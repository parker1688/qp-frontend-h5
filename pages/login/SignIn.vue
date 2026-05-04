<template>
  <view class="log-box">
    <uv-form labelPosition="left" :model="formData" :rules="rules" ref="logRef">
      <uv-form-item  prop="username" style="margin-top:60rpx" :customStyle="{borderBottom: '2rpx solid #3b3b3b'}">
        <uv-icon size="23"  name="/static/log/user.png"  style="margin-right: 20rpx"></uv-icon>
        <uv-input   border="none" v-model="formData.username" placeholder="用户名由6-15位数字和字母的组合" maxlength="15" fontSize="15"  placeholderStyle="{ font-family: $uni-family-Regular;font-size: 28rpx; color: #7e7e7e;}"></uv-input>
      </uv-form-item>
      <uv-form-item  prop="password" style="margin-top:60rpx" :customStyle="{borderBottom: '2rpx solid #3b3b3b'}">
        <uv-icon size="23"  name="/static/log/psd.png" style="margin-right: 20rpx"></uv-icon>
        <uv-input    :password="padShow" v-model="formData.password" border="none" placeholder="密码由7-14位数字和字母的组合"  maxlength="14" fontSize="15"  placeholderStyle="{ font-family: $uni-family-Regular;font-size: 28rpx; color: #7e7e7e;}"></uv-input>
        <uv-icon size="15" @click="padShowBut()" :name="padShow?'/static/log/nxs.png':'/static/log/xs.png'"></uv-icon>
      </uv-form-item>
      <uv-form-item  prop="confirmPassword" style="margin-top:60rpx" :customStyle="{borderBottom: '2rpx solid #3b3b3b'}">
        <uv-icon size="23"  name="/static/log/psd.png" style="margin-right: 20rpx"></uv-icon>
        <uv-input   :password="padShow1"  v-model="formData.confirmPassword" border="none" placeholder="请再次输入密码"  maxlength="14" fontSize="15"  placeholderStyle="{ font-family: $uni-family-Regular;font-size: 28rpx; color: #7e7e7e;}"></uv-input>
        <uv-icon size="15" @click="padShow1But()" :name="padShow1?'/static/log/nxs.png':'/static/log/xs.png'"></uv-icon>
      </uv-form-item>
      <uv-form-item  prop="phone" style="margin-top:60rpx" :customStyle="{borderBottom: '2rpx solid #3b3b3b'}">
        <uv-icon size="23"  name="/static/log/sj.png" style="margin-right: 20rpx"></uv-icon>
<!--        <view class="phone-text u-flex-xy-center" >+86 <uv-icon style="margin-left: 4rpx" name="arrow-down-fill" color="#2559d8" size="10"></uv-icon></view>-->
        <uv-input   v-model="formData.phone" border="none" maxlength="11" placeholder="请输入11位手机号" fontSize="15"  placeholderStyle="{ font-family: $uni-family-Regular;font-size: 28rpx; color: #7e7e7e;}"></uv-input>
      </uv-form-item>
      <uv-form-item  prop="real_name" style="margin-top:60rpx" :customStyle="{borderBottom: '2rpx solid #3b3b3b'}">
        <uv-icon size="23"  name="/static/log/xm.png" style="margin-right: 20rpx"></uv-icon>
        <uv-input   v-model="formData.real_name" border="none" maxlength="20"  placeholder="请输入提现真实姓名" fontSize="15"  placeholderStyle="{ font-family: $uni-family-Regular;font-size: 28rpx; color: #7e7e7e;}"></uv-input>
      </uv-form-item>
      <uv-button   customStyle="margin-top:66rpx;width: 616rpx;height: 98rpx;
         	background-color: #ae8d45;font-size: 30rpx;color: #ffffff;border-radius: 49rpx;font-family: $uni-family-Medium;" @click="handleSubmit">立即注册</uv-button>
      <view class="goto u-flex-xy-center">
        已有账号，<text @click="gologin">去登录></text>
      </view>
      <view class="goto u-flex-xy-center">
        <image  @click="goto" class="sbww" src="/static/log/sbww.png"></image>
      </view>
    </uv-form>
  </view>
</template>

