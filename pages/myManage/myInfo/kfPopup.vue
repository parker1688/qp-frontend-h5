<template>
  <view>
    <uv-popup ref="loginPopup" mode="bottom" :closeOnClickOverlay="false" round="30">
      <view class="loginPopup-box u-flex-column-center-start">
        <view class="top u-flex-center-around">
          <image style="width: 130rpx;height:130rpx" src="/static/search/nlogin.png"></image>
          <view class="u-flex-grow">
            <view class="u-flex-x-start logname">您已绑定手机号：</view>
            <view class="u-flex-x-start">+86 {{ strLenght(tel,4) }}，如需修改请联系客服</view>
          </view>
        </view>
        <view class="but u-flex u-flex-around">
          <view class="qx u-flex-xy-center" @click="close">取消</view>
          <view class="qd u-flex-xy-center" @click="logbut">联系客服</view>
        </view>
      </view>
    </uv-popup>
  </view>
</template>

<script lang="ts" setup>
import { toPtah } from "@/utils/index"
import { computed, reactive, ref, shallowRef, watch } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { userStore } from "@/stores/user"
const userDataStore = userStore();
const tel = computed(() => userDataStore.userInfo.tel)
const loginPopup = shallowRef()
const  close =() =>{
  loginPopup.value.close()

}
const  logbut =() =>{
  toPtah('/pages/kf/index')
  loginPopup.value.close()
}
const open =() =>{
  loginPopup.value.open()
}
const strLenght=(str:any,num:number = 1)=>{
  return str.slice(0,num -1) + '****' +str.slice(0 - num)
}
defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.loginPopup-box {
  width: 100%;
  height: 460rpx;
  background: white;
  overflow: hidden;
  .top {
    width:calc(100% - 50rpx);
    border-bottom: 2rpx dashed $uni-default-xzColor;
    height: 200rpx;
    font-size: 24rpx;
    color: #7a7683;
    padding-bottom: 20rpx;
    image {
      margin-right: 30rpx;
    }
    .logname {
      font-size: 30rpx;
      font-weight: 600;
      margin-bottom: 30rpx;
      color: #0f0f0f;
    }
  }
  .but {
    width: 100%;
    margin-top:60rpx;
    font-size: 28rpx;
    view {
      width: 336rpx;
      height: 88rpx;
      border-radius: 18rpx;
      border: solid 1rpx #000000;
      color: #000000;
    }

    .qd {
      color: white;
      background: $uni-default-color;
      border: solid 1rpx  $uni-default-color;
    }
  }
}
</style>