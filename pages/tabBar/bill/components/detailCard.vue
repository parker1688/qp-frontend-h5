<template>
	<view class="detail-box">
		<view class="top">
			<view class="t1"> <text>{{getVenueName(data)}}</text><text class="t4">{{data.bet_time}}</text></view>
			<view class="t2"> {{data.game_name}}</view>
		</view>
		<view class="bottom">
			<view style="flex-grow: 1;">
				<view class="t3">投注额：{{data.bet_amount}}CNY</view>
				<view class="t4">币种：<text>CNY</text></view>
				<view class="t4 flex">单号：<text>{{data.order_sn}}</text> <image src="/static/kf/fz.png" style="width: 32rpx; height: 32rpx;" @click="copyTextBut(data.order_sn)"></image></view>
			</view>
			<view v-if="!isTrue" class="jine" :class="{red:data.net_amount>=0,
			green:data.net_amount<0
			}">
				{{data.net_amount>=0?"+":"" }}{{data.net_amount}}
			</view>
		</view>
		<image class="icon" :src="resultImage"></image>
	</view>
</template>

<script setup>
	import { copyText,pagesRoute} from "@/utils/index"
	import{computed} from 'vue'
	import { userStore } from "@/stores/user"
	import { startStore } from "@/stores/start"
	const gameTypeList = computed(() => startStore().gameTypeList)
	const isTrue=computed(()=>startStore().isTrueBill)
	
	const allVenueList = computed(() => userStore().allVenueList)
	const getVenueName = (item ) => {
		const res = allVenueList.value.find(it => item.venue_code == it.venue_code)
		const resText = gameTypeList.value.find(it => item.game_type == it.venue_type)
		if (res?.game_type_img && res.game_type_img.length) {
			const ress = res.game_type_img.find(it => item.venue_code == it.venue_code)
			const titles =ress?.venue_name + resText?.text
      return titles.replace('体育体育', '体育')
		} else {
			return ''
		}
	
	}
	const props = defineProps({
		data: {
			game_name:String,
			game_type: String,
			net_amount: Number,  //结算金额
			bet_amount:String,  //投注金额
			venue_code: String,
			venue_name: String,
		}
	
	})
	const strLenght = (str) => {
		return str.length > 10 ? str.slice(0, 2) + '***' + str.slice(-2) : str
	}
	const resultImage = computed(() => 
	isTrue.value?"/static/zhudan/wjs.png":
	  props.data.net_amount >= 0 
	    ? '/static/zhudan/win.png'
	    : '/static/zhudan/lose.png'
	);
	const copyTextBut=(text)=>{
		copyText(text)
	}
</script>

<style lang="scss" scoped>
	.detail-box{
		display: flex;
		flex-direction: column;
		position: relative;
		.icon{
			position: absolute;
			right: 0;
			width: 100rpx;
			height: 100rpx;
			top:50%;
			transform:translate(0,-62rpx) ;
		}
		.top{
			border-radius: 20rpx;
			padding: 22rpx 30rpx 16rpx 30rpx;
			background-color: #fff;
			border-bottom: 2rpx dashed #ddd;
			display: flex;
			flex-direction: column;
			.t1{
				font-size: 22rpx;
				font-family: $uni-family-Regular;
				display: flex;
				justify-content: space-between;
			}
			.t2{
				margin: 6rpx 0;
				font-size: 30rpx;
				font-family: $uni-family-Medium;
			}
		}
		.bottom{
			height: 100rpx;
			padding: 20rpx 30rpx;
			border-radius: 20rpx;
			background-color: #fff;
			display: flex;
			.t3{
				font-size: 24rpx;
				font-family: $uni-family-Medium;
				
			}
			
			.flex{
				display: flex;
				align-items: center;
			}
			.jine{
				font-size: 30rpx;
				width: 150rpx;
				font-weight: 600;
				display: flex;
				align-items: center;
			}
			.red{
				color:#d80000
			}
			.green{
				color:#009a00
			}
		}
	}
	.t4{
		font-size: 22rpx;
		font-family: $uni-family-Regular;
		color:#6e6e6e !important;
		margin-top: 4rpx;
	}
</style>