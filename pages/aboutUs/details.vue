<template>
	<view class="container-box">
		<uv-navbar placeholder bgColor="transparent"  @leftClick="pagesRoute"  leftIconColor="#fff" :titleStyle="{color:'#fff'}" :title="userDataStore.navDetail?.name">
		  <template v-slot:left>
		    <view class="uv-nav-slot">
		      <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
		    </view>
		  </template>
		</uv-navbar>
		<view class="activity-box u-flex-column" >
      <!--        #ifdef H5-->
			 <scroll-view v-if="userDataStore.navDetail.content" :scroll-top="scrollTop"  scroll-y="true" :style="`height:calc(${homeHeight - 44}px )`">
         <!--  #endif-->
         <!--        #ifdef APP-PLUS || MP-WEIXIN-->
         <scroll-view v-if="userDataStore.navDetail.content" :scroll-top="scrollTop"  scroll-y="true" :style="`height:calc(100vh - ${botHeight})`">
           <!--  #endif-->
           <uv-parse  :preview-img="false" style="margin-top: 32rpx;"  :content="userDataStore.navDetail.content"></uv-parse>
			</scroll-view>
			<view v-else-if="userDataStore.navDetail.children&&userDataStore.navDetail.children.length>0" style="margin-top: 10rpx;">
				<uv-tabs :current="current" :lineColor="`url(${lineBg}) 100% 100%`" :list="userDataStore.navDetail.children" lineHeight="10"
				:activeStyle="{
					fontFamily: '$uni-family-Bold',
					fontSize:'28rpx',
					color:'#1c1c1c',
					fontWeight:'bold'
				}"
				:inactiveStyle="{
					fontFamily: '$uni-family-Regular',
					fontSize:'24rpx',
					color:'#707070'
				}"
				  @click="getCurrent" ></uv-tabs>
        <!--        #ifdef H5 -->
				  <scroll-view :scroll-top="scrollTop"  scroll-y="true" :style="`height:calc(${homeHeight - 44}px - 90rpx)`" >
            <!--  #endif-->
            <!--        #ifdef APP-PLUS || MP-WEIXIN-->
            <scroll-view :scroll-top="scrollTop"  scroll-y="true" :style="`height:calc(100vh - ${botHeight} - 90rpx)`" >
              <!--  #endif-->
              <uv-parse  :preview-img="false" :content="userDataStore.navDetail.children[current].content"></uv-parse>
				  </scroll-view>
				 
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { pagesRoute} from "@/utils/index"
	import {
		userStore
	} from "@/stores/user"

	import {
		ref,
		computed,
		nextTick 
	} from "vue"
	const userDataStore = userStore();
	const current=ref(0)
	const scrollTop = ref(0) // 新增scrollTop控制变量
	const homeHeight = computed(() => {
		return uni.getSystemInfoSync().windowHeight
	})
  const botHeight = computed(() => {
    return (uni.getSystemInfoSync().statusBarHeight + 44)+'px'
  })
	const lineBg='/static/home/xz.png'
	const getCurrent = (item : any) => {
		current.value = item.index
		resetScrollPosition()
	}
	const resetScrollPosition = () => {
	  // 方法1：通过scrollTop重置
	  scrollTop.value = 0
	  nextTick(() => {
	    scrollTop.value = 0.01 // 小技巧：确保触发滚动
	  })
	  
	  // 方法2：通过ref直接操作（小程序可能需要此方法）
	  // nextTick(() => {
	  //   if (scrollViewRef.value) {
	  //     scrollViewRef.value.scrollTo({ top: 0, duration: 0 })
	  //   }
	  // })
	}
</script>

<style lang="scss" scoped>
	.activity-box{
		background: $uni-bg-color ;
		border-radius: 30rpx 30rpx 0 0;
		overflow: hidden;
		padding: 0rpx 30rpx;
	}
</style>
