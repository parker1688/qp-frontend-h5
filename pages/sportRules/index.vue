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
					<view class="u-flex-shrink0 table-box" style="padding: 22rpx;">
						<view>
							<uv-input fontSize="32rpx" style="font-weight: 600;" v-model="typeValue" disabled
								disabledColor="#ffffff" placeholder="请选择类型" border="none" @click="showTypeSelect">
								<template v-slot:suffix>
									<uv-icon style="margin-right: 20rpx;" name="arrow-right" size="mini"></uv-icon>
								</template>
							</uv-input>
						</view>
					</view>
					<view class="u-flex table-box sub1" v-if="rules[paths[0]]?.children[0]?.children.length>0">
						<view class="sub2">
							<view class="btn" :class="{
								 selected:j==paths[1]
							 }" v-for="i,j in rules[paths[0]]?.children" @click="handleClick(j)">
								{{i.name}}
							</view>
						</view>
					</view>
					<view style="padding-bottom: 100rpx;" v-if="Object.keys(currentObj)?.length>0">
						<uv-collapse v-for="i,j in currentObj?.children" :border="false" :accordion="true"
							style="background-color: white;border-radius: 10rpx;padding: 10rpx 0;margin: 20rpx;">
							<uv-collapse-item :title="i.name" name="">
								<template #title>
									<view style="color: red;">{{i.name}}</view>
								</template>
								<view class="uv-collapse-content">
									<uv-parse :content="i.content"></uv-parse>
								</view>
							</uv-collapse-item>

						</uv-collapse>
					</view>

				</scroll-view>
				<uv-picker keyName="name" ref="typeSelectref" :columns="[rules]" @confirm="typeSelect"></uv-picker>
		</view>

	</view>
</template>

<script setup lang="ts">
	import { pagesRoute, formatFlexibleHierarchy } from "@/utils/index"
	// import { rules } from './mock.js'
	import { formatDate } from '@/utils/time'
	import { getNavConfig } from "@/api/user";

	import {
		userStore
	} from "@/stores/user"
	import { toPtah, copyText } from "@/utils/index"

	import {
		ref,
		computed,
		nextTick,
		shallowRef,
		onMounted,
		reactive
	} from "vue"
	const finalObj = ref()
	const rules = reactive([])
	const paths = ref([0, 0, 0])

	const data = ref()
	const init = async () => {
		const res = await getNavConfig(0)
		const d : any = formatFlexibleHierarchy(res.data)
		data.value = d.find((i : any) => i.key == "bet_introduce")
		Object.assign(rules, [...data.value.children]);

	}
	const currentObj = computed(() => {
		let res
		if (rules[paths.value[0]]?.children[0].children.length>0) {

			res = rules[paths.value[0]].children[paths.value[1]]
		} else {
			res = rules[paths.value[0]]
		}
		return res||{}

	})
	const handleClick = (j) => {
		paths.value[1] = j
		
	}
	
	onMounted(() => {
		init()
	})
	const typeSelectref = ref()
	const typeValue = computed(()=>rules[paths.value[0]]?.name)
	const typeSelect = (e) => {
		const { indexs, value, values } = e
		paths.value[0] = indexs[0]
		paths.value[1] = 0
	}
	const showTypeSelect = () => {
		typeSelectref.value.open()
	}
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

	const menuList = ref([{ title: "投注规则", key: "bet_guide" }

	])
	const getKFBut = () => {
		toPtah('/pages/kf/index')
	}
	const menuBut = (index : any) => {
		menuNum.value = index
		init()
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
	.selected {
		background-color: #ae8d45 !important;
		color: white;
	}

	.activity-box {
		background: $uni-bg-color-grey ;
		border-radius: 30rpx 30rpx 0 0;
		overflow: hidden;

	}

	.btn {
		background: #f7f7f7;
		border-radius: 10rpx;
		;
		padding: 10rpx 0;
		flex: 0 0 calc(33.33% - (28rpx * 2 / 3) - (10rpx * 2 / 3));
		text-align: center;
	}

	.sub1 {
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0;
	}

	.sub2 {
		display: flex;
		gap: 20rpx;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 30rpx;
		width: 100%;
	}

	.table-box {
		margin: 40rpx 20rpx 10rpx 20rpx;
		border-radius: 30rpx;
		background: $uni-bg-color ;
		// padding: 28rpx 0 28rpx 30rpx;

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

	.fixed {
		top: 0;
		position: fixed;
		padding: 20rpx;
		width: 100%;
		background-color: #f0f0f2;
	}

	.item {
		&:first-child {
			margin-top: 80rpx;
		}
	}
</style>