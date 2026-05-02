<template>
	<view class="container overflow-y"
  <!--        #ifdef APP-PLUS || MP-WEIXIN-->
  :style=" `height:calc(100vh - ${botHeight});`"
  <!--  #endif-->
  >
		<uv-navbar placeholder bgColor="#1c1c1c" leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="我的">
			<template v-slot:left>
				<view class="uv-nav-slot u-flex-center-end" @click="setBut" style="color: #FFFFFF">
					<uv-icon name="/static/my/set.png" @click="setBut" bold color="#ffffff" size="20"></uv-icon>
				</view>
			</template>
			<template v-slot:right>
				<view class="uv-nav-slot u-flex-center-end" @click="getKFBut" style="color: #FFFFFF">
					<uv-icon name="/static/kf/kf.png" size="19"></uv-icon>
					<text class="kfClass">客服</text>
				</view>
			</template>
		</uv-navbar>
		<view class="user-info u-flex">
			<view class="userLeft u-flex">
				<image @click="gotoUserInfo" :src="userData.avatar || '/static/my/user/mrtx.jpg'"
					style="width: 100rpx;height:100rpx;margin-right: 20rpx;border: 4rpx solid white;background: white;border-radius: 50%">
				</image>
				<view class="u-flex-center-start" @click="copyTextBut(userData.user_id)">
					ID:{{ userData.user_id }}
					<image class="leftbut" src="/static/kf/fz.png"></image>
				</view>
				
			</view>
			<view class="checkIn" @click="openCheckIn"></view>
		</view>
		<view class="vip-box u-flex-column u-flex-items-end">
			<view class="u-flex-center-between viptop">
				<view class="back-box">
					<text style="margin-right: 6rpx;">V{{vipData.nowLevel<2?1:vipData.nowLevel }}</text>打码量:
					<text style="margin-left: 21rpx;">{{ vipData.nowBetAmount }}</text>/{{ vipData.nextBetAmount }}
				</view>
				<view class="nexvip">V{{ vipData.nowLevel<2?2:vipData.nowLevel + 1}}</view>
			</view>
			<view class="vipNum-box">
				<uv-line-progress :percentage="vipData.nowBetAmount/vipData.nextBetAmount * 100" height="10rpx"
					:showText="false" activeColor="#ce0202"></uv-line-progress>
			</view>
			<view class="u-flex-center-between vipNum-bottom">
				<view class="item u-flex-y-center" v-for="(item,index) in vipList" :key="index">
					<view class="yuan">
						<image v-if="vipData.nowLevel>0" src="/static/my/xz.png"></image>
					</view>
					{{item}}
				</view>
			</view>
		</view>
		<view class="money-box u-flex">
			<view class="u-flex-grow u-flex-column u-flex-between">
				<view class="u-flex-center-start">
					我的钱包 
					<view style="position: relative;">
						<uv-icon class="rotate-box" :class="{ 'rotate-ccw': isRotating }"  name="/static/home/sx2.png" style="margin-left: 10rpx"
							color="#000000" size="14"></uv-icon>
						<view style="width: 50rpx;height: 50rpx;position: absolute;top: -12rpx;left: 0;" @click="getBalanceBut"></view>
					</view>
				
				</view>
				<view class="u-flex-center-start">
					<!--          <image src="/static/home/money.svg"></image>-->
					<view class="rmb-img u-flex-xy-center u-flex-shrink0">¥</view>
					<text> <text v-if="!isRotating">{{ userMoney?.ava_amount?.toFixed(2) ||0}}</text>
					<text v-else><Loading  /></text>
					 
					</text>
				</view>
			</view>
			<view class="u-flex-center-between but">
				<view class="u-flex u-flex-middle cz" @click="moneyBut(0)">充值</view>
				<view class="tx u-flex u-flex-middle tx" @click="moneyBut(1)">提现</view>
			</view>
		</view>

		<view class="list-box  u-flex u-flex-wrap">
			<view v-for="(it,index) in list" :key="index" @click="goToPtah(it)">
				<image :src="it.img" style="width: 54rpx;height: 60rpx"></image>
				<view>{{ it.name }}</view>
			</view>
		</view>
		<view class="banner">
			<image src="@/static/my/banner.gif" style="width: 100%;height: 164rpx;border-radius: 30rpx;"></image>
			<image src="@/static/my/all.png" class="innerImg"></image>
		</view>
		<view class="list-box u-flex u-flex-wrap">
			<view v-for="(it,index) in gymList" :key="index" @click="goToPtah(it)">
				<view style="border-radius: 50%;background-color: #ae8d45;height: 56rpx;width: 56rpx;margin: auto;">
					<image :src="it.img" style="width: 100%;height: 100%; "></image>
				</view>
				<view style="margin-top: 12rpx;"><text>{{ it.name }}</text></view>
			</view>

		</view>
		<view class="help-list">
			<view class="item u-flex u-flex-y-center" v-for="(it,index) in helpList" :key="index" @click="goToPtah(it)">

				<image class="marg" :src="it.img" style="width: 30rpx;height: 30rpx"></image>
				<view class="title"><text>{{ it.name }}</text>
				<view class="rightText" v-if="it.version">{{it.version}}</view>
				</view>
				
				<uv-icon class="marg last" name="arrow-right" color="#c7c7c7" size="18"></uv-icon>

			</view>
		</view>
		<view class="outLogin u-flex u-flex-middle" v-if="isToken" @click="outLoginBut">
			退出登录
		</view>
    <checkInPopup ref="cheInPopRef"></checkInPopup>
    <tabBar :current="4" />
	</view>
