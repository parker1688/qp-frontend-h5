<template>
    <view class="uptPwd">
      <uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute"  leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="账号安全">
        <template v-slot:left>
          <view class="uv-nav-slot">
            <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
          </view>
        </template>
      </uv-navbar>
      <view class="form-box">
      <uv-form ref="formRef" labelPosition="top" labelWidth="300" :model="formData" :rules="rules">
        <uv-form-item label="登录原密码" prop="oldPassword" class="border" >
          <uv-input v-model="formData.oldPassword" type="password" placeholder="请输入密码" password></uv-input>
        </uv-form-item>
        <uv-form-item label="登录新密码" prop="newPassword" class="border" >
          <uv-input v-model="formData.newPassword"  type="password" placeholder="请输入新密码"  password></uv-input>
        </uv-form-item>
        <uv-form-item label="确认新密码" prop="confirmPassword" class="border" >
          <uv-input v-model="formData.confirmPassword" placeholder="请重新输入新密码" type="password" password></uv-input>
        </uv-form-item>
        <uv-button  class="but" customStyle="width:calc(100vw - 50rpx);height: 96rpx; background-color: #ae8d45;font-size: 32rpx;
         color: #ffffff; border-radius: 48rpx;" @click="handleSubmit">保存</uv-button>
      </uv-form>
      </view>
    </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed} from "vue";
import {updataPassword} from "@/api/user";
import {pagesRoute} from "@/utils/index";
const formRef = shallowRef()
import { userStore } from "@/stores/user"
const userData = computed(() =>  userStore().userInfo)

const formData = reactive({
  userName:'',
  oldPassword:'',
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
  oldPassword: [
    {
      validator: (rule: object, value: string, callback: any) => {
        if (!value) callback(new Error('请输入当前密码'))
        callback()
      },
      trigger: 'blur'
    }
  ],
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

// 提交数据
const handleSubmit =  async () => {
  formData.userName = userData.value.user_name
  await formRef.value.validate()
  await updataPassword(formData)
  uni.showToast({icon: 'success', title: '修改成功'})
  setTimeout(()=>{
    uni.navigateBack()
  },2000)
}
</script>

<style  lang="scss" scoped>
.uptPwd{
  background-color: $uni-default-back0Color;
  // #ifdef H5
  height: 100%;
  // #endif
  // #ifdef APP-PLUS || MP-WEIXIN
  height:100vh;
  // #endif
  overflow: hidden;
  .form-box{
    background-color: $uni-bg-color-grey;
    width: calc(100vw - 50rpx);
    height: 100%;
    padding: 0 25rpx;
    overflow: hidden;
    border-radius: 30rpx 30rpx 0 0;
    .border{
      padding: 20rpx;
      border-radius: 20rpx;
      margin-top: 40rpx;
      background:$uni-bg-color;
    }
    .but{
      margin-top: 100rpx;
    }
  }
}
</style>
