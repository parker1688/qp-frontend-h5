<template>
	<view class="activity-box u-flex-column" :style="`height:calc(${homeHeight - 44}px)`">
		<view class="u-flex-shrink0 table-box">
			<uv-tabs :current="current" :list="data.children" lineWidth="0" :activeStyle="{
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
    <!--        #ifdef H5 -->
		<scroll-view scroll-y="true" :style="`height:calc(${homeHeight - 44}px - 108rpx)`" style="padding-top: 10rpx;" :enable-flex="true">
    <!--  #endif-->
    <!--        #ifdef APP-PLUS || MP-WEIXIN-->
   <scroll-view scroll-y="true" :style="`height:calc(100vh -  ${botHeight} - 108rpx)`" style="padding-top: 10rpx;" :enable-flex="true">
    <!--  #endif-->
        <view v-if="data.children[current].children.length>0" v-for="(item ,index) in data.children[current].children" :key="index"
				@click.stop="goDetails(item)">
				<Item  :data="item" />
			</view>
			<view v-else class="tx-box">
				<uv-parse  :preview-img="false" :content="data.children[current].content"></uv-parse> 
			</view>
		</scroll-view>

	</view>
</template>

<script lang="ts" setup>
	import { computed, ref, reactive, onMounted } from "vue";
	import { toPtah,formatFlexibleHierarchy } from "@/utils/index"
	import { onLoad, onShow, onReady } from "@dcloudio/uni-app";
	import Item from "./components/item.vue"
	import { getNavConfig } from "@/api/user";
	import { userStore } from "@/stores/user"
	const userDataStore = userStore();
	
	const data = ref()

	onMounted(() => {
		init()
	})
	const init = async () => {
		const res = await getNavConfig(0)
		 const d:any = formatFlexibleHierarchy(res.data)
		data.value = d.find((i:any)=>i.key=="guide")
		
	}
	const formatData = (param :any) => {
		return param.map((i:any) => {
			let j = JSON.parse(i.data)
			return {
				id: i.id,
				key: i.key,
				name: i.name,
				...j
			}
		})

	}
	const current = ref(0)
	
	

	const formData = reactive({
		promotion_type: 0
	})
	const goDetails = (item:any) => {
		userDataStore.setNavDetail(item)
		toPtah(`/pages/tutorial/details`)
	}




	const getCurrent = (item : any) => {
		current.value = item.index
	}
	const homeHeight = computed(() => {
		return uni.getSystemInfoSync().windowHeight
	})
  const botHeight = computed(() => {
    return (uni.getSystemInfoSync().statusBarHeight + 44)+'px'
  })

	onLoad(async () => {

	})
</script>

<style lang="scss" scoped>
	.activity-box {
		background: $uni-bg-color-grey ;
		border-radius: 30rpx 30rpx 0 0;
		overflow: hidden;

		.table-box {
			height: 58rpx;
			background: $uni-bg-color ;
			padding: 28rpx 0 28rpx 30rpx;

		}

		.list-box {
			margin: 20rpx 30rpx 0 30rpx;
			width: 690rpx;
			background: $uni-bg-color ;
			min-height: 324rpx;
			border-radius: 8rpx;

			.box-item {
				.title {
					margin-top: 25rpx;
					margin-left: 25rpx;
					font-size: 28rpx;
					font-weight: 600;
					font-family: $uni-family-Bold;
				}

				.text {
					margin-left: 25rpx;
					margin-top: 20rpx;
					margin-bottom: 25rpx;
					color: $uni-default-back6Color;
					font-family: $uni-family-Regular;
					font-size: 24rpx;
				}
			}
		}
	}

	.tx-box {
		background-color: #fff;
		margin: 10rpx 16rpx;
		border-radius: 20rpx;
		padding: 26rpx;
		padding-top: 34rpx;


		.block {

			padding-bottom: 56rpx;

			.icon {
				display: inline-block;
				width: 8rpx;
				height: 36rpx;
				background-color: #b48b35;
				/* 示例颜色，可替换为实际颜色 */
				border-radius: 8px 0 0 8px;
			}

			.title {
				font-size: 28rpx;
				margin-left: 16rpx;
				font-family: $uni-family-Bold;
				font-weight: bold;
				color: #1c1c1c;
			}

			.text {
				font-size: 28rpx;
				line-height: 34rpx;
				font-family: $uni-family-Regular;
				color: #707070
			}
		}
	}
</style>