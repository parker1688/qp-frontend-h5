<template>

	<uv-popup ref="successPop" mode="right" :customStyle="customStyle2">
		<view class="top">
			<view class="uv-nav-slot">
				<uv-icon name="/static/tx/fh.png" size="20" @click="close"></uv-icon>
			</view>
			<text class="title">{{ props.title }}</text>
			<view class="uv-nav-slot"></view>
		</view>
		<view class="content">
			<scroll-view scroll-y="true" style="height: calc(100% - 68px);">
				<view class="card-box">
					<view style="margin-left: 20rpx;">
						
							<uv-index-list  customNavHeight="100rpx">
								<uv-checkbox-group v-model="checkboxValue" iconPlacement="left" placement="column">
									<template v-slot:header>
										<view style="height: 100rpx;width: 750rpx;background-color: #3c9cff;">头部内容</view>
									</template>
									<template v-for="(item, index) in lists">
										
										<view class="row">
											<uv-checkbox style="margin-top: 20rpx;" :name="item.CompetitionId" :label="item.CompetitionName" :activeColor="actcolor"></uv-checkbox>
											
										</view>
									</template>
									</uv-checkbox-group>
									
								</uv-index-list>
								
					<!-- 	<uv-checkbox-group v-model="checkboxValue" iconPlacement="left" placement="column">
							<uv-checkbox style="margin-top: 20rpx;" v-for="it in lists" :name="it.CompetitionId" :label="it.CompetitionName" :activeColor="actcolor"></uv-checkbox>
						</uv-checkbox-group> -->
					</view>
				</view>
			</scroll-view>
			<view class="bottom">
				<view class="left">
					<view class="u-flex-y-center"><uv-checkbox name="apple" label="全选" labelSize="16" label-color="#000" :activeColor="actcolor"></uv-checkbox></view>
					<view class="fanxuan" >反选</view>
				</view>
				<view class="right">
					<text class="selected">已选择<text class="num">{{num}}</text>个联赛</text>
					<view class="confirm"> 确定</view>
				</view>
			</view>

		</view>

	</uv-popup>
</template>

<script setup lang="ts">
	import {
		shallowRef, ref, computed
	} from 'vue'
	const customStyle2 = {
		width: '750rpx',
		height: '100%',
		backgroundColor: "rgb(0, 0, 0)",
		// backgroundImage: "url('/static/my/checkIn/cgbg.png')",
		// backgroundSize: 'cover',
		// padding:'30rpx 40rpx'
	}
	// const props = defineProps({
	// 	 number: String
	// })
	const actcolor="#ae8d45"
	const selected=ref([])
	const num = computed(()=>{
		return checkboxValue.value.length
	})
	const props = withDefaults(
		defineProps<{
			lists : any,
			title : string
		}>(),
		{
			lists: [],
			title: 'IM赛事筛选'
		}
	)
	const checkboxValue = ref([])
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
		// margin-top: 30rpx;
		height: 44px;
		display: flex;
		justify-content: center;
		color: white;
		align-items: center;

		.uv-nav-slot {
			width: 46px;
			display: flex;
			justify-content: center;
			margin-left: 0;
		}

		text {
			margin-left: auto;
			/* 挤到右侧 */
			margin-right: auto;
			/* 再居中 */
			color: white;
			font-size: 32rpx;
			font-family: $uni-family-Medium;
		}

		.close {
			position: absolute;
			right: 30rpx;
			
		}
	}

	.card-box {
		background-color: white;
		padding: 40rpx 0;
	}

	.content {
		background-color: #f7f7f7;
		height: calc(100% - 44px);
		padding-top: 10rpx;
		display: flex;
		// margin-top: 41%;
		// justify-content: center;
		flex-direction: column;
		.row{
			height: 70rpx;
		}
		// height: 300rpx;
		.number {
			font-size: 70rpx;
			color: #fd8100;
			text-align: center;
			font-family: $uni-family-Heavy;
			font-weight: bold;
		}

		.btn {
			width: 100%;
			height: 160rpx;
			background-image: url('/static/my/checkIn/lqcg.png');
			background-size: cover;
		}

		.bottom {
			height: 68px;
			position: fixed;
			bottom: 0;
			align-items: flex-start;
			background-color: white;
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;
			bottom: 0;
			box-shadow: 0 -1px 6px 0 #00000029;
			box-sizing: border-box;
			display: flex;
			left: 0;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;
			width: 100%;
			z-index: 101;

			.left {
				display: flex;
				.fanxuan{
					margin-left: 20rpx;
				}
			}

			.right {
				display: flex;
				align-items: center;
				color:rgb(138, 138, 141);
				.selected{
					margin-right: 20rpx;
				}
				.num{
					color:#000;
					margin: 0 8rpx;
					font-weight: 600;
				}
				.confirm{
					    background-color: rgb(174, 141, 69);
					    border-radius: 12rpx;
					    color: white;
					    flex-shrink: 0;
					    font-size: 28rpx;
					    height: 68rpx;
					    line-height: 68rpx;
					    min-width: 100rpx;
					    padding: 0 26rpx;
					    text-align: center;
				}
			}
		}
	}
</style>