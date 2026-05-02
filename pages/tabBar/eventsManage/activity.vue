<template>
  <!--  #ifndef H5    -->
	<view class="activity-box u-flex-column" :style="`height:calc(100vh - ${topBotHeight}px)`">
  <!--    #endif    -->
  <!--  #ifdef H5    -->
    <view class="activity-box u-flex-column" :style="`height:calc(${homeHeight - topBotHeight}px)`">
  <!--    #endif    -->
		<view class="u-flex-shrink0 table-box">
			<uv-tabs :current="current" :list="menuList" lineWidth="0" :activeStyle="{
		     	border: 'none',
		     	color:'#ffffff',
		     	height:'58rpx',
          width: '180rpx',
          borderRadius:'30rpx',
          display:' flex',
          alignItems: 'center',
          justifyContent:' center',
          padding: '0 10rpx',
          background:'#ae8d45',
          fontFamily: '$uni-family-Medium',
          fontSize:'26rpx',
          boxSizing: 'border-box',
          }" :inactiveStyle="{
           color: '#303133',
           border: '2rpx solid #CCCCCC',
           fontFamily: '$uni-family-Regular',
           height:'58rpx',
           width: '180rpx',
           borderRadius:'30rpx',
           display:' flex',
           alignItems: 'center',
           justifyContent:' center',
           fontSize:'26rpx',
           padding: '0 10rpx',
           boxSizing: 'border-box',
		}" @click="getCurrent" itemStyle="padding-left:0; padding-right: 18rpx; height: 58rpx;"></uv-tabs>
		</view>
    <!--  #ifndef H5    -->
    <scroll-view scroll-y="true" :style="`height:calc(100vh - ${topBotHeight}px - 108rpx)`" @scrolltolower="scrolltolower" :enable-flex="true">
    <!--    #endif    -->
    <!--  #ifdef H5    -->
    <scroll-view scroll-y="true" :style="`height:calc(${homeHeight - topBotHeight}px - 108rpx)`" @scrolltolower="scrolltolower" :enable-flex="true">
    <!--    #endif    -->
        <view v-for="(item ,index) in pager.lists" :key="index" class="list-box u-flex u-flex-center u-flex-shrink0"  v-if="formData.promotion_type!==10" @click.stop="goDetails(item)">
          <view class="u-flex-column-start-between box-item u-flex-shrink0">
            <uv-image  :src="baseImgUrl+item.h5_img" width="690rpx" height="239rpx" :observeLazyLoad="true">
              <template v-slot:loading>
                <image src="/static/search/ljz.png" style="width:120rpx;height:120rpx"></image>
              </template>
              <template v-slot:error>
                <image :src="baseUrl+item.h5_img" style="width:690rpx;height:239rpx"></image>
              </template>
            </uv-image>
            <view class="title">{{ item.title }}</view>
            <view class="text">{{ item.content}}</view>
          </view>
        </view>
        <view v-for="(item ,indexs) in typeList" :key="indexs" class="list-box u-flex u-flex-center u-flex-shrink0"  v-else  @click.stop="goDetails(item)">
          <view class="u-flex-column-start-between box-item u-flex-shrink0">
            <image :src="item.h5_img" style="width:690rpx;height:239rpx"></image>
            <view class="title">{{ item.title }}</view>
            <view class="text">{{ item.content}}</view>
          </view>
        </view>
        <view v-if="!pager.loading&&pager.lists.length || formData.promotion_type===10" class="u-flex-x-center" style="padding: 25rpx;font-size:22rpx;color: #a9a9a9;">已全部加载~</view>
        <uvNoData v-if="!pager.loading&&!pager.lists.length"/>
      </scroll-view>

	</view>
</template>

