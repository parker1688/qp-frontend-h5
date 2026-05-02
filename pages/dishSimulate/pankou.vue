<template>
	<view class="u-flex-shrink0 table-box">
		<uv-tabs :current="current" :list=" props.lists " lineWidth="0" :activeStyle="{
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
		<uv-parse style="padding: 20rpx;" :preview-img="false" :content=" props?.data?.children[current].content"></uv-parse>
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
	const props=defineProps({
		data:Object,
		lists:Array  
	})
	const current = ref(0)
	const getCurrent = (item : any) => {
		current.value = item.index
	props.data
	
	}
	
</script>

<style lang="scss" scoped>
	.table-box {
		height: 58rpx;
			background: $uni-bg-color ;
		padding: 28rpx 0 28rpx 30rpx;
	
	}
</style>