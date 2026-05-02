<template>
  <view class="container-box">
    <uv-navbar placeholder bgColor="#1c1c1c"  @leftClick="pagesRoute" leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="通知详情">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
      <template v-slot:right>
        <view class="uv-nav-slot u-flex-center-end" @click="delShowBut" style="color: #FFFFFF">
          <uv-icon name="trash" size="28" color="#ffffff" style="margin-right: 10rpx"></uv-icon>
        </view>
      </template>
    </uv-navbar>
     <view class="container u-flex-column">
        <view class="list-item u-flex-center-between">
          <uv-icon size="50" name="/static/message/yd.png"></uv-icon>
          <!--            <uv-icon size="60" name="/static/message/xtwd.png"></uv-icon>-->
          <!--            <uv-icon size="60" name="/static/message/yd.png"></uv-icon>-->
          <view class="title">{{ dataInfo.title }}</view>
          <view class="time">{{formatDate(dataInfo.create_time,'M-D h:m:s') }}</view>
        </view>
        <view class="content u-flex-grow">
          {{ dataInfo.content }}
        </view>
     </view>
    <uv-overlay :show="show" >
        <view class="but-box u-flex-column u-flex-items-center">
           <view class="top"></view>
           <view class="u-flex-xy-center" @click="delBut" >删除</view>
           <view class="u-flex-xy-center" @click="show = false">取消</view>
        </view>
    </uv-overlay>
  </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed} from "vue"
import { onLoad, onShow } from "@dcloudio/uni-app";
import { readMessage,delMessage } from "@/api/user";
import {pagesRoute} from "@/utils/index"
import { formatDate} from "@/utils/time"
const show=ref(false)
const readMessageBut=async (id:number)=>{
  const  res =await readMessage({id})
}
const dataInfo=ref({})
const delShowBut=() =>{
  show.value=true
}
const delBut= async ()=>{
  const  res =await delMessage({id:dataInfo.value.id})
  show.value=false
  uni.showToast({title: res.msg,})
  setTimeout(()=>{
    uni.navigateBack()
  },2000)

}
onLoad((it:object)=>{
  const res =JSON.parse(it.item)
  dataInfo.value=res
   readMessageBut(res.id)
})
</script>

<style lang="scss" scoped>
.container-box{
  background-color:$uni-default-back0Color;
  height: 100%;
  .but-box{
    width: 100%;
    position: fixed;
    bottom: 60rpx;
    >view{
      width:calc(100vw - 60rpx);
      height: 114rpx;
      border-radius: 25rpx;
      font-size: 36rpx;
      border: 2rpx solid $uni-text-color-disable;
      background: white;
      margin-bottom: 20rpx;
      color: $uni-color-cl;
    }
    .top{
      width: 150rpx;
      height: 20rpx;
    }
    view:last-child{
      color: #2559d8;
    }
  }
  .container {
    width: 100%;
    background-color:$uni-bg-color-grey;
    height: 100%;
    border-radius: 30rpx 30rpx 0 0;
    .title{
      width: 100%;
      font-size: 30rpx;
      padding: 20rpx 0;
      height: 30rpx;
      text-align: left;
      overflow: hidden;
    }
    .uv-nav-slot{
      color: #FFFFFF;
    }
    .content{
      padding:25rpx;
      font-size: 26rpx;
      margin-top:20rpx;
      background: $uni-bg-color;
    }
    .list-item{
      background: $uni-bg-color;
      color: $uni-default-back3Color;
      width: calc(100vw - 60rpx);
      padding: 30rpx;
      height: 56rpx;
      border-radius: 20rpx;
      margin-bottom: 20rpx;
      .title{
        margin-bottom: 10rpx;
        text-align: left;
        width: 450rpx;
        margin-left: 30rpx;
      }
      .time{
        width: 180rpx;
        font-size: 22rpx;
        color: $uni-default-backColor;
      }




    }
  }
}

</style>