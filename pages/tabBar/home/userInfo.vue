<template>
	<uv-popup ref="userInfoRef" mode="left" bgColor="#ffffff">
		<view style="width: 550rpx;">
			<view :style="`margin-top: ${topHeight}px` "></view>
			<scroll-view scroll-y="auto" :style="`height:calc(${homeHeight - topHeight }px)`">
			<view class="user-box u-flex u-flex-between">
				<view class="u-flex padding10">
					<image class="tx" :src="userData.avatar || '/static/my/user/mrtx.jpg'"></image>
					<view class="id-info u-flex-column-start-between">
						<view class="id" @click="copyText(userData.user_id)"> ID:{{ userData.user_id }}</view>
						<view class="vip u-flex-xy-center">
							<!--              <view class="v-box u-flex-xy-center">-->
							<!--                <image style="" src="/static/vip/V-1.png"></image>-->
							<!--                {{vipData.nowLevel}}-->
							<!--              </view>-->
							<image class="vip-item" src="/static/vip/vip.png" />{{vipData.nowLevel<2?1:vipData.nowLevel}}
						</view>
					</view>
				</view>
				<view class="padding10">
					<uv-icon name="close" @click="close" color="#ccc" bold size="20"></uv-icon>
				</view>
			</view>
			
				<view style="margin: 60rpx 0 0 25rpx;font-weight: 600">
					快速入口
				</view>
				<view class="list-box u-flex-column">
					<view class="u-flex u-flex-center-between">
						<view class="u-flex  u-flex-middle">
							<image style="width: 30rpx;height: 30rpx;margin-right:20rpx" src="/static/home/left/qb.png">
							</image>
							<view>我的钱包</view>
						</view>
						<view class="u-flex  u-flex-middle">
							<image style="width: 30rpx;height:30rpx;margin-right: 10rpx;"
								src="/static/home/left/rmb.png">
							</image>
							<view class="money">
							<text v-if="!isRotating">
								{{userMoney.ava_amount?.toFixed(2) || 0 }}
							</text>
							<text v-else>
								<Loading style="margin-right: 20rpx;"/>
							</text>
							</view>
							<view style="position: relative;">
								<uv-icon  class="rotate-box" :class="{ 'rotate-ccw': isRotating }" name="/static/home/sx2.png" color="#ccc" size="16"
									style="margin-right: 10rpx"></uv-icon>
									<view style="position: absolute;width: 50rpx;height: 50rpx; top:-12rpx;left: 0;" @click="getBalanceBut(false)" ></view>
							</view>
							
						</view>
					</view>
				</view>
				<view class="list-box u-flex-column">
					<view class="u-flex u-flex-center-between" v-for="it in list" :key="it.index" @click="goto(it)">
						<view class="u-flex  u-flex-middle">
							<image style="width: 30rpx;height: 30rpx;margin-right:20rpx" :src="it.icon"></image>
							<view>{{it.name}}</view>
						</view>
						<uv-icon name="arrow-right" color="#ccc" size="16"></uv-icon>
					</view>
				</view>
				<view class="list-box2 u-flex-column">
					<view class="block" v-for="it in radioList">
						<view class="main">{{it.title}}</view>
						<view class="u-flex radio-group"> <uv-radio-group v-model="radioValue[it.id]">
								<uv-radio class="radio-item" v-for="opt in it.options" :name="opt.value"
									active-color="#998046" inactiveColor="#dfe0e1">
									<template #icon="{ checked }">
										<!-- 自定义选中和未选中状态的图标 -->
										<view class="radio_icon"></view>
									</template>
									<view style="margin-left: 10rpx;" :style="{
										fontWeight:radioValue[it.id] === opt.value ? 'bold' : '',
								        color: radioValue[it.id] === opt.value ? '#1c1c1c' : '#707070'
								      }">
										{{ opt.label }}
									</view>
								</uv-radio>
							</uv-radio-group></view>
					</view>
				</view>
			</scroll-view>
		</view>
	</uv-popup>
</template>

