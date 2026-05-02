<template>
  <div>
    <uv-overlay :show="show">
      <view class="hv-box u-flex-xy-center">
         <view class="hv-item">
              <view class="hv-top u-flex-center-between">
                <view style="width: 40px"> </view>
                <view>输入验证码</view>
                <uv-icon @click="close" style="margin-right: 10rpx" size="30" color="#fff" name="close"></uv-icon>
              </view>
              <view class="ts">
                <view>亲爱的玩家，为了您的账号安全，</view>
                <view>请输入绑定手机验证码</view>
              </view>
              <view class="phone">
                手机号: <text>{{ strLenght(userData.tel,4) }}</text>
              </view>
              <view class="phone-code">
                <uv-input placeholder="输入验证码" maxlength="6"   fontSize="15"  type="number"  v-model="veryCode">
                  <!-- vue3模式下必须使用v-slot:suffix -->
                  <template v-slot:suffix>
                    <uv-code ref="uCode" @change="codeChange" seconds="60" changeText="X秒重新获取"
                    ></uv-code>
                    <uv-button @click="getCode" :text="tips" type="success" size="mini"></uv-button>
                  </template>
                </uv-input>
              </view>
              <view class="u-flex-x-center">
                <uv-button  class="but" text="确认" customStyle="width:500rpx;height: 96rpx; background-color: #ae8d45;font-size: 32rpx;
               color: #ffffff; border-radius: 48rpx;" @click="handleSubmit"></uv-button>
              </view>
         </view>
      </view>
    </uv-overlay>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, shallowRef} from "vue";
import {getPhoneVeryCode,bindBank,bindOnline,bindBlockchain} from "@/api/money"
import { tagEnum } from '@/enums/savingsEnums'
import { toast } from '@/uni_modules/uv-ui-tools/libs/function/index.js';

import { userStore } from "@/stores/user"
const userData = computed(() =>  userStore().userInfo)
const show=ref(false)
const uCode=shallowRef()
const emit = defineEmits(['getData'])
const parent = withDefaults(
    defineProps<{
      tagType:String,
    }>(),
    {
      tagType: ''
    }
)

const formData=ref({})

const veryCode=ref(null)
const tips=ref('')
const codeChange =(text) => {
  tips.value = text;
}
const getCode =()=> {
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

const getPhoneVeryCodeBut=async()=>{
 const res=await  getPhoneVeryCode({
   tag:parent.tagType,
   phone:userData.value.tel
 })
}

const strLenght=(str:any,num:number = 1)=>{
  return str.slice(0,num -1) + '****' +str.slice(0 - num)
}
const open=(data:object,type:number)=>{
  show.value=true
  formData.value=JSON.parse(data)
  delete formData.value.typeName
}

const handleSubmit =async ()=>{
   if(!veryCode.value){
     uni.showToast({
       icon: 'none',
       title: '请输入验证码！',
     })
    return
   }

  const regs1 =  /\d{6}/
  if(!regs1.test(veryCode.value)){
    uni.showToast({icon: 'none', title: '验证码为6位数字！'})
    return
  }
   let res=null
   if(parent.tagType == tagEnum.BindBank){
      res =await  bindBank({veryCode:veryCode.value,...formData.value})
   }else  if(parent.tagType == tagEnum.Blockchain){
      res =await  bindBlockchain({veryCode:veryCode.value,...formData.value})
   }else  if(parent.tagType == tagEnum.BindOnline){
     res =await  bindOnline({veryCode:veryCode.value,...formData.value})
  }

   if(res.code == 0){
     uni.showToast({
       title: res.msg
     })
     setTimeout(()=>{
       dayOkBut()
       uni.navigateBack()
     },2000)
   }

}

const dayOkBut=()=>{
  show.value=false
}

const close=()=>{
  show.value=false
}
defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.hv-box{
  width: 100%;
  height: 100%;
  .hv-item{
    width: 600rpx;
    height: 600rpx;
    background: white;
    border-radius: 30rpx;
    overflow: hidden;
    .hv-top{
      width: 100%;
      height: 100rpx;
      background: $uni-default-color;
      color: white;
      font-size: 32rpx;
    }
    .ts{
      padding:30rpx 50rpx;
      color: $uni-text-color-grey;
    }
    .phone{
      font-size: 36rpx;
      color: $uni-default-back0Color;
      padding:0 50rpx;
      text{
        font-weight: 600;
        font-size: 40rpx;
      }
    }
    .phone-code{
      padding:30rpx 50rpx;
    }
  }
}

</style>