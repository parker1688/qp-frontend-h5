<template>
  <view class="container-box">
    <uv-navbar placeholder bgColor="#1c1c1c"  @leftClick="pagesRoute"  leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="交易记录">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
      <template v-slot:right>
        <view class="h-top">
          <view class="menuBox u-flex" @click="dayOpen">
            {{ getTypeList(formData.funding_type) }}
            <uv-icon size="10" style="margin-left: 10rpx" name="/static/down/xzq.png" color="#ffffff"></uv-icon>
          </view>
        </view>
      </template>
    </uv-navbar>
    <view class="container">
      <view class="table-box u-flex">
        <view v-for="(it,index) in dayTypeList" :key="index" class="u-flex-xy-center" @click="tableBut(it,index)" :class="{'action':index ==tableNum }">
          <view class="u-flex-xy-center">{{it.name}}</view>
        </view>
      </view>
      <!--      #ifdef H5-->
        <scroll-view scroll-y="true" :style="`height:calc(${homeHeight -40}px - 122rpx)`" @scrolltolower="scrolltolower" :enable-flex="true">
      <!--        #endif    -->
      <!--      #ifdef APP-PLUS || MP-WEIXIN-->
      <scroll-view scroll-y="true" :style="`height:calc(100vh - ${topHeight + 40}px - 122rpx)`" @scrolltolower="scrolltolower" :enable-flex="true">
      <!--        #endif    -->
        <view v-for="(item ,index) in pager.lists" :key="index" class="list-box u-flex-column u-flex-between">
          <view class="u-flex u-flex-between">
            <view class="name">{{ getTypeListName(item) }}</view>
            <view>{{ item.create_time }}</view>
          </view>
          <view class="u-flex u-flex-between ">
            <view>
  <!--            <text>GoPay钱包（充值加赠3%）</text>-->
            </view>
            <view class="u-flex-xy-center"  :class="item.status==1?'money1':'money'">{{item.amount}}</view>
          </view>
          <view class="u-flex u-flex-between">
             <view class="u-flex-y-center">
               <text>币种:{{ item.currency }}</text>  单号：{{ item.id }}
               <image @click="copyTextBut(item.id)" src="/static/kf/fz.png" />
             </view>
  <!--          0 处理中 1 成功 2 失败-->
             <view class="u-flex-xy-center"  v-if="item.status==2" style="color: #c50404">失败</view>
             <view class="u-flex-xy-center"  v-else-if="item.status==1" style="color: #2559d8">成功</view>
             <view class="u-flex-xy-center"  v-else>处理中</view>
          </view>
        </view>
        <view v-if="!pager.loading&&pager.lists.length" class="u-flex-x-center" style="padding: 25rpx;font-size:20rpx;color:#999 ">已全部加载~</view>
        <uvNoData v-if="!pager.loading&&!pager.lists.length"/>
      </scroll-view>
    </view>
    <dayPopup ref="dayPopupRef" :list="typeLists"  @getData="getFundingType" notTetx="重置" title="交易类型"/>
  </view>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, shallowRef} from "vue";
import { copyText,pagesRoute} from "@/utils/index"
import dayPopup from  '@/components/dayPopup/index'
import { usePaging } from "@/hooks/usePaging";
import { onLoad, onShow, onReady } from "@dcloudio/uni-app";
import { getDayTime} from "@/utils/time"
import { walletTransaction } from "@/api/money";
import { userStore } from "@/stores/user"
import { startStore } from "@/stores/start"
const dayPopupRef = shallowRef()
const homeHeight = computed(() => {
  return uni.getSystemInfoSync().windowHeight
})
const topHeight = computed(() => {
  return uni.getSystemInfoSync().statusBarHeight
})
const dayTypeList = computed(() => startStore().dayTypeList)

const  scrolltolower =(item:any)=>{
  resetPageNum()
}
const formData = reactive({
  funding_type:0,
  time_type:1,
  // startAt:'',
  // endAt:''
})
const { pager,resetPageNum, getLists ,resetPage} = usePaging({
  fetchFun: walletTransaction,
  params: formData,
});

const typeList =ref([
 // {name:'全部类型',type:0},
  {name:'公司入款',type:1},
  {name:'在线存款',type:2},
  {name:'官方充值',type:3},
  {name:'提现',type:4},
  {name:'优惠',type:5},
  {name:'返水',type:6},
 // {name:'手续费',type:7},
  {name:'管理员添加',type:8},
  {name:'管理员扣除',type:9},
  {name:'额度转换',type:10},
  {name:'提现退回',type:11},

])
const typeLists =ref([
  // {name:'全部类型',type:0},
  {name:'公司入款',type:1},
  {name:'在线存款',type:2},
  {name:'官方充值',type:3},
  {name:'提款',type:4},
  {name:'优惠',type:5},
  {name:'返水',type:6},
  // {name:'手续费',type:7},
  {name:'管理员添加',type:8},
  {name:'管理员扣除',type:9},
  {name:'额度转换',type:10},
//  {name:'提款拒绝',type:11},

])
const addDelType =ref([
  {name:'官方赠送',type:30},
  {name:'官方补偿',type:31},
  {name:'一般扣除',type:40},
  {name:'福利扣除',type:41},
])



const strLenght=(str:any)=>{
  return str.length>10? str.slice(0,4)+ '***'+str.slice(-4):str
}

const getTypeList =(type:string)=>{
  const res=typeList.value.find(it=>it.type ==type )
  return res?res.name:'全部类型'
}
const getTypeListName =(item:object)=>{
  if(item.funding_type  == 10){
    return  item.opt_type == 1 ?  item.venue_code +'转入':item.venue_code +'转出'
  }else if(item.funding_type  == 8 || item.funding_type  == 9){
    const res=addDelType.value.find(it=>it.type ==item.trs_type )
    return res?.name || ''
  }else {
    const res=typeList.value.find(it=>it.type ==item.funding_type )
    return res?res.name:'全部类型'
  }


}
const getFundingType =(it:any)=>{
  if(it){
    formData.funding_type=it.type
  }else {
    formData.funding_type=0
  }
  resetPage()
}


const tableNum=ref(0)
const tableBut = (it,index:any) =>{
  tableNum.value = index
  getStartAtEndAt(it.type)
  resetPage()
}
const getStartAtEndAt=(type:number)=>{
  formData.time_type=type
  // const res= getDayTime(type)
  // formData.startAt=res.startAt
  // formData.endAt=res.endAt
}
const copyTextBut=(text:any)=>{
  copyText(text)
}


const dayOpen=()=>{
  dayPopupRef.value?.open(formData.funding_type)
}
const leftClick=()=>{
  uni.navigateBack()
}
onLoad(()=>{
  getStartAtEndAt(1)
  getLists()
})
onShow(()=>{


})

</script>

<style lang="scss" scoped>
@import '@/static/css/czj.scss'; /* 引入外部CSS文件 */
</style>