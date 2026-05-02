<template>
	<view class="container" <!-- #ifdef APP-PLUS || MP-WEIXIN-->
		:style=" `height:calc(100vh - ${botHeight});`"
		<!--  #endif-->
		>
		<uv-navbar placeholder bgColor="#1c1c1c" title="注单" :titleStyle="{color:'#fff'}">
			<template v-slot:left>
				<view class="tabs" @click="menuNum=index" v-for="it,index in tabs" :key="index"
					:class="{'action':index==menuNum}">
					{{it.title}}
				</view>
			</template>
		</uv-navbar>
		<!--    #ifdef APP-PLUS || MP-WEIXIN  -->
		<view v-if="menuNum==0" class="main" :style="`height:calc(100vh - 44px - ${topHeight}px -  ${botHeight})`">
		<!--    #endif    -->
			<!--    #ifdef H5  -->
			<view v-if="menuNum==0" class="main" style="height:calc(100% - 44px)">
			<!--    #endif    -->
				<view class="menu-top u-flex ">
					<view class="menu-item u-flex-grow u-flex-column u-flex-around">
						<view class="u-flex-center-between">
							<view>总计：{{ tongji.zongji }}单</view>
							<view class="bay-but u-flex u-flex-content-start">
								<view class="u-flex" @click="dayOpen">
									{{ getTypeList(dayNum) }}<uv-icon name="/static/my/xl.png"></uv-icon>
								</view>
								<view v-if="dropDownShow" class="day-box">
									<view class="u-flex u-flex-between">
										<view> 总计：{{tongji.zongji}}单</view>
										<view class="u-flex" @click="dayClose">
											{{ getTypeList(dayNum) }}<uv-icon name="/static/my/xl.png"></uv-icon>
										</view>
									</view>
									<view class="dayList-box  u-flex u-flex-wrap">
										<view class="dayItem u-flex-shrink0 u-flex-xy-center"
											v-for="(it,index) in dayList" :class="{action:it.type==dayNum}" :key="index"
											@click="dayBut(it,index)">{{it.name}}</view>
									</view>
									<view class="u-flex u-flex-around daybut">
										<view class="u-flex-xy-center" @click="dayClose">取消</view>
										<view class="u-flex-xy-center" @click="dayOkBut">确定</view>
									</view>
								</view>
							</view>
						</view>
						<view class="u-flex u-flex-between" style="margin-top: 6rpx;">
							<view class="textColor">
								有效投注额：{{tongji.touzhue}} CNY
							</view>
							<view class="textColor">
								输赢：<text
									:class="tongji.shuying>=0?'ym':'sm'">{{tongji.shuying>=0?"+":""}}{{tongji.shuying}}</text>
								CNY
							</view>
						</view>
					</view>
					<view>
						<uv-tabs :current="current" :lineColor="`url(${lineBg}) 100% 100%`" lineWidth="14"
							lineHeight="7" :list="navList" :activeStyle="{
              fontFamily: '$uni-family-Bold',
              fontSize:'28rpx',
              color:'#1c1c1c',
              fontWeight:'bold'
             }" :inactiveStyle="{
              fontFamily: '$uni-family-Regular',
              fontSize:'24rpx',
              color:'#707070'
             }" @click="getCurrent"></uv-tabs>
					</view>
				</view>
        <!--    #ifdef APP-PLUS || MP-WEIXIN  -->
				<scroll-view scroll-y="true" style="height:calc(100% -  220rpx)" :enable-flex="true">
          <!--    #endif    -->
          <!--    #ifdef H5  -->
          <scroll-view scroll-y="true" style="height:calc(100% - 120rpx)" :enable-flex="true">
          <!--    #endif    -->
					<view v-for="item,index in filterList" :key="index">
						<Card style="margin-bottom: 14rpx;" :data="{...item,dayNum:dayNum}" />
					</view>
					<view v-if="filterList.length" class="u-flex-x-center"
						style="padding: 25rpx;font-size: 22rpx;color: #a9a9a9;">已全部加载~</view>
					<uvNoData v-if="!filterList.length" />
				</scroll-view>
			</view>
			<tabBar :current="3" />
		</view>
</template>

