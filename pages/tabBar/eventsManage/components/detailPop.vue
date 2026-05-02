<template>
	<uv-popup ref="detailPop" :customStyle="customStyle2">
		<view class="top u-flex-y-center ">
			<text>任务详情</text>
			<image class="close" src="/static/home/down/close.png" @click="close"></image>
			<!-- <uv-icon class="close" name="close" size="28" bold color="#ddd" @click="close"></uv-icon> -->
		</view>
		<view class="bottom">
      <uv-parse :content="detail.detail"></uv-parse>
		</view>
	</uv-popup>
</template>

<script setup lang="ts">
	import {computed, shallowRef, ref} from 'vue'
	const customStyle2 = {
		width: '596rpx',
		height: '660rpx',
		borderRadius: "30rpx",
		// backgroundImage: "url('/static/my/checkIn/cgbg.png')",
		backgroundSize: 'cover',
		// padding:'30rpx 40rpx'
	}
  const detail=ref('')
	const detailPop = shallowRef()
	const close = () => {
		detailPop.value.close()
	}
	const open = (it:any) => {
    detail.value=it
		detailPop.value.open()
	}
	defineExpose({
		open,
		close,
	})
</script>

<style lang="scss" scoped>
	.top {
		padding: 0 40rpx;
		height: 100rpx;
		background-color: #b58b35;
		font-size: 38rpx;
		font-family: $uni-family-Heavy;
		font-weight: 600;
		color: $uni-bg-color;

		.close {
			margin-left: auto;
			width: 40rpx;
			height: 40rpx;
		}
	}

	.bottom {
		padding: 40rpx;
		height:470rpx;
		overflow: auto;
		.item {
			margin-bottom: 30rpx;

			.title {
				font-size: 28rpx;
				color: #1c1c1c;
				font-family: $uni-family-Bold;
				font-weight: 600;
			}

			.desc {
				font-family: $uni-family-Regular;
				font-size: 26rpx;
				color: #707070;
			}
		}
	}
</style>