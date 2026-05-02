<template>
   <view class="wwl-box u-flex-direction-column">
       <image src="/static/noInternet/wwl.png"></image>
       <view class="title">网络不给力</view>
       <view class="ts">
         <view class="u-flex-xy-center">世界上最遥远的距离</view>
         <view class="u-flex-xy-center m8">就是我有游戏</view>
         <view class="u-flex-xy-center">你没有网络</view>
       </view>
       <view class="sx u-flex-xy-center" @click="sxBut">刷新试试</view>
   </view>
</template>

<script lang="ts" setup>

import {pagesRoute} from "@/utils/index";


const sxBut = ()=>{
  uni.getNetworkType({
    success: (res) => {
      if (res.networkType === 'none') {
        uni.showToast({
          title: '当前无网络连接，请检查网络设置',
          icon: 'none'
        });
      }else {
        pagesRoute()
      }
    }
  });
}
</script>

<style  lang="scss" scoped>
.wwl-box{
  width: 100vw;
  // #ifdef H5
  height: 100%;
  // #endif
  // #ifdef APP-PLUS || MP-WEIXIN
  height:100vh;
  // #endif
  background: $uni-bg-color-grey;
  image{
    width: 500rpx;
    height: 500rpx;
  }
  .title{
    margin: 6rpx 0 38rpx 0;
    font-family: $uni-family-Regular;
    font-size: 30rpx;
    color: #1c1c1c;
  }
  .ts{
    >view{
      font-family: $uni-family-Medium;
      font-size: 24rpx;
      font-weight: normal;
      font-stretch: normal;
      line-height: 36rpx;
      letter-spacing: 0rpx;
      color: #707070;
    }
    .m8{
      margin: 4rpx 0;
    }
  }
  .sx{
    width: 386rpx;
    height: 90rpx;
    border-radius: 45rpx;
    border: solid 2rpx $uni-default-color;
    font-family: $uni-family-Bold;
    font-size: 30rpx;
    color:$uni-default-color;
    margin-top: 58rpx;
  }
}
</style>