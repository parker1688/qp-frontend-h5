<template>
  <view class="zfbbox">
    <uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute" leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="输入新密码">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
      <template v-slot:right>
        <view class="uv-nav-slot u-flex-center-end" @click="goToKF" style="color: #FFFFFF">
          <uv-icon name="/static/kf/kf.png" size="19"></uv-icon>
		  <text class="kfClass">客服</text>
        </view>
      </template>
    </uv-navbar>
    <view class="login-box">
      <view class="ts-box u-flex-xy-center">
        <image src="/static/log/JG.png"></image>
        <view>
          <view>您已通过安全验证，请输入新的账号密码</view>
        </view>
      </view>
      <view class="item3-box">
        <view class="form-box">
          <uv-form ref="formRef" labelPosition="top" labelWidth="300" :model="formData" :rules="rules">
            <view class="formItemBox borderBottom">
              <uv-form-item  prop="newPassword"  border="none" style="padding:20rpx 0">
                <view class="phone-text u-flex-center-start" >新  密  码</view>
                <uv-input   v-model="formData.newPassword" border="none" placeholder="请输入新密码" fontSize="15" placeholderStyle="{ font-family: $uni-family-Regular;font-size: 28rpx; color: #7e7e7e;}"></uv-input>
              </uv-form-item>
            </view>
            <view class="formItemBox">
              <uv-form-item  prop="confirmPassword" border="none" style="padding:20rpx 0">
                <view class="phone-text u-flex-center-start" >确认密码</view>
                <uv-input   v-model="formData.confirmPassword" border="none" placeholder="请再次输入新的密码" fontSize="15" placeholderStyle="{ font-family: $uni-family-Regular;font-size: 28rpx; color: #7e7e7e;}"></uv-input>
              </uv-form-item>
            </view>
         </uv-form>
        </view>
        <uv-button  class="but" customStyle="width: calc(100vw - 60rpx);height: 96rpx; background-color: #ae8d45;font-size: 30rpx;
         color: #ffffff; border-radius: 48rpx;font-family: $uni-family-Medium;" @click="handleSubmit">确定</uv-button>
        <view class="ts1">
          <view><text>*</text>*如有问题<text   @click="goToKF">请联系在线客服</text></view>
        </view>
      </view>


    </view>

  </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed} from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { toPtah,pagesRoute} from "@/utils/index"
import {passwordForgotUpdate} from "@/api/user";
const formRef = shallowRef()

const formData = reactive({
  userName:'',
  newPassword:'',
  confirmPassword:''
})


const regs = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
const newPasswordRules =  (rule: object, value: string, callback: any) => {
  try {
    if (!value){
      return callback(new Error('请输入新的密码'))
    } else if(!regs.test(value)) {
      return callback(new Error('密码由6-12位数字和字母的组合'));
    } else {
      callback()
    }
  }catch (e) {

  }

}

// 表单校验规则
const rules = reactive<object>({
  newPassword: [
    {
      validator:newPasswordRules,
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      validator: (rule: object, value: string, callback: any) => {
        if (formData.newPassword) {
          if (!value) callback(new Error('请再次输入密码'))
          if (value !== formData.newPassword) callback(new Error('两次输入密码不一致!'))
        }
        callback()
      },
      trigger: 'blur'
    }
  ]
})


const goToKF=()=>{
  toPtah('/pages/kf/index')
}

onLoad((e)=>{
  formData.userName=e.userName
})
// 提交数据
const handleSubmit =  async () => {
  await formRef.value.validate()
  const res=await passwordForgotUpdate(formData)
  uni.showToast({icon: 'success', title: res.msg})
  if(res.code === 0){
    setTimeout(()=>{
      toPtah('/pages/login/index',2)
    },2000)
  }
}

</script>

<style  lang="scss" scoped>
.zfbbox{
  background-color: $uni-default-back0Color;
  overflow: hidden;
  // #ifdef H5
  height: 100%;
  // #endif
  // #ifdef APP-PLUS || MP-WEIXIN
  height:100vh;
  // #endif
  .login-box{
    width: 100vw;
    background-color: #2c2c2c;
    border-radius: 30rpx 30rpx 0rpx 0rpx;
    height: 100%;
    image{
      width: 51rpx;
      height: 56rpx;
      margin-right: 43rpx;
    }
    .ts-box{
      height: 132rpx;
      font-family: $uni-family-Regular;
      font-size: 24rpx;
      font-weight: normal;
      font-stretch: normal;
      line-height: 36rpx;
      letter-spacing: 1rpx;
      color: #c0ac78
    }
  }
  .form-box{
    background-color: #ffffff;
    width: 700rpx;
    padding: 0 25rpx;
    overflow: hidden;
    border-radius: 30rpx;
    .formItemBox{
      height: 128rpx;
      width: 100%;
    }
    .borderBottom{
      border-bottom: 2rpx solid $uni-text-color-disable;
    }
    .phone-text{
      width: 130rpx;
      font-family: $uni-family-Bold;
      font-size: 30rpx;
     /// font-weight: 600;
      font-stretch: normal;
      letter-spacing: 1rpx;
      color: #0f0f0f;
    }

  }
  .item3-box{
    width: 100%;
    height: 100%;
    background: $uni-bg-color-grey;
    border-radius: 30rpx;
  }
  .but{
    margin: 80rpx 30rpx
  }
  .ts1{
    font-family: $uni-family-Bold;
    font-size: 24rpx;
    color: #0f0f0f;
    text-align: center;
    margin-top: 77rpx;
    line-height: 40rpx;
    text{
      font-size: 26rpx;
      color: #c50404;
      font-weight: 600;
    }

  }
  :deep(.uv-form-item__body){
    padding:20rpx 0 10rpx 0;
  }
}

</style>
