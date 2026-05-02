<template>
  <view>
    <uv-popup ref="popup" mode="center" :safeAreaInsetBottom="false" round="15">
      <view class="swiper-box u-flex-column u-flex-end">
        <view class="title u-flex-center-end"  style="margin-right: 20rpx">
           <uv-icon name="close"  @click="close" color="#e6e3da" bold size="28"></uv-icon>
        </view>
        <swiper class="swiper" autoplay circular indicator-color="#999" indicator-active-color="#4cd964"  :indicator-dots="indicatorDots"  style="width: 573rpx;height: 620rpx;" @change="swiperChange">
          <swiper-item v-for="(its,indexs) in list" :key="indexs">
            <image style="width:573rpx;height:620rpx" mode="aspectFill" :src="baseImgUrl+its.bulletin_img"></image>
          </swiper-item>
        </swiper>
        <view class="but u-flex-xy-center" v-if="isToken">
          <checkbox-group @change="change">
            <checkbox :value="true" :checked="dayReminder"><text class="textbox">今日不再提醒</text></checkbox>
          </checkbox-group>
        </view>
      </view>
    </uv-popup>
  </view>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, shallowRef, watch } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import environment from '@/utils/environments.ts'
const baseUrl = environment.envConfigs.url
const baseImgUrl = environment.envConfigs.imgUrl
import {formatDate} from "@/utils/time";
import { userStore } from "@/stores/user"
const userDataStore = userStore();
const isToken = computed(() => userDataStore.token ? true : false)
const current=ref(0)
const indicatorDots=ref(true)
const dayReminder = ref(false)
const popup = shallowRef()
const list=ref([])
const emit = defineEmits(['close']); // 声明事件

const swiperChange=()=>{

}
const change=(it:any)=>{
  dayReminder.value= it.detail.value.length>0?true:false

}
const open = (it:any)=>{
  list.value =it
  if(list.value.length){
    popup.value.open()
    dayReminder.value=false
  }

}
const close = ()=>{
  popup.value.close()
  const time=formatDate(new Date().getTime(),'Y-M-D')
  const userInfo=userStore().userInfo
  let data={
    isTure: true,
    time:dayReminder.value?time:'',
    user_id:userInfo?.user_id || ''
  }
  userDataStore.setDayReminder(data)
   emit('close');
}

defineExpose({
  open,
  close,
})
</script>

<style lang="scss" scoped>
.swiper-box{
  width: 573rpx;
  height: 725rpx;
  overflow: hidden;
  position: relative;
  //#ifdef APP-PLUS||H5
  background-image: url("/static/home/ggback.png");
  background-size: 100% 100%;
  //#endif
  //#ifdef MP-WEIXIN
  background: red;
  //#endif
  overflow: hidden;
  border-radius:30rpx;

  .title{
    height: 110rpx;
 //   font-size: 38rpx;
  }
  .but{
    width: 200rpx;
    height: 50rpx;
    position: absolute;
    color: #ffffff;
    font-size: 20rpx;
    font-weight: 500;
    bottom: 18rpx;
    left: 20rpx;
    z-index: 6666;
    font-family: $uni-family-Medium;
   // background:$uni-border-color;
     .textbox{
       background: rgba(0,0,0,.4);
       padding: 2rpx;
       display: inline-block;
     }
    :deep(.uni-checkbox-input){
      width: 32rpx;
      height: 32rpx;
      border-radius: 50%;
      box-shadow: 0rpx 0rpx 6rpx 0rpx #525252;
      border: solid 2rpx #ffffff;
      background: transparent;
    }
  }
}

:deep(.uv-popup__content){
  background-color:transparent!important;
}
</style>