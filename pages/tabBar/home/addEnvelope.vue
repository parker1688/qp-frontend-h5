<template>
  <view>
    <uv-overlay :show="show" class="hby-box u-flex-direction-column" @click="close">
        <view class="swiper-box" @click.stop="">
          <swiper class="swiper-item" :autoplay="false" :current="current" style="" @change="swiperChange">
            <swiper-item v-for="(it,index) in swiperList" :key="index">
              <view class="hb-item u-flex-column-center-start" :class="it.gift_style ==1?'hb-back1':it.gift_style ==2?'hb-back2':'hb-back3'">
                <view class="name">★ {{it.content}} ★</view>
                <view class="money-box">
                  <image src="/static/home/hb/money.png"></image>{{ it.bonus_amount }}
                </view>
                <image @click.stop="getMoney(it)" class="hxbut"  src="/static/home/hb/hxbut.png"></image>
                <view class="ts">
                  {{ it.stage_content }}
                </view>
              </view>
            </swiper-item>
          </swiper>
          <view class="left" @click.stop="currentLeft" v-if="!isTrueBut&&swiperList.length>1">
            <uv-icon name="/static/home/hb/left.png"  size="40"></uv-icon>
          </view>
          <view class="right" @click.stop="currentRight" v-if="isTrueBut&&swiperList.length>1">
            <uv-icon name="/static/home/hb/right.png"   size="40"></uv-icon>
          </view>
        </view>
        <uv-icon name="/static/home/hb/close.png"  style="margin-top: 36rpx" size="40"></uv-icon>
    </uv-overlay>
  </view>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, shallowRef, watch } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import {getActivityInfoReward} from "@/api/user";
import { startStore } from "@/stores/start"
const show=ref(false)
const bonus_amount=ref(0)
const id=ref(0)
const current=ref(0)
const swiperList=ref([])
const isTrueBut=ref(true)


const swiperChange=(e:any) =>{
  current.value=e.detail.current
  if(current.value>=swiperList.value.length -1){
    isTrueBut.value=false
  }
  if( current.value ==0){
    isTrueBut.value=true
  }
}

// 滑动结束时触发
const currentLeft=() => {
  if(current.value -1 <= 0){
    current.value =0
    isTrueBut.value=true
  }else {
    current.value =current.value -1
  }

}
const currentRight=() => {
  if(current.value>=swiperList.value.length -2){
    current.value = swiperList.value.length -1
    isTrueBut.value=false
  }else {
    current.value =current.value +1
  }
}

const open = (it:any)=>{
  console.log(JSON.parse(it.list))
  swiperList.value=JSON.parse(it.list)
  show.value=true
}
const getMoney= async (it:any)=>{
  //活动类型（11 回血包；12 红包雨）
  const id=it.id
  const  res=await getActivityInfoReward({id,type:11})
  if(res.code == 0){
    uni.showToast({
      icon: 'none',
      title: res.msg,
    })
    swiperList.value =swiperList.value.filter(item => item.id !== id);
    current.value=0
    startStore().setAddEnvelopeNum(swiperList.value.length)
    if(!swiperList.value.length){
      close()
    }
  }

}

const close=()=>{
  show.value=false
}
defineExpose({
  open,
  close,
})
</script>

<style scoped lang="scss">
.hby-box{
  width: 100%;
  height: 100%;
  .swiper-box{
    width: 100vw;
    height: 1025rpx;
    position: relative;
    .swiper-item{
      width: 100vw;
      height: 1025rpx;
    }
    .left{
      width:52rpx;
      height: 80rpx;
      position: absolute;
      left: 30rpx;
      top: calc(70% - 40rpx);
      z-index: 6666;

    }
    .right{
      width:52rpx;
      height: 80rpx;
      position: absolute;
      right:30rpx;
      top: calc(70% - 40rpx);
      z-index: 6666;

    }
  }

  .hb-item{
    width: 100vw;
    height: 1025rpx;
    /* 动画设置 */
    animation: slideIn 1s forwards;
    .name{
      font-family: $uni-family-Bold;
      font-size: 30rpx;
      color: #1c1c1c;
      margin-top: 590rpx;
    }
    .money-box{
      font-family: $uni-family-Bold;
      font-size: 128rpx;
      color: #e84f57;
      text-align: center;
      image{
        width: 46rpx;
        height: 46rpx;
        margin-right: 10rpx;
      }
    }
    .hxbut{
      width: 328rpx;
      height: 118rpx;
    }
    .ts{
      font-family: $uni-family-Bold;
      font-size: 18rpx;
      color: #707070;
      margin-top: 34rpx;
    }

  }
  .hb-back1{
    background-image: url("/static/home/hb/hx1.png");
    background-size: 100% 100%;
  }
  .hb-back2{
    background-image: url("/static/home/hb/hx2.png");
    background-size: 100% 100%;
  }
  .hb-back3{
    background-image: url("/static/home/hb/hx3.png");
    background-size: 100% 100%;
  }
}
@keyframes slideIn {
  from {
    transform: translateY(-200px)  scale(0.4);
  }
  to {
    transform: translateX(0)  scale(1);
  }
}

</style>