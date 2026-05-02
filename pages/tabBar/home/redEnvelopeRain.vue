<template>
  <view>
    <uv-overlay :show="show" >
      <view class="hby-box u-flex-direction-column" @click="close" v-if="openHBShow">
        <view class="hb-item u-flex-column-center-start" @click.stop="openHB">
          <view class="name">阳光狂夏消暑红包</view>
          <view class="ts">祝老板一路发发发!!!</view>
        </view>
<!--        <uv-icon name="/static/home/hb/close.png" @click.stop="close"  size="40"></uv-icon>-->
      </view>
      <view class="lhb-box u-flex-direction-column" @click="close" v-else>
        <view class="lhb-item u-flex-column-center-start" @click.stop="">
            <view class="money-box">
              <image src="/static/home/hb/money.png"></image>{{ bonus_amount }}
            </view>
            <image  @click.stop="open2HB" class="lookhbBut" src="/static/home/hb/lookhbBut.png"></image>
        </view>
        <uv-icon name="/static/home/hb/close.png" @click.stop="close"  size="40"></uv-icon>
      </view>
    </uv-overlay>

  </view>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, shallowRef, watch } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import {getActivityInfoReward} from "@/api/user";
import environment from '@/utils/environments.ts'
import { toPtah } from "@/utils/index"
const baseUrl = environment.envConfigs.url
const baseImgUrl = environment.envConfigs.imgUrl
const emit = defineEmits(['close'])
const popup = shallowRef()
const show=ref(false)
const openHBShow=ref(true)
const bonus_amount=ref(0)
const id=ref(0)
const content=ref('')
const open = (it:any)=>{
  id.value=it.id
  content.value=it.content
  show.value=true
  openHBShow.value=true

}
const getMoney= async ()=>{
  //活动类型（11 回血包；12 红包雨）
  const  resData=await getActivityInfoReward({id:id.value,type:12})
  bonus_amount.value=resData.data.bonus_amount

}

const openHB=()=>{
  openHBShow.value=false
  getMoney()

}
const open2HB=()=>{
  show.value=false
  openHBShow.value=false
  toPtah(`/pages/eventsManage/details/index?promotionImg=${baseImgUrl + content.value}`)
}
const  close =()=>{
  show.value=false
  setTimeout(()=>{
    openHBShow.value=true
    emit('close')
  },100)

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
  background-image: url("/static/home/hb/hby.gif");
  background-size: 100% 100%;
  image{
    width: 100vw;
    height: 100vh;
  }
  .hb-item{
    width: 100vw;
    height: 750rpx;
    background-image: url("/static/home/hb/khb.gif");
    background-size: 100% 100%;
    /* 动画设置 */
    animation: slideIn 1s forwards;
    .name{
      font-family: $uni-family-Bold;
      font-size: 52rpx;
      color: #fcf0c5;
      margin-top: 270rpx;
    }
    .ts{

      font-family: $uni-family-Regular;
      font-size: 32rpx;
      color: #fcf0c5;
      margin-top: 28rpx;
    }

  }
}
.lhb-box{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-image: url("/static/home/hb/hby.gif");
  background-size: 100% 100%;
  .lhb-item{
    width: 750rpx;
    height: 750rpx;
    background-image: url("/static/home/hb/lookhb1.png");
    background-size: 100% 100%;
    animation: slideIn2 1s forwards;
    .money-box{
      font-family: $uni-family-Bold;
      font-size: 128rpx;
      color: #e84f57;
      margin-top: 200rpx;
      text-align: center;
      image{
        width: 46rpx;
        height: 46rpx;
        margin-right: 10rpx;
      }
    }
    .lookhbBut{
      width: 408rpx;
      height: 114rpx;
      margin-top: 190rpx;
    }
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
@keyframes slideIn2 {
  from {
    transform: translateY(-200px)  scale(0.2);
  }
  to {
    transform: translateX(0)  scale(1);
  }
}
</style>