<script lang="ts" setup>
	import { getBalance, getVipProgressBut } from "@/hooks/publicRequest";
	import { computed, reactive, shallowRef,ref } from "vue";
	import Loading from '@/components/Loading/index.vue'
	
	import { toPtah, copyText } from "@/utils/index"
	const userInfoRef = shallowRef()
	import { userStore } from "@/stores/user"
	const userDataStore = userStore()
	const userMoney = computed(() => userDataStore.userMoney)
	const userData = computed(() => userDataStore.userInfo)
	const vipData = computed(() => userDataStore.vipData)
	const topHeight = computed(() => {
		return uni.getSystemInfoSync().statusBarHeight
	})
	const isToken = computed(() => userDataStore.token ? true : false)
	
	const homeHeight = computed(() => {
			return uni.getSystemInfoSync().windowHeight
	})
	const isRotating=ref(false)
	
	const list = reactive([
		{ icon: '/static/home/left/kf.png', name: '在线客服', path: '/pages/kf/index', type: 1 },
    //#ifdef H5
		{ icon: '/static/home/left/app.png', name: 'APP下载', path: '/pages/download/index', type: 1 },
    //#endif
		{ icon: '/static/home/left/vip.png', name: 'vip中心', path: '/pages/vipManage/vip/index', type: 1 },
		{ icon: '/static/home/left/xm.png', name: '我的洗码', path: '/pages/codeWashing/index', type: 1 },
		{ icon: '/static/home/left/ct.png', name: '充提', path: '/pages/tabBar/savingsAccount/index', type: 0 },
		{ icon: '/static/home/left/xx.png', name: '我的消息', path: '/pages/myManage/message/index', type: 1 }
	])
	const radioValue = reactive({
		group1: "0",
		group2: "1",
		group3: "0",
	})
	const radioList = reactive([
		{ id: "group1", title: "盘口设置", options: [{ label: "欧洲盘", value: "0" }, { label: "香港盘", value: "1" }] },
		{ id: "group2", title: "投注设置", options: [{ label: "不接受任何赔率变动", value: "0" }, { label: "只接受更好赔率", value: "1" }, { label: "自动接受任何赔率", value: "2" }] },
		{ id: "group3", title: "语言模式", options: [{ label: "中文简体", value: "0" }] }
	])
	const goto = (it : any) => {
		toPtah(it.path, it.type)
		close()
	}
	const getBalanceBut = async () => {
		// userMoney?.ava_amount
		if (!isToken.value) {
			toPtah('/pages/login/index')
			return
		}
		isRotating.value=true
		
		setTimeout(async()=>{
			await getBalance(false)
			isRotating.value=false
		},1000)
	
	}
	const open = () => {
		userInfoRef.value.open()
		getVipProgressBut()
	}
	const close = () => {
		userInfoRef.value.close()
	}
	defineExpose({
		open,
		close
	})
</script>

<style lang="scss" scoped>
	.padding10 {
		padding: 10rpx;
	}

	.user-box {
		width: 100%;
		height: 100rpx;
		margin: 18rpx 0;

		image.tx {
			border-radius: 50%;
			width: 80rpx;
			height: 80rpx;
			background: $uni-default-xzColor;
			margin-right: 20rpx
		}

		.v-box {
			width: 68rpx;
			height: 42rpx;
			background-color: $uni-default-back0Color;
			border-radius: 16rpx;
			font-size: 24rpx;
			color: #ffca91;

			image {
				width: 20rpx;
				height: 19rpx;
			}
		}

		.vip-item {
			width: 64rpx;
			height: 31rpx;
			margin-right: 4rpx;
		}

		.id-info {
			font-size: 30rpx;

			.vip {
				font-size: 32rpx;
				font-weight: bold;
				color: $uni-default-color;
				text-align: left;

			}
		}
	}

	.list-box {
		width: 100%;
		font-size: 30rpx;
		font-weight: 600;

		.money {
			color: $uni-default-color;
			margin-right: 10rpx;
			font-size: 30rpx;
		}

		>view {
			height: 90rpx;
			width: calc(100% - 50rpx);
			padding: 0 25rpx;
			background: white;
			border-bottom: 2rpx solid $uni-bg-color-hover;

			.az {
				font-size: 28rpx;
				background: #f9ae3d;
				padding: 6rpx 16rpx;
				border-radius: 8rpx;
				margin-left: 20rpx;
			}
		}
	}

	.list-box2 {
		width: 100%;
		font-size: 30rpx;


		.block {
			padding: 0 25rpx;
			border-bottom: 2rpx solid $uni-bg-color-hover;
		}

		.main {
			font-weight: bold;
			margin-top: 30rpx;
			margin-bottom: 20rpx;
		}

		.radio-group {
			display: flex;
			justify-content: space-around;

			.radio-item {
				margin-top: 20rpx;
				margin-right: 100rpx;
			}

			margin-bottom: 26rpx;
		}

		.radio_icon {
			background-color: #fff;
			width: 50%;
			height: 50%;
			border-radius: 50%;
		}
	}
	.rotate-box{
		transition: transform 1s ease; /* 平滑过渡效果 */
		 transform-origin: center center;
	}
	
	@keyframes rotateCCW {
	  0% {
	    transform: rotate(0deg);
	  }
	  100% {
	    transform: rotate(-360deg); /* 负值表示逆时针 */
	  }
	}
	.rotate-ccw {
	  animation: rotateCCW .5s linear  infinite;
	}
</style>