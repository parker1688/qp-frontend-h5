<template>
  <view class="container u-flex-column"
<!--        #ifdef APP-PLUS || MP-WEIXIN-->
    :style=" `height:calc(100vh - ${botHeight});`"
<!--  #endif-->
  >
    <uv-navbar  placeholder bgColor="#1c1c1c">
      <template v-slot:left></template>
      <template v-slot:center>
        <view class="h-top">
          <view class="menuBox  u-flex">
            <view v-for="(it,index) in menuList" :key="index" @click="menuBut(index)"  :class="{action:index==menuNum}">{{it}}</view>
          </view>
        </view>
      </template>
      <template v-slot:right>
        <view class="h-top u-flex-xy-center" v-if="menuNum"  @click="gotoTX">
          <image  src="/static/savingsAccount/czicon.png"></image>
        </view>
        <view class="h-top u-flex-xy-center" v-else @click="gotoCZ">
          <image  src="/static/savingsAccount/czicon.png"></image>
        </view>
      </template>
    </uv-navbar>
    <view class="scroll-box overflow-y">
        <withdraw v-if="menuNum"></withdraw>
        <topUp v-else></topUp>
    </view>
    <tabBar :current="2" />
  </view>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import topUp from "./topUp";
import withdraw from "./withdraw.vue";
import { toPtah} from "@/utils/index"
import { userStore } from "@/stores/user"
const menuList=ref(['充值','提现'])
const menuNum=ref(0)
const menuBut =(index:any)=>{
  menuNum.value=index
}
const botHeight = computed(() => {
  return  (50 + uni.getSystemInfoSync().safeAreaInsets.bottom)+'px'
})
const gotoCZ=()=>{
  toPtah('/pages/savingsManage/topUp/index')
}
const gotoTX=()=>{
  toPtah('/pages/savingsManage/withdrawalRecord/index')
}
onLoad(()=>{
  uni.hideTabBar()
})
onShow(async () => {
  userStore().setCustomNum(2)
  if(uni.getStorageSync('menuNum') && uni.getStorageSync('menuNum')>=0){
    console.log(uni.getStorageSync('menuNum'))
    menuNum.value=await  uni.getStorageSync('menuNum')
    uni.removeStorageSync('menuNum')
  }

})
</script>

<style lang="scss" scoped>
/* 页面整体样式 */
.container {
  box-sizing: border-box;
  overflow: hidden;
  background-color:#000000;
  // #ifdef H5
  height:calc(100% - 50px);
  // #endif
  .h-top {
    color: white;
    .menuBox{
      font-size: 32rpx;
      >view{
        color: $uni-default-backColor;
      }
      >view:first-child{
        margin-right: 40rpx;
      }
      .action{
        color: white;
      }
    }
    image{
      width: 50rpx;
      height: 55rpx;
      margin-right: 4rpx;
    }
  }
  .scroll-box{
    border-radius: 30rpx 30rpx 0 0;
    background-color: $uni-bg-color-grey;
    height: 100%;
  }
}

</style>
