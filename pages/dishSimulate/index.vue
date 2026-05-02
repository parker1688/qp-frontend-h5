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
							{{it.title}}
						</view>

					</view>
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
					
					<pankou  v-if="menuNum==0" :data="data" :lists="data?.children"></pankou>
					<moni v-if="menuNum==1" :data="monitouzhu" ></moni>
				</scroll-view>

		</view>

	</view>
</template>

<script setup lang="ts">
	import { pagesRoute, formatFlexibleHierarchy } from "@/utils/index"
	// import { Announcement, bashatiyu } from './mock/index.js'
	import { formatDate } from '@/utils/time'
	import { getNavConfig } from "@/api/user";
	import { monitouzhu } from "./mock";
	import pankou from './pankou.vue'
	import moni from './moni.vue'
	
	import {
		userStore
	} from "@/stores/user"
	import { toPtah, copyText } from "@/utils/index"

	import {
		ref,
		computed,
		nextTick,
		shallowRef,
		onMounted
	} from "vue"
	const data = ref()
	const init = async () => {
		const res = await getNavConfig(0)
		const d : any = formatFlexibleHierarchy(res.data)
		data.value = d.filter((i : any) => i.key == "bet_guide")[menuNum.value]
	}
	const lists = computed(()=> menuNum.value==0?data.value?.children:monitouzhu)
	onMounted(() => {
		init()
	})
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

	const menuNum = ref(0)

	const menuList = ref([{ title: "盘口教程",key:"bet_guide" }
		, { title: "模拟投注",key:"guide" }
	])
	const getKFBut = () => {
		toPtah('/pages/kf/index')
	}
	const menuBut = (index : any) => {
		resetScrollPosition()
		menuNum.value = index
		
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
		background: $uni-bg-color-grey ;
		border-radius: 30rpx 30rpx 0 0;
		overflow: hidden;

	}

	.table-box {
		height: 58rpx;
		background: $uni-bg-color ;
		padding: 28rpx 0 28rpx 30rpx;

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