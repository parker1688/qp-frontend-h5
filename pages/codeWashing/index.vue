<template>
  <view class="container">
    <uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute" leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="我的返水">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
      <template v-slot:right>
        <view class="uv-nav-slot u-flex-center-end" @click="getKFBut" style="color: #FFFFFF">
          <uv-icon name="/static/kf/kf.png" size="19"></uv-icon>
          <text class="kfClass">客服</text>
        </view>
      </template>
    </uv-navbar>
    <view class="scroll-box" :style="`height:calc(${homeHeight - 44}px)`">
      <!--      #ifdef H5-->
      <scroll-view scroll-y="true"  :style="`height:calc(${homeHeight - 44}px)`" @scrolltolower="scrolltolower" :enable-flex="true">
        <!--        #endif    -->
        <!--      #ifdef APP-PLUS || MP-WEIXIN-->
        <scroll-view scroll-y="true" :style="`height:calc(100vh - ${topHeight + 44}px)`" @scrolltolower="scrolltolower" :enable-flex="true">
          <!--        #endif    -->
       <view class="top u-flex-start-between">
         <view class="left u-flex-column-start-between">
           <view class="title u-flex" @click="explainShow">
             <uv-icon size="16" style="margin-right: 8rpx"  name="/static/codeWashing/wh.png" ></uv-icon>
             返水金额
           </view>
         </view>
         <view class="content u-flex-column-center-between">
           <image class="log" src="/static/codeWashing/xmlogo.png"></image>
           <view class="money u-flex u-flex-items-center">
             <uv-icon size="20" style="margin:10rpx 16rpx 0 0"  name="/static/codeWashing/mony.png" ></uv-icon>
             {{total_bonus_amount.toFixed(2) }}
           </view>
         </view>
         <view class="right u-flex" @click="dayOpen">
           <uv-icon size="16" style="margin-right: 8rpx"  name="/static/codeWashing/look.png" ></uv-icon>
           返水记录
         </view>
       </view>
       <view class="list-box">
         <view class="title">可洗码金额</view>
         <view class="monetBox">
           {{ total_bet_amount.toFixed(2) }}<text>CNY</text>
         </view>
         <view class="list-muen-item u-flex-center-between ">
           <view v-for="(it,index) in menuList" :key="index">{{it}}</view>
         </view>
         <scroll-view scroll-y="true" style="height: 370rpx">
           <view v-for="(it,index) in currList" :key="index" class="list-item u-flex-center-between" >
             <view class="u-flex-y-center">
               <image style="width: 30rpx;height: 30rpx;" :src="getVenueData(it).icon"></image>{{ getVenueData(it).text }}</view>
             <view>{{ it.bet_amount.toFixed(2) }}</view>
             <view class="Heavy">{{ (it.bonus_rate * 100).toFixed(2) }}%</view>
             <view class="u-flex-x-end">
               <view class="bonus_amount u-flex-x-center">{{ it.bonus_amount.toFixed(2) }}</view>
             </view>
           </view>
           <view v-if="currList.length" class="u-flex-x-center" style="padding: 25rpx;font-size: 22rpx;color: #a9a9a9;">没有更多数据啦~</view>
           <uvNoData width="100%" height="100%" padding="0" v-else/>
         </scroll-view>
       </view>
        <view class="ts u-flex-xy-center">由于注单延迟，下注后15分钟左右再领取</view>
        <view class="but u-flex-xy-center u-flex-shrink0" @click="rebateApplyBut">领取返水</view>
        <view class="ts2 u-flex-shrink0 u-flex-xy-center" @click="recommendShow"><image class="xmxq" src="/static/kf/xmxq.png"></image>洗码累计详情</view>
        </scroll-view>
    </view>
        <recommend  ref="recommendRef"/>
        <explain  ref="explainRef"/>
        <moneyless ref="moneylessRef"/>
        <successPopVue  ref="successRef"  :number="total_bonus_amount.toFixed(2)" title="领取返水"/>
  </view>
</template>

<script lang="ts" setup>
import {computed, ref, shallowRef} from "vue";
import { toPtah,pagesRoute } from "@/utils/index"
import { onLoad, onShow } from "@dcloudio/uni-app";
import {getRebate,rebateApply} from "@/api/user";
import { userStore } from "@/stores/user"
import { startStore } from "@/stores/start"
import { getUserinfoBut} from "@/hooks/publicRequest";
import recommend from "./components/recommend"
import explain from "./components/explain"
import moneyless from "./components/moneyless"
import successPopVue from '@/components/successPopup/index.vue'
const recommendRef=shallowRef()
const explainRef=shallowRef()
const moneylessRef= shallowRef()
const successRef = shallowRef()
const userDataStore = userStore();
const total_bet_amount=ref(0)
const total_bonus_amount=ref(0)
const min_bonus_amount=ref(0)
const currList=ref([])
const menuList=ref(['游戏类型','有效投注额','洗码比例','返水金额'])
const gameTypeList=computed(()=>startStore().gameTypeList)
const homeHeight = computed(() => {
  return uni.getSystemInfoSync().windowHeight
})
const topHeight = computed(() => {
  return uni.getSystemInfoSync().statusBarHeight
})
const getVenueData=(item:any)=>{
  const resText=gameTypeList.value.find(it=>item.game_type == it.venue_type)
  return resText
}
const recommendShow=()=>{
  recommendRef.value.open()
}
const explainShow=()=>{
  explainRef.value.open()
}
const moneylessShow=()=>{
  moneylessRef.value.open({money:min_bonus_amount.value})
}

