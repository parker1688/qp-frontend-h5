<template>
	<uv-collapse :border="false" style="background-color: white;border-radius: 10rpx;padding: 10rpx 0;">
		<uv-collapse-item :title="props.data.CompetitionName" name="Docs guide" icon="/static/gym/logo.webp">
			<template #title>
				<view style="color: red;">{{props.data.CompetitionName}}</view>
			</template>
			<view class="uv-collapse-content" v-for="it,index in props.data.Events">
				<view class="left">
					<image class="logo" src="/static/gym/logo.webp" />
					<view class="teamName">{{it.HomeTeam}}</view>
				</view>
				<view class="center">
					<view class="time">{{formatDate(it.EventDate,"M-D h:m")}}</view>
					<view class="score">{{score(it)}}</view>

				</view>
				<view class="right">
					<image class="logo" src="/static/gym/logo.webp" />
					<view class="teamName">{{it.AwayTeam}}</view>
				</view>
			</view>
		</uv-collapse-item>

	</uv-collapse>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed,
	} from "vue"
	import {
		formatDate
	} from '@/utils/time'

	const props = defineProps({
		data: {}
	})
	const score = ((it) => {
		if (it.ResultList[0].HomeScore && it.ResultList[0].AwayScore) {
			return it.ResultList[0].HomeScore + " - " + it.ResultList[0].AwayScore
		} else {
			return "-"
		}

	})
	const collapseRef = ref()
</script>

<style scoped lang="scss">
	.uv-collapse-content {
		display: flex;
		margin-bottom: 50rpx;

		// background-color: $uni-bg-color-grey;
		&:last-child {
			margin-bottom: 0;
		}

		.logo {
			width: 100rpx;
			height: 100rpx;
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
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				font-size: 40rpx;
				font-weight: 600;
				color: $uni-default-back0Color;
			}

			.time {
				align-self: flex-start;

			}
		}

		.teamName {
			margin-top: 10rpx;
			font-size: 28rpx;
			text-align: center;
			font-weight: 600;
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
</style>