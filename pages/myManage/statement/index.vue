<template>
  <view class="container-box"  :style="`height: ${homeHeight}px`">
    <uv-navbar placeholder bgColor="#1c1c1c"  @leftClick="pagesRoute" leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="个人报表">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
      <template v-slot:right>
        <view class="h-top">
          <view class="menuBox  u-flex" @click="dayOpen">
            {{ timeName }} <uv-icon style="margin-left: 10rpx" size="10" name="/static/down/xzq.png" color="#ffffff"></uv-icon>
          </view>
        </view>
      </template>
    </uv-navbar>
    <view class="top-box u-flex">
      <image :src="userData.avatar || '/static/my/user/mrtx.jpg'"></image>
      <view class="u-flex-column-start-between u-flex-grow">
        <view>{{ userData.nick_name||userData.user_name }}</view>
        <view class="vip u-flex-xy-center">VIP{{vipData.nowLevel }}</view>
      </view>
    </view>
    <view class="container">
      <view class="money-box">
        <view class="u-flex u-flex-between u-flex-wrap" >
          <view class="u-flex-direction-column item" v-for="(it,index) in list" :key="index" >
            <view class="momey">{{it.money}}<text>CNY</text></view>
            <view>{{it.name}}</view>
          </view>
        </view>
      </view>
      <view class="money-box">
        <view class="u-flex u-flex-between u-flex-wrap" >
          <view class="u-flex-direction-column item" v-for="(it,index) in list1" :key="index" >
            <view class="momey" :class="index==1?'momey1':index?'momey2':''"> {{it.money}}<text>CNY</text></view>
            <view>{{it.name}}</view>
          </view>
        </view>
      </view>
      <scroll-view scroll-y="true" :style="`height:calc(${homeHeight -44}px - 578rpx)`" @scrolltolower="scrolltolower" :enable-flex="true">
        <view class="list-box">
         <view class="u-flex u-flex-items-center u-flex-between" v-for="(item ,index) in 8">
          <view class="font30">哈希</view>
          <view class="u-flex-direction-column">
            <view class="font30">0<text>CNY</text></view>
            <view>局数</view>
          </view>
          <view class="u-flex-direction-column">
            <view class="font30">0<text>CNY</text></view>
            <view>有效投注</view>
          </view>
          <view class="u-flex-direction-column">
            <view class="font30 momey1">0<text>CNY</text></view>
            <view>盈利</view>
          </view>
        </view>
       </view>
      </scroll-view>

    </view>
    <dayPopup ref="dayPopupRef" :list="typeList"  @getData="getFundingType" notTetx="重置" title="时间"/>
  </view>
</template>

<script lang="ts" setup>
import {computed,reactive, ref, shallowRef} from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import dayPopup from  '@/components/dayPopup/index'
import { getDayTime} from "@/utils/time"
import { userStore } from "@/stores/user"
import { startStore } from "@/stores/start"
import {pagesRoute } from "@/utils/index"
const dayPopupRef = shallowRef()
const userDataStore = userStore();
const vipData=computed(()=> userDataStore.vipData)
const userData = computed(() => userDataStore.userInfo)
const typeList=computed(()=>startStore().dayTypeList)
const userlist=ref([])
import { userReport } from "@/api/user";

const homeHeight = computed(() => {
  return uni.getSystemInfoSync().windowHeight
})
const timeName=ref('筛选日期')
const timeType=ref(-1)
const formData=reactive({
  startAt:'',
  endAt:'',
})
const list=ref([
  {name:'账户金额',money:0},
  {name:'充值金额',money:0},
  {name:'取款金额',money:0},

])
const list1=ref([
  {name:'投注金额',money:0},
  {name:'会员盈利',money:0},
  {name:'获得彩金',money:0},
])

const dayOpen=()=>{
  dayPopupRef.value?.open( timeType.value)
}
const getFundingType =async(it:any)=> {
  if(it){
    timeName.value=it.name
    timeType.value=it.type
    const res= getDayTime(it.type)
    formData.startAt=res.startAt
    formData.endAt=res.endAt
  }else {
    timeType.value=-1
    timeName.value='筛选日期'
    formData.startAt=''
    formData.endAt=''
  }

}

const leftClick=()=>{
  uni.navigateBack()
}
const userReportBut= async ()=>{
 const res = await  userReport()

  list.value=[
    {name:'账户金额',money:res.data.amount},
    {name:'充值金额',money:res.data.recharge_amount},
    {name:'取款金额',money:res.data.withdrawal_amount}
  ]
  list1.value=[
    {name:'投注金额',money:res.data.valid_betamount},
    {name:'会员盈利',money:res.data.win_amount},
    {name:'获得彩金',money:res.data.promotion_amount}
  ]
  userlist.value=res.list

}

onLoad(async ()=>{
  userReportBut()
})
</script>

<style lang="scss" scoped>
.container-box{
  background-color: $uni-default-back0Color;
  .h-top {
    color: white;
    .menuBox {
      font-size: 22rpx;
    }
  }
  .top-box{
    padding: 50rpx 30rpx;
    color: #FFFFFF;
    font-size: 32rpx;
    image{
      width: 100rpx;
      height:100rpx;
      background: #ffffff;
      border-radius: 50%;
    }
    >view{
      margin-left: 20rpx;
      height:100rpx;
      .vip{
        background: url("/static/vip/vip-back-top.png");
        background-size:100% 100% ;
        color: $uni-default-back0Color;
        font-family: $uni-family-Heavy;
        font-size: 24rpx;
        padding-left: 20rpx;
        width: 115rpx;
        height: 44rpx;
      }
    }
  }
  /* 页面整体样式 */
  .container {
    box-sizing: border-box;
    overflow: hidden;
    background-color: $uni-bg-color-grey;
    border-radius: 30rpx 30rpx 0 0;
    .money-box{
      margin-bottom: 20rpx;
      border-radius: 30rpx;
      background: $uni-bg-color;
      .item{
        width: 200rpx;
        height: 169rpx;
        color: #1c1c1c;
        font-size: 22rpx;
        border-radius: 30rpx;
      }
      .momey{
        font-size: 30rpx;
        margin-bottom: 16rpx;
        text{
          font-size: 16rpx;
          color: #1c1c1c;
        }
      }
      .momey1{
        color: $uni-color-cl;
      }
      .momey2{
        color: $uni-default-color;
      }

    }
    .list-box{
      font-size: 22rpx;
      >view{
        width: 680rpx;
        height: 63rpx;
        background-color: #ffffff;
        border-radius: 20rpx;
        padding:30rpx 35rpx;
        margin-bottom: 4rpx;
        color: #1c1c1c;
        .font30{
          font-size: 30rpx;
          text{
            font-size: 16rpx;
          }
        }
        .momey1{
          color: $uni-color-cl;
        }
        .momey2{
          color: $uni-default-color;
        }

      }
    }
  }
}

</style>