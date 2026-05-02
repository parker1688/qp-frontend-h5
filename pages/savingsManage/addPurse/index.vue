<template>
  <view class="uptPwd">
    <uv-navbar placeholder bgColor="#1c1c1c"  @leftClick="pagesRoute"  leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="添加虚拟钱包">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
      <template v-slot:right>
        <view class="uv-nav-slot u-flex-center-end" @click="goToKF" style="color: #FFFFFF">
			<uv-icon name="/static/kf/kf.png" size="19" ></uv-icon>
			<text class="kfClass">客服</text>
        </view>
      </template>
    </uv-navbar>
    <view class="form-box">
      <uv-form ref="formRef" labelPosition="top" labelWidth="300" :model="formData" :rules="rules">
        <uv-form-item label="真实姓名" prop="real_name" class="border" >
          <uv-input v-model="formData.real_name"   disabled disabledColor="#fff"  placeholder="请填写真实姓名"></uv-input>
        </uv-form-item>
        <uv-form-item label="钱包类型" prop="typeName" class="border" >
          <uv-input v-model="formData.typeName"  disabled disabledColor="#fff"   @click="bindBankBut"  suffixIcon="arrow-right" placeholder="请选择类型"></uv-input>
        </uv-form-item>
        <uv-form-item label="钱包地址" prop="blockchain_address" class="border" >
          <uv-input v-model="formData.blockchain_address" placeholder="请输入或黏贴钱包地址"></uv-input>
        </uv-form-item>
        <uv-form-item label="备注信息" prop="remark"  class="border">
          <uv-input v-model="formData.remark" maxlength="15" placeholder="请填写您的备注信息"></uv-input>
        </uv-form-item>
        <uv-button  class="but" customStyle="width:calc(100vw - 50rpx);height: 96rpx; background-color: #ae8d45;font-size: 32rpx;
         color: #ffffff; border-radius: 48rpx;" @click="handleSubmit">确认添加</uv-button>
<!--        <uv-button  class="but" text="确认添加" customStyle="width: 688rpx;height: 96rpx; background-color: #f9e0b3;font-size: 32rpx; color: #ffffff; border-radius: 48rpx;"></uv-button>-->

      </uv-form>
      <phoneVerification  ref="phoneVerificationRef" :tagType="tagEnum.Blockchain"/>
      <selectPopup  ref="addPopupRef" title="选择类型" @getData="getDataBut"  :type="withdrawEnum.PURSR"/>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed} from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { withdrawEnum ,tagEnum,channeEnum} from '@/enums/savingsEnums'
import phoneVerification from  '@/components/phoneVerification/index'
import selectPopup from  '@/components/selectPopup/index'
import {allPaymentOut,allChannelBankImg} from "@/api/money"
import { userStore } from "@/stores/user"
const userName = computed(() => userStore().userInfo.real_name)
const phoneVerificationRef=shallowRef()
const addPopupRef=shallowRef()
const formRef=shallowRef()
import { toPtah,pagesRoute } from "@/utils/index"

const allTypeList=ref([])
const goToKF=()=>{
  toPtah('/pages/kf/index')
}
const formData = reactive({
  payment_name:'',
  payment_code:'',
  typeName:'',
  real_name:userName.value,
  blockchain_address:'',
  remark:'',
})

// 表单校验规则
const rules = reactive<object>({
  typeName: [
    {
      message: '请选择钱包类型',
      required: true,
      trigger: 'blur'
    }
  ],
  blockchain_address: [
    {
      message: '请输入钱包地址',
      required: true,
      trigger: 'blur'
    }
  ],
  real_name: [
    {
      message: '请输入真实姓名',
      required: true,
      trigger: 'blur'
    }
  ]
})

const bindBankBut =()=>{
  addPopupRef.value?.open(allTypeList.value)
}
const getAllPaymentOutBut=async()=>{
  const res=await allChannelBankImg({channel_code:channeEnum.VirtualCode})
  allTypeList.value = res.data
}
const getDataBut=(it:object)=>{
  formData.payment_name=it.payment_name
  formData.typeName=it.payment_name
  formData.payment_code=it.payment_code

}
// 提交数据
const handleSubmit =  async () => {
  await formRef.value.validate()
  phoneVerificationRef.value?.open(JSON.stringify(formData))
}
onShow(()=>{

})
onLoad(()=>{
  getAllPaymentOutBut()
})

</script>

<style  lang="scss" scoped>
.uptPwd{
  background-color: $uni-default-back0Color;
  overflow: hidden;
  // #ifdef H5
  height: 100%;
  // #endif
  // #ifdef APP-PLUS || MP-WEIXIN
  height:100vh;
  // #endif
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
       width: 100%;
      margin-top: 100rpx;
    }
  }
}
</style>
