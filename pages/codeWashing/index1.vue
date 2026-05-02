<template>
  <view class="container">
    <uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute" leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="我的返水">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
      <template v-slot:right>
        <view class="h-top">
          <view class="menuBox  u-flex" @click="dayOpen">
            返水记录
          </view>
        </view>
      </template>
    </uv-navbar>

    <view class="containerItem u-flex-column u-flex-start u-flex-items-center">
        <image class="log" src="/static/kf/xm.png"></image>
        <view class="money">
          <image style="width: 40rpx;height:40rpx" src="/static/savingsAccount/rmb.png" />
          {{total_bet_amount.toFixed(2) }}
        </view>
        <view class="text" v-if="total_bet_amount>=1">您当前洗码数量</view>
        <view class="text" v-else>您暂无洗码，请先游戏</view>
        <view class="but u-flex-xy-center" v-if="total_bet_amount>=1" @click="rebateApplyBut">领取返水</view>
        <view class="but buts u-flex-xy-center" v-else @click="dayGame">前往游戏</view>
        <view class="ts">由于注单延迟，下注后15分钟左右再领取</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {computed, ref, shallowRef} from "vue";
import { toPtah,pagesRoute } from "@/utils/index"
import { onLoad, onShow } from "@dcloudio/uni-app";
import {getRebate,rebateApply} from "@/api/user";
import { userStore } from "@/stores/user"
import { getUserinfoBut} from "@/hooks/publicRequest";
const userDataStore = userStore();
const total_bet_amount=ref(0)

const dayGame=()=>{
  toPtah('/pages/tabBar/home/index',0)
}
const dayOpen=()=>{
  toPtah('/pages/codeWashing/list')
}
const getRebatebut=async ()=>{
  const data={
    user_id:userDataStore.userInfo.user_id,
    user_name:userDataStore.userInfo.user_name
  }
  const res=await getRebate(data)
  total_bet_amount.value=res.data.total_bet_amount
}

const rebateApplyBut =async()=>{
  const data={
    user_id:userDataStore.userInfo.user_id,
    user_name:userDataStore.userInfo.user_name
  }
  if(userDataStore.userInfo.is_bonus == 2){
    uni.showToast({icon: 'none',title: '您被禁止领取福利，请联系客服',})
    return
  }
  const res=await rebateApply(data)

  uni.showToast({icon: 'none', title:res.msg})
  setTimeout(()=>{
    getRebatebut()
  },1500)
}
onShow(()=>{
  getRebatebut()
  getUserinfoBut()
})
</script>


<style lang="scss" scoped>
/* 页面整体样式 */
.container {
  box-sizing: border-box;
  overflow: hidden;
  height: 100%;
  background-color:$uni-default-back0Color;
  .h-top {
    color: white;
    .menuBox {
      font-size: 28rpx;
    }
  }
  .containerItem{
    border-radius: 30rpx 30rpx 0 0;
    background-color:$uni-bg-color;
    height: 100%;
    .log{
      width: 392rpx;
      height: 392rpx;
      margin-top: 133rpx;
      margin-bottom: 125rpx;
    }
    .money{
      font-size: 72rpx;
      margin-bottom: 42rpx;
      font-family: $uni-family-Heavy;
      font-weight: 600;
    }
    .text{
      font-size: 28rpx;
      font-family: $uni-family-Regular;
    }
    .but{
      background: $uni-default-color;
      width: 566rpx;
      height: 98rpx;
      border-radius: 50rpx;
      margin-top: 76rpx;
      font-size: 34rpx;
      letter-spacing: 4rpx;
      font-family: $uni-family-Medium;
    }
    .buts{
      color: $uni-default-color;
      background:$uni-default-xzColor;
    }
    .ts{
      margin-top: 36rpx;
      font-size: 22rpx;
      color: $uni-default-back6Color;
    }
  }


}

</style>