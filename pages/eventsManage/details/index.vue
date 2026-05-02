<template>
  <view class="container u-flex">
    <uv-navbar placeholder bgColor="#1c1c1c"  @leftClick="pagesRoute"  leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="活动详情">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
      <template v-slot:right>
        <view class="uv-nav-slot u-flex-center-end" @click="goToKF">
          <uv-icon name="/static/kf/kf.png" size="19"></uv-icon>
		  <text class="kfClass">客服</text>
        </view>
      </template>
    </uv-navbar>
    <view class="content-box u-flex-grow" :style="`margin-top:calc( ${topHeight + 44}px ) ` ">
      <!--      #ifdef H5-->
      <scroll-view scroll-y="true" style="height:100%" @scrolltolower="scrolltolower" :enable-flex="true">
        <!--        #endif    -->
        <!--      #ifdef APP-PLUS || MP-WEIXIN-->
      <scroll-view scroll-y="true" :style="`height:calc(100vh - ${topHeight + 44}px)`" @scrolltolower="scrolltolower" :enable-flex="true">
          <!--        #endif    -->
        <view v-if="promotionImg">
          <uv-image width="100%" mode="widthFix"  :src="promotionImg"  :lazy-load="true" />
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed} from "vue"
import { toPtah,pagesRoute } from "@/utils/index"
import { onLoad, onShow, onReady } from "@dcloudio/uni-app";
import environment from '@/utils/environments.ts'
const baseUrl = environment.envConfigs.url
const baseImgUrl = environment.envConfigs.imgUrl
const goToKF=()=>{
  toPtah('/pages/kf/index')
}
const topHeight = computed(() => {
  return uni.getSystemInfoSync().statusBarHeight
})
import {activityDetail} from "/api/user";
const detailData=ref({})
const detailBut=async (id:number)=>{
  const res=await activityDetail({id})
  detailData.value=res.data
}
const promotionImg=ref('')
onLoad((it:any)=>{
  promotionImg.value= it.promotionImg
})
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  // #ifdef H5
  height: 100%;
  // #endif
  // #ifdef APP-PLUS || MP-WEIXIN
  height:100vh;
  // #endif
  background-color:$uni-default-back0Color;

  .content-box{
    background-color:$uni-bg-color;
    border-radius: 30rpx 30rpx 0 0;
    //height: calc(100% - 44px);
    //margin-top: 44px;
    overflow: hidden;
    .title{
      width: 100%;
      font-size: 32rpx;
      padding: 20rpx 0;
      text-align: center;
      font-weight: bold;
    }
    .content {
      line-height: 48rpx;
      padding:   25rpx;
      font-size: 26rpx;
    }
    .time{
      font-size: 24rpx;
      padding: 20rpx 0;
      text-align: center;
    }
    .uv-nav-slot{
      color: #FFFFFF;
    }
  }

}
</style>