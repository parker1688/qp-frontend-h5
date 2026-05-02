<template>
  <view class="savingsbox"  >
    <scroll-view scroll-y="true" class="dayList-box" :style="`height: ${homeHeight}px`">
      <uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute"  leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="存款信息">
        <template v-slot:right>
          <view class="uv-nav-slot u-flex-center-end" @click="goToKF" style="color: #FFFFFF">
			 <uv-icon name="/static/kf/kf.png" size="19" ></uv-icon>
			 <text class="kfClass">客服</text>
          </view>
        </template>
      </uv-navbar>
      <view class="content-box">
        <view class="top u-flex-direction-column">
          <view class="money">¥ <text>200</text></view>
          <view class="fz28 moneyts">存入金额</view>
          <view class="fz26">请 <text>尽快</text> 完成支付</view>
          <view class="fz20 ts1">（请存入金额与以上金额一致，否则无法到账）</view>
        </view>
        <view class="middle u-flex-column u-flex-items-center">
          <view class="u-flex-center-between">
            <lable>二维码收款(TRC20)</lable>
            <text class="fz20">请扫一扫以下二维码，完成支付</text>
          </view>
          <view class="ewm borderNone u-flex-direction-column">
              <image src=""></image>
              <view class="but u-flex-xy-center">点击保存</view>
          </view>
          <view class="u-flex-center-between">
            <lable>MEMO:</lable>
            <view class="u-flex-grow">TRC20</view>
            <view class="code u-flex-xy-center">复制</view>
          </view>
          <view class="u-flex-center-between borderNone">
            <lable>充值地址:</lable>
            <view class="u-flex-grow">TXlajdljdljlfjlakjsdlasdjlasjd...</view>
            <view class="code u-flex-xy-center">复制</view>
          </view>
        </view>
        <view class="middle ">
          <view class="u-flex-center-between">
            <lable>当前汇率:</lable>
            <view>1USDT=7.31CNY</view>
          </view>
          <view class="u-flex-center-between">
            <lable>交易金额:</lable>
            <view>1USDT=7.31CNY</view>
          </view>
          <view class="u-flex-center-between borderNone">
            <lable>订单号:</lable>
            <view class="u-flex-grow">TXlajdljdljlfjlakjsdlasdjlasjd...</view>
            <view class="code u-flex-xy-center">复制</view>
          </view>
        </view>
        <view class="middle">
          <view class="u-flex-center-between">
            <lable>存款方式:</lable>
            <view>支付宝支付</view>
          </view>
          <view class="u-flex-center-between borderNone">
            <lable>交易时间:</lable>
            <view>2025-01-01 00:00:00</view>
          </view>
        </view>
        <view class="ts-box">
          <view>*重要提醒</view>
          <view class="ts1">1.请及时按通道要求存款</view>
          <view class="ts1">2.若存在疑问，请联系<text>在线客服。</text></view>
        </view>

      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed} from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
const homeHeight = computed(() => {
  return uni.getSystemInfoSync().windowHeight
})
import { toPtah,pagesRoute } from "@/utils/index"
const goToKF=()=>{
  toPtah('/pages/kf/index')
}
const formData = reactive({
  email:'',
  name:''
})


// 提交数据
const handleSubmit =  async () => {

}
onShow(()=>{


})

</script>

<style  lang="scss" scoped>
.savingsbox{
  background-color: $uni-default-back0Color;
  overflow: hidden;
  .content-box{
    background-color: $uni-bg-color-grey;
    width: 100vw;
    min-height: 100%;
    overflow: hidden;
    border-radius: 30rpx 30rpx 0 0;
    .fz28{
      font-size: 28rpx;
    }
    .fz26{
      font-size: 28rpx;
    }
    .fz20{
      font-size: 20rpx;
    }

    .top{
      width: 100vw;
      height: 298rpx;
      background-color: #ffffff;
      border-radius: 30rpx;
      .money{
        color: #c50404;
        font-size: 44rpx;
        text{
          font-size: 76rpx;
        }
      }
      .moneyts{
        margin: 20rpx;
      }
      .ts1{
        color: #ff700c;
      }
      text{
        color: #c50404;
      }
    }
    .middle{
      width:calc(100vw - 50rpx);
      padding:0 25rpx;
      min-height: 108rpx;
      border-radius: 30rpx;
      background-color: #ffffff;
      margin-top: 20rpx;
      >view{
        width: 700rpx;
        height: 90rpx;
        border-bottom: 1rpx solid $uni-text-color-grey;
      }
      .borderNone{
        border: none;
      }
      .ewm{
        width: 298rpx;
        height: 392rpx;
        background-color: $uni-bg-color-grey;
        border-radius: 20rpx;
        margin: 20rpx;
        image{
          width: 232rpx;
          height: 232rpx;
          background-color:#FFFFFF;
          margin-bottom: 20rpx;
        }
        .but{
          width: 268rpx;
          height: 78rpx;
          background-color:$uni-default-color;
          border-radius: 39rpx;
          font-family: $uni-family-Medium;
          color: #ffffff;
        }
      }
      lable{
        font-size: 28rpx;
        margin-right: 20rpx;
      }
      .code{
        width: 68rpx;
        height: 40rpx;
        background-color: #f7f7f7;
        font-size: 18rpx;
        border-radius: 20rpx;
      }
      text{
        color: #7a7683;
      }
    }
    .ts-box{
      margin:50rpx 25rpx;
      color: #c50404;
      font-size: 20rpx;
      .ts1{
        color: #7a7683;
        text{
          color: #ff700c;
        }
      }

    }
  }
}

</style>
