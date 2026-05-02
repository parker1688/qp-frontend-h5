<template>
  <view class="kfz-box">
    <view class="kfz">
      <view class="u-flex-center-around" @click="gotoKF">
        <view class="u-flex-grow u-flex-center-start">
          <image src="/static/kf/kf3.png"></image>
          <view class="text-box">
            <view>在线客服</view>
            <view class="text">快捷、便捷、及时沟通</view>
          </view>
        </view>
        <uv-icon name="arrow-right" size="20" color="#999"></uv-icon>
      </view>
    </view>
    <loginPopup ref="loginPopupRef" />
  </view>

</template>

<script lang="ts" setup>
import {computed, shallowRef} from "vue";
import loginPopup from "@/components/loginPopup/index";
const loginPopupRef = shallowRef()
import { userStore } from "@/stores/user"
import { toPtah } from "@/utils/index"
const userDataStore = userStore();
const isToken = computed(() => userDataStore.token ? true : false)
const userData = computed(() => userDataStore.userInfo)
const gotoKF=()=>{
  if (!isToken.value) {
    loginPopupRef.value.open()
    return
  }
 toPtah('/pages/kf/index')
}
</script>

<style lang="scss" scoped>
.kfz-box{
  background-color:$uni-default-back0Color;
  .kfz{
    width: 100%;
    background-color: $uni-bg-color-grey;
    overflow: hidden;
    height: 100%;
    border-radius: 30rpx 30rpx 0 0;
    >view{
      background: #FFFFFF;
      padding: 20rpx;
      font-size: 28rpx;
      border-radius: 30rpx;
      height:76rpx;
      .text-box{
        margin-left: 20rpx;
        .text{
          font-size: 20rpx;
          color: $uni-default-backColor;
          margin-top: 10rpx;
        }
      }

    }
    image{
      width: 50rpx;
      height: 50rpx;
    }
  }

}

</style>
