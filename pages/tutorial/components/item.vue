<template>
	<view class="box u-flex u-flex-y-center">
		<image v-if="props.data.image" :src="baseUrl+props.data.image" style="width: 72rpx;height: 72rpx;"></image>
		<view :style="{ fontSize: props.data.fontSize,marginLeft:props.data.image?'30rpx':'6rpx' }">{{props.data.name}}
		</view>
		<uv-icon name="arrow-right" size="20" style="padding: 20rpx;position:absolute;right: 0;"></uv-icon>
	</view>
</template>

<script lang="ts" setup>
	import { computed, ref, shallowRef } from "vue";
	import environment from '@/utils/environments.ts'

	const baseUrl = environment.envConfigs.url

	const props = defineProps<{
		data : {
			name : String,
			link : String,
			image : String,
			fontSize ?: any
		},
	}>()
</script>

<style lang="scss" scoped>
	.box {
		font-family: $uni-family-Medium;
		font-size: 34rpx;

		background-color: #fff;
		margin-top: 10rpx;
		padding: 24rpx 30rpx;

		.title {
			margin-left: 30rpx;
			color: #1c1c1c;
		}
	}
</style>