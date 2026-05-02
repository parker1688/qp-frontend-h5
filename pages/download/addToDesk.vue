<template>
	<view>
		<uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute" leftIconColor="#fff"
			:titleStyle="{color:'#fff'}" title="添加到主屏幕">
			<template v-slot:left>
				<view class="uv-nav-slot">
					<uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
				</view>
			</template>

		</uv-navbar>
		<scroll-view class="box" scroll-y="true" :style="`height:calc(${homeHeight - 44}px)`">
			<view style=""></view>
			<view class="item" v-for="item in list">
				<text class="title">{{item.text}}</text>
				<image style="width: 668rpx;height: 668rpx;margin-top: 28rpx;" :src="item.src"></image>
			</view>
		</scroll-view>

	</view>
</template>

<script setup>
	import {
		reactive,
		computed
	} from "vue";
	import {
		pagesRoute
	} from "@/utils/index"
	const homeHeight = computed(() => {
		return uni.getSystemInfoSync().windowHeight
	})
	const list = reactive([{
		text: `1、点击"safari浏览器"进入网站`,
		src: "/static/home/left/1.png"
	},{
		text: `2、点击底部`,
		src: "/static/home/left/2.png"
	},{
		text: `3、在弹窗里点击"添加到主屏幕"`,
		src: "/static/home/left/3.png"
	},{
		text: `4、点击"添加"`,
		src: "/static/home/left/4.png"
	},{
		text: `5、恭喜您安装成功!`,
		src: "/static/home/left/5.png"
	}])
</script>

<style lang="scss">
	.box {
		border-top-left-radius:  30rpx;
		border-top-right-radius:  30rpx;
		background-color: $uni-bg-color;
		.item{
			padding: 42rpx;
			display: flex;
			flex-direction: column;
			.title{
				font-weight: bold;
				font-size: 30rpx;
				color: #1c1c1c;
				font-family: $uni-family-Medium;
			}
		}
	}
</style>