<script lang="ts" setup>
import { computed, ref,reactive } from "vue";
import { toPtah } from "@/utils/index"
import { onLoad, onShow, onReady } from "@dcloudio/uni-app";
import { userStore } from "@/stores/user"
import environment from '@/utils/environments.ts'
const baseUrl = environment.envConfigs.url
const baseImgUrl = environment.envConfigs.imgUrl
import {activityList} from "/api/user";
import { usePaging } from "@/hooks/usePaging";
const current = ref(0)
const topBotHeight = computed(() => {
  return uni.getSystemInfoSync().statusBarHeight + 50 + 44 +  uni.getSystemInfoSync().safeAreaInsets.bottom
})
//所有活动 热门活动 新会员专属 电子活动 棋牌活动 捕鱼活动 安装引导
const  menuList=ref([
    {name:'所有活动',type:0},
    //{name:'限时活动',type:1},
   // {name:'存款活动',type:2},
   // {name:'日常活动',type:3},
    {name:'新会员专区',type:4},
    {name:'热门活动',type:5},
    {name:'电子优惠',type:6},
    {name:'棋牌优惠',type:7},
    {name:'捕鱼优惠',type:8},
   // {name:'视讯优惠',type:9},
     {name:'安装引导',type:10}

])
const typeList=ref([
    {title: '华为鸿蒙安装引导', content: '安装引导',h5_img: '/static/events/phone/banner/hwhm.gif',promotion_img:'/static/events/phone/details/hwhm.png' ,promotion_type:10},
    {title: '华为手机安装引导', content: '安装引导',h5_img: '/static/events/phone/banner/hw.gif',promotion_img:'/static/events/phone/details/hw.png',promotion_type:10 },
    {title: '三星手机安装引导', content: '安装引导',h5_img: '/static/events/phone/banner/sx.gif',promotion_img:'/static/events/phone/details/sx.png' ,promotion_type:10},
    {title: 'IQOO手机安装引导', content: '安装引导',h5_img: '/static/events/phone/banner/iqoo.gif',promotion_img:'/static/events/phone/details/iqoo.png' ,promotion_type:10},
    {title: 'realme安装引导', content: '安装引导',h5_img: '/static/events/phone/banner/realme.gif',promotion_img:'/static/events/phone/details/realme.png',promotion_type:10 },
    {title: '一加手机安装引导', content: '安装引导',h5_img: '/static/events/phone/banner/yj.gif',promotion_img:'/static/events/phone/details/yj.png' ,promotion_type:10},
    {title: '魅族手机安装引导', content: '安装引导',h5_img: '/static/events/phone/banner/mz.gif',promotion_img:'/static/events/phone/details/mz.png',promotion_type:10 },
    {title: 'VIVO手机安装引导', content: '安装引导',h5_img: '/static/events/phone/banner/vivo.gif',promotion_img:'/static/events/phone/details/vivo.png',promotion_type:10 },
    {title: 'OPPO手机安装引导', content: '安装引导',h5_img: '/static/events/phone/banner/oppo.gif',promotion_img:'/static/events/phone/details/oppo.png' ,promotion_type:10},
    {title: '小米手机安装引导', content: '安装引导',h5_img: '/static/events/phone/banner/xm.gif',promotion_img:'/static/events/phone/details/xm.png' ,promotion_type:10},
    {title: '其他手机安装引导', content: '安装引导',h5_img: '/static/events/phone/banner/qt.gif',promotion_img:'/static/events/phone/details/qt.png',promotion_type:10 },
    {title: 'USDT充值教程', content: '钱包充值教程',h5_img: '/static/events/money/banner/USDT.png',promotion_img:'/static/events/money/details/USDT.png',promotion_type:10 },
    {title: 'TOPAY充值教程', content: '钱包充值教程',h5_img: '/static/events/money/banner/TOPAY.png',promotion_img:'/static/events/money/details/TOPAY.png',promotion_type:10 },
    {title: 'OKPAY充值教程', content: '钱包充值教程',h5_img: '/static/events/money/banner/OKPAY.png',promotion_img:'/static/events/money/details/OKPAY.png' ,promotion_type:10},
    {title: 'GOPAY充值教程', content: '钱包充值教程',h5_img: '/static/events/money/banner/GOPAY.png',promotion_img:'/static/events/money/details/GOPAY.png',promotion_type:10 }
    ])

const formData=reactive({
  promotion_type:0
})
const goDetails=(it:object)=>{

  if(it.promotion_type === 10){
    toPtah(`/pages/eventsManage/details/index?promotionImg=${it.promotion_img}`)
  }else {
    toPtah(`/pages/eventsManage/details/index?promotionImg=${baseImgUrl + it.promotion_img}`)
  }

}
const { pager,resetPageNum, getLists ,resetPage} = usePaging({
  fetchFun: activityList,
  params: formData,
});
const  scrolltolower =(item:any)=>{
  resetPageNum()


}


const getCurrent = (item : any) => {
  formData.promotion_type= item.type
  if(item.type !== 10){
    current.value= item.index
    resetPage()
  }

}
const homeHeight = computed(() => {
		return uni.getSystemInfoSync().windowHeight
})

onShow(async ()=>{
  userStore().setCustomNum(1)
  resetPage()
})
onLoad(async ()=>{

})
</script>

<style lang="scss" scoped>
.activity-box{
  background:$uni-bg-color-grey ;
  border-radius: 30rpx 30rpx 0 0;
  overflow: hidden;
  .table-box{
    height: 58rpx;
    background:$uni-bg-color ;
    padding: 28rpx 0 28rpx 30rpx;

  }
  .list-box {
    margin:20rpx 30rpx 0 30rpx;
    width: calc(100% - 60rpx);
    background:$uni-bg-color ;
    min-height: 324rpx;
    border-radius: 8rpx;
    .box-item {
      .title {
        margin-top: 25rpx;
        margin-left: 25rpx;
        font-size: 28rpx;
        font-weight: 600;
        font-family: $uni-family-Bold;
      }

      .text {
        margin-left: 25rpx;
        margin-top: 20rpx;
        margin-bottom: 25rpx;
        color: $uni-default-back6Color;
        font-family: $uni-family-Regular;
        font-size: 24rpx;
      }
    }
  }
}

</style>