<script lang="ts" setup>
const emit = defineEmits(['gologin'])
import {ref, reactive, shallowRef, computed} from "vue"
import {register,inviteAave} from "/api/user";
import { userStore } from "@/stores/user"
import { getUserinfoBut,dayReminderBut,getRechargeWallet} from "@/hooks/publicRequest"
import { toPtah } from "@/utils/index"
import {clientlogsBut} from "@/hooks/clientlogs"
const userDataStore=userStore()
const agentId=computed(()=>userDataStore.agentId)
const userInfo=computed(()=>userDataStore.userInfo)
const formData =reactive({
  username:'',
  password:'',
  confirmPassword:'',
  phone:'',
  real_name:'',
  invite_code:agentId.value,
 // veryCode:'325666',
  visitorId:''
})

const inviteAaveBut=async ()=>{

    const data={
      user_id:userInfo.value.user_id,
      invite_code:agentId.value
    }
   await inviteAave(data)
}
const deviceData=computed(()=>{
  const {model ,deviceId} =uni.getDeviceInfo()
  return model+'-'+deviceId
})

const logRef =shallowRef()
const padShow=ref(true)
const padShow1=ref(true)

const padShowBut=(item:boolean)=>{
  padShow.value=!padShow.value
}
const padShow1But=(item:boolean)=>{
  padShow1.value=!padShow1.value
}

const gologin=()=>{
  emit('gologin')
}
const goto=()=>{
  toPtah('/pages/tabBar/home/index',0)
}

const regs = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,15}$/
const usernameRules =  (rule: object, value: string, callback: any) => {
  try {
    if (!value) {
      return callback(new Error('请输入用户名！'));
    }else if(!regs.test(value)) {
      return callback(new Error('用户名由6-15位数字和字母的组合，请修改！'));
    } else {
      callback()
    }
  }catch (e) {

  }

}
const regs1 = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{7,14}$/
const confirmPasswordRules =  (rule: object, value: string, callback: any) => {
  try {
    if (!value) {
      return callback(new Error('密码由7-14位数字和字母的组合，请修改！'));
    }else if(!regs1.test(value)) {
      return callback(new Error('密码由7-14位数字和字母的组合，请修改！'));
    } else {
      callback()
    }
  }catch (e) {

  }

}
// 表单校验规则
const rules = reactive<object>({
  username: [
    {
      validator:usernameRules,
      trigger: 'blur'
    }
  ],
  password: [
    {
      validator: confirmPasswordRules,
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      validator: (rule: object, value: string, callback: any) => {
        if (formData.password) {
          if (!value) callback(new Error('请再次输入密码'))
          if (value !== formData.password) callback(new Error('两次输入密码不一致!'))
        }
        callback()
      },
      trigger: 'blur'
    }
  ],
  phone: [
    {
      validator: (rule: object, value: string, callback: any) => {
        let regs = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
        if (!value) {
          return callback(new Error('手机号码不能为空'));
        } else if (!regs.test(value)) {
          return callback(new Error('手机号格式不正确'));
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  real_name:[
    {
      validator: (rule: object, value: string, callback: any) => {
       if (!value) callback(new Error('请输入提现真实姓名'))
        callback()
      },
      trigger: 'blur'
    }
  ]
})


const handleSubmit = async ()=> {
  try {
    formData.visitorId=deviceData.value
    await logRef.value.validate()
    const data= await register(formData)
    if(data.code === 0){
      const token=data.data.token
      const merchant_code=data.data.merchant_code
      userDataStore.setToken(token)
      userDataStore.setMerchantCode(merchant_code)
      //#ifdef H5
      userDataStore.setIsDownShow(true)
      //#endif
      getUserinfoBut()
      uni.showToast({icon: 'success', title: '注册成功'})
      setTimeout(()=>{
      //  inviteAaveBut()
        toPtah('/pages/tabBar/home/index',0)
        dayReminderBut(false)
        getRechargeWallet()
      },2000)
      clientlogsBut({ID:'SignInID',item:{...formData,...data.data}})
    }
  } catch (err: any) {
    console.error('[register handleSubmit error]', err)
    if (typeof err === 'string' && err) {
      uni.showToast({ icon: 'none', title: err })
    }
  }
}
</script>

<style  lang="scss" scoped>
.log-box{
  padding:0 66rpx 66rpx 66rpx;
  width: calc(100% - 132rpx);
  background-color: white;
  display: flex;
  .phone-text{
    color: #2559d8;
    font-size: 28rpx;
    width: 80rpx;
  }
  .goto{
    width: 50%;
    margin:60rpx auto;
    text-align: center;
    text{
      color:$uni-default-color ;
    }
    .sbww{
      width: 167rpx;
      height: 28rpx;
    }
  }
}
</style>
