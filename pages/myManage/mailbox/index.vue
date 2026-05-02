<template>
  <view class="mailbox">
    <uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute"  leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="填写邮箱">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
    </uv-navbar>
    <view class="form-box">

      <uv-form ref="formRef" labelPosition="top" labelWidth="300" :model="formData" :rules="rules">
        <uv-form-item label="请填写邮箱" prop="email" class="border" >
          <uv-input v-model="formData.email" type="email" placeholder="请填写邮箱"></uv-input>
        </uv-form-item>
        <uv-button v-if="formData.email" class="but"  customStyle="width: calc(100vw - 50rpx);height: 96rpx; background-color: #ae8d45;font-size: 32rpx; color: #ffffff; border-radius: 48rpx;" @click="handleSubmit">保存</uv-button>
        <uv-button v-else class="but" customStyle="width: calc(100vw - 50rpx);height: 96rpx; background-color: #f9e0b3;font-size: 32rpx; color: #ffffff; border-radius: 48rpx;">保存</uv-button>
      </uv-form>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed} from "vue";
import {updateEmail } from "@/api/user";
import {pagesRoute} from "@/utils/index";
import {getUserinfoBut} from "@/hooks/publicRequest"
const formRef = shallowRef()
import { onLoad, onShow } from "@dcloudio/uni-app";
import { userStore } from "@/stores/user"
const userData = computed(() => userStore().userInfo)
const formData = reactive({
  email:''
})

const email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const emailRules =  (rule: object, value: string, callback: any) => {
  try {
    if (!value){
      return callback(new Error('请输入邮箱'))
    } else if(!email.test(value)) {
      return callback(new Error('请输入有效的邮箱地址'));
    } else {
      callback()
    }
  }catch (e) {

  }

}
// 表单校验规则
const rules = reactive<object>({
  email: [
    {
      validator: emailRules,
      trigger: 'blur'
    }
  ]
})


onShow(()=>{
  for (const key in formData) {
    if (userData.value[key] != null && userData.value[key] != undefined) {
      //@ts-ignore
      formData[key] = userData.value[key]
    }
  }
})
// 提交数据
const handleSubmit =  async () => {
  await formRef.value.validate()
 const res=  await updateEmail(formData)
  getUserinfoBut()
  if(res.code == 0){
    uni.showToast({ icon: 'success', title: '保存成功' })
    setTimeout(()=>{
      uni.navigateBack()
    },2000)
  }

}
</script>

<style  lang="scss" scoped>
.mailbox{
  background-color: $uni-default-back0Color;
  overflow: hidden;
  height: 100vh;
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
      margin:0 auto;
      margin-top: 100rpx;

    }
  }
}

</style>
