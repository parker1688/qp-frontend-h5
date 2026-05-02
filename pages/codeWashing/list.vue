<template>
    <view class="container">
      <uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute"  leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="洗码记录">
        <template v-slot:left>
          <view class="uv-nav-slot">
            <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
          </view>
        </template>
        <template v-slot:right>
          <view class="h-top">
            <view class="menuBox  u-flex" @click="dayOpen">
              <text style="margin-right: 10rpx"> {{ timeName }}</text>
              <uv-icon size="10" v-if="dayPopupShow"  name="/static/down/xzz.png" color="#ffffff"></uv-icon>
              <uv-icon size="10" v-else  name="/static/down/xzq.png" color="#ffffff"></uv-icon>
            </view>
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
          <view v-for="(item ,index) in pager.lists" :key="index" class="list-box">
            <view class="list-item u-flex u-flex-between u-flex-wrap">
              <view class="w40 u-flex-column-start-between">
                <view>{{ item.create_time }}</view>
                <view class="u-flex xq-look" @click="cookBut(item,index)">
                  查看详情    <uv-icon name="/static/codeWashing/down.png" style="margin-left: 8rpx" size="9"></uv-icon>
                </view>
              </view>
              <view class="w30 u-flex-direction-column">
                <view class="moneyTiile">
                  返水金额
                </view>
                <view class="money">{{ item.bonus_amount.toFixed(2) }}<text>CNY</text></view>
              </view>
              <view class="w30 xq u-flex-center-end"  @click="billBut">
                查看注单 <uv-icon name="/static/codeWashing/look.png"  style="margin-left: 16rpx" size="15" ></uv-icon>
              </view>
            </view>
            <view class="xq-list" v-if="item.isShow">
              <view class="menu u-flex">
                <view class="u-flex-x-start">游戏类型</view>
                <view class="u-flex-x-center">有效投注额</view>
                <view class="u-flex-x-center">洗码比例</view>
                <view class="u-flex-x-end">返水金额</view>
              </view>
              <view class="xq-list-item u-flex" v-for="(it,index) in detailList" :key="index">
                <view class="u-flex-x-start">{{ getVenueName(it) }}</view>
                <view class="u-flex-x-center">{{ it.bet_amount.toFixed(2) }}</view>
                <view class="u-flex-x-center">{{ (it.bonus_rate * 100).toFixed(2) }}%</view>
                <view class="u-flex-x-end">
                   <view class="text">{{ it.bonus_amount.toFixed(2) }}</view>
                </view>
              </view>
            </view>

          </view>
          <view v-if="!pager.loading&&pager.lists.length" class="u-flex-x-center" style="padding: 25rpx;font-size: 22rpx;color: #a9a9a9;">没有更多数据啦~</view>
          <uvNoData v-if="!pager.loading&&!pager.lists.length"/>
        </scroll-view>
      </view>
      <dayPopup ref="dayPopupRef" :list="typeList"  @getData="getFundingType" notTetx="重置" title="时间"/>
    </view>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, shallowRef} from "vue";
import { onLoad, onShow, onReady } from "@dcloudio/uni-app";
import dayPopup from  '@/components/dayPopup/index'
import { getDayTime} from "@/utils/time"
import { userStore } from "@/stores/user"
import { startStore } from "@/stores/start"
import { usePaging } from "@/hooks/usePaging";
import {getRebateRecordList,getRebateDetailList} from "/api/user";
import { pagesRoute,toPtah } from "@/utils/index"
const typeList=computed(()=>startStore().dayTypeList)
const allVenueList=computed(()=>userStore().allVenueList)
const gameTypeList=computed(()=>startStore().gameTypeList)

const dayPopupRef = shallowRef()
const formData = reactive({
  time_type:-1,
  // startAt:'',
  // endAt:''
})
const detailList=ref([])
const timeName=ref('筛选日期')
const dayPopupShow=ref(false)
const timeType=ref(-1)
const  scrolltolower =(item:any)=>{
  resetPageNum()
}
const getVenueName=(item:any)=>{
  const res =allVenueList.value.find(it=>item.venue_code ==it.venue_code)
  const resText=gameTypeList.value.find(it=>item.game_type ==it.venue_type)
  if(res?.game_type_img&&res.game_type_img.length){
    const ress =res.game_type_img.find(it=>item.venue_code ==it.venue_code)
    return ress?.venue_name  +resText?.text
  }else {
    return ''
  }

}
const billBut=()=>{
  toPtah('/pages/tabBar/bill/index',0)
}

