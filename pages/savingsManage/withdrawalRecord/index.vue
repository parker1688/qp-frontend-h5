<template>
  <view class="container-box" :style="`height: ${homeHeight}px`">
    <uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute" leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="提款记录">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
      <template v-slot:right>
        <view class="h-top">
          <view class="menuBox u-flex" @click="dayOpen">
            {{ getTypeList(formData.status) }}
            <uv-icon size="10" name="/static/down/xzq.png" style="margin-left: 10rpx" color="#ffffff"></uv-icon>
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
            <view class="name">{{ getZfTypeList(item.order_type) }}</view>
            <view>{{item.create_time }}</view>
          </view>
          <view class="u-flex u-flex-between ">
            <view class="u-flex-xy-center">
  <!--            <text>GoPay钱包（充值加赠3%）</text>-->
            </view>
            <view class="u-flex-xy-center" :class="item.status==1?'money1':'money'">{{item.amount}}</view>
          </view>
          <view class="u-flex u-flex-between ">
             <view class="u-flex-y-center">
               <text>币种:{{ item.currency }}</text>  单号：{{ item.order_sn }}
               <image @click="copyTextBut(item.order_sn)" src="/static/kf/fz.png" />
             </view>
  <!--           0: 处理中 1:处理中 2:失败 3:成功-->
             <view class="u-flex-xy-center" v-if="item.status==2" style="color: #c50404">失败</view>
             <view class="u-flex-xy-center" v-else-if="item.status==3" style="color: #2559d8">成功</view>
             <view class="u-flex-xy-center" v-else>处理中</view>
          </view>
        </view>
        <view v-if="!pager.loading&&pager.lists.length" class="u-flex-x-center" style="padding: 25rpx;font-size:20rpx;color:#999 ">已全部加载~</view>
        <uvNoData v-if="!pager.loading&&!pager.lists.length"/>
      </scroll-view>
    </view>
    <dayPopup ref="dayPopupRef" :list="typeList"  @getData="getFundingType" notTetx="重置" title="提款类型"/>
  </view>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, shallowRef} from "vue";
import { copyText,pagesRoute} from "@/utils/index"
import dayPopup from  '@/components/dayPopup/index'
import { usePaging } from "@/hooks/usePaging";
import { onLoad, onShow, onReady } from "@dcloudio/uni-app";
import { getDayTime} from "@/utils/time"
import { walletWithdrawList } from "@/api/money";
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
  status:-1,
  time_type:1,
  // startAt:'',
  // endAt:''
})
const { pager,resetPageNum, getLists ,resetPage} = usePaging({
  fetchFun: walletWithdrawList,
  params: formData,
});
//状态 -1: 全部 1:处理中 2:失败 3:成功
const typeList =ref([
  {name:'全部',type:-1},
  {name:'处理中',type:1},
  {name:'失败',type:2},
  {name:'成功',type:3},
])

const zfTypeList =ref([
  {name:'银行卡',type:1},
  {name:'虚拟币',type:3},
  {name:'支付宝',type:4},
])

const strLenght=(str:any)=>{
  return str.length>10? str.slice(0,4)+ '***'+str.slice(-4):str
}
const getZfTypeList =(type)=>{
  const res=zfTypeList.value.find(it=>it.type ==type )
  return res.name || ''
}
const getTypeList =(type)=>{
  const res=typeList.value.find(it=>it.type ==type )
  return res?res.name:'全部类型'
}
const getFundingType =(it:any)=>{
  if(it){
    formData.status=it.type
  }else {
    formData.status=-1
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
  dayPopupRef.value?.open(formData.status)
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