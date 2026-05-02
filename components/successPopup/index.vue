<template>
	<uv-popup ref="successPop" :customStyle="customStyle2">
		<view class="top">
			<text>{{ props.title }}</text>
			<uv-icon class="close" name="close" size="28" bold color="#ddd" @click="close"></uv-icon>
		</view>
		<view class="bottom">
			<view class="number">+{{props.number}}</view>
			<view class="btn" @click="close"></view>
		</view>
	</uv-popup>
</template>

<script setup lang="ts">
	import {
		shallowRef,ref
	} from 'vue'
	const customStyle2 = {
		width: '634rpx',
		height: '637rpx',
		backgroundColor: "transparent",
		backgroundImage: "url('/static/my/checkIn/cgbg.png')",
		backgroundSize: 'cover',
		// padding:'30rpx 40rpx'
	}
	// const props = defineProps({
	// 	 number: String
	// })
  const props = withDefaults(
      defineProps<{
        number : string,
        title : string
      }>(),
      {
        number: '',
        title:'恭喜您获得彩金'
      }
  )
	const successPop = shallowRef()
	const close = () => {
		successPop.value.close()
	}
	const open = () => {
		successPop.value.open()
	}
	defineExpose({
		open,
		close,
	})
</script>

<style lang="scss" scoped>
	.top {
		margin-top: 30rpx;
		display: flex;
		justify-content: center;
		
		text {
			color: #1c1c1c;
			font-size: 40rpx;
			font-family: $uni-family-Medium;
		}

		.close {
			position: absolute;
			right: 30rpx;
		}
	}
	.bottom{
		display: flex;
		margin-top: 41%;
		justify-content: center;
		flex-direction: column;
		height: 300rpx;
		.number{
			font-size: 70rpx;
			color:#fd8100;
			text-align: center;
			font-family: $uni-family-Heavy;
			font-weight: bold;
		}
		.btn{
			width:100%;
			height: 160rpx;
			background-image:url('/static/my/checkIn/lqcg.png') ;
			background-size: cover;
		}
	}
</style>