<script lang="ts" setup>
	import { computed, reactive, ref, shallowRef } from "vue";
	import Card from './components/card.vue'
	import DetailCard from './components/detailCard.vue'
	import { onLoad, onShow, onReady } from "@dcloudio/uni-app";
	import { userStore } from "@/stores/user"
	import { startStore } from "@/stores/start"
	import { getDayTime, formatDate } from "@/utils/time"
	import { usePaging } from "@/hooks/usePaging";
	import { venueGameRecord, venueGamestatis } from "@/api/money";
	import { copyText } from "@/utils/index"

	const tabs = ref([{ title: "游戏" }])
	const current = ref(0)
	const lists = ref([])
	const lineBg = '/static/zhudan/xz.png'

	const menuNum = ref(0)
	const topHeight = computed(() => {
		return uni.getSystemInfoSync().statusBarHeight
	})
	const botHeight = computed(() => {
		return (50 + uni.getSystemInfoSync().safeAreaInsets.bottom) + 'px'
	})
	const isToken = computed(() => userStore().token ? true : false)
	const allVenueList = computed(() => userStore().allVenueList)
	const gameTypeList = computed(() => startStore().gameTypeList)
	const tongji = computed(() => {
		return {
			zongji: filterList.value.reduce((a, b) => a + b.bet_count, 0),
			shuying: filterList.value.reduce((a, b) => a + b.net_amount, 0).toFixed(2),
			touzhue: filterList.value.reduce((a, b) => a + b.bet_amount, 0).toFixed(2),
		}
	})
	const formData = reactive({
		time_type: 1
	})
	const dayNum = ref(1)
	const dayNumType = ref(0)
	const dayList = computed(() => startStore().dayTypeList)
	const dayBut = (it : any, index : number) => {
		dayNum.value = it.type
	}
	const navList = computed(() => {
		const res = startStore().gameTypeList.map((i, index) => ({ name: i.text, index: index + 1, type: i.venue_type }))
		res.unshift({ name: "全部", index: 0, type: "" })
		return res
	})
	const getCurrent = (item : any) => {
		current.value = item.index
	}
	const strLenght = (str : any) => {
		return str.length > 10 ? str.slice(0, 2) + '***' + str.slice(-2) : str
	}
	const filterList = computed(() => {
		if (current.value > 0) {
			return lists.value.filter((it) => navList.value[current.value].type == it.game_type)
		} else {
			return lists.value
		}

	})
	const getVenueName = (item : any) => {
		const res = allVenueList.value.find(it => item.venue_code == it.venue_code)
		const resText = gameTypeList.value.find(it => item.game_type == it.venue_type)
		if (res?.game_type_img && res.game_type_img.length) {
			const ress = res.game_type_img.find(it => item.venue_code == it.venue_code)
			return ress?.venue_name + resText?.text
		} else {
			return ''
		}

	}
	const getStartAtEndAt = (type : number) => {
		formData.time_type = type
	}

	const copyTextBut = (text : any) => {
		copyText(text)
	}

	const getTypeList = (type) => {
		const res = dayList.value.find(it => it.type == type)
		return res.name
	}
	const dropDownShow = ref(false)
	const dayOpen = () => {
		if (!isToken.value) {
			uni.showToast({
				icon: 'none',
				title: '请登录！',
			})
			return
		}
		dropDownShow.value = true
	}
	const dayClose = () => {
		// dayNum.value = dayNumType.value
		dropDownShow.value = false
	}
	const dayOkBut = () => {
		dayNumType.value = dayNum.value
		getStartAtEndAt(dayNumType.value)
		dropDownShow.value = false
		init()
	}
	const leftClick = () => {
		uni.navigateBack()
	}


	const init = async () => {
		const arr = ["AGZR",
			"TYQP",
			"PGDZ",
			"CQ9",
			"JDB",
			"WALI",
			"KYQP",
			"WUGDZ",
			"FGDZ",
			"LYQP",
			"MTQP",
			"MGDZ",
			"FBTY",
			"HGTY",
			"VRCP",
			"VGQP",
			"DBDJ",
			"BGZR",
			"BBIN"]
		const sorted = allVenueList.value.sort((a, b) => {
			return arr.findIndex(i => i == a.venue_code) - arr.findIndex(i => i == b.venue_code)
		})
		
		const res = await venueGamestatis(formData)
		const list = res.data.data.filter(item => item.bet_count)
		lists.value = list.sort((a, b) => { //结算状态 场馆 类型 结算状态 排序
			if (a.is_settled !== b.is_settled) return a.is_settled - b.is_settled;
			const codeCompare = arr.findIndex(i=>i==a.venue_code)- arr.findIndex(i=>i==b.venue_code)
			if(codeCompare) return codeCompare
			return a.game_type - b.game_type; 
		})
	}
	onLoad(() => {
		uni.hideTabBar()
	})
	onShow(async () => {
		userStore().setCustomNum(3)
		if (!isToken.value) {
			uni.showToast({
				icon: 'none',
				title: '请登录！',
			})
			return
		}
		init()

	})
