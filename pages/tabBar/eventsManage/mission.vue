<template>
	<!--  #ifndef H5    -->
	<view class="activity-box u-flex-column" :style="`height:calc(100vh - ${topBotHeight}px)`">
	<!--    #endif    -->
		<!--  #ifdef H5    -->
		<view class="activity-box u-flex-column" :style="`height:calc(${homeHeight - topBotHeight}px)`">
		<!--    #endif    -->
			<view class="u-flex-shrink0 table-box">
				<uv-tabs :current="current" :list="menuList" lineWidth="0" :activeStyle="{
		     	border: 'none',
		     	color:'#ffffff',
		     	height:'58rpx',
          width: '180rpx',
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
           width: '180rpx',
           borderRadius:'30rpx',
           display:' flex',
           alignItems: 'center',
           justifyContent:' center',
           fontSize:'26rpx',
           padding: '0 10rpx',
           boxSizing: 'border-box',
		}" @click="getCurrent" itemStyle="padding-left:0; padding-right: 18rpx; height: 58rpx;"></uv-tabs>
			</view>
			<!--  #ifndef H5    -->
			<scroll-view scroll-y="true" :style="`height:calc(100vh - ${topBotHeight}px - 108rpx)`"
				@scrolltolower="scrolltolower" :enable-flex="true">
			<!--    #endif    -->
				<!--  #ifdef H5    -->
				<scroll-view scroll-y="true" :style="`height:calc(${homeHeight - topBotHeight}px - 108rpx)`"
					@scrolltolower="scrolltolower" :enable-flex="true">
				<!--    #endif    -->
					<messionCard :data="item" v-for="item,index in pager.lists" :key="index" @click="handdleClick(item)" />

					<view v-if="!pager.loading&&pager.lists.length" class="u-flex-x-center"
						style="padding: 25rpx;font-size:22rpx;color: #a9a9a9;">已全部加载~</view>
					<uvNoData v-if="!pager.loading&&!pager.lists.length" />
				</scroll-view>
				<successPopVue ref="successRef" :number="rewardCount"></successPopVue>
		</view>
</template>

<script lang="ts" setup>
	import { computed, ref, reactive,shallowRef } from "vue";
	import { toPtah } from "@/utils/index"
	import successPopVue from '@/components/successPopup/index.vue'
	import detailPop from './components/detailPop.vue'
	import { onLoad, onShow, onReady } from "@dcloudio/uni-app";
	
	import messionCard from "./components/messionCard.vue";
	import { userStore } from "@/stores/user"
	import { startStore } from "@/stores/start"
	import environment from '@/utils/environments.ts'
	const baseUrl = environment.envConfigs.url
	const baseImgUrl = environment.envConfigs.imgUrl
	import { taskList,getTask,freeVenueLaunch } from "/api/user";
	import { openGame} from "@/utils/index"
	import { getGtype} from "@/utils/venue"
	import { usePaging } from "@/hooks/usePaging";
	const userDataStore = userStore();
	
	const current = ref(0)
	const topBotHeight = computed(() => {
		return uni.getSystemInfoSync().statusBarHeight + 50 + 44 + uni.getSystemInfoSync().safeAreaInsets.bottom
	})
	const parent = ref()
	const gameName = computed(()=> {
	  const res=  startStore().gameTypeList.find(it=>parent.value == it.venue_type)
	  return res? res.table:''
	})
	const successRef = shallowRef()
	const rewardCount = ref(0)
	const cardData = ref()
	const menuList = ref([
		{ name: '每日任务', type: 1,icon:'' },
		{ name: '充值任务', type: 2 },
		{ name: '电子任务', type: 3 },
		{ name: '棋牌任务', type: 4 },
		{ name: '捕鱼任务', type: 5 },
		{ name: '体育任务', type: 6 },

	])
	const iconMapping={
		"mrrw":"/static/mission/mrrw.png", //每日任务
		"by":"/static/mission/by.png",  //捕鱼
		"cz":"/static/mission/cz.png", //充值
		"dz":"/static/mission/dz.png",  //电子
		"qp":"/static/mission/qp.png",  //棋牌
		"ty":"/static/mission/ty.png"  //体育
	}
	const data = ref([])

	const formData = reactive({
		type:"1",
	})

	const { pager, resetPageNum, getLists, resetPage } = usePaging({
		fetchFun: taskList,
		params: formData,
	});
	const scrolltolower = (item : any) => {
		resetPageNum()
	}
	const handdleClick = async(item : any) => {
		rewardCount.value = item.bonus_amount
		if(item.status==0){  //去完成 跳转
			parent.value=item.game_type
		handdleMethod(item)
		}else{  //去领取
			const res  = await getTask({id:item.id})
			if(res.code==0){
				rewardCount.value = item.bonus_amount
				successRef.value.open()
				resetPage()
			}
		}
		
	}
	const handdleMethod=(data:any)=>{  //处理不同类型任务跳转逻辑 
		if(data.subtype==1){  //任务目标（1 累计充值；
			toPtah("/pages/tabBar/savingsAccount/index",0)
		}else{ //2 累计投注；3 累计亏损；4 累计盈利）
			if(data.venue_code&&data.venue_name){  //确定厂商 确定游戏 
				if(data.game_code&&data.game_code.split(",").length==1){ //一个game_code 打开游戏
					freeVenueLaunchBut(data)
				}else{  //多个game_code 跳转列表
					toPtah(`/pages/gameManage/searchVenueGame/index?game_type=${data.game_type}&venue_name=${data.venue_name + gameName.value}&venue_code=${data.venue_code}`)
				}
			}else{ //全部游戏 ->首页
				toPtah("/pages/tabBar/home/index",0)
			}
		}
	}
	const getCurrent = (item : any) => {
		formData.type = item.type
		current.value = item.index
		resetPage()
	}
	const homeHeight = computed(() => {
		return uni.getSystemInfoSync().windowHeight
	})
	const freeVenueLaunchBut = async (item : any) => {
		const pere = {
			venue_code: item.venue_code,
			game_code: item.game_code || '',
			tableId: item.id || '',
			gtype:getGtype(item)
		}
		const data = await freeVenueLaunch(pere)
		if (data.data.gameUrl) {
			openGame({gameUrl:data.data.gameUrl,title:item.game_name})
		}
	}
	onShow(async () => {
		userStore().setCustomNum(1)
		resetPage()
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
</style>