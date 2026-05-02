<template>
	<view>
		<uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute" leftIconColor="#fff"
			:titleStyle="{color:'#fff'}" :title="userDataStore.navDetail.name+'教程'" />
		<view scroll-y="true" class="activity-box u-flex-column">
      <!--        #ifdef H5 -->
			<scroll-view scroll-y="true"  :style="`height:calc(${homeHeight - 44}px)`">
        <!--  #endif-->
        <!--        #ifdef APP-PLUS || MP-WEIXIN-->
        <scroll-view scroll-y="true"  :style="`height:calc( 100vh - ${botHeight})`">
          <!--  #endif-->
				<view style="height: 46rpx;"></view>
				<uv-parse  :preview-img="false"	 :content="userDataStore.navDetail.content"></uv-parse>
			</scroll-view>


		</view>
	</view>
</template>

<script setup>
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		getNavConfig
	} from "@/api/user";
	import {
		pagesRoute
	} from "@/utils/index"
	import {
		ref,
		computed
	} from "vue"
	import {
		userStore
	} from "@/stores/user"
	const userDataStore = userStore();
	const homeHeight = computed(() => {
		return uni.getSystemInfoSync().windowHeight
	})
  const botHeight = computed(() => {
    return (uni.getSystemInfoSync().statusBarHeight + 44)+'px'
  })
</script>

<style lang="scss" scoped>
	.activity-box {
		background: $uni-bg-color-grey ;
		border-radius: 30rpx 30rpx 0 0;
		overflow: hidden;
		padding: 0 30rpx;

	}
</style>