const dayOpen=()=>{
  toPtah('/pages/codeWashing/list')
}
const getKFBut = () => {
  toPtah('/pages/kf/index')
}
const getRebatebut=async ()=>{
  const data={
    user_id:userDataStore.userInfo.user_id,
    user_name:userDataStore.userInfo.user_name
  }
  const res=await getRebate(data)
  total_bet_amount.value=res.data.total_bet_amount
  total_bonus_amount.value=res.data.total_bonus_amount
  min_bonus_amount.value= res.data.min_bonus_amount
  currList.value=res.data.curr_detail_list
}

const rebateApplyBut =async()=>{
  if(total_bet_amount.value < min_bonus_amount.value){
    moneylessShow()
    return
  }

  const data={
    user_id:userDataStore.userInfo.user_id,
    user_name:userDataStore.userInfo.user_name
  }
  if(userDataStore.userInfo.is_bonus == 2){
    uni.showToast({icon: 'none',title: '您被禁止领取福利，请联系客服',})
    return
  }

  const res=await rebateApply(data)
  successRef.value.open()
 // uni.showToast({icon: 'none', title:res.msg})
  setTimeout(()=>{
    getRebatebut()


  },1500)
}
onShow(()=>{
  getRebatebut()
  getUserinfoBut()
})
</script>


<style lang="scss" scoped>
/* 页面整体样式 */
.container {
  box-sizing: border-box;
  overflow: hidden;
  background-color:$uni-default-back0Color;
  border-radius: 30rpx 30rpx 0 0;
  // #ifdef H5
  height: 100%;
  // #endif
  // #ifdef APP-PLUS || MP-WEIXIN
  height:100vh;
  // #endif
  .h-top {
    color: white;
    .menuBox {
      font-size: 28rpx;
    }
  }
  .scroll-box{
    background-color: $uni-bg-color-grey;
    border-radius: 30rpx 30rpx 0 0;
    overflow: hidden;
    .top{
      font-family: $uni-family-Heavy;
      color: #080808;
      width: calc(100% - 56rpx);
      padding: 28rpx 32rpx 42rpx 28rpx;
      height: 196rpx;
      background-color:$uni-bg-color;
      border-radius: 30rpx;
      .left{
           height: 106rpx;
          .title{
            font-family: $uni-family-Medium;
            font-size: 24rpx;
            color: #1c1c1c;
          }
      }
      .content{
        font-family:$uni-family-Medium;
        font-size: 22rpx;
        color: #1c1c1c;
        min-width: 300rpx;
        .log{
          width: 118rpx;
          height: 118rpx;
          opacity: 0.5;
        }
        .money{
          height: 50rpx;
          margin-top: 28rpx;
          font-size: 60rpx;
          color: #080808;
          font-family:$uni-family-Heavy;
        }
      }
      .right{
        font-family: $uni-family-Medium;
        font-size: 24rpx;
        color: #1c1c1c;
        margin-top: 2rpx;
      }


    }
    .list-box{
      width: calc(100vw - 60rpx);
      padding:30rpx;
      height: 508rpx;
      background-color: #ffffff;
      border-radius: 30rpx;
      margin-top: 18rpx;
      .monetBox{
        font-family: $uni-family-Medium;
        font-size: 42rpx;
        color: #ae8d45;
        text-align: center;
        position: relative;
        margin-top: -28rpx;
        text{
          font-size: 18rpx;
          font-family:$uni-family-Medium;
          color: #000000;
          margin-left: 8rpx;
        }
      }
      .title{
        font-family:$uni-family-Medium;
        font-size: 24rpx;
        color: #1c1c1c;
        image{
          width: 30rpx;
          height: 30rpx;
        }
      }
      .list-muen-item{
        padding:40rpx 0 22rpx 0 ;
        border-bottom: 2rpx solid  #e5e5e5;
        margin-bottom: 6rpx;
        >view{
          width:calc(100% - 120rpx) /3;
          font-size: 22rpx;
          font-family: $uni-family-Bold;
          text-align: center;
        }
        >view:first-child{
          width: 120rpx;
          text-align: left;
        }
        >view:last-child{
          text-align: right;
        }
      }
      .list-item{
        padding:16rpx 0 ;
        >view{
          width: calc(100% - 120rpx) /3;
          height: 30rpx;
          text-align: center;
          font-size: 25rpx;
          font-family: $uni-family-Medium;
          color: #1c1c1c;
          image{
            margin-right: 16rpx;
          }
        }
        >view:first-child{
          width: 120rpx;
          text-align: left;
        }
        >view:last-child{
          text-align: right;
          .bonus_amount{
            min-width: 90rpx;
          }
        }
        .Heavy{
          font-family: $uni-family-Heavy;
          color: #a98e50;
        }
      }
    }

    .text{
      font-size: 28rpx;
      font-family:$uni-family-Medium;
    }
    .but{
      background: $uni-default-color;
      width: 566rpx;
      height: 98rpx;
      border-radius: 50rpx;
      margin: 0 auto;
      margin-top: 18rpx;
      font-size: 34rpx;
      letter-spacing: 4rpx;
      color: #ffffff;
      font-family:$uni-family-Bold;
    }
    .buts{
      color: $uni-default-color;
      background:$uni-default-xzColor;
      font-family: $uni-family-Medium;
    }
    .ts{
      font-family: $uni-family-Medium;
      margin-top: 52rpx;
      font-size: 22rpx;
      color: #707070;
    }
    .ts2{
      font-family: $uni-family-Medium;
      margin-top: 50rpx;
      padding-bottom: 40rpx;
      font-size: 22rpx;
      color: #707070;
      .xmxq{
        width: 30rpx;
        height: 30rpx;
        margin-right: 10rpx;
      }
    }
  }


}

</style>