<template>
  <view>
    <!--     #ifdef H5-->
    <scroll-view scroll-y="true" :style="`height:calc(${homeHeight -44}px - 88rpx)`" @scrolltolower="scrolltolower" :enable-flex="true">
      <!--      #endif-->
      <!--     #ifdef APP-PLUS || MP-WEIXIN-->
    <scroll-view scroll-y="true" :style="`height:calc(100vh - ${topHeight + 44}px - 106rpx)`" @scrolltolower="scrolltolower" :enable-flex="true">
      <!--      #endif-->
      <view class="list-item u-flex-center-between" v-for="it in pager.lists" :key="it.id" @click="goDetails(it)">
        <uv-icon size="38" v-if="it.read_status==1" name="/static/message/grwd.png"></uv-icon>
        <uv-icon size="38" v-else name="/static/message/yd.png"></uv-icon>
        <view class="content-box u-flex-grow">
          <view class="u-flex u-flex-between">
            <view class="title" :class="{'yjxx':it.read_status!==1}">{{ it.title }}</view>
            <view class="time"  :class="{'yjxx':it.read_status!==1}">{{formatDate(it.create_time,'M-D h:m:s') }}</view>
          </view>
          <view class="u-flex u-flex-between">
            <uv-text :lines="2" size="26rpx" :color="it.read_status==1?'#999':'#c7c7c7'" :text="it.content"></uv-text>
            <uv-icon size="15" style="margin-left: 52rpx" name="arrow-right" color="#999"></uv-icon>
          </view>
        </view>
      </view>
      <view v-if="!pager.loading&&pager.lists.length" class="u-flex-x-center" style="padding: 25rpx;font-size:20rpx;color:#999 ">已全部加载~</view>
      <uvNoData v-if="!pager.loading&&!pager.lists.length"/>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed} from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { usePaging } from "@/hooks/usePaging";
import { formatDate} from "@/utils/time"
import { messageList } from "@/api/user";
import { toPtah } from "@/utils/index"
const { pager,resetPageNum, getLists ,resetPage} = usePaging({
  fetchFun:messageList,
  params: {
    type:1
  },
})
const homeHeight = computed(() => {
  return uni.getSystemInfoSync().windowHeight
})
const topHeight = computed(() => {
  return uni.getSystemInfoSync().statusBarHeight
})
const goDetails=(it:any)=>{
  toPtah('/pages/myManage/message/details?item='+JSON.stringify(it))
}
const scrolltolower  = (it:object) =>{
  resetPage()
}
onLoad(()=>{
  resetPage()

})
</script>

<style  lang="scss" scoped>
  .list-item{
    background: $uni-text-color-inverse;
    color: $uni-default-back3Color;
    height: 126rpx;
    border-top:  2rpx solid $uni-bg-color-grey;
    padding:30rpx;
    .content-box{
      margin-left: 30rpx;
    }
    .time{
      font-size: 24rpx;
      color: $uni-default-backColor;
      margin-bottom: 20rpx;
    }
    .title{
      margin-bottom: 10rpx;
      font-family: $uni-family-Medium;
      font-size: 30rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 400rpx;
      height: 40rpx;
    }
    .yjxx{
      color: #c7c7c7!important;
    }

  }
</style>
