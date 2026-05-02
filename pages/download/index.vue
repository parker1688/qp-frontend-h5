<template>
	<view class="container-box">
		<uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute" leftIconColor="#fff"
			:titleStyle="{color:'#fff'}" title="下载客户端">
			<template v-slot:left>
				<view class="uv-nav-slot">
					<uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
				</view>
			</template>

		</uv-navbar>
		<view class="box">
			<view class="content" v-for="item in list">
				<view class="first" style="width: 162rpx;height: 162rpx;">
					<image :src='baseImgUrl + merchantData.logo_img' style="width: 100%;height: 100%;"></image>

				</view>
				<view class="u-flex-column mid">
					<view class="title">{{item.title}}</view>
					<view class="text">{{item.text}}</view>
				</view>
				<view class="right" @click="toPtah(item.link,item.type)">
					{{item.rightText}} >
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		pagesRoute
	} from "@/utils/index"
	import {
		toPtah,
	} from "@/utils/index"

	import {
		userStore
	} from "@/stores/user"
	import {
		reactive,
		computed
	} from "vue";
  import environment from '@/utils/environments.ts'
  const baseUrl = environment.envConfigs.url
  const baseImgUrl = environment.envConfigs.imgUrl
	const userDataStore = userStore();
	const merchantData =computed(()=> userStore().merchantData)
	const list = reactive([{
			
			title: "标准版/IOS急速版",
			text: "全站原生APP、急速体验、更流畅更稳定、游戏应有尽有...",
			rightText: "去下载",
			link: merchantData.value?.short_link,
			type:4
		},
		{
			
			title: "保存到桌面",
			text: "一键保存应用到桌面，快速游戏、永久下载入口...",
			rightText: "去保存",
			link: "/pages/download/addToDesk",
			type:1
		}

	])
</script>

<style lang="scss" scoped>
	.box {
		border-radius: 30rpx;
		background-color: $uni-bg-color;
		padding: 0 42rpx;
		height: 100vh;

		.content {
			display: flex;
			flex: 1 1 auto;
			align-items: center;
			padding: 42rpx 0;
			border-bottom: 2rpx solid #ddd;

			.first {
				width: 162rpx;
				height: 162rpx;
				flex-shrink: 0;
			}

			.mid {
				margin-left: 20rpx;
				margin-right: 60rpx;

				.title {
					font-size: 28rpx;
					font-family: $uni-family-Bold;
					color: #1c1c1c;
					font-weight: bold;
				}

				.text {
					margin-top: 10rpx;
					font-size: 24rpx;
					color: #707070;
					font-family: $uni-family-Medium;
				}
			}

			.right {
				margin-left: auto;
				font-size: 28rpx;
				color: #1c1c1c;
				display: flex;
				justify-content: center;
				align-items: center;
				font-family: $uni-family-Medium;
				white-space: nowrap;
			}

		}
	}
</style>