const cookBut=async(item:any,index:number)=>{
  const res= await  getRebateDetailList({date:item.create_time})
  detailList.value=res.data
  pager.lists.map((it,ind)=>{
      if(index == ind){
        it.isShow=!it.isShow
      }else {
        it.isShow=false
      }
  })
}

const { pager,resetPageNum, getLists ,resetPage} = usePaging({
  fetchFun: getRebateRecordList,
  params: formData,
});


const dayOpen=()=>{
  dayPopupShow.value=true
  dayPopupRef.value?.open( timeType.value)
}
const getFundingType =async(it:any)=> {
  if(it){
    timeName.value=it.name
    formData.time_type= timeType.value=it.type
    await resetPage()
  }else {
    timeType.value=-1
    timeName.value='筛选日期'
    formData.time_type=-1
    await resetPage()
  }
  dayPopupShow.value=false

}
const homeHeight = computed(() => {
  return uni.getSystemInfoSync().windowHeight
})
const topHeight = computed(() => {
  return uni.getSystemInfoSync().statusBarHeight
})
onLoad(()=>{
  getLists()
})
</script>

<style lang="scss" scoped>
/* 页面整体样式 */
.container {
  box-sizing: border-box;
  overflow: hidden;
  // #ifdef H5
  height: 100%;
  // #endif
  // #ifdef APP-PLUS || MP-WEIXIN
  height:100vh;
  // #endif

  background-color: $uni-default-back0Color;
  border-radius: 30rpx 30rpx 0 0;

  .h-top {
    color: white;
    .menuBox{
      font-size: 22rpx;
      font-family: $uni-family-Regular;
    }
    image{
      width: 50rpx;
      height: 55rpx;
      margin-right: 4rpx;
    }
  }
  .list-box{
    width: 100vw;
    background-color: $uni-bg-color;
    margin-bottom: 10rpx;
    border-radius: 30rpx;
    .list-item{
      height:58rpx;
      padding: 30rpx 30rpx 28rpx 30rpx;
      width: calc(100% - 60rpx);
      >view{
        width: 30%;
        color: $uni-default-back3Color;
        font-family: $uni-family-Medium;
        height:58rpx;
        font-size: 18rpx;
      }
      .time{
        color: #909090;
      }
      .moneyTiile{
        font-size: 18rpx;
        color: #1c1c1c;
      }
      .money{
        font-family: $uni-family-Heavy;
        font-size: 30rpx;
        color: #ec382b;
        text{
          font-family: $uni-family-Heavy;
          color: #1c1c1c;
          font-size: 16rpx;
          margin-left: 9rpx;
        }
      }
      .xq{
        font-family: $uni-family-Medium;
        font-size: 22rpx;
        color: #909090;
      }
      .xq-look{
        font-family: $uni-family-Bold;
        font-size: 24rpx;
        color: #2559d8;
      }
      .w40 {
        width: 40%;
      }
    }
    .xq-list{
      border-top: 2rpx solid #e5e5e5;
      padding:18rpx 33rpx 32rpx 33rpx;
      .menu{
        font-family:$uni-family-Heavy;
        font-size: 18rpx;
        color: #1c1c1c;
        >view{
          width: 23%;
        }
        >view:first-child{
          width: 31%;
        }
      }
      .xq-list-item{
        margin-top: 16rpx;
        font-family: $uni-family-Medium;
        font-size: 18rpx;
        color: #1c1c1c;
        >view{
          width: 23%;
         .text{
            min-width: 80rpx;
            text-align: center;
          }
        }
        >view:first-child{
          width: 31%;
        }

      }
    }

  }
  .scroll-box{
    background-color: $uni-bg-color-grey;
    border-radius: 30rpx 30rpx 0 0;
    overflow: hidden;
  }
  .list-boxs{
    height: 80rpx;
    background-color: $uni-bg-color-grey;
    border-radius: 30rpx 30rpx 0 0;
    overflow: hidden;
  }
}

</style>