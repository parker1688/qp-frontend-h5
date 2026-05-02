<template>
  <view>
    <uv-overlay :show="show" @click="close">
      <view class="overlay-box u-flex-xy-center" @click.stop="">
        <view class="overlay u-flex-column-center-between">
               <view class="title u-flex-x-center">提示</view>
               <view class="text-box u-flex-direction-column">
                 <view>汇率:1钱包币=1.0CNY</view>
<!--                 <view>1 USDT = {{ ratePrice }}人民币</view>-->
                 <view>提币数量:{{ money }}</view>
                 <view>人民币金额:{{ money  }}CNY</view>
               </view>
               <view class="but u-flex u-flex-shrink0">
                 <view class="u-flex-xy-center"  @click="close">取消</view>
                 <view class="u-flex-xy-center" @click="confirm">确定</view>
               </view>
        </view>
      </view>
    </uv-overlay>
  </view>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, shallowRef, watch } from "vue";
const show=ref(false)
const funObject=ref(null)
const emit = defineEmits(['confirm'])
const ratePrice=ref(0)
const close=()=>{
  show.value=false
}
const money=ref(0)

const open=(it:any,fun:any)=>{
  money.value=it.money
  ratePrice.value=it.ratePrice
  show.value=true
  funObject.value=fun
}

const confirm=()=>{
  if(funObject.value) funObject.value()
  show.value=false
  setTimeout(()=>{
    funObject.value = null;
  })
}


defineExpose({
  open,
  close,
  confirm
})
</script>

<style lang="scss" scoped>
.overlay-box{
  width: 100vw;
  height: 100%;
  .overlay{
    width: 500rpx;
    height: 330rpx;
    background-color: #ffffff;
    border-radius: 30rpx;
    .title{
      font-family: $uni-family-Bold;
      font-size: 36rpx;
      color: #000000;
      margin: 46rpx 0 0 0;
    }
    .text-box{
      font-family: $uni-family-Bold;
      font-size: 26rpx;
      color: #000000;
      height: 100rpx;
    }
    .but{
      width: 100%;
      font-family: $uni-family-Bold;
      font-size: 24rpx;
      color: #1c1c1c;
      height: 78rpx;
      border-top:2rpx solid #e5e5e5 ;
      >view{
        width: 50%;
        height: 78rpx;
        box-sizing: border-box;
      }
      >view:first-child{
        border-right:2rpx solid  #e5e5e5;
      }
    }
   }
}
</style>