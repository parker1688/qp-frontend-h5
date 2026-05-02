<template>
	<view class="container">
		<uv-navbar placeholder bgColor="#1c1c1c" :title="title"   @leftClick="pagesRoute" leftIconColor="#fff" :titleStyle="{color:'#fff'}">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
			<template v-slot:right>
				<view class="uv-nav-slot u-flex-center-end" @click="kfbut" style="color: #FFFFFF">
					<view class="rmb-box u-flex-xy-center">
            <view class="rmb-img u-flex-xy-center u-flex-shrink0">¥</view>
			<text v-if="!isRotating">{{ userMoney?.ava_amount?.toFixed(2) ||0}}</text>
			<text v-else><Loading  style="margin-right: 20rpx;"/></text>
          </view>
		  <view style="position: relative;">
			  <uv-icon class="rotate-box" :class="{ 'rotate-ccw': isRotating }"  name="/static/home/sx1.png" size="14"></uv-icon>
			  <view style="width: 50rpx;height: 50rpx;position: absolute;top: -12rpx;left: 0;" @click="getBalanceBut"></view>
			  
		  </view>
				</view>
			</template>
		</uv-navbar>
		<view class="select-list-box">
			<view class="select-box u-flex-center-between">
				<view style="width: 300rpx">
					<uv-tabs :list="menuTwo" keyName="venue_name" @click="tabsBut" :lineColor="`url(/static/search/xz2.png) 100% 70%`"
					:inactiveStyle="{fontSize:'26rpx',color:'#5b5b5b'}"	:activeStyle="{color: '#303133',fontWeight:'bold',fontSize:'28rpx'}"></uv-tabs>
				</view>
				<view class="search" style="width: 350rpx">
					<uv-search placeholder="输入游戏名称" fontSize="12" v-model="keyword" searchIcon="/static/search/searchIcon.png" searchIconSize="16"
                     :placeholderColor="{color:'#b0b0b0'}" :actionStyle="{fontSize:'24rpx',height:'30rpx',  padding: '5rpx 0'}" @custom="searchBut"></uv-search>
				</view>
			</view>
      <!--  #ifndef H5    -->
			<scroll-view scroll-y="true" :style="`height:calc(100vh - ${topHeight + 44}px - 114rpx)` " :enable-flex="true">
      <!--    #endif    -->
      <!--  #ifdef H5    -->
      <scroll-view scroll-y="true" :style="`height:calc(100% - 114rpx)` " :enable-flex="true">
      <!--    #endif    -->
				<goodsList @loginBut="goLogin" :list="searchGameList" @delBut="delDataBut" :type="formData.venue_type" :isCollect="gameMenuNum?true:false" />
				<uvNoData v-if="!loading&&!gameList.length" />
			</scroll-view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { computed, reactive, ref, shallowRef, watch } from "vue";
	import Loading from '@/components/Loading/index.vue'
	
  import {pagesRoute} from '@/utils/index.ts'
	import { onLoad, onShow } from "@dcloudio/uni-app";
	import { getBalance } from "@/hooks/publicRequest";
	import { getGameList, getHomeCollectList, getVenueList, homenotifyMarqueeList, homeBulletinList } from "@/api/user";
	import { userStore } from "@/stores/user"
	const userDataStore = userStore();
	import environment from '@/utils/environments.ts'
	const baseUrl = environment.envConfigs.imgUrl
	import goodsList from "@/components/goodsList/game";
	const topHeight = computed(() => {
		return uni.getSystemInfoSync().statusBarHeight
	})
	const keyword = ref('')
	const gameMenuNum = ref(1)  //2级分类
	const menuTwo = ref([
		{ venue_name: "热门",  hot: 1, },
		{ venue_name: "全部",  hot: 0, },
		{ venue_name: "收藏",  hot: 0, }
	])

	const isToken = computed(() => userDataStore.token ? true : false)

	const userMoney = computed(() => userDataStore.userMoney)
	const title = ref('')
	const formData = {
		venue_code: '',
		game_type: '',
		hot: 1
	}
	const gameList = ref([])
  const searchGameList=ref([])
	const loading = ref(true)
  const isRotating=ref(false)


	const delDataBut = (iten : any) => {
		 const index = gameList.value.findIndex(it => it.id === iten.id)
    gameList.value.splice(index, 1)
	}
  //获取收藏列表
  const getHomeCollectListBut = async () => {
    const res = await getHomeCollectList({ venue_type: formData.game_type })
    gameList.value = res.data
    searchGameList.value = gameList.value
    loading.value = false
  }
	const getBalanceBut = async () => {
		// userMoney?.ava_amount
		if (!isToken.value) {
			toPtah('/pages/login/index')
			return
		}
		isRotating.value=true
		
		setTimeout(async()=>{
			await getBalance(false)
			isRotating.value=false
		},1000)
	
	}
	const getGameListBut = async () => {
		const res = await getGameList(formData)
		gameList.value = res.data
    searchGameList.value = gameList.value
		loading.value = false
	}
	const tabsBut =(item:any)=>{
    loading.value = true
    gameList.value=[]
    searchGameList.value=[]
    if (item.index !=2) {
      formData.hot = item?.hot | 0
      gameMenuNum.value=1
      getGameListBut()
    } else {
      formData.hot = item?.hot | 0
      gameMenuNum.value=0
      getHomeCollectListBut()
    }
  }
  const searchBut=async (it:any)=>{
    if(!it){
      searchGameList.value = gameList.value
      return
    }
    searchGameList.value = gameList.value.filter(item => item.game_name.includes(it)  ||  item.game_name_pinyin.includes(it))
    loading.value=false
  }
	onLoad((it : any) => {
		title.value = it.venue_name
    formData.game_type=it.game_type
		formData.venue_code = it.venue_code
		getGameListBut()
		getBalance()
	})
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
    height: 100%;
		background: $uni-default-back0Color;

		.select-list-box {
			width: 100%;
      height: calc(100% - 44px);
			background: $uni-bg-color-hover;
			border-radius: 20rpx 20rpx 0 0;
			overflow: hidden;

			.select-box {
				width: 100%;
				height: 100rpx;
				background: $uni-bg-color;
				overflow: hidden;
				margin-bottom: 10rpx;
				:deep(.uv-tabs__wrapper__nav__line) {
					height: 12rpx !important;

				}

				:deep(.uv-search__action) {
					background: white;
					height: 40rpx;
					border-radius: 20rpx;
					margin-right: 10rpx;
				}

				.search {
					width: 400rpx;
					height: 64rpx;
					background: #f2f2f2;
					border-radius: 40rpx;
					margin-right: 20rpx;
					overflow: hidden;

				}
			}

      :deep(.uv-tabs__wrapper__nav__line){
          width: 25rpx!important;
          height: 4rpx!important;
      }
		}
    .rmb-box{
      padding: 0 6rpx;
      height: 44rpx;
      background-color: #ffffff;
      border-radius: 22rpx;
      color: #1c1c1c;
      font-size: 24rpx;
      font-family: $uni-family-Bold;
      margin-right: 10rpx;
      .rmb-img {
        width: 35rpx;
        height: 35rpx;
        border-radius: 50%;
        overflow: hidden;
        background: $uni-default-color;
        font-size: 22rpx;
        margin-right: 8rpx;
        padding: 0;
        color: #FFFFFF;
        font-family: $uni-family-Bold;
      }
    }


		.yx-list-box {
			padding: 0 20rpx;
			width: calc(100% - 40rpx);

		}

	}
	.rotate-box{
		transition: transform 1s ease; /* 平滑过渡效果 */
		 transform-origin: center center;
	}
	
	@keyframes rotateCCW {
	  0% {
	    transform: rotate(0deg);
	  }
	  100% {
	    transform: rotate(-360deg); /* 负值表示逆时针 */
	  }
	}
	.rotate-ccw {
	  animation: rotateCCW .5s linear  infinite;
	}
</style>