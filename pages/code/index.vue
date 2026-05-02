<template>
  <view class="wrap u-flex-xy-center">
    <uv-loading-page :loading="true" loading-text="加载中..." font-size="24px"></uv-loading-page>
  </view>
</template>

<script lang="ts" setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import {computed, reactive, ref} from "vue";
import { toPtah,getWindowUrl} from "@/utils/index"
import { userStore } from "@/stores/user"
import {getMerchantCode} from "@/api/user"
const inviteCode = computed(()=>userStore().merchantCode )

onLoad((e:any)=>{
  const href =getWindowUrl()
  getMerchantCodeBut(e.agent)
})

const getMerchantCodeBut=async (agent:any)=>{
  const res=await getMerchantCode({invite_code:agent})
  if(res.code == 0 && res.data?.merchant_code){
    const newCode=res.data.merchant_code
    if(inviteCode.value !== newCode){
      userStore().setMerchantCode(newCode)
      userStore().resetState()
    }
    toPtah('/pages/tabBar/home/index',0)
  }

}


</script>

<style scoped>
.wrap{
  width: 100%;
  height: 100%;
  background:#f7f7f7;
}

</style>