<template>
	<uv-popup ref="checkInPopup" mode="center" :closeOnClickOverlay="true" :customStyle="customStyle">
		<view class="main">
			<view class="top u-flex-center-end">
			<image class="close" src="/static/home/down/close.png" @click="close"></image>
			</view>

			<view class="content">
				<view class="checkin-container">
					<view v-for="(item, index) in checkInData" :key="index" class="checkin-card" :class="{ 
				        'checked': item.ifCheckIn,
				        'last-item': index === 6,
						     'currentDay':item.ifCheckIn
				      }">
						<image class="icon" :class="{
							'last-item-icon': index === 6,
							 'checkedLastIcon': item.ifCheckIn,
							}" :src="index === 6?'/static/my/checkIn/smcj_icon.png':item.ifCheckIn?'/static/my/checkIn/yqd_icon.png':'/static/my/checkIn/wqd_icon.png'">
						</image>
						<view style="display: flex;flex-direction: column;align-items: center;" :class="{
								'checkDay': item.ifCheckIn,
								}">
							<text class="lastDay" v-if="index === 6">神秘彩金</text>
							<text class="day">{{ item.ifCheckIn?'已签到':item.name }}</text>
						</view>
					</view>
				</view>
				<view class="progress">
					<text class="leiji">月累计签到<text class="leijiNum">{{leiji}}</text>天</text>
					<view class="checkin-wrapper">
						<!-- 进度条 -->
						<view class="progress-container">
							<progress :percent="adjustedProgress" class="custom-progress" :showText="true" backgroundColor="#9a9a9a" height="12" />
							<!-- 奖励标记 -->
							<view v-for="(reward, index) in sortedRewards" :key="index" class="reward-marker" :style="{ left: `${getRewardPosition(index)}%` }"
								:class="{ 'unlocked': currentDay >= reward.days }">
								<text class="reward-day">{{ reward.days }}天</text>
								<image :src="reward.icon" class="gift-icon" />
								<text class="reward-text">{{ reward.name }}</text>
							</view>

						</view>

					</view>
				</view>
				<view class="tips u-flex-x-center">
					单日打码到累计7天重置,月累计打码到每月1日重置,每日打码{{dama}}以上才可以签到
				</view>
        <view class="btn" :class="{ 'checkBtn': ifCurrentCheckIn !==2 }" @click="handdleClick"> </view>
			</view>

		</view>
	</uv-popup>
	<successPopVue ref="successRef" :number="rewardCount"></successPopVue>
</template>

