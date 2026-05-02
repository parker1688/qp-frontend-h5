<template>
	<view class="card-box u-flex-y-center" @click="showDetail">

		<view class="content u-flex-grow u-flex-column " :class="{'ylq':data.status=='2'}">
			<view class="top ">
				<image class="icon" :src="iconMapping[data.type]"></image>
				<view class="title ">
					{{mapping2[data.subtype]}}
				</view>
			</view>
			<view class="subTitle">{{data.name}}</view>
			<view class="progress">
				<uv-line-progress :percentage="percent" inactiveColor="#ececec" height="16rpx" :showText="false"
					activeColor="#ae8d45"></uv-line-progress>
			</view>
			<view class="reward u-flex u-flex-between">
				<view class="detail">奖励现金:<text class="hight-light">+{{data.bonus_amount}}</text></view>
				<view class="process"> {{Math.floor(data.curr_amount) }}/{{data.amount}}</view>
			</view>
		</view>
		<view class="right" :class="{'ylq':data.status=='2'}">
			<myBadge v-if="data.ifBadge" />
			<view class="btn u-flex-xy-center" :class="data.status==0?'qwc':data.status==1?'qlq':'ylq qlq' "
				@click.stop="handleClick">
				{{data.status==0?'去完成':data.status==1?'去领取':'已领取'}}
			</view>
				

		</view>
		<detailPop ref="detailPopRef"></detailPop>
	</view>
</template>

<script setup  lang="ts">
	import {computed,ref,shallowRef} from 'vue'
	import detailPop from './detailPop.vue'
	import myBadge from '/components/myBadge/index.vue'
	const detailPopRef = shallowRef()
	const iconMapping = {
		"1": "/static/mission/mrrw.png", //每日任务
		"5": "/static/mission/by.png", //捕鱼
		"2": "/static/mission/cz.png", //充值
		"3": "/static/mission/dz.png", //电子
		"4": "/static/mission/qp.png", //棋牌
		"6": "/static/mission/ty.png" //体育
	}
	const percent = computed(()=>{
		return Math.floor(props.data.curr_amount)/props.data.amount*100 
	})
	const showDetail=()=>{
		if(props.data.status!=2){
			detailPopRef.value.open({...props.data})
		}
	}
	const mapping1 = {
		1: `每日任务`,
		2: `充值任务`,
		3: `电子任务`,
		4: `棋牌任务`,
		5: `捕鱼任务`,
		6: `体育任务`
	}
	const mapping2 = {
		1: `累计充值`,
		2: `累计投注`,
		3: `累计亏损`,
		4: `累计盈利`,
	}
	const props = defineProps({
		data: {
			id: String, //	ID
			type: String, //	任务大类（1 每日任务；2 充值任务；3 电子任务；4 棋牌任务；5 捕鱼任务；6 体育任务）
			subtype: String, //	任务目标（1 累计充值；2 累计投注；3 累计亏损；4 累计盈利）
			name: String, //	任务名称
			intro: String, //	任务简介
			detail: String, //	任务详情
			curr_amount: String, //	累计额度（用户任务进度）
			amount: String, //任务额度
			bonus_amount: String, //	奖励额度
			start_at: String, //任务开始时间
			end_at: String, //任务结束时间
			status: String, //用户任务状态（0 去完成；1 去领取；2 已领取）
		}
	})
	const emit = defineEmits(['click'])

	const handleClick = () => {
		if (props.data.status == '2') return
		
		emit('click')

	}
</script>

<style lang="scss" scoped>
	.ylq {
		opacity: 50%;
	}

	.card-box {
		padding: 20rpx 22rpx;
		width: 688rpx;
		height: 214rpx;
		margin: 22rpx auto;
		background-color: $uni-bg-color;
		border-radius: 28rpx;

		.content {
			flex-direction: column;
			margin-right: 40rpx;
			height: 100%;

			.top {
				margin-top: 10rpx;
				display: flex;
				margin-left: 2rpx;
				align-items: center;

				.icon {
					width: 34rpx;
					height: 34rpx;
				}

				.title {
					margin-left: 14rpx;
					font-family: $uni-family-Bold;
					font-weight: 600;
					font-size: 26rpx;
					color: #1c1c1c
				}
			}


			.subTitle {
				margin-top: 14rpx;
				margin-left: 46rpx;
				font-family: $uni-family-Regular;
				font-size: 22rpx;
				color: #707070
			}

			.progress {
				margin-top: 14rpx;
				margin-left: 46rpx;
			}

			.reward {
				font-family: $uni-family-Medium;
				font-size: 22rpx;
				margin-top: 32rpx;
				align-items: center;
				color: #1c1c1c;
				flex-direction: row;
				margin-left: 58rpx;

				.detail {
					display: flex;
					align-items: center;

					.hight-light {
						font-size: 38rpx;
						font-family: $uni-family-Heavy;
						margin-left: 6rpx;
						color: #c50404;
						font-weight: 600;
					}
				}

			}
		}

		.right {
			margin-left: auto;
			position: relative;

			.btn {
				width: 136rpx;
				height: 56rpx;
				border-radius: 28rpx;
				font-family: $uni-family-Bold;
				font-size: 26rpx;
				font-weight: 600;
				display: flex;

			}

			.qwc {
				border: 2rpx solid #ae8d45;
				color: #ae8d45;
			}

			.qlq {
				background-color: #ae8d45;
				color: $uni-bg-color
			}

		}
	}
</style>