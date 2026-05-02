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
        <view class="list-box list-boxs u-flex u-flex-between u-flex-wrap">
          <view class="w30">类型/时间</view>
          <view class="w30">有效投注</view>
          <view>返水比例</view>
          <view>返水金额</view>
        </view>
        <!--      #ifdef H5-->
        <scroll-view scroll-y="true"  :style="`height:calc(${homeHeight - 44}px - 100rpx)`" @scrolltolower="scrolltolower" :enable-flex="true">
          <!--        #endif    -->
          <!--      #ifdef APP-PLUS || MP-WEIXIN-->
        <scroll-view scroll-y="true" :style="`height:calc(100vh - ${topHeight + 44}px - 100rpx)`" @scrolltolower="scrolltolower" :enable-flex="true">
          <!--        #endif    -->
          <view v-for="(item ,index) in pager.lists" :key="index" class="list-box u-flex u-flex-between u-flex-wrap">
            <view class="w40 u-flex-direction-column">
              <view>
                {{getVenueName(item)}}
              </view>
              <view class="time">{{ item.create_time }}</view>
            </view>
            <view class="w30">{{item.bet_amount}}</view>
            <view>{{ item.bonus_rate }}</view>
            <view class="ym">{{ item.bonus_amount }}</view>
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
import {getRebateRecordList} from "/api/user";
import { pagesRoute } from "@/utils/index"
const allVenueList=computed(()=>userStore().allVenueList)
const typeList=computed(()=>startStore().dayTypeList)
const gameTypeList=computed(()=>startStore().gameTypeList)

const dayPopupRef = shallowRef()
const formData = reactive({
  time_type:-1,
  // startAt:'',
  // endAt:''
})
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

    // const res= getDayTime(it.type)
    // formData.startAt=res.startAt
    // formData.endAt=res.endAt
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

.cocontainer-box{

}
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
    font-size: 22rpx;
    height: 128rpx;
    background-color: $uni-bg-color-grey;
    margin-bottom: 20rpx;
    >view{
      width: 20%;
      background: $uni-text-color-inverse;
      color: $uni-default-back3Color;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .w30{
      width: 30%;
    }
    .w40 {
      width: 30%;
      font-size: 20rpx;
    }
    .ym{
      color: $uni-color-cl;
    }
    .money{
      color:#3DE51B;
    }
    .time{
      font-size: 18rpx;
      color: #a9a9a9;
      margin-top: 10rpx;
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