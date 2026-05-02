<template>
  <view>
    <uv-overlay :show="show" @click="close">
         <view class="overlay-box u-flex-xy-center">
               <view class="overlay-Item">
                   <view class="title u-flex-center-between">
                     <view style="width:20px"></view>
                     <view>温馨提示</view>
                     <uv-icon name="close" color="#e5e5e5" size="20"></uv-icon>
                   </view>
                   <view class="content-box">
                     <view class="top u-flex-center-between">
                       <image src="/static/search/nlogin.png"></image>
                       <view class="ts">
                         抱歉，当前可领取返水金额<br/>
                         不满足洗码规定的最低金额
                       </view>
                     </view>
                     <view class="tss">(可返水金额≥{{ money.toFixed(2) }}可进行洗码)</view>
                   </view>
                   <view class="but u-flex-xy-center">
                      <view class="u-flex-xy-center" @click="close">我知道了</view>
                      <view class="u-flex-xy-center" @click="dayGame">前往游戏</view>
                   </view>

               </view>
         </view>
    </uv-overlay>
  </view>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, shallowRef, watch } from "vue";
import { toPtah } from "@/utils/index"
const show=ref(false)
const dayGame=()=>{
  toPtah('/pages/tabBar/home/index',0)
}

const close=()=>{
  show.value=false
}
const money=ref(0)
const open=(it:any)=>{
  money.value=it.money
  show.value=true
}



defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.overlay-box{
  width: 100%;
  height: 100%;
  .overlay-Item{
    width: 632rpx;
    height: 634rpx;
    background-image: url("/static/codeWashing/tstc.png");
    background-size: 100% 100%;
    .title{
      width: 552rpx;
      height: 94rpx;
      padding:0 40rpx;
      font-family: $uni-family-Bold;
      font-size: 40rpx;
      color: #ffffff;
    }
    .content-box{
      border-bottom: 4rpx dashed #e5e5e5;
      padding-bottom: 76rpx;
      .top{
        padding:62rpx 50rpx;
        image{
          width: 130rpx;
          height: 130rpx;
          margin-right: 28rpx;
        }
        .ts{
          width: 400rpx;
          font-family:$uni-family-Bold;
          font-size: 30rpx;
          color: #1c1c1c;
        }
      }
      .tss{
        font-family: PingFang-SC-Heavy;
        font-size: 30rpx;
        color: #ae8d45;
        text-align: center;
      }

    }
    .but{
      margin-top: 20rpx;
      >view{
        width: 280rpx;
        height: 88rpx;
        background-color: #ffffff;
        border-radius: 18rpx;
        border: solid 2rpx #000000;
        font-family: $uni-family-Regular;
        font-size: 28rpx;
        color: #000000;
      }
      >view:last-child{
        background-color: $uni-default-color;
        border: solid 2rpx $uni-default-color;
        font-family: $uni-family-Bold;
        color: #ffffff;
        margin-left: 24rpx;
      }
    }
  }
}
</style>