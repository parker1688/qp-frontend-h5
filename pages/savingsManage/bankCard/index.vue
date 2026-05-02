<template>
  <view class="bankCard">
    <uv-navbar placeholder bgColor="#1c1c1c"  @leftClick="pagesRoute"  leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="添加银行卡">
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
        <uv-form-item label="持卡人姓名" prop="account_holder" class="border" >
          <uv-input v-model="formData.account_holder"  disabled disabledColor="#fff"  placeholder="请输入持卡人姓名"></uv-input>
        </uv-form-item>
        <uv-form-item label="选择银行" prop="typeName" class="border" >
          <uv-input v-model="formData.typeName"  disabled disabledColor="#fff"  @click="bindBankBut"  suffixIcon="arrow-right" placeholder="选择银行"></uv-input>
        </uv-form-item>
        <uv-form-item label="银行卡号" prop="account_number" class="border" >
          <uv-input v-model="formData.account_number"  placeholder="请填写或者黏贴你的银行卡号"></uv-input>
        </uv-form-item>
        <uv-form-item label="开户网点" prop="bank_address"  class="border">
          <uv-input v-model="formData.bank_address"  placeholder="请填写银行卡所属开户网点"></uv-input>
        </uv-form-item>
        <uv-button  class="but"  customStyle="width: calc(100vw - 50rpx);height: 96rpx; background-color: #ae8d45;font-size: 32rpx;
         color: #ffffff; border-radius: 48rpx;" @click="handleSubmit">确认添加</uv-button>
<!--        <uv-button  class="but" text="确认添加" customStyle="width: 688rpx;height: 96rpx; background-color:-->
<!--         #f9e0b3;font-size: 32rpx; color: #ffffff; border-radius: 48rpx;"></uv-button>-->
      </uv-form>
    </view>
    <phoneVerification  ref="phoneVerificationRef" :tagType="tagEnum.BindBank"/>
    <addPopup  ref="addPopupRef" title="选择类型" @getData="getDataBut"  :type="withdrawEnum.CARD"/>
  </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed} from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import phoneVerification from  '@/components/phoneVerification/index'
import addPopup from  '@/components/selectPopup/index'
import {allChannelBankImg} from "@/api/money"
import { userStore } from "@/stores/user"
const userName = computed(() => userStore().userInfo.real_name)
const phoneVerificationRef=shallowRef()
import { withdrawEnum ,tagEnum,channeEnum} from '@/enums/savingsEnums'
const addPopupRef=shallowRef()
const formRef=shallowRef()
import { toPtah ,pagesRoute } from "@/utils/index"

const allTypeList=ref([])
const goToKF=()=>{
  toPtah('/pages/kf/index')
}
const formData = reactive({
  bank_address:'',
  account_number:'',
  typeName:'',
  account_holder:userName.value,
  account_bank_type:'',
})

const bankYhk=/^[A-Z]{4}([A-Z0-9]{4,7})$/;
const bankRules =  (rule: object, value: string, callback: any) => {
  try {
    if (!value){
      return callback(new Error('请输入银行卡号'))
    } else if(!bankYhk.test(value)) {
      return callback(new Error('请输入有效的银行卡号'));
    } else {
      callback()
    }
  }catch (e) {

  }

}
// 表单校验规则
const rules = reactive<object>({
  account_holder: [
    {
      message: '请输入持卡人姓名',
      required: true,
      trigger: 'blur'
    }
  ],
  typeName: [
    {
      message: '请选择银行',
      required: true,
      trigger: 'blur'
    }
  ],
  account_number: [
    {
    //  validator: bankRules,
      message: '请输入银行卡号',
      required: true,
      trigger: 'blur'
    }
  ],
  bank_address: [
    {
      message: '请输入开户网点',
      required: true,
      trigger: 'blur'
    }
  ]
})

const bindBankBut =()=>{
  addPopupRef.value?.open(allTypeList.value)
}
const getAllBindBankTypeBut=async()=>{
  const res=await allChannelBankImg({channel_code:channeEnum.BankCode})
  allTypeList.value = res.data
}
const getDataBut=(it:object)=>{
  formData.account_bank_type=it.payment_code
  formData.typeName=it.payment_name

}
// 提交数据
const handleSubmit =  async () => {
  await formRef.value.validate()
  phoneVerificationRef.value?.open(JSON.stringify(formData))
}
onShow(()=>{

})
onLoad(()=>{
  getAllBindBankTypeBut()
})

</script>

<style  lang="scss" scoped>
.bankCard{
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
    width:calc(100vw - 50rpx);
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
