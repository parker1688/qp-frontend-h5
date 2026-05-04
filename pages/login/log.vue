<template>
  <view  class="logo-box u-flex-column u-flex-start">
    <view class="log-box">
      <uv-form labelPosition="left" :model="formData" :rules="rules" ref="logRef">
        <uv-form-item  prop="username"  style="margin-top:60rpx" :customStyle="{borderBottom: '2rpx solid #3b3b3b'}">
          <uv-icon size="23"  name="/static/log/user.png"  style="margin-right: 20rpx"></uv-icon>
          <uv-input  border="none" v-model="formData.username" placeholderStyle="{ font-family: $uni-family-Regular;font-size: 28rpx; color: #7e7e7e;}"  placeholder="请输入账号" fontSize="15"></uv-input>
        </uv-form-item>
        <uv-form-item  prop="password"  style="margin-top:60rpx" :customStyle="{borderBottom: '2rpx solid #3b3b3b'}">
          <uv-icon size="23"  name="/static/log/psd.png" style="margin-right: 20rpx"></uv-icon>
          <uv-input  :password="padShow" v-model="formData.password" placeholderStyle="{ font-family: $uni-family-Regular;font-size: 28rpx; color: #7e7e7e;}" border="none" placeholder="请输入密码" fontSize="15"></uv-input>
          <uv-icon size="15" @click="padShowBut()" :name="padShow?'/static/log/nxs.png':'/static/log/xs.png'"></uv-icon>
        </uv-form-item>
        <view class="pwdType u-flex-center-between">
          <uv-checkbox-group @change="change" >
            <uv-checkbox   activeColor="#ae8d45" size="20" v-model="remAccount"  shape="circle" :checked="remAccount"><text class="checkboxTexy">记住密码</text></uv-checkbox>
          </uv-checkbox-group>
          <view style="color: #7e7e7e;font-size: 25rpx;" @click="forgotPasswordBut">忘记密码</view>
        </view>
         <uv-button    customStyle="margin-top:66rpx;width: 616rpx;height: 98rpx;
         	background-color: #ae8d45;font-size: 30rpx;color: #ffffff;border-radius: 49rpx;font-family: $uni-family-Medium;" @click="handleSubmit">登录</uv-button>
         <view class="goto u-flex-center-between">
            <image  @click="goto" class="sbww" src="/static/log/sbww.png"></image>
            <image  @click="goToKF" class="sbww" src="/static/log/lxkf.png"></image>
         </view>
      </uv-form>
    </view>
    <abnormal ref="abnormalRef"/>
    <IPabnormal ref="iPabnormalRef"/>
  </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed} from "vue";
import {login,loginAbnormalRecover} from "/api/user";
import { userStore } from "@/stores/user"
import { toPtah } from "@/utils/index"
import {getUserinfoBut,dayReminderBut, getRechargeWallet} from "@/hooks/publicRequest"
import { onLoad, onShow } from "@dcloudio/uni-app";
import abnormal from './abnormal'
import IPabnormal from './IPabnormal'
const goToKF=()=>{
  toPtah('/pages/kf/index')
}
const deviceData=computed(()=>{
  const {model ,deviceId} =uni.getDeviceInfo()
  return model+'-'+deviceId
})
const forgotPasswordBut=()=>{
  toPtah('/pages/myManage/forgotPassword/index')
}
const remAccount = ref(false)
const abnormalRef =shallowRef()
const iPabnormalRef=shallowRef()
const userDataStore=userStore()


const accountKey=computed(()=>userDataStore.accountKey)
const formData =reactive({
  username:'',
  password:'',
  visitorId:deviceData.value
})

const change=(it:any)=>{
  remAccount.value= it.length>0?true:false

}
const goto=()=>{
  toPtah('/pages/tabBar/home/index',0)
}
const logRef =shallowRef()
const padShow=ref(true)
const checkboxValue=ref([''])
const padShowBut=(item:boolean)=>{
  padShow.value=!padShow.value
}

// 表单校验规则
const rules = reactive<object>({
  username: [
    {
      required: true,
      message: '请输入账号',
      trigger: ['blur', 'change']
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['blur', 'change']
    }
  ],
})


onShow(()=>{
 setTimeout(()=>{
  // iPabnormalRef.value.open()
 },2000)
  if (accountKey.value?.remAccount) {
    remAccount.value = accountKey.value.remAccount
    formData.username = accountKey.value.username
    formData.password = accountKey.value.password
  }
})

const loginInfoBut=(it:any)=>{
  const token = it.token
  userDataStore.setToken(token)
  //#ifdef H5
  userDataStore.setIsDownShow(true)
  //#endif
  getUserinfoBut()
  uni.showToast({icon: 'success', title: '登录成功'})
  setTimeout(()=>{
    toPtah('/pages/tabBar/home/index',0)
    dayReminderBut()
    getRechargeWallet()
  },2000)
}

//
const loginAbnormal = async() =>{
  const res= await loginAbnormalRecover(formData)
  loginInfoBut(res.data)
}
const handleSubmit = async ()=>{
  try {
    await logRef.value.validate()
    //记住账号，缓存
    const res= await login(formData)
    userDataStore.setAccountKey({...formData,remAccount:remAccount.value})
    if(res.code === 0){
      loginInfoBut(res.data)
    }else if(res.code === 100011){
      iPabnormalRef.value.open({...res.data,username:formData.username},()=>{
        loginAbnormal()

      })
      // abnormalRef.value?.open({...res.data,username:formData.username})
    }
  } catch (err: any) {
    console.error('[login handleSubmit error]', err)
    if (typeof err === 'string' && err) {
      uni.showToast({ icon: 'none', title: err })
    }
  }
}
</script>

<style  lang="scss" scoped>
.logo-box{
  height:1170rpx;
  background-color:$uni-bg-color-grey;

}
.log-box{
  padding:0 66rpx 66rpx 66rpx;
  width: calc(100% - 132rpx);
  height: 652rpx;
  background-color: white;
  overflow: hidden;
  .checkboxTexy{
    font-family: $uni-family-Regular;
    font-size: 25rpx;
    color: #000000;
  }
  .pwdType{
    margin-top: 42rpx;

  }
  .goto{
    width: 70%;
    margin:80rpx auto;
    text-align: center;

    .sbww{
      width: 167rpx;
      height: 28rpx;
    }
  }

}
</style>
