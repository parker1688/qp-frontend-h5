<template>
  <view class="lg-box">
    <uv-navbar placeholder bgColor="#1c1c1c"  @leftClick="pagesRoute" leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="我的消息">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
      <template v-slot:right>
        <view class="uv-nav-slot u-flex-center-end" @click="goToKF" style="color: #FFFFFF">
          <uv-icon name="/static/kf/kf.png" size="19"></uv-icon>
		  <text class="kfClass">客服</text>
        </view>
      </template>
    </uv-navbar>
    <view class="lg-item">
      <view class="table-box">
        <view class="table-item u-flex">
          <view v-for="(it,index) in tableList" :key="index" class="u-flex-xy-center"
                @click="tableBut(index)" :class="{'action':index ==tableNum }">{{it}}</view>
        </view>
      </view>

      <myList v-if="tableNum==0" ref="myRef"/>
      <systemList  v-else/>
   </view>
  </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed} from "vue";
const tableList =ref(['个人消息','系统消息'])
import { onLoad, onShow } from "@dcloudio/uni-app";
import myList from "./myList.vue"
import systemList from "./systemList"
import { toPtah ,pagesRoute} from "@/utils/index"
const tableNum=ref(0)
const myRef=shallowRef()

const tableBut = (index:number) => {
  tableNum.value = index
}

const goToKF=()=>{
  toPtah('/pages/kf/index')
}


</script>

<style  lang="scss" scoped>
.lg-box{
  width:100% ;
  overflow: hidden;
  // #ifdef H5
  height: 100%;
  // #endif
  // #ifdef APP-PLUS || MP-WEIXIN
  height:100vh;
  // #endif
  background-color:$uni-default-back0Color;
  .lg-item{
    border-radius: 30rpx 30rpx 0 0;
    overflow: hidden;
    height: 100%;
    background-color: $uni-bg-color-grey;
  }
  .table-box{
    height: 106rpx;
    background-color:  $uni-bg-color;
    overflow: hidden;
    .table-item{
      height: 70rpx;
      margin:18rpx 30rpx;
      background-color:  $uni-bg-color-grey;
      border-radius: 35rpx;
    }

    view{
      flex: 1;
      text-align: center;
      color: $uni-default-back3Color;
      box-sizing: border-box;
      font-family: $uni-family-Medium;
      font-size: 26rpx;
    }
    .action{
      color: $uni-bg-color;
      border: 4rpx solid $uni-default-color;
      background: $uni-default-color;
      border-radius: 35rpx;

    }
  }
}
</style>
