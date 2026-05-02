<template>
   <view>
     <uv-overlay :show="show" @click="close">
       <view class="overlay-box u-flex-column u-flex-between u-flex-items-center" @click.stop="">
         <view class="top"></view>
         <view class="dtls-box">
           <scroll-view ref="scrollRef"  :scroll-top="scrollTop"  @scroll="scroll" scroll-y="true"  style="height: 900rpx">
               <view class="dtl-box">
                 <view class="title-box u-flex-column u-flex-items-center">
                   <view class="title">会员特权</view>
                   <view class="text">会员每升级一级 都能获得相应的奖励</view>
                 </view>
                 <view class="list-title  u-flex">
                   <view>等级</view>
                   <view>打码要求</view>
                   <view>晋级礼金</view>
                   <view>周礼金</view>
                   <view>月礼金</view>
                   <view>年收益</view>
                 </view>
                 <view class="list-box  u-flex" v-for="(item,index) in list" :key="index">
                   <view class="u-flex-xy-center">
                     <view class="vip u-flex-xy-center"><uv-icon name="/static/vip/V-1.png" size="12"></uv-icon>{{ item.level }}</view>
                   </view>
                   <view>{{ item.min_bet_amount }}</view>
                   <view>{{ item.upgrade_gift }}</view>
                   <view>{{ item.weekly_gift }}</view>
                   <view>{{ item.monthly_gift }}</view>
                   <view>{{ item.upgrade_gift }}</view>
                 </view>
                 <view class="but" @click="getListbut">{{isShow?'加载更多':'收起'}}</view>
               </view>
               <view class="dtl-vip-box">
                 <view class="title-box u-flex-x-center u-flex-items-center">
                   <view class="title u-flex-xy-center">会员晋升说明</view>
                 </view>
                 <view v-for="(it,index) in DList" :key="index" class="item-list">
                    <view class="title">{{ it.title }}</view>
                    <view class="text">{{ it.text }}</view>
                 </view>
               </view>
               <view class="but-top u-flex-xy-center" @click="goTopBut">回到顶部</view>
               <view style="height: 40rpx" ></view>
           </scroll-view>
         </view>
       </view>
     </uv-overlay>
   </view>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, shallowRef, watch } from "vue";
const  scrollRef =shallowRef()
const scrollTop=ref(0)
const show=ref(false)
const isShow=ref(true)
const list=ref([])
const AllList=ref([])
const goTopBut=()=>{
  scrollTop.value = 0
}
const close=()=>{
  show.value=false
}

const open=(it:any)=>{
  list.value=[]
  AllList.value=it

  AllList.value.forEach((its,index)=>{
      if(index<8){
        list.value.push(its)
      }
  })
  show.value=true
}
const scroll=(e:any)=>{
  scrollTop.value = e.detail.scrollTop
}
const DList=ref([
  {title:'晋级标准',text:'会员的累计有效投注额达到对应级别的要求，即可自动晋升到相应的VIP等级'},
  {title:'晋级礼金',text:'会员每晋升一个等级均可获得对应的晋级礼金，每个级别的晋级礼金每个账号只能领取一次'},
  {title:'周礼金',text:'会员晋升到一定等级后，每周（周一开始领取）即可领取礼金，每个账号每周领取一次'},
  {title:'月礼金',text:'会员晋升到一定等级后，每月（每月1日开始领取）即可领取礼金，每个账号每月领取一次'},
  {title:'我司保留对活动的修改，停止及最终解释权',text:'我司保留对活动的修改，停止及最终解释权'},
])


const getListbut=()=>{
  isShow.value=!isShow.value
  if(!isShow.value){
    list.value=AllList.value
  }else {
    list.value=[]
    AllList.value.forEach((its,index)=>{
      if(index<8){
        list.value.push(its)
      }
    })
  }
}

defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.overlay-box{
  width: 100%;
  position: fixed;
  height: 1000rpx;
  bottom:0;
  .top{
    width: 150rpx;
    height: 20rpx;
    background: #FFFFFF;
    border-radius:10rpx;
  }
  .dtls-box{
    width: 100%;
    border-radius:40rpx 40rpx 0 0;
    background: $uni-bg-color-hover;
    height: 900rpx;
    overflow: hidden;
  }
  .dtl-box{
    background: #FFFFFF;
    width: 100%;
    border-radius:40rpx;
    .title-box{
      height: 140rpx;
      margin-bottom: 28rpx;
      .title{
        font-weight: bold;
        font-size: 36rpx;
        margin-top: 30rpx;
        margin-bottom: 20rpx;
      }
      .text{
        font-size: 24rpx;

      }
    }
    .list-title{
      background: $uni-default-back-color;
      height: 80rpx;
      >view{
        color: $uni-default-color;
        flex-grow: 1;
        flex-shrink: 0; /* 防止收缩 */
        text-align: center;
        line-height: 80rpx;
        font-size: 20rpx;
      }
    }
    .list-box{
      height: 80rpx;
      background:$uni-bg-color;
      >view{
        color: $uni-default-back3Color;
        width: 16.66%;
        flex-shrink: 0; /* 防止收缩 */
        font-size: 20rpx;
        text-align: center;
        line-height: 80rpx;
        .vip{
          width: 80rpx;
          height: 50rpx;
          line-height: 50rpx;
          border-radius: 20rpx;
          font-size: 24rpx;
          font-weight: 600;
          color: #ffca91;
          background:$uni-default-back3Color;
        }
      }

    }
    .list-box:nth-child(2n){
      background: $uni-bg-color-hover;
    }
    .but{
      height: 80rpx;
      text-align: center;
      line-height: 80rpx;
      font-size: 24rpx;
    }
  }
  .dtl-vip-box{
     margin-top: 40rpx;
     border-radius:40rpx;
     background: #FFFFFF;
     padding-bottom: 25rpx;
    .title-box{
      font-weight: 600;
      font-size: 34rpx;
      height: 100rpx;

    }
    .item-list{
      padding: 0 25rpx;
      color: $uni-default-back0Color;
      .title{
        font-size: 34rpx;
        margin-bottom: 20rpx;
      }
      .text{
        font-size: 24rpx;
        margin-bottom: 40rpx;
      }
    }
  }
  .but-top{
    color: $uni-default-color;
    background: $uni-default-back-color;
    font-size: 24rpx;
    width: 180rpx;
    height: 80rpx;
    border-radius: 40rpx;
    margin:40rpx auto;
  }
}
</style>