<template>
	<view class="u-flex-shrink0 table-box">
		<uv-tabs :current="current" :list=" props.data " lineWidth="0" :activeStyle="{
	     	border: 'none',
	     	color:'#ffffff',
	     	height:'58rpx',
	  width: '200rpx',
	  borderRadius:'30rpx',
	  display:' flex',
	  alignItems: 'center',
	  justifyContent:' center',
	  padding: '0 10rpx',
	  background:'#ae8d45',
	  fontFamily: '$uni-family-Medium',
	  fontSize:'26rpx',
	  boxSizing: 'border-box',
	  }" :inactiveStyle="{
	   color: '#303133',
	   border: '2rpx solid #CCCCCC',
	   fontFamily: '$uni-family-Regular',
	   height:'58rpx',
	   width: '200rpx',
	   borderRadius:'30rpx',
	   display:' flex',
	   alignItems: 'center',
	   justifyContent:' center',
	   fontSize:'26rpx',
	   padding: '0 10rpx',
	   boxSizing: 'border-box',
	}" @click="getCurrent" itemStyle="padding-left:0; padding-right: 18rpx; height: 58rpx;"></uv-tabs>
	</view>
	<view>
		<view class="sb1"><text class="ss1">单选题</text><text class="ss2">根据赛果选择会盈利的投注项</text></view>
		<view class="card-box">
			<view>
				<view class="uv-collapse-content">
					<view class="left">
						<view class="logo" style="background-image: url('/static/gym/zhu_icon.png');" >主队</view>
						<view class="teamName">阿森纳</view>
					</view>
					<view class="center">
						<view class="time">赛果</view>
						<view class="score">{{score(it)}}</view>

					</view>
					<view class="right">
						<view class="logo" style="background-image: url('/static/gym/away_icon.png');"  >客队</view>
						<view class="teamName">切尔西</view>
					</view>
				</view>
			</view>
			<view class="row">
				<view class="host comm" v-if="props.data[current].id==1||props.data[current].id==4">主</view>
				<view class="btns">
					<view class="btn" :class="{
						selected: item.id==selectedObj.id
					}" v-for="item,index in props.data[current].main" @click="haddleClick(item,index,'main')">
						<view class="n1">{{item.detail}}</view>
						<view class="n2"  :class="{
							up:item.sort=='upward',
							down:item.sort=='down'
						}">{{item.odds}}</view>
					</view>
				</view>
			</view>
			<view class="row">
				<view class="away comm" v-if="props.data[current].id==1||props.data[current].id==4">客</view>
				<view class="btns">
					<view class="btn" :class="{
						selected: item.id==selectedObj.id
					}" v-for="item,index in props.data[current].guest" @click="haddleClick(item,index,'guest')">
						<view  class="n1">{{item.detail}}</view>
						<view class="n2 " :class="{
							up:item.sort=='upward',
							down:item.sort=='down'
						}">{{item.odds}}</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="Object.keys(selectedObj).length>0" >
			<view class="sb1"><text class="ss1">投注结果</text></view>
			<view class="card-box">
				<view><text>{{selectedObj?.title}}</text>
				<text style="font-weight: bold;">{{selectedObj?.detail}}@</text>
				<text style="font-weight: bold;">{{selectedObj?.odds}}</text>
				</view>
				<view class="ex" style="margin-top: 16rpx;">
					{{selectedObj?.desc}}
				</view>
				<view class="ex">
					{{selectedObj?.desc1}}
				</view>
				<image class="iconf" :src="`/static/gym/${selectedObj.icon}.png`"></image>
			</view>
			
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		ref,
		computed,
		nextTick,
		shallowRef,
		onMounted
	} from "vue"
	const props = defineProps({
		data: Object,
	})
	const selectedObj=ref({})
	const score = ((it) => props.data[current.value].id==4 ? "7 - 5":"2 - 0" )
	const HomeTeam = computed(() =>
		props.data[current.value].main[0].title
	)
	const resimg=computed(()=>{
		return
		
	})
	const AwayTeam = computed(() =>
		props.data[current.value].guest[0].title
	)
	const current = ref(0)
	const getCurrent = (item : any) => {
		current.value = item.index
		selectedObj.value={}
	}
	const haddleClick=(item,index,type)=>{
		selectedObj.value=item
	}