</script>

<style lang="scss" scoped>
	.main {
		border-radius: 30rpx 30rpx 0 0;
		background-color: $uni-bg-color-grey
	}

	/* 页面整体样式 */
	.container {
		width: 100vw;
		box-sizing: border-box;
		overflow: hidden;
		// #ifdef H5
		height: calc(100% - 50px);
		// #endif
		background-color: $uni-default-back0Color;

		.h-top {
			color: white;

			.menuBox {
				font-size: 32rpx;

				.but {
					color: #000000;
					height: 45px;
					border-radius: 10rpx 10rpx 0 0;
					margin-right: 40rpx;
					font-size: 26rpx;
					background: #FFFFFF;
					padding: 0 10px;
					margin-left: 10px;
				}

			}

			image {
				width: 50rpx;
				height: 50rpx;
				margin-right: 4rpx;
			}
		}

		.menu-top {
			width: calc(100% - 50rpx);
			border-radius: 30rpx;
			flex-direction: column;
			margin-bottom: 10rpx;
			// height: 100rpx;
			padding: 20rpx 30rpx 2px 30rpx;
			background: #FFFFFF;
			font-size: 24rpx;

			.menu-item {
				// height: 100rpx;
				border-bottom: 2rpx solid #ddd;
				padding-bottom: 12rpx;

				.textColor {
					color: #6d6d6d;
				}

				.ym {
					color: $uni-color-cl;
				}

				.sm {
					color: #0b9714;
				}
			}

			.bay-but {
				height: 40rpx;
			}
		}

		.list-box {
			font-size: 22rpx;
			height: 122rpx;
			margin-bottom: 20rpx;
			padding: 0 25rpx;
			background: $uni-text-color-inverse;

			>view {
				width: 30%;
				text-align: center;
				line-height: 30rpx;
				color: $uni-default-back3Color;

				text {
					font-size: 30rpx;
				}
			}

			.name {
				font-size: 30rpx;
				color: #1c1c1c;
				padding: 4rpx 0;
				font-weight: normal;
			}

			.w40 {
				width: 40%;
				font-size: 18rpx;

				text {
					font-size: 18rpx;
					font-weight: 600;
					margin-right: 23rpx;
					color: $uni-default-color;
				}

				image {
					width: 30rpx;
					height: 30rpx;

				}
			}

			.ym {
				color: $uni-color-cl;
			}

			.sm {
				color: #0b9714;
			}
		}

		.day-box {
			width: calc(100vw - 60rpx);
			height: 340rpx;
			padding: 20rpx 30rpx;
			z-index: 6666;
			position: fixed;
			left: 0;
			background: white;
			box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);

			.dayList-box {
				.dayItem {
					width: 206rpx;
					height: 60rpx;
					border-radius: 30rpx;
					border: 2rpx solid $uni-bg-color-grey;
					margin-right: 36rpx;
					margin-top: 20rpx;
					font-size: 28rpx;
					background-color: $uni-bg-color-grey;
					box-sizing: border-box;
				}

				.dayItem:nth-child(3n) {
					margin-right: 0;
				}

				.action {
					color: $uni-default-color;
					border: 2rpx solid $uni-default-color;
					background-color: $uni-text-color-inverse;
					box-sizing: border-box;
				}
			}

			.daybut {
				margin: 40rpx;
				font-family: $uni-family-Medium;

				>view {
					width: 206rpx;
					height: 78rpx;
					color: $uni-default-color;
					background: $uni-default-xzColor;
					border-radius: 40rpx;
					font-size: 28rpx;
				}

				view:last-child {
					width: 446rpx;
					height: 78rpx;
					color: #FFFFFF;
					background: $uni-default-color;
					margin-left: 36rpx;
				}
			}
		}

	}

	.action {
		background-color: #FFFFFF;
		color: #000 !important;
		border-radius: 15px 15px 0 0;
	}

	.tabs {
		color: #fff;
		height: 100%;
		width: 100rpx;
		font-size: 26rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>