</template>

<script lang="ts" setup>
	import { computed, ref,shallowRef } from "vue";
	import { onLoad, onShow } from "@dcloudio/uni-app";
	import Loading from '@/components/Loading/index.vue'
	import { getBalance, getVipProgressBut } from "@/hooks/publicRequest";
	import checkInPopup from './checkIn.vue'
	import { toPtah, copyText } from "@/utils/index"
	import { userStore } from "@/stores/user"
	const userDataStore = userStore();
	const cheInPopRef=shallowRef()
	const vipData = computed(() => userDataStore.vipData)
	const isToken = computed(() => userDataStore.token ? true : false)
	const userData = computed(() => userDataStore.userInfo)
	const userMoney = computed(() => userDataStore.userMoney)
	
  const version = computed(() => userDataStore.version)
	const vipList = ref(['晋级积分', '周礼金', '月礼金', '年收益'])
  const botHeight = computed(() => {
    return  (50 + uni.getSystemInfoSync().safeAreaInsets.bottom)+'px'
  })
  const isRotating=ref(false)
	const list = ref([
		{ name: '投注记录', img: '/static/my/tzjl.png', path: '/pages/tabBar/bill/index', type: 0 },
		{ name: '交易记录', img: '/static/my/jyjl.png', path: '/pages/myManage/trading/index', type: 1 },
		// {name:'个人报表',img:'/static/my/grbb.png',path:'/pages/myManage/statement/index',type:1},
		{ name: 'VIP中心', img: '/static/my/vip.png', path: '/pages/vipManage/vip/index', type: 1 },
		{ name: '客服', img: '/static/my/mykf.png', path: '/pages/kf/index', type: 1 },
		{ name: '我的洗码', img: '/static/my/wdxm.png', path: '/pages/codeWashing/index', type: 1 },
		{ name: '安全中心', img: '/static/my/aqzx.png', path: '/pages/myManage/myInfo/index', type: 1 },
		{ name: '我的消息', img: '/static/my/wdxx.png', path: '/pages/myManage/message/index', type: 1 },
		{ name: '官方赞助', img: '/static/my/gfzz.png', path: '/pages/myManage/sponsor/index', type: 1 }
	])
	const gymList = ref([
		{ name: '赛事公告', img: '/static/my/shgg.png', path: '/pages/eventAnnouncement/index', type: 1 },
		{ name: '赛事结果', img: '/static/my/shjg.png', path: '/pages/matchResult/index', type: 1 },
		{ name: '盘口教程', img: '/static/my/pkjc.png', path: '/pages/dishSimulate/index', type: 1 },
		{ name: '投注规则', img: '/static/my/tzgz.png', path: '/pages/sportRules/index', type: 1 },

	])
	const helpList = ref([
		{ name: '新手教程', img: '/static/my/xsjc.png', path: '/pages/tutorial/index', type: 1 },
		{ name: '关于我们', img: '/static/my/gywm.png', path: '/pages/aboutUs/index', type: 1 },
		{ name: '版本号', img: '/static/my/version.png', path: '1', version:`V${version.value}` },
	])
	const getKFBut = () => {
		toPtah('/pages/kf/index')
	}
	const setBut = () => {
		toPtah('/pages/myManage/myInfo/index', 1, true)
	}
	const gotoUserInfo = () => {
		toPtah('/pages/myManage/updateUser/index', 1, true)
	}
	const copyTextBut = (text : any) => {
		copyText(text)
	}
	const moneyBut = (num : number) => {
		uni.setStorageSync('menuNum', num)
		toPtah(`/pages/tabBar/savingsAccount/index`, 0, true)
	}
	const goToPtah = (it : any) => {
		if(!it.path){
			uni.showToast({
				icon:"none",
				title:"暂未开放"
			})
			return
		}
		toPtah(it.path, it.type, true)
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
	const outLoginBut = () => {
		userDataStore.logout()
	}
	const openCheckIn=()=>{
		cheInPopRef.value.open()
	}

  onLoad(()=>{
    uni.hideTabBar()
  })
	onShow(() => {
		userDataStore.setCustomNum(4)
		if (!isToken.value) {
			toPtah('/pages/login/index')
		} else {
			getBalance()
			getVipProgressBut()
		}
	})
</script>

<style lang="scss" scoped>
	/* 页面整体样式 */
	.container {
		box-sizing: border-box;
		background-color: $uni-bg-color-grey;
		overflow: hidden;

		//#ifdef H5
		height: calc(100% - 50px);
		//#endif
		.h-top {
			width: calc(100% - 20rpx);
			background: #1c1c1c;
			padding: 0 10rpx;
			height: 90rpx;
			color: white;
			font-size: 36rpx;
		}

		.user-info {
			height: 154rpx;
			font-size: 28rpx;
			color: #FFFFFF;
			background: #1c1c1c;
			padding-bottom: 30rpx;
			align-items: center;
			.userLeft {
				height: 100rpx;
				margin: 26rpx 0 28rpx 30rpx;
				font-size: 32rpx;
			}
			.checkIn{
				height: 60rpx;
				background-image: url("/static/my/qd.png");
				background-size: cover;
				border-top-left-radius: 30rpx;
				border-bottom-left-radius: 30rpx;
				display: flex;
				justify-content: space-around;
				width: 170rpx;
				// background-color: #a8a8a8;
				margin: 26rpx 0 28rpx 30rpx;
				margin-left: auto;
				display: flex;
				align-items: center;
			}
			.leftbut {
				width: 30rpx;
				height: 30rpx;
				margin-left: 20rpx;
			}
		}

		.vip-box {
			width: 100vw;
			height: 192rpx;
			background: url("/static/my/myvipBack.png");
			background-size: 100% 100%;
			margin-top: -30rpx;

			.viptop {
				margin-top: 40rpx;

				.nexvip {
					font-size: 24rpx;
					font-weight: 600;
				}
			}

			.vipNum-box {
				margin-top: 12rpx;
				height: 10rpx;
				overflow: hidden;
			}

			.vipNum-bottom {
				margin-top: 22rpx;
			}

			>view {
				width: 520rpx;
				font-size: 24rpx;
				margin-right: 52rpx;

				text {
					color: $uni-color-cl;
					font-weight: 600;
				}

				.item {
					font-size: 22rpx;
					color: $uni-default-back3Color;

					.yuan {
						width: 21rpx;
						height: 21rpx;
						border-radius: 50%;
						background: $uni-default-back3Color;
						position: relative;
						margin-right: 10rpx;

						image {
							width: 24rpx;
							height: 24rpx;
							position: absolute;
							top: -2rpx;
						}
					}
				}
			}
		}

		.money-box {
			width: calc(100% - 60rpx);
			height: 96rpx;
			background-color: #FFFFFF;
			border-radius: 30rpx;
			padding: 26rpx 30rpx;
			position: relative;
			margin-top: -30rpx;
			font-size: 24rpx;

			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}

			.rmb-img {
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				overflow: hidden;
				background: $uni-default-color;
				font-size: 22rpx;
				margin-right: 10rpx;
				padding: 0;
				color: #FFFFFF;
				font-family: $uni-family-Bold;
			}

			text {
				font-size: 36rpx;
				font-weight: bold;
			}

			.but {
				width: 300rpx;
				margin-top: 20rpx;

				>view {
					width: 150rpx;
					height: 60rpx;
					font-size: 28rpx;
					color: #ffffff;
					background: rgba(217, 0, 27, 1);
					border-radius: 30rpx;
				}

				.tx {
					background: $uni-default-color;
					margin-left: 30rpx;
					margin-right: 4rpx;
				}
			}
		}

		.list-box {
			padding: 28rpx 42rpx 2rpx 42rpx;
			background: white;
			margin-top: 18rpx;
			border-radius: 30rpx;

			>view {
				font-size: 26rpx;
				text-align: center;
				color:#1c1c1c;
				font-family:$uni-family-Regular;
				margin-right:calc((100vw - 500rpx)/3);
				margin-bottom: 30rpx;

				image {
				}

				view {
					text-align: center;
					width: 104rpx;
				}
			}

			>view:nth-child(4n) {
				margin-right: 0;
			}
		}

		.help-list {
			margin-top: 18rpx;
			background: white;
			border-radius: 30rpx;
			padding: 10rpx 28rpx;
			justify-content: space-between;

			.item {
				.marg {
					margin: 10rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				margin-top: 0.1625rem;

				.title {
					margin-left: 10rpx;
					padding: 18rpx 0;
					font-size: 28rpx;
					border-bottom: 1rpx solid #eeeeee;
					flex-grow: 1;
					display: flex;
					.rightText {
						color: #c7c7c7;
						margin-left: auto;
					
					}
				}

				

				&:last-child {
					.title {
						border-bottom: none; // 清除边框
					}
				}
			}

		}
	}

	.outLogin {
		font-size: 30rpx;
		width: 426rpx;
		height: 80rpx;
		margin: 92rpx auto;
		margin-bottom: 200rpx;
		background: #FFFFFF;
		color: $uni-default-color;
		border-radius: 40rpx;
	}

	.banner {
		position: relative;
		margin-top: 28rpx;
		display: flex;
		justify-content: center;

		.innerImg {
			width: 25%;
			height: 46rpx;
			position: absolute;
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