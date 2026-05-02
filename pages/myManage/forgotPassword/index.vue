<template>
  <view class="zfbbox">
    <uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute"  leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="确认用户信息">
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
          <view>请输入您的登录账号、手机号，并发送验证码</view>
          <view>进行验证</view>
        </view>
      </view>
      <view class="item3-box">
        <view class="form-box">
          <uv-form ref="formRef" labelPosition="top" labelWidth="300" :model="formData" :rules="rules">
            <view class="formItemBox borderBottom">
              <uv-form-item  prop="userName" border="none" style="padding:20rpx 0">
                 <view class="phone-text u-flex-center-start" >账   号</view>
                <uv-input   v-model="formData.userName" border="none" placeholder="请输入账号" fontSize="15" placeholderStyle="{ font-family: $uni-family-Regular;font-size: 28rpx; color: #7e7e7e;}"></uv-input>
              </uv-form-item>
            </view>
            <view class="formItemBox borderBottom">
              <uv-form-item  prop="phone" border="none" style="padding:20rpx 0">
                <view class="phone-text u-flex-center-start" >手  机  号</view>
                <uv-input   v-model="formData.phone" border="none" maxlength="11" placeholder="请输入11位手机号" fontSize="15" placeholderStyle="{ font-family: $uni-family-Regular;font-size: 28rpx; color: #7e7e7e;}"></uv-input>
              </uv-form-item>
            </view>
            <view class="formItemBox">
              <uv-form-item  prop="veryCode" border="none" style="padding:20rpx 0">
                <view class="phone-text u-flex-center-start" >验  证  码</view>
                <uv-input placeholder="输入验证码" maxlength="6"  border="none"   type="number" v-model="formData.veryCode" fontSize="15" placeholderStyle="{ font-family: $uni-family-Regular;font-size: 28rpx; color: #7e7e7e;}">
                  <!-- vue3模式下必须使用v-slot:suffix -->
                  <template v-slot:suffix>
                    <uv-code ref="uCode" @change="codeChange" seconds="60" changeText="X秒重新获取"></uv-code>
                    <uv-button @click="getCode" :text="tips" customStyle="font-size: 26rpx;;width: 188rpx;height: 56rpx;border-radius: 28rpx;border: solid 2rpx #000000;"></uv-button>
                  </template>
              </uv-input>
            </uv-form-item>
            </view>
          </uv-form>
        </view>
        <uv-button  class="but" customStyle="width: calc(100vw - 60rpx);height: 96rpx; background-color: #ae8d45;font-size: 30rpx;
         color: #ffffff; border-radius: 48rpx;font-family: $uni-family-Medium;" @click="handleSubmit">确定</uv-button>
        <!--        <uv-button  class="but" text="确认添加" customStyle="width: 688rpx;height: 96rpx; background-color: #f9e0b3;font-size: 32rpx; color: #ffffff; border-radius: 48rpx;"></uv-button>-->
        <view class="ts1">
          <view><text>*</text>如忘记手机号或是手机号无法收到验证码</view>
          <view  @click="goToKF"><text>请联系在线客服</text></view>
        </view>
      </view>
    </view>

  </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed} from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { toast } from '@/uni_modules/uv-ui-tools/libs/function/index.js';
import { withdrawEnum ,tagEnum,channeEnum} from '@/enums/savingsEnums'
import { toPtah,pagesRoute} from "@/utils/index"
import {getPhoneVeryCode} from "@/api/money"
import {passwordForgot} from "@/api/user";
const uCode=shallowRef()
const formRef = shallowRef()
const veryCode=ref(null)
const tips=ref('')
const codeChange =(text) => {
  tips.value = text;
}
let regs = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/

const getCode =()=> {
  if(!formData.phone){
    uni.showToast({
      icon:'none',
      title: '请输入手机号码！',
    })
    return
  }
  if(!regs.test(formData.phone)){
    uni.showToast({
      icon:'none',
      title: '手机号格式不正确！',
    })
    return
  }
  if (uCode.value?.canGetCode) {
    // 模拟向后端请求验证码
    uni.showLoading({
      title: '正在获取验证码'
    })
    getPhoneVeryCodeBut()
    setTimeout(() => {
      uni.hideLoading();
      toast('验证码已发送');
      uCode.value?.start();
    }, 2000);
  } else {
    toast('倒计时结束后再发送');
  }
}
const goToKF=()=>{
  toPtah('/pages/kf/index')
}
const formData = reactive({
  userName:'',
  phone:'',
  veryCode:null,
})

const getPhoneVeryCodeBut=async()=>{
  const res=await  getPhoneVeryCode({
    tag:tagEnum.ForgotPass,
    phone:formData.phone
  })
}

// 表单校验规则
const rules = reactive<object>({
  typeName: [
    {
      message: '请输入账号',
      required: true,
      trigger: 'blur'
    }
  ],
  phone: [
    {
      validator: (rule: object, value: string, callback: any) => {
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
  veryCode: [
    {
      message: '请输入验证码',
      required: true,
      trigger: 'blur'
    }
  ]
})

// 提交数据
const handleSubmit =  async () => {
  await formRef.value.validate()
  const regs1 =  /\d{6}/
  if(!regs1.test(formData.veryCode)){
    uni.showToast({icon: 'none', title: '验证码为6位数字！'})
    return
  }
  const res=await passwordForgot(formData)
  if(res.code === 0){
    toPtah('/pages/myManage/forgotPassword/newPaw?userName='+ formData.userName,2)
  }

}
onShow(()=>{

})
onLoad(()=>{
})

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
   //   font-weight: 600;
      font-stretch: normal;
      letter-spacing: 1rpx;
      color: #0f0f0f;
    }

  }
  .but{
    margin-top: 88rpx;
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
