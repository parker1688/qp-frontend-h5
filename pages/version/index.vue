<template>
  <view class="down-box">
    <view class="xz-box u-flex-xy-center">
      <uv-icon  name="/static/down/downlogo.png" size="43"></uv-icon>
      <image class="xz"  src="/static/down/loading1.png"></image>
    </view>
    <view class="down-footer">
      <view class="text">下载更新中，请勿退出</view>
      <uv-line-progress :percentage="downVersionData.progress" height="28rpx" activeColor="#868686" customStyle="border: solid 2rpx #555555;" inactiveColor="#1c1c1c"></uv-line-progress>
      <view class="mb">{{downVersionData.downloadedSize ||0}}MB/{{downVersionData.totalSize || 0}}MB</view>
    </view>

  </view>
</template>

<script lang="ts" setup>
import {ref, reactive, computed} from "vue";
import { userStore } from "@/stores/user"
const downVersionData=  computed(()=>userStore().downVersionData)
</script>

<style lang="scss" scoped>
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.down-box{
  width: 100vw;
  height: 100vh;
  background: #1c1c1c;
  .xz-box{
    position: fixed;
    top: 38%;
    left:calc(50% - 80rpx);
    width: 160rpx;
    height: 160rpx;
    .xz{
      position: absolute;
      left: 0;
      right: 0;
      width: 160rpx;
      height: 160rpx;
      animation: rotate 1.5s linear infinite;
    }
  }
  .down-footer{
    position: fixed;
    bottom: 160rpx;
    width: 82%;
    margin: 0 9%;
    .text{
      text-align: center;
      margin-bottom: 18rpx;
      font-family: $uni-family-Regular;
      font-size: 30rpx;
      color: #868686;
    }
    .mb{
      text-align: center;
      font-family: $uni-family-Regular;
      font-size: 30rpx;
      font-weight: normal;
      font-stretch: normal;
      color: #868686;
      margin-top: 22rpx;
    }

  }
}


</style>