<script setup>
	import {
		ref,
		shallowRef,
		computed,
		nextTick
} from 'vue'

	import {
		onMounted
	} from "vue"
	import {
		getCheckInInfo,
		checkIn
	} from "@/api/user";

	import successPopVue from '@/components/successPopup/index.vue'
	import environment from '@/utils/environments.ts'
	const baseUrl = environment.envConfigs.url
	const checkInPopup = shallowRef()
	const successRef = shallowRef()
	const rewardCount = ref(0) //点击签到显示的奖励金额总和
	const leiji = ref(7) //月累计签到天数
	const ifCurrentCheckIn = ref(false) //状态（1 可领取；2 已领取）
	const rewardConfig = ref({})//进度条配置
	const checkInData = ref([]);  //七个卡片配置
	const currentDay = ref(0);
	const dama = ref(0) //打码要求
	const userDama = ref(0) //用户本日实际打码
	const customStyle = {
		width: '636rpx',
		height: '816rpx',
		backgroundColor: "transparent",
		backgroundImage: "url('/static/my/checkIn/qdbg.png')",
		backgroundSize: 'cover',
	}
	const init = async () => {
		const res = await getCheckInInfo()
    sortedRewards.value= res.data.extraRewardList.map( it=>{
      return {
        ...it,
        icon: baseUrl + it.icon,
        name: `彩金${it.extraReward}元`
      }
    })
    leiji.value = res.data.extDays //月累计签到天数
		currentDay.value = res.data.days //第几天
		dama.value = res.data.rewardList[currentDay.value - 1].amount
		ifCurrentCheckIn.value = res.data.status //签到状态
		userDama.value = res.data.totalAmount
		const ext = res.data.extraRewardList.find((i) => i.days == currentDay.value)?.extraReward
		rewardCount.value = res.data.rewardList[currentDay.value - 1].reward + (ext ? ext : 0) //总奖励金额 单日加月累计
    checkInData.value = res.data.rewardList.map((it) => {
          return {
            ...it,
           name: `第${it.days}天`,
           ifCheckIn:(currentDay.value>it.days|| currentDay.value==it.days && ifCurrentCheckIn.value === 2) ?true:false
          }
    })


		// let s = {}
		// res.data.extraRewardList.map(i => {
		// 	s[i.days] = {
		// 		amount: i.amount,
		// 		icon: baseUrl + i.icon,
		// 		name: `彩金${i.extraReward}元`
		// 	}
		// })
		// rewardConfig.value = s
	}

	const handdleClick = async () => {
		// if (userDama.value < dama.value) {
		// 	uni.showToast({
		// 		icon: 'none',
		// 		title: `当日打码量不足${dama.value}，不可签到`
		// 	})
		// }else
		if (ifCurrentCheckIn.value !== 1) {
      uni.showToast({
        icon: 'none',
        title: ifCurrentCheckIn.value?`签到奖励已领取`:`当日打码量不足${dama.value}，不可签到`
      })
    } else {
			const res = await checkIn()
			if (res.code == 0) {
				close()
				successRef.value.open()
				init()
			}
		}
	}
	const sortedRewards=ref([])
	// const sortedRewards = computed(() => {
	// 	return Object.entries(rewardConfig.value)
	// 		.map(([day, config]) => ({
	// 			day: Number(day),
	// 			...config
	// 		}))
	// 		.sort((a, b) => a.day - b.day);
	// });
	const getRewardPosition = (index) => {
		const count = sortedRewards.value.length;
		return ((index + 1) / (count + 1)) * 100;
	};
	const cusButton = computed(() => {
		return ifCurrentCheckIn ? {
			backgroundImage: "/static/my/checkIn/yqd.png"
		} : {
			backgroundImage: "/static/my/checkIn/qd.png"
		}
	})
	const gradientStyle = {
		background: 'linear-gradient(to right, #d2a54c, #fffed3)',
	}

	const getExtraReward = (item) => {
		successRef.value.open()
	}
	// 动态进度计算
	const adjustedProgress = computed(() => {
		// 找到当前所在区间
     if(!sortedRewards.value.length) return
		 let segmentEndIndex = sortedRewards.value.findIndex(r => leiji.value <= r.days);
		 if (segmentEndIndex === -1) segmentEndIndex = sortedRewards.value.length;
		// 计算区间边界天数
		const segmentStartDay = segmentEndIndex > 0 ?
			sortedRewards.value[segmentEndIndex - 1].days :
			0;
		const segmentEndDay = segmentEndIndex < sortedRewards.value.length ?
			sortedRewards.value[segmentEndIndex].days :
			sortedRewards.value[sortedRewards.value.length - 1].days + 1;

		// 计算当前天数在区间的实际比例
		const segmentRatio = (leiji.value - segmentStartDay) /
			(segmentEndDay - segmentStartDay);

		// 计算区间在进度条上的固定位置
		const segmentStartPos = segmentEndIndex > 0 ?
			getRewardPosition(segmentEndIndex - 1) :
			0;
		const segmentEndPos = segmentEndIndex < sortedRewards.value.length ?
			getRewardPosition(segmentEndIndex) :
			100;

		// 计算进度: 区间起点 + 实际天数比例 * 区间宽度
		const progress = (segmentStartPos + segmentRatio * (segmentEndPos - segmentStartPos));
		return Math.round(progress); // Return integer percentage
	});
	const close = () => {
		checkInPopup.value.close()
	}
	const open = () => {
		init()
		checkInPopup.value.open()
	}
	//onMounted(async () => {
	//	init()
	//})
	defineExpose({
		open,
		close,
	})
</script>

