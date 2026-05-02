<template>
	<div>
		<uv-overlay :show="show" @click="close">
			<view class="menu-top u-flex-column u-flex-items-center">
				<view class="top"></view>
				<view class="day-box u-flex-grow">
					<view class="u-flex-center-between">
						<view class="close" v-if="list.length<5" @click="pathBut">管理</view>
            <view class="close" v-else ></view>
						<view>选择{{ title }}</view>
            <view class="close" @click="close">
              <uv-icon size="20" @click="close"  color="#999" name="close"></uv-icon>
            </view>
					</view>
					<scroll-view scroll-y="true" class="dayList-box" style="width: 690rpx;height:680rpx;margin-top: 20rpx">
						<view v-if="channeEnum.AliPayCode === type">
							<view class="list-item1 u-flex-center-start" v-for="(it,index) in list" :key="index" @click.stop="getIndex(it,index)" :style="'background:url('+baseUrl+it.img+');background-size:cover'">
                <image :src="baseUrl+ it?.icon"></image>
								<view class="u-flex-grow">
									<view class="name">{{ strLenght(it.account_holder) }}</view>
									<view class="zh">{{ strLenght(it.account_number,2) }}</view>
								</view>
								<view class="xz-box u-flex-xy-center">
                  <view v-if="listNum ==index"></view>
								</view>
							</view>
						</view>
						<view v-else-if="channeEnum.VirtualCode === type">
							<view class="list-item2 u-flex-center-start"  v-for="(it,index) in list" :key="index" @click.stop="getIndex(it,index)" :style="'background:url('+baseUrl+it.img+');background-size: cover'">
                <image :src="baseUrl+ it?.icon"></image>
								<view class="u-flex-grow">
									<view class="name">{{ it.blockchain }}</view>
									<view class="name1">{{ strLenght(it.real_name) }}</view>
									<view class="zh">●●●● ●●●● ●●●● {{strLenght(it.blockchain_address,4,0)}}</view>
								</view>
								<view class="xz-box u-flex-xy-center">
                  <view v-if="listNum ==index"></view>
								</view>
							</view>
						</view>
						<view v-else-if="channeEnum.BankCode === type">
							<view class="list-item u-flex-center-start" v-for="(it,index) in list" :key="index" @click.stop="getIndex(it,index)" :style="'background:url('+baseUrl+it.img+');background-size: cover'">
                <image :src="baseUrl+ it?.icon"></image>
								<view class="u-flex-grow">
									<view class="name">{{ it.account_bank_type }}</view>
									<view class="zh">●●●● ●●●● ●●●●  {{strLenght(it.account_number,4,0)}}</view>
								</view>
								<view class="xz-box u-flex-xy-center">
									<view v-if="listNum ==index"></view>
								</view>
							</view>
						</view>
					</scroll-view>
					<view class="but u-flex-xy-center" @click="dayOkBut">确定</view>
				</view>
			</view>
		</uv-overlay>
	</div>
</template>

<script lang="ts" setup>
	//1:微信 2:银行卡 3:支付宝 4:钱包 5:数字人民币 6:数字货币
	import { channeEnum } from '@/enums/savingsEnums'
	import { computed, ref, shallowRef } from "vue";
  import environment from '@/utils/environments.ts'
  const baseUrl = environment.envConfigs.imgUrl
  import { toPtah} from "@/utils/index"
	const show = ref(false)
  const type=ref(null)
  const title=ref('')
  const path =ref('')
	const emit = defineEmits(['getSelectData'])
	const listNum = ref(-1)
  const list=ref([])
	const itemValue = ref({})
	const getIndex = (it : any, index : number) => {
		itemValue.value = it
    listNum.value=index
	}
  const strLenght=(str:any,num:number = 1,type:number=1)=>{
    return type===1?(str.slice(0,num) + '****' +str.slice(0 - num)) :  str.slice(0 - num)
  }
	const open = (item:object) => {
    type.value=item.menuData.channel_code
    path.value=item.menuData.path
    title.value=item.menuData.text
		show.value = true
    list.value=item.selectList
    listNum.value=item.selectList.findIndex(it=> it.id === item.selectId)
	}

	const dayOkBut = () => {
		emit('getSelectData', itemValue.value)
    close()
	}

	const pathBut =()=>{
    toPtah(path.value)
    close()
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
				border-bottom: 2rpx solid #666666;
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
			padding: 0 30rpx;
			background-color: $uni-bg-color-grey;
		}

		.list-item2 {
			font-family: $uni-family-Medium;
			color: #ffffff;
			//background: url("/static/tx/zfb-bg.png");
			//background-size: 100% 100%;
			width:calc(100vw - 60rpx);
			height: 170rpx;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			overflow: hidden;

			image {
				width: 68rpx;
				height: 68rpx;
				margin: 0 26rpx 26rpx 26rpx;
			}

			.name {
				font-size: 32rpx;
			}

			.name1 {
				font-size: 20rpx;
				margin-top: 8rpx;
				margin-bottom: 22rpx;
			}

			.zh {
				font-size: 22rpx;
			}
		}

		.list-item1 {
			font-family: $uni-family-Medium;
			color: #ffffff;
			background: url("/static/tx/zfb-bg.png");
			background-size: 100% 100%;
			width: calc(100vw - 60rpx);
			height: 138rpx;
			border-radius: 20rpx;
			margin-bottom: 30rpx;

			image {
				width: 66rpx;
				height: 61rpx;
				margin: 26rpx;
			}

			.name {
				font-size: 30rpx;
				margin-bottom: 16rpx;
			}

			.zh {
				font-size: 36rpx;
			}
		}

		.list-item {
			font-family: $uni-family-Medium;
			color: #ffffff;
			background: url("/static/tx/zfb-bg.png");
			background-size: 100% 100%;
			width: calc(100vw - 60rpx);
			height: 138rpx;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			overflow: hidden;

			image {
				width: 68rpx;
				height: 68rpx;
				margin: 26rpx;
			}

			.name {
				font-size: 30rpx;
				margin-bottom: 20rpx;
			}

			.zh {
				font-size: 22rpx;
			}
		}

		.xz-box {
			width: 42rpx;
			height: 42rpx;
			background-color: #ffffff;
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
			width: calc(100vw - 62rpx);
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