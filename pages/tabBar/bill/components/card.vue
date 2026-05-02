<template>
	<view class="card-box" @click="todetail">
		<view class="main">
			<view class="line">
				<view class="col1"><image :src="icon" style="width: 30rpx;height: 30rpx;"></image></view>
				<view class="col2 cgm">{{data.venue_name}}{{gameName}}</view>
				<view class="col3 zdnum">{{data.bet_count}}</view>
				<view class="col4">
					<view style="align-items: flex-end;" >
						<text  v-if="!data.is_settled">
							<text class="zdnum " :class="{red:data.net_amount>=0,
							green:data.net_amount<0
							}">{{data.net_amount>=0?"+":""}}{{data.net_amount}}</text><text class="cny">CNY</text>
						</text>
					
						<text class=" zdnum" style="color:#c7c7c7" v-else>未结算</text>
					</view>
				</view>
			</view>
			<view class="line">
				<view class="col1"></view>
				<view class="col2 tz">有效投注金额:<text>{{data.bet_amount}}</text></view>
				<view class="col3 tz">注单数</view>
				<view class="col4 tz">输赢</view>
			</view>
		</view>
		<view class="icon">
			<uv-icon class="marg last" name="arrow-right" color="#c7c7c7" size="18" ></uv-icon>
		</view>
	</view>
</template>

<script setup>
	import { copyText,toPtah,pagesRoute} from "@/utils/index"
	import { userStore } from "@/stores/user"
	import { startStore } from "@/stores/start"
	import {computed} from "vue"
	const props = defineProps({
		data: {
			bet_amount:Number,
			bet_count:Number,
			game_type: String,
			is_settled:Number,
			net_amount: Number,
			venue_code: String,
			venue_name: String,
      dayNum:Number
		}
	
	})
	const userDataStore = userStore();
	const gameTypeList = computed(() => startStore().gameTypeList)
	const allVenueList = computed(() => userStore().allVenueList)
	
	const getVenueName = (item ) => {
		const res = allVenueList.value.find(it => item.venue_code == it.venue_code)
		const resText = gameTypeList.value.find(it => item.game_type == it.venue_type)
		if (res?.game_type_img && res.game_type_img.length) {
			const ress = res.game_type_img.find(it => item.venue_code == it.venue_code)
			return ress?.venue_name + resText?.text
		} else {
			return ''
		}
	
	}
	const gameName = computed(()=> {
	  const res=  startStore().gameTypeList.find(it=>props.data.game_type == it.venue_type)
	  return res? res.table:''
	})
	const icon = computed(()=> {
	  const res=  startStore().gameTypeList.find(it=>props.data.game_type  == it.venue_type)
	  return res? res.icon:''
	})
	const todetail=()=>{
    startStore().setIsTrueBill({gameType:props.data.game_type,isSettled:props.data.is_settled?true:false})
    const res=props.data
    const titles=getVenueName(res).replace('体育体育', '体育')

    toPtah('/pages/tabBar/bill/details?venue_code='+res.venue_code+"&title="+titles+"&dayNum="+res.dayNum+"&gameType="+res.dayNum+"&game_type="+res.game_type)
	}
</script>

<style lang="scss" scoped>
	.card-box {
		border-radius: 40rpx;
		background-color: #fff;
		padding: 20rpx 32rpx;
		display: flex;
		align-items: center;
		.main {
			flex-grow: 1;
			.line{
				display: flex;
				view{
					display: flex;
					// justify-content: center;
					align-items: center;
				}
				.col1{
					width: 48rpx;
				}
				.col2{
					
					width: 200rpx;
				}
				.col3{
					width: 200rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.col4{
					flex-grow: 1;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.cgm{
					font-size: 30rpx;
					font-family: $uni-family-Medium;
					font-weight: 600;
				}
				.cny{
					font-family: $uni-family-Medium;
					font-size: 16rpx;
					line-height: 32rpx;
					margin-left: 6rpx;
				}
				.zdnum{
					font-size: 30rpx;
					font-family: $uni-family-Heavy;
					font-weight: 600;
				}
				.tz{
					font-family: $uni-family-Regular;
					font-size: 22rpx;
				}
				.red{
					color:#c50404
				}
				.green{
					color:#0b9714
				}
			}
		}

	}
</style>