<style lang="scss" scoped>
	.main {

		.top {
			height: 174rpx;

			.icon {
				width: 150rpx;
				height: 150rpx;
				position: absolute;
				transform: translate(-20%, -20%);

			}

			.title {
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				font-size: 34rpx;
				width: 100%;
			}

			.close {
				width: 40rpx;
				height: 40rpx;
				margin-left: auto;
				display: flex;
				align-items: center;
				position: absolute;
				right: 26rpx;
				top: 54rpx
			}

		}

		.content {
			
            >view{
				padding: 0 34rpx;
			}
			.checkin-container {
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				/* 第一行4列 */
				gap: 10rpx;

				/* 默认卡片样式 */
				.checkin-card {
					height: 150rpx;
					background: #f5f5f5;
					border-radius: 12rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					position: relative;
				}

				/* 强制第5、6项换行到第二行 */
				.checkin-card:nth-child(5),
				.checkin-card:nth-child(6) {
					grid-column: span 1;
					/* 保持1列宽度 */
				}

				/* 第7项单独处理 */
				.checkin-card.last-item {
					grid-column: 3 / span 2;
					/* 从第2列开始，跨2列 */
					flex-direction: row;
					justify-content: space-around;
				}

				/* 已签到样式 */
				//.checkin-card.checked {
				//	// background: #e8f5e9;
				//	border: none;
				//	// background-image: url("/static/my/checkIn/yqd_icon.png");
				//	// 	background-size: cover;
				//}

				.currentDay {
					border: 2rpx solid #f2af42
				}

				.icon {
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 10rpx;
				}

				.last-item-icon {
					width: 120rpx;
					height: 120rpx;
				}

				.checkedLastIcon {
					opacity: 0.5;
				}

				.day {
					font-size: 26rpx;
					font-family: $uni-family-Regular;
					color: #5e5e5e
				}

				.checkDay {
					color: #f2af42;
					opacity: .5;
				}

				.lastDay {
					font-size: 30rpx;
					color: #f2af42;
				}

				.status {
					position: absolute;
					top: 10rpx;
					right: 10rpx;
					width: 40rpx;
					height: 40rpx;
					background: #4caf50;
					color: white;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24rpx;
				}
			}

			.progress {
				margin-top: 20rpx;
				font-size: 16rpx;

				.leiji {
					font-family: $uni-family-Regular;
					font-size: 22rpx;
					display: block;
					color: #7e7e7e;
					margin-bottom: 10rpx;

					.leijiNum {
						font-size: 24rpx;
						color: #f2af42
					}
				}

				/* 进度条容器 */
				.progress-container {
					background: linear-gradient(to right, #7a4401, #b48833);
					position: relative;
					padding-bottom: 40rpx;
					padding-top: 40rpx;
					border-radius: 30rpx;
				}

				/* 奖励标记 */
				.reward-marker {
					position: absolute;
					top: 50%;
					transform: translateX(-50%) translateY(-50%);
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				.gift-icon {
					width: 42rpx;
					height: 40rpx;
					transition: all 0.3s;
				}

				.reward-day {
					font-size: 16rpx;
					color: #fff;
					position: relative;
					top: 3rpx;
					left: -30rpx;
					white-space: nowrap;
				}

				.reward-text {
					font-size: 16rpx;
					color: #fff;
					white-space: nowrap;
				}
			}

			.tips {
				color: #7e7e7e;
				font-size: 16rpx;
        margin-top: 16rpx;
        margin-bottom: 4rpx;
        padding: 0;

			}

			.btn {
				height: 100rpx;
				background-color: none;
				background-image: url('/static/my/checkIn/yqd.png');
				background-size: cover;
				/* 覆盖整个按钮 */
				background-position: center;
				/* 图片居中 */
				background-repeat: no-repeat;
				/* 不重复 */
				color: white;
				/* 文字颜色（根据背景调整） */
				padding: 10px 20px;
				/* 调整内边距使文字和背景协调 */
			}

			.checkBtn {
				background-image: url('/static/my/checkIn/qd.png');
				/* 替换为你的图片URL */
			}
		}

		.bottom {
			padding: 10rpx;


		}
	}

	:deep(.custom-progress .uni-progress-inner-bar) {
		background: linear-gradient(to right, #d2a54c, #fffed3) !important;
		// width: auto !important;
		border-radius: 100rpx;
	}
</style>