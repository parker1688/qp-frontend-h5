<template>
   <view v-if="isDownShow" class="downTop u-flex-center-between">
      <view class="u-flex-xy-center">
          <image class="close" @click="close" src="/static/home/down/close.png"></image>
          <image class="logo" :src="baseImgUrl + merchantData.logo_img"></image>
          <view>
             <view class="title">{{merchantData.merchant_name}}APP</view>
             <view class="text">下载APP，体验更多游戏!</view>
          </view>
      </view>
     <image class="down" src="/static/home/down/down.png" @click="downBut"></image>
   </view>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, shallowRef, watch,watchEffect } from "vue";
import environment from '@/utils/environments.ts'
const baseUrl = environment.envConfigs.url
const baseImgUrl = environment.envConfigs.imgUrl
import { userStore } from "@/stores/user"
const isDownShow=computed(()=> userStore().isDownShow)
const merchantData =computed(()=> userStore().merchantData)
const downBut=()=>{
  setTimeout(()=>{
    window.open('https://'+merchantData.value.short_link, '_blank');
  },200)
}

const close=()=>{
  userStore().setIsDownShow(false)
}
</script>

<style lang="scss" scoped>
.downTop{
  width: calc(100vw - 44rpx);
  padding: 0 22rpx;
  height: 48px;
  background-color: $uni-bg-color-grey;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  overflow: hidden;
  .close{
    width: 24rpx;
    height: 24rpx;
    margin-right: 24rpx;
  }
  .logo{
    width: 70rpx;
    height: 70rpx;
    margin-right: 26rpx;
  }
  .title{
    font-family: $uni-family-Bold;
    font-size: 28rpx;
    color: #1c1c1c;
  }
  .text{
    font-family: $uni-family-Regular;
    font-size: 18rpx;
    color: #717171;
  }
  .down{
    width: 144rpx;
    height: 54rpx;
  }

}
</style>