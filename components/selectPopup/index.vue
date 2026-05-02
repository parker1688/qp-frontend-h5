<template>
	<div>
		<uv-overlay :show="show">
			<view class="menu-top u-flex-column u-flex-items-center">
				<view class="top"></view>
				<view class="day-box u-flex-grow">
					<view class="u-flex-center-between">
						<view class="close" @click="close">取消</view>
						<view>{{ parent.title }}</view>
						<view></view>
					</view>
					<scroll-view scroll-y="true" class="dayList-box" style="height:840rpx">
						<view>
							<view class="list-item u-flex-center-start" v-for="(it,index) in list" :key="index" @click="getIndex(it,index)"
               :style="parent.type === withdrawEnum.CARD?'':'background:url('+baseImgUrl+it.img+');background-size: cover;'"
              >
								<image :src="baseImgUrl+ it?.icon"></image>
								<view class="u-flex-grow">
									<view class="name">{{ it.bank_name || it.payment_name }}</view>
								</view>
								<view class="xz-box u-flex-xy-center">
									<view v-if="listNum ==index"></view>
								</view>
							</view>
						</view>
					</scroll-view>
<!--					<view class="but u-flex-xy-center">确定</view>-->
				</view>
			</view>
		</uv-overlay>
	</div>
</template>

<script lang="ts" setup>
	//1:微信 2:银行卡 3:支付宝 4:钱包 5:数字人民币 6:数字货币
	import { withdrawEnum } from '@/enums/savingsEnums'
	import { computed, ref, shallowRef } from "vue";
  import environment from '@/utils/environments.ts'
  const baseImgUrl = environment.envConfigs.imgUrl
	const parent = withDefaults(
		defineProps<{
			title : String,
			type : Number,
		}>(),
		{
			title: '选择类型',
			type: 0
		}
	)
	const show = ref(false)

	const emit = defineEmits(['getData'])
	const listNum = ref(-1)
  const list=ref([])
	const itemValue = ref({})
	const getIndex = (it : any, index : number) => {
		itemValue.value = it
    listNum.value=index
    dayOkBut()

	}
	const open = (item:Array,index : number = -1) => {
		show.value = true
    list.value=item
    listNum.value=index
	}

	const dayOkBut = () => {
		emit('getData', itemValue.value)
		show.value = false
	}

	const close = () => {
		show.value = false
	}
	defineExpose({
		open,
		close
	})
</script>

<style lang="scss" scoped>
	.menu-top {
		width: 100vw;
		font-size: 26rpx;
		height: 1000rpx;
		z-index: 6666;
		position: fixed;
		left: 0;
		bottom: 0;

		.top {
			width: 100rpx;
			height: 16rpx;
			background-color: #ffffff;
			border-radius: 7rpx;
			margin-bottom: 20rpx;
		}

		.day-box {
			background: $uni-bg-color-grey;
			width: 100vw;
			border-radius: 30rpx 30rpx 0 0 !important;
			overflow: hidden;

			>view:first-child {
				border-bottom: 2rpx solid $uni-border-color;
				font-size: 34rpx;
				height: 110rpx;
				padding: 0 25rpx;
				background: white;
				font-weight: 600;

				.close {
					font-size: 24rpx;
					font-weight: 500;
					color: $uni-default-backColor;
				}
			}
		}

		.dayList-box {
			background-color: $uni-bg-color-grey;
		}

		.list-item {
			font-family: $uni-family-Medium;
			color: #000000;
			overflow: hidden;
      border: 2rpx solid $uni-border-color;
      border-radius: 20rpx;
			image {
				width: 68rpx;
				height: 68rpx;
				margin: 26rpx;
			}

			.name {
				font-size: 30rpx;
			}

			.zh {
				font-size: 22rpx;
			}
		}

		.xz-box {
			width: 42rpx;
			height: 42rpx;
      border:4rpx solid  $uni-border-color;
			border-radius: 50%;
			margin-right: 20rpx;
			overflow: hidden;

			view {
				width: 18rpx;
				height: 18rpx;
				background-color: $uni-default-color;
				border-radius: 50%;
			}
		}

		.but {
			width: 688rpx;
			height: 96rpx;
			background-color: $uni-default-color;
			border-radius: 48rpx;
			font-family: $uni-family-Medium;
			font-size: 34rpx;
			color: #ffffff;
			margin: 20rpx auto;
		}
	}
</style>