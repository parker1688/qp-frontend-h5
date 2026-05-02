<template>
	<view class="yx-list-box">
		<view class="u-flex u-flex-wrap u-flex-content-start">
			<view v-for="(it,index) in parent.list" :key="index" class="item-box u-flex-column-center-around" @click="gameUrlTo(it)">
				<view class="type u-flex-center-end " v-if="parent.isCollect"  @click.stop="addCollectBut(it)">
					<uv-icon size="20"  color="#ffffff" name="/static/search/nsc.png"></uv-icon>
				</view>
        <view class="type u-flex-center-end"  v-else @click.stop="delCollectBut(it.id)">
          <uv-icon size="20" color="#B8741A" name="/static/search/sc.png"></uv-icon>
        </view>
				<view class="image">
					<uv-image mode="aspectFill" :src="baseImgUrl+it.img_icon" width="160rpx" radius="20rpx" height="163rpx" :observeLazyLoad="true">
						<template v-slot:loading>
<!--							<uv-loading-icon color="red"></uv-loading-icon>-->
              <image src="/static/search/ljz.png" style="width:120rpx;height:120rpx"></image>
						</template>
						<template v-slot:error>
							<image :src="baseUrl+it.img_icon" style="width:160rpx;height:163rpx;border-right: 20rpx"></image>
						</template>
					</uv-image>
          <view class="hwz-box u-flex-direction-column" v-if="it.is_maintain">
            <image src="/static/home/whz.png"></image>
            <text>维护中...</text>
          </view>
				</view>

				<view class="name u-flex-xy-center">
					<view class="u-flex u-flex-nowrap">{{it.game_name}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import environment from '@/utils/environments.ts'
	const baseUrl = environment.envConfigs.url
	const baseImgUrl = environment.envConfigs.imgUrl
  import {getPtUrl} from '@/utils/pt.ts'
	import { computed } from "vue";
	import { addCollect, delCollect, getVenueList, freeVenueLaunch } from "@/api/user";
  import { openGame} from "@/utils/index"
  import { getGtype} from "@/utils/venue"
	const parent = withDefaults(
		defineProps<{
			list : Array,
			isCollect : boolean
			type : string,
		}>(),
		{
			type: '',
			list: [],
			isCollect: true
		}
	)
	import { userStore } from "@/stores/user"
	const userDataStore = userStore();
	import { startStore } from "@/stores/start"
	const emit = defineEmits(['delBut'])
	const isToken = computed(() => userDataStore.token ? true : false)
	const isListTure = computed(() => startStore().venueGameListType.includes(parent.type))  //游戏进入第三方还是自己游戏列表
	const addCollectBut = async (it : any) => {
		if (!isToken.value) {
			emit('loginBut')
			return
		}
		const data = {
			id: it.id,
			venue_code: it.venue_code,
			venue_type: it.venue_type,
			game_code: it.game_code,
			game_name: it.game_name,
			img_icon: it.img_icon,
		}
		const res = await addCollect(data)
		if (res.data) {
			uni.showToast({
				title: '收藏成功！',
			})
		}
	}
	//进入游戏
	const gameUrlTo = (item : any) => {
		if (!isToken.value) {
			emit('loginBut')
			return
		}
    if(item.is_maintain){
      return
    }
		freeVenueLaunchBut(item)

	}
	const freeVenueLaunchBut = async (item : any) => {
		const pere = {
			venue_code: item.venue_code,
			game_code: item.game_code || '',
			tableId: item.id || '',
      gtype:getGtype(item)
		}
		const data = await freeVenueLaunch(pere)
    if(item.venue_code=="PTDZ"){
      const res=JSON.parse(data.data.gameUrl)
      const gameUrl=getPtUrl({...res.sessionToken,game_code:item.game_code})
      openGame({gameUrl:gameUrl,title:item.game_name || item.venue_name})
    } else if (data.data.gameUrl) {
      openGame({gameUrl:data.data.gameUrl,title:item.game_name})
		}

	}

	const delCollectBut = async (id : any) => {
		const res = await delCollect({ id })
		if (res.data) {
			emit('delBut', {id})
			uni.showToast({
				title: '删除成功！',
			})
		}
	}
</script>


<style lang="scss" scoped>
	.yx-list-box {
		padding: 0 25rpx;
		width: calc(100% - 50rpx);

		.item-box {
		//	margin:12rpx 10rpx;
			position: relative;
			width: 214rpx;
			height: 243rpx;
			border-radius: 20rpx;
			overflow: hidden;
			background: white;
      margin-right:calc((100% - 642rpx)/2);

      margin-top:30rpx ;
		}
    .item-box:nth-child(3n){
      margin-right: 0;
    }
		.type {
			position: absolute;
			top: 0;
      right: 0;
			z-index: 66;
			width: calc(100% - 20rpx);
			padding: 10rpx;
		}

		.image {
			margin-top: 10rpx;
      position: relative;
		}

		.name {
			height: 32rpx;
      margin-bottom: 6rpx;
			view {
				padding: 2rpx;
				height: 32rpx;
				border-radius: 4rpx;
				font-size:28rpx;
        overflow: hidden;
			}

		}
    .hwz-box{
      background: $uni-bg-color-mask;
      overflow: hidden;
      border-radius: 20rpx;
      overflow: hidden;
      backdrop-filter: blur(8px);
      position: absolute;
      z-index: 66;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      image{
        width:65rpx;
        height:70rpx
      }
      text{
        color: $uni-default-backColor;
        font-size: 20rpx;
        margin-top: 10rpx;

      }
    }
	}
</style>