</script>

<style lang="scss" scoped>
	.selected{
		background-color: #ae8d45;
		color: white !important;
		.n1{
			color: white !important
		}
		.n2{
			color: white !important
		}
	}
	.iconf{
		width: 90rpx;
		height: 90rpx;
		position: absolute;
		right: 20rpx;
		top: 20rpx;
	}
	.table-box {
		height: 58rpx;
		background: $uni-bg-color ;
		padding: 28rpx 0 28rpx 30rpx;

	}

	.sb1 {
		position: relative;
		display: flex;
		align-items: center;
		margin: 20rpx 20rpx;

		.ss1::before {
			display: flex;
			align-items: center;
			background-color: #ae8d45;
			border-radius: 10rpx;
			content: "";
			height: 50rpx;
			left: 1rpx;
			position: absolute;
			top: 0;
			width: 6rpx;
		}

		.ss1 {
			margin-left: 16rpx;
			font-size: 36rpx;
			font-weight: bold;
		}

		.ss2 {
			margin-left: 10rpx;
			color: rgb(138, 138, 141);
			font-size: 26rpx;
		}
	}

	.card-box {
		position: relative;
		border-radius: 30rpx;
		padding: 40rpx 20rpx;
		display: flex;
		flex-direction: column;
		background-color: white;
	}

	.uv-collapse-content {
		width: 80%;
		display: flex;
		margin: auto;
		margin-bottom: 50rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.logo {
			width: 126rpx;
			height: 110rpx;
			background-size: cover;
			color: white;
			font-size: 24rpx;
			line-height: 140rpx;
			text-align: center;
		}

		.left {
			width: 40%;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
		}

		.right {
			width: 40%;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
		}

		.center {
			width: 20%;
			display: flex;
			height: 100%;
			position: relative;
			flex-direction: column;
			align-items: center;

			.score {
				
				font-size: 40rpx;
				font-weight: 600;
				color: $uni-default-back0Color;
			}

			.time {
				align-self: flex-start;
				margin: auto;
				font-size: 24rpx;
				color: rgb(194, 194, 194);
			}
		}

		.teamName {
			margin-top: 10rpx;
			font-size: 32rpx;
			text-align: center;
			color: $uni-default-back0Color;
			white-space: nowrap;
			/* 禁止换行 */
			overflow: hidden;
			/* 隐藏溢出内容 */
			text-overflow: ellipsis;
			/* 显示省略号 */
			width: 250rpx;
		}
	}

	.row {
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20rpx;

		.comm {
			background-size: cover;
			width: 27px;
			height: 27px;
			line-height: 22px;
			text-align: center;
			font-size: 24rpx;
			color: white;

		}

		.host {
			background-image: url("/static/gym/host.png");
		}

		.away {
			background-image: url("/static/gym/away.png");
		}

		.btns {
			display: flex;
			gap: 10rpx;

			.btn {
				// padding: 30rpx;
				width: 140rpx;
				height: 100rpx;
				font-size: 24rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border: 1px solid #ddd;
				border-radius: 10rpx;

				.n1 {
					color: rgb(138, 138, 141)
				}

			}

			.up {
				position: relative;
				color:#d42f21;
				font-weight: bold;
				&:after {
					background: url("/static/gym/up.gif") 50% no-repeat;
					background-size: 20rpx 20rpx;
					top: 50%;
					transform: translateY(-50%);
					content: "";
					height: 20rpx;
					position: absolute;
					width: 20rpx;
				}
			}

			.down {
				position: relative;
				color:#00a525;
				font-weight: bold;
				&:after {
					background: url("/static/gym/down.gif") 50% no-repeat;
					background-size: 20rpx 20rpx;
					top: 50%;
					transform: translateY(-50%);
					content: "";
					height: 20rpx;
					position: absolute;
					width: 20rpx;
				}
			}
		}
	}
	.ex{
		font-size: 24rpx;
		color:#8a8a8d;
	}
</style>