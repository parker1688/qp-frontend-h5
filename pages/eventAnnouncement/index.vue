<template>
	<view class="container-box">
		<uv-navbar placeholder bgColor="transparent" @leftClick="pagesRoute" leftIconColor="#fff"
			:titleStyle="{color:'#fff'}" :title="userDataStore.navDetail?.name">
			<template v-slot:left>
				<view class="uv-nav-slot">
					<uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
				</view>
			</template>
			<template v-slot:center>
				<view class="h-top">
					<view class="menuBox  u-flex">
						<view style="position: relative;" v-for="(it,index) in menuList" :key="index"
							@click="menuBut(index)" :class="{action:index==menuNum}">
							<!-- <myBadge style="right: -10rpx;top:6rpx" v-if="it.ifBadge"></myBadge> -->
							<!-- <uv-badge v-if="it.ifBadge" style="position: absolute;right: -10rpx;" type="error" max="99" :value="0" isDot></uv-badge> -->
							{{it.title}}
						</view>

					</view>
				</view>
			</template>
			<template v-slot:right>
				<view class="uv-nav-slot u-flex-center-end" @click="getKFBut" style="color: #FFFFFF">
					<uv-icon name="/static/kf/kf.png" size="19"></uv-icon>
					<text class="kfClass">客服</text>
				</view>
			</template>
		</uv-navbar>
		<view class="activity-box u-flex-column">
			<!--        #ifdef H5-->
			<scroll-view :scroll-top="scrollTop" scroll-y="true" :style="`height:calc(${homeHeight - 44}px )`">
			<!--  #endif-->
				<!--        #ifdef APP-PLUS || MP-WEIXIN-->
				<scroll-view :scroll-top="scrollTop" scroll-y="true" :style="`height:calc(100vh - ${botHeight})`">
				<!--  #endif-->
					<view v-if="menuNum==0" class="card-item" v-for="it,index in Announcement" :key="index">
						<view class="time">{{formatDate(it.ExpiryDate)}}</view>
						<view>
							{{it.AnnouncementDetail[0].Content}}

						</view>
					</view>
					<view v-if="menuNum==1" class="card-item" v-for="it,index in bashatiyu" :key="index">
						<view class="time">{{formatDate(it.postTime)}}</view>
						<view>
							{{it.message}}

						</view>
					</view>
				</scroll-view>

		</view>
		<loginPopup ref="loginPopupRef" />

	</view>
</template>

<script setup lang="ts">
	import { pagesRoute } from "@/utils/index"
	import { Announcement, bashatiyu } from './mock/index.js'
	import { formatDate } from '@/utils/time'
	import {
		userStore
	} from "@/stores/user"
	import { toPtah, copyText } from "@/utils/index"

	import {
		ref,
		computed,
		nextTick,
		shallowRef
	} from "vue"
	const loginPopupRef = shallowRef()

	const userDataStore = userStore();
	const isToken = computed(() => userDataStore.token ? true : false)

	const current = ref(0)
	const scrollTop = ref(0) // 新增scrollTop控制变量
	const homeHeight = computed(() => {
		return uni.getSystemInfoSync().windowHeight
	})
	const botHeight = computed(() => {
		return (uni.getSystemInfoSync().statusBarHeight + 44) + 'px'
	})
	const lineBg = '/static/home/xz.png'
	const getCurrent = (item : any) => {
		current.value = item.index
		resetScrollPosition()
	}
	const menuNum = ref(0)

	const menuList = ref([{ title: "IM体育" }
		, { title: "巴沙体育" }
	])
	const getKFBut = () => {
		toPtah('/pages/kf/index')
	}
	const menuBut = (index : any) => {

		if (index == 1 && !isToken.value) {
			loginPopupRef.value.open()
		} else {
			resetScrollPosition()
			menuNum.value = index
			
		}


	}
	const resetScrollPosition = () => {
		// 方法1：通过scrollTop重置
		scrollTop.value = 0
		nextTick(() => {
			scrollTop.value = 0.01 // 小技巧：确保触发滚动
		})

		
	}
</script>

<style lang="scss" scoped>
	.activity-box {
		background: $uni-bg-color ;
		border-radius: 30rpx 30rpx 0 0;
		overflow: hidden;

	}

	.h-top {
		color: white;

		.menuBox {
			font-size: 32rpx;

			>view {
				color: $uni-default-backColor;
			}

			>view:first-child {
				margin-right: 40rpx;
			}

			.action {
				color: white;
			}
		}

		image {
			width: 50rpx;
			height: 55rpx;
			margin-right: 4rpx;
		}
	}

	.card-item {
		padding: 36rpx 32rpx;

		color: rgb(91, 91, 91);
		border-bottom: 1px solid #f0f0f2;
		font-size: 26rpx;

		.time {
			text-align: right;
			font-size: 24rpx;
			color: rgb(121, 121, 121);
			margin-bottom: 20rpx;
		}
	}
</style>