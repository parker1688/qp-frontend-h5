<template>
	<view class="container-box"
  <!--        #ifdef APP-PLUS || MP-WEIXIN-->
  :style=" `height:calc(100vh - ${botHeight});`"
  <!--  #endif-->
  >
		<uv-navbar placeholder bgColor="transparent" @leftClick="pagesRoute" leftIconColor="#fff"
			:titleStyle="{color:'#fff'}" title="">
			<template v-slot:left>
				<view class="uv-nav-slot">
					<uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
				</view>
			</template>
		</uv-navbar>
		<view class="top">
			<image :src='bannerImg' style="width:540rpx;height:198rpx"></image>
		</view>
		<view class="bottom">
			<view class="help-list">
				<view class="item u-flex u-flex-y-center" v-for="(it,index) in data.children" :key="index"
					@click="goDetails(it)">
			
					<view class="title"><text>{{ it.name }}</text></view>
					<uv-icon class="marg last" size="18" name="arrow-right" color="#c7c7c7"></uv-icon>
			
				</view>
			</view>
		</view>
		
	</view>
</template>

<script setup lang="ts">
	import { pagesRoute } from "@/utils/index"
	import { toPtah, formatFlexibleHierarchy } from "@/utils/index"
	import { getNavConfig } from "@/api/user";
	import { ref, onMounted,computed} from 'vue'
	import { userStore } from "@/stores/user"
	import environment from '@/utils/environments.ts'
	const baseUrl = environment.envConfigs.url
	const userDataStore = userStore();
	const bannerImg = computed(() => baseUrl+userDataStore.bannerImg)
  const botHeight = computed(() => {
    return (uni.getSystemInfoSync().statusBarHeight + 44)+'px'
  })
	const data = ref()
	const init = async () => {
		const res = await getNavConfig(0)
		const d : any = formatFlexibleHierarchy(res.data)
		data.value = d.find((i : any) => i.key == "introduce")
	}
	onMounted(() => {
		init()
	})
	const goDetails = (item : any) => {
		userDataStore.setNavDetail(item)
		toPtah(`/pages/aboutUs/details`)
	}
	
</script>

<style lang="scss" scoped>
	$boxheight: 458rpx;

	.container-box{
    //#ifdef H5
    height:100%;
    //#endif

		.top{
			height:$boxheight;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.bottom{
			background-color: #f4f4f5;
			border-radius: 30rpx;
			height: calc(100% - #{$boxheight});
			.help-list {
				margin-top: 18rpx;
				background: white;
				border-radius: 30rpx;
				padding: 10rpx 42rpx;
				justify-content: space-between;
			
				.item {
					.marg {
						margin: 10rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
			
					margin-top: 0.1625rem;
			
					.title {
						padding: 18rpx 0;
						font-size: 30rpx;
						font-family: $uni-family-Medium;
						color: #1c1c1c;
						border-bottom: 1rpx solid #eeeeee;
						flex-grow: 1;
						display: flex;
					}
			
					&:last-child {
						.title {
							border-bottom: none; // 清除边框
						}
					}
				}
			
			}
		}
	}
	
</style>