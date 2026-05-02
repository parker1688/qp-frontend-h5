<template>
  <view class="zfbbox">
    <uv-navbar :placeholder="true" bgColor="#1c1c1c" @leftClick="pagesRoute"  leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="提现银行卡管理">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
    </uv-navbar>
    <scroll-view scroll-y="true" class="u-flex-grow"  :style="`height: ${homeHeight}px`" :enable-flex="true">
     <view  class="list-box">
       <view class="list-item u-flex-center-start" v-for="(it,index) in AllBindBankList" :key="index" :style="'background:url('+baseUrl+it.img+');background-size: 100% 100%;'">
           <image :src="baseUrl+ it?.icon"></image>
           <view>
             <view class="name">{{ it.account_bank_type }}</view>
             <view class="zh">●●●●  ●●●●  ●●●● {{ strLenght(it.account_number) }}</view>
           </view>
         </view>
       <view class="buts u-flex-xy-center" v-if="AllBindBankList.length<5" @click="toPtahBut">+ 添加银行卡</view>
     </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed} from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { toPtah,pagesRoute} from "@/utils/index"
import {AllBindBank} from "@/api/money"
import environment from '@/utils/environments.ts'
const baseUrl = environment.envConfigs.imgUrl
const homeHeight = computed(() => {
  return uni.getSystemInfoSync().windowHeight
})
const strLenght=(str:any)=>{
  return str.slice(-4)
}
const toPtahBut=()=>{
  toPtah('/pages/savingsManage/bankCard/index')
}
const AllBindBankList=ref([])
const  getlist=async ()=>{
  const res=await AllBindBank()
  if(res.data){
    AllBindBankList.value=res.data
  }

}
onShow(()=>{
  getlist()
})
</script>

<style  lang="scss" scoped>
.zfbbox{
  background-color: $uni-default-back0Color;
  overflow: hidden;
  .list-box{
    background-color: $uni-bg-color-grey;
    width:calc(100vw - 50rpx);
    // #ifdef H5
    height: 100%;
    // #endif
    // #ifdef APP-PLUS || MP-WEIXIN
    height:100vh;
    // #endif
    padding: 0 25rpx;
    overflow: hidden;
    border-radius: 30rpx 30rpx 0 0;
    .list-item{
      font-family: $uni-family-Medium;
      color: #ffffff;
      background: url("/static/tx/zfb-bg.png");
      background-size: 100% 100%;
      width: 690rpx;
      height: 138rpx;
      border-radius: 20rpx;
      margin-top: 28rpx;
      overflow: hidden;
      image{
        width: 68rpx;
        height: 68rpx;
        margin: 26rpx;
      }
      .name{
        font-size: 30rpx;
        margin-bottom: 20rpx;
      }
      .zh{
        font-size: 22rpx;
      }
    }
  }
  .buts{
    width: calc(100vw - 50rpx);
    height: 98rpx;
    border-radius: 49rpx;
    border: dashed 3rpx #000000;
    font-family: $uni-family-Regular;
    font-size: 30rpx;
    margin-top: 60rpx;
  }
}

</style>
