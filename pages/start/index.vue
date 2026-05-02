<template>
   <view class="start-box">
      <view class="tg-box u-flex-xy-center" v-if="num > 0">
        <text class="text" @click="toHome">跳过</text> <text>{{num}}s</text>
      </view>
     <image class="image" src="/static/logo/qd3.png"></image>

<!--     <uv-image mode="aspectFill" :src="\ startImg" width="100vw"  height="100vh" :observeLazyLoad="true">-->
<!--       <template v-slot:loading>-->
<!--         <image src="/static/search/ljz.png" style="width:120rpx;height:120rpx"></image>-->
<!--       </template>-->
<!--       <template v-slot:error>-->
<!--         <image :src="baseUrl + startImg" class="image"></image>-->
<!--       </template>-->
<!--     </uv-image>-->
   </view>
</template>

<script lang="ts" setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import { userStore } from "@/stores/user"
import {pagesRoute ,toPtah} from "@/utils/index"
import {computed, ref,shallowRef,watchEffect } from "vue";
import { startInfo} from '@/api/user'
import environment from '@/utils/environments.ts'
const baseUrl = environment.envConfigs.url
const baseImgUrl = environment.envConfigs.imgUrl


const num=ref(5)
const stopWatch = watchEffect(() => {
  if (num.value <= 0) {
    stopWatch();
    toHome()
  } else {
    setTimeout(() => {num.value--;}, 1000);
  }
})



const startImg=computed(()=>userStore().startImg)
const agentId=computed(()=>userStore().agentId)
const toHome=()=>{
  uni.getNetworkType({
    success: (res) => {
      if (res.networkType !== 'none') {
        toPtah('/pages/tabBar/home/index',0)
      }
    }
  });
}
onShow(()=>{
  uni.getNetworkType({
    success: (res) => {
      if (res.networkType === 'none') {
        num.value = 0
      }else {
        num.value = 5
      }
    }
  });
})
</script>

<style scoped lang="scss">
.start-box{
   width: 100vw;
   height: 100vh;
   position: relative;
  .tg-box{
    position: absolute;
    right: 43rpx;
    top: 100rpx;
    width: 137rpx;
    height: 67rpx;
    border-radius: 8rpx;
    border: solid 2rpx #ffffff;
    z-index: 999;
    text{
      font-family: $uni-family-Regular;
      font-size: 26rpx;
      font-weight: normal;
      font-stretch: normal;
      color: #ffffff;
      margin-right: 30rpx;
    }
    text:last-child{
      margin-right:0;
    }
  }

  .tg-boxs{
    position: absolute;
    right: 43rpx;
    top: 200rpx;
    min-width: 500rpx;
    min-height: 200rpx;
    border-radius: 8rpx;
    border: solid 2rpx #ffffff;
    z-index: 999;
    color: #FFFFFF;
    font-size: 30rpx;
    font-weight: 600;
    text{
      font-family: $uni-family-Regular;
      font-size: 26rpx;
      font-weight: normal;
      font-stretch: normal;
      color: #ffffff;
      margin-right: 30rpx;
    }
    text:last-child{
      margin-right:0;
    }
  }
  .image{
    width: 100vw;
    height: 100vh;
  }
}
</style>