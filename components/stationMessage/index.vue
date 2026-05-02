<template>
	<view>
		<uv-popup ref="loginPopup" mode="center" :closeOnClickOverlay="false" :customStyle="customStyle">
			<view class="top">
				<image class="close" src="/static/home/down/close.png" @click="close"></image>
			</view>
			<view class="content">
				<view class="space"></view>
				<view class="title">{{data?.title}}</view>
				<view class="des">{{data?.content}}</view>
			</view>
			<view class="bottom">
				<view class="time">{{data?.create_time}}</view>
			</view>
		</uv-popup>
	</view>
</template>

<script lang="ts" setup>
	import { toPtah } from "@/utils/index"
	import { computed, reactive, ref, shallowRef, watch } from "vue";
	import { onLoad, onShow } from "@dcloudio/uni-app";
	import { readMessage } from "@/api/user"
	const loginPopup = shallowRef()
  const emit = defineEmits(['close']) // 声明事件
	const customStyle = {
		width: '582rpx',
		height: '726rpx',
		backgroundColor: "transparent",
		backgroundImage: "url('/static/home/znx.png')",
		backgroundSize: 'cover'
	}
	const data=ref(null)
	const close = async () => {
    	loginPopup.value.close()
	   await readMessage({ id: data.value.id })
     emit('close')
  }
	const logbut = () => {
		loginPopup.value.close()
		toPtah('/pages/login/index')
	}
	const open=(it:any)=>{
    data.value=it.data
    loginPopup.value.open()
  }
	defineExpose({
		open,
		close
	})
</script>

<style lang="scss" scoped>
	.top {
		height: 14%;

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
		height: 78%;

		padding: 0rpx 36rpx 0rpx 42rpx;

		.space {
			height: 60rpx;
		}

		.title {
			font-size: 36rpx;
			font-family: $uni-family-Bold;
			font-weight: bold;
		}

		.des {
			margin-top: 18rpx;
			font-size: 24rpx;
			line-height: 36rpx;
			font-family: $uni-family-Medium;
			height: calc(100% - 60rpx - 27px - 18rpx);
			overflow: auto;
		}
	}

	.bottom {
		padding: 0rpx 36rpx 0rpx 42rpx;
		height: 6%;

		.time {
			float: right;
			font-family: $uni-family-Regular;
			font-size: 24rpx;
			color: #707070;
		}
	}
</style>