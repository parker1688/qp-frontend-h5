<template>
	<!-- 首页页面结构 -->
	<view class="container u-flex-column"
  <!--        #ifdef APP-PLUS || MP-WEIXIN-->
  :style=" `height:calc(100vh - ${botHeight});`"
  <!--  #endif-->
  >
<!--    #ifdef H5-->
    <down/>
<!--    #endif-->
    <uv-navbar placeholder bgColor="#1c1c1c" :class="isDownShow?'navbarBox':''" style="z-index: 666;" leftIconColor="#1c1c1c"  title="">
      <template v-slot:left>
        <view class="h-top u-flex-xy-center">
          <uv-icon name="/static/home/hong-top-left.png" color="#ffffff" @click="leftPopupBut" size="23"></uv-icon>
          <image style="width: 195rpx;height:73rpx" :src="baseImgUrl + bannerImg"></image>
        </view>
      </template>
      <template v-slot:right>
        <view class="h-top u-flex-xy-center" v-if="isToken">
          <view class="rmb-img u-flex-xy-center u-flex-shrink0">¥</view>
          <view><text v-if="!isRotating">{{ userMoney?.ava_amount?.toFixed(2)||0 }}</text>
		   
		   <text v-else><Loading style="margin-right: 20rpx;"/></text></view>
		  <view style="position: relative;">
			   <uv-icon class="rotate-box" :class="{ 'rotate-ccw': isRotating }" name="/static/home/sx1.png" bold color="#ffffff" size="15"></uv-icon>
			   <view style="position: absolute;top: -12rpx; left: 0; width:50rpx; height: 50rpx;" @click="getBalanceBut(false)"></view>
		  </view>
         
        </view>
        <view class="h-top u-flex-xy-center" v-else>
          <view class="login-box u-flex-xy-center" @click="goLogin">登录</view>
          <view class="dl-box u-flex-xy-center" @click="register">注册</view>
        </view>
      </template>
    </uv-navbar>
		<view class="menu-list u-flex-shrink0">
			<scroll-view scroll-x="true" :enable-flex="true" :scroll-with-animation="true" :scroll-into-view="'twoCategory'+ scrollID">
				<view class="u-flex">
					<view class="menu-items u-flex-column-center-start" v-for="(item,index) in menuList" :key="item.id" @click="menuScroll(item,index)" :id="'twoCategory'+ index">
						<image :class="{action:index == menuNum}" :src="index == menuNum?item.imageOK:item.image"></image>
						<view class="name" :class="{action:index == menuNum}">{{item.text}}</view>
						<view class="u-flex-xy-center">
							<uv-icon v-if="index == menuNum" style="margin-top: 4rpx" color="#B8741A" size="10" name="/static/home/xz.png"></uv-icon>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="game-box  u-flex-column u-flex-start u-flex-grow" v-if="menuNum === 0" >

      <scroll-view scroll-y="true" class="u-flex-grow"  style="width:100vw;min-height:10rpx"  :enable-flex="true">
        <lunbo/>
        <view class="notice-box u-flex u-flex-shrink0">
          <uv-icon name="/static/home/tz.png" size="12"></uv-icon>
          <uv-notice-bar  v-if="textList.length" color="#6d6d6d" :icon="false" bgColor="#ffffff" fontSize="12" :text="textList[0]"></uv-notice-bar>
        </view>
        <view v-for="(it,index) in casinoList" :key="index">
          <goodsSwiper @loginBut="goLogin"  :list="it.cgList" :type="it.game_type" mode="aspectFill"/>
        </view>
        <uvNoData v-if="!loading&&!casinoList.length"/>
      </scroll-view>
		</view>
		<view class="game-box  u-flex-column u-flex-start u-flex-grow" v-if="menuNum > 0">
			<view class="game-menu u-flex-shrink0" v-if="menuTWOList.length">
				<scroll-view scroll-x="true" :enable-flex="true" :scroll-with-animation="true" :scroll-into-view="'gameMenu'+ gameMenuID">
					<view class="u-flex">
						<view class="menu-item u-flex-direction-column u-flex-shrink0"
							:class="{action:index == gameMenuNum}" v-for="(item,index) in menuTWOList" :key="index" @click="gameMenuScroll(item,index)" :id="'gameMenu'+ index">
              <image v-if="index<3" :src="item.img_bar" mode="aspectFill"></image>
              <image v-else :src="baseImgUrl+item.img_bar" mode="aspectFill"></image>
              <view>{{resolveVenueMenuName(item, index)}}</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<scroll-view scroll-y="true" class="u-flex-grow scrollBox" style="min-height:10rpx"  :enable-flex="true">
				<goodsList @loginBut="goLogin" :list="gameList" @delBut="delDataBut" :type="formData.venue_type" :isCollect="gameMenuNum?true:false" />
        <uvNoData v-if="!loading&&!gameList.length"/>
			</scroll-view>
		</view>
		<userInfo ref="userInfoRef" />
		<loginPopup ref="loginPopupRef" />
		<view class="search-box u-flex-xy-center" @click="goSearch" v-if="menuNum">
			<image src="/static/home/search.png"></image>
		</view>
    <view class="hby-home-box u-flex-xy-center" v-if="isToken&&redEnvelopeRainTime&&redEnvelopeRainTime<=300">
      <image class="hby" src="/static/home/hb/home-hby.png" @click="redEnvelopeRainTimeBut"></image>
      <view class="time-box">
        <view class="ts">即将来袭</view>
        <uv-count-down :time="redEnvelopeRainTime * 1000" format="mm:ss" autoStart millisecond @finish="redEnvelopeRainTimeFinish" @change="onRedEnvelopeRainTimeChange">
          <view class="time">
            <text class="time__item">{{ redEnvelopeRainTimeData.hours>10?redEnvelopeRainTimeData.hours:'0'+redEnvelopeRainTimeData.hours}}:</text>
            <text class="time__item">{{redEnvelopeRainTimeData.minutes>9?redEnvelopeRainTimeData.minutes:'0'+redEnvelopeRainTimeData.minutes}}:</text>
            <text class="time__item">{{redEnvelopeRainTimeData.seconds>9?redEnvelopeRainTimeData.seconds:'0'+redEnvelopeRainTimeData.seconds}}</text>
          </view>
        </uv-count-down>
      </view>
    </view>
    <view class="hxb-home-box u-flex-xy-center" v-if="isToken&&addEnvelopeNum">
      <image class="hb" src="/static/home/hb/home-hxb.png" @click="getActivityInfoBut"></image>
    </view>


    <advertisement ref="advertisementRef" @close="getMesage"/>
	  <stationMessage ref="messageRef"  @close="getActivityInfoBut"></stationMessage>
    <redEnvelopeRain   ref="redEnvelopeRainRef"  @close="redEnvelopeRainBut" />
    <addEnvelope ref="addEnvelopeRef"/>
    <tabBar :current="0" />
	</view>
</template>

<script lang="ts" setup>
	import Loading from '@/components/Loading/index.vue'
	import stationMessage from '@/components/stationMessage/index.vue'
  import { getBalance, getylGameListBut } from "@/hooks/publicRequest";
	import { computed, reactive, ref, shallowRef, watch,watchEffect } from "vue";
  import environment from '@/utils/environments.ts'
  const baseUrl = environment.envConfigs.url
  const baseImgUrl = environment.envConfigs.imgUrl
	import { getGameList,getHomeCollectList,getVenueList,homenotifyMarqueeList,homeBulletinList,getActivityInfo} from "@/api/user";
	import { onLoad, onShow } from "@dcloudio/uni-app";
  import { toPtah,menusFn,pointsList,normalizeGameType} from "@/utils/index"
	import { userStore } from "@/stores/user"
	import { messageList } from "@/api/user"
	
	const userDataStore = userStore();
  import { startStore } from "@/stores/start"
  import userInfo from "./userInfo"
  import goodsSwiper from "./goodsSwiper";
  import advertisement from "./advertisement";
  import redEnvelopeRain from "./redEnvelopeRain";
  import addEnvelope from "./addEnvelope";
  const botHeight = computed(() => {
    return  (50 + uni.getSystemInfoSync().safeAreaInsets.bottom)+'px'
  })
  import lunbo from "./lunbo";
  // #ifdef H5
  import down from "./down";
  // #endif
  const isDownShow=computed(()=> userStore().isDownShow)
  import goodsList from "@/components/goodsList/index";
  import loginPopup from "@/components/loginPopup/index";
  const userInfoRef = shallowRef()
  const loginPopupRef = shallowRef()
  const advertisementRef= shallowRef()
  const messageRef=shallowRef()
  const redEnvelopeRainRef=shallowRef()
  const addEnvelopeRef=shallowRef()
	//请求参数
	const formData = {
		venue_code: '',
		venue_type: '',
		game_type: '',
		hot: 1
	}
	const msg=ref()
  const loading=ref(true)
  const adflag=ref(false)
  const homeListHeight=ref(0)
	const isRotating=ref(false)
	const userData = computed(() => userDataStore.userInfo)
  const dayReminder=computed(()=>userDataStore.dayReminder)
	const userMoney = computed(() => userDataStore.userMoney)
	const isToken = computed(() => userDataStore.token ? true : false)

  const bannerImg = computed(() => userDataStore.bannerImg)
  const addEnvelopeNum= computed(() => startStore().addEnvelopeNum)
  const redEnvelopeRainTime=ref(0)
  const activity_red_envelope_rain_info=ref(null)
  const activity_health_pack_info=ref(null)
  const redEnvelopeRainTimeData=ref(null)
  const textTime = ref(2)
	const textList = ref([])
	const scrollID = ref(0)
	const menuNum = ref(0)
	const menuList = computed(() => startStore().menuOneList)
	const menuTWOList = ref([])
  const allVenueList =computed(() => userDataStore.venueGameData.allLits)  //所有的场馆
  const casinoList=computed(() => userDataStore.venueGameData.newMap) //娱乐场
  const bulletinList = ref([])
	const menuTwo = ref([
		{ id: 'id1', venue_name: "收藏", venue_type: '',venue_code:'', game_type: '', hot: 0, is_maintain: true, img_bar: '/static/home/meunTwo/sc.png' },
		{ id: 'id2', venue_name: "热门", venue_type: '',venue_code:[], game_type: '', hot: 1, is_maintain: true, img_bar: '/static/home/meunTwo/rm.png' },
		{ id: 'id3', venue_name: "全部", venue_type:'',venue_code:[], game_type: '', hot: 0, is_maintain: true, img_bar: '/static/home/meunTwo/all.png' },
	])
 const gameMenuID = ref(0)//1级分类
 const gameMenuNum = ref(1)  //2级分类
 const gameList = ref([])
 const menuNumName=ref('')
	const menuScroll = (iten : any, index : any) => {
		menuNum.value = index
    menuNumName.value=iten.text
		formData.venue_type = iten.venue_type
    formData.hot=1
    formData.venue_code=''
    gameMenuID.value=0
		gameMenuNum.value = 1

		if (index) {
			getVenueListBut()
		}

		if (scrollID.value == index && scrollID.value > 0) {
			scrollID.value = scrollID.value - 1
		} else {
			scrollID.value = index - 1
		}

	}

  const resolveVenueMenuName = (item: any, index: number) => {
    if (index < 3) return item?.venue_name || ''
    const categoryName = String(menuNumName.value || '').trim()
    const venueName = String(item?.venue_name || '').trim()
    if (venueName && venueName !== categoryName) return venueName
    const alias = String(item?.config_alias || item?.alias || '').trim()
    if (alias) return alias
    const venueCode = String(item?.venue_code || '').trim()
    if (venueCode) return venueCode
    return venueName || categoryName
  }


	//获取娱乐场 游戏
	// const getylGameListBut = async () => {
  //   loading.value=true
	// 	const res = await getVenueList()
  //   const list= await pointsList(res.data)
  //   const resData  =await menusFn(list)
  //   casinoList.value =resData.newMap
  //   allVenueList.value=resData.allLits
  //   userDataStore.setAllVenueList(res.data)
  //   loading.value=false
	// }
	//获取收藏列表
	const getHomeCollectListBut = async () => {
		const res = await getHomeCollectList({ venue_type: formData.venue_type })
		gameList.value = res.data
    loading.value = false
	}
	//获取 游戏列表
	const getGameListBut = async () => {
		const res = await getGameList(formData)
    const list=userDataStore.allVenueList
		gameList.value = res.data.map(it=>{
     const isData=list.find(its=>its.venue_code === it.venue_code)
      it.is_maintain=isData? isData.is_maintain : true
		  return it
    })
    loading.value = false
	}
	const delDataBut = (item : any) => {
		const index = gameList.value.findIndex(it => it.id == item.id)
		gameList.value.splice(index, 1)
	}
	//获取二级分类
	const getVenueListBut = () => {
    menuTWOList.value=[]
    gameList.value=[]
  const res =  allVenueList.value.filter(item => normalizeGameType(item.game_type) == formData.venue_type)
  const currentVenueList = ((res && res.length) ? res[0].list : []).filter(Boolean)

    menuTWOList.value = menuTwo.value.map((it,index) => {
      it.game_type = formData.venue_type
      if(index){
        it.venue_code = currentVenueList.map(its=> its?.venue_code).filter(Boolean)
      }
      return it
    })
    if (currentVenueList.length) {
      menuTWOList.value = [...menuTWOList.value, ...currentVenueList]
    }
    formData.venue_code =  menuTWOList.value[gameMenuNum.value]?.venue_code || ''
    if (formData.venue_code) {
      getGameListBut()
    } else {
      loading.value = false
    }

	}

	const gameMenuScroll = (iten : any, index : any) => {
    loading.value = true
    gameList.value=[]
		if (index) {
      formData.venue_code = iten.venue_code
      //formData.venue_type = iten.game_type
      formData.game_type = ''
      formData.hot = iten?.hot | 0
			getGameListBut()
		} else {
      if (!isToken.value) {
        uni.showToast({
          icon: 'none',
          title: '请登录！',
        })
        return
      }
      formData.venue_code = iten.venue_code
      //formData.venue_type = iten.game_type
      formData.game_type = ''
      formData.hot = iten?.hot | 0
			getHomeCollectListBut()
		}
    gameMenuNum.value = index
		if (gameMenuID.value == index && gameMenuID.value > 0) {
			gameMenuID.value = gameMenuID.value - 1
		} else {
			gameMenuID.value = index - 1
		}
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

	const leftPopupBut = () => {
		if (!isToken.value) {
			goLogin()
			return
		}
		userInfoRef.value.open()
	}
	//去登录
	const goLogin = () => {
		// toPtah('/pages/login/index')
		loginPopupRef.value.open()
	}
	const register =()=>{
    toPtah('/pages/login/index?type=1')
  }
	const goSearch = () => {
		toPtah('/pages/gameManage/searchGame/index')
	}
	const toGameVenue = () => {
		toPtah('/pages/gameManage/gameVenue/index', 1, true)
	}
	//   watch(() => userStore.locationInfo, (newVal,w oldVal) => {
	// userAdderss.value=newVal
	//   }, {
	//     immediate: true // 如果需要在监听时立即触发，则设置为true
	//   });
  //跑马灯
  const getHomenotifyMarqueeList= async ()=>{
    const  res=await homenotifyMarqueeList()
    if(res.data.length){
      textTime.value=res.data[0].frequency
      textList.value = res.data.map(it=> it.content)
    }
  }
  //广告
  const getHomeBulletinList =async()=>{
    const  res=await homeBulletinList()
    bulletinList.value=res.data
	 adflag.value = bulletinList.value.length>0
	 if(!adflag.value){  //没有广告
		 getMesage()
	 }
	 
  }
  const getMesage = async()=>{
	  if(isToken.value){
		  const res =  await messageList({current:1,pageSize:10,read_status:1,is_popup:1})
		  if(res.data.length>0){
        const data=res.data[0]
        messageRef.value.open({data:{...data}})
		  }else {
        getActivityInfoBut()
      }
		 
	  }

  }
  //活动红包信息接口
  const getActivityInfoBut = async ()=>{
    const res =await getActivityInfo()
    if(res.code == 0){
      const data=res.data.activity_red_envelope_rain_info
      const data1= res.data.activity_health_pack_info
      activity_red_envelope_rain_info.value=data
      activity_health_pack_info.value=data1
      if(data1&&data1?.length){
        startStore().setAddEnvelopeNum(data1.length)
      }
      if(data){
        redEnvelopeRainTime.value=data.cd
        // startStore().setRedEnvelopeRainTime(data.cd)
        if(data.cd == 0){
          redEnvelopeRainRef.value.open({...data})
          return
        }
      }

      if(data1&&data1?.length){
        addEnvelopeRef.value.open({list:JSON.stringify(data1)})
        return
      }
    }

  }
  const redEnvelopeRainBut=()=>{
    const data=activity_health_pack_info.value

    if(data&&data?.length){
      addEnvelopeRef.value.open({list:JSON.stringify(data)})
      return
    }
  }
  //倒计时结束
  const redEnvelopeRainTimeFinish=()=>{
    redEnvelopeRainTime.value=0
    redEnvelopeRainRef.value.open({...activity_red_envelope_rain_info.value})
  }
  //倒计时
  const onRedEnvelopeRainTimeChange=(e:any)=>{
    redEnvelopeRainTimeData.value = e
  }
  const redEnvelopeRainTimeBut=()=>{
     const content=activity_red_envelope_rain_info.value.content
     toPtah(`/pages/eventsManage/details/index?promotionImg=${baseImgUrl + content}`)
  }
	onLoad(() => {
    uni.hideTabBar()
    getylGameListBut()
    getHomenotifyMarqueeList()
    getHomeBulletinList()
	})
	// 接收位置选择页面返回的数据
	onShow(() => {
    redEnvelopeRainTime.value = 0
    redEnvelopeRainTimeData.value=''
    activity_red_envelope_rain_info.value=''
    activity_health_pack_info.value=''
    startStore().setAddEnvelopeNum(0)
    userDataStore.setCustomNum(0)
    const homeReloadPage=startStore().homeReloadPage
    if(homeReloadPage == -1){
      menuNum.value=-1
      setTimeout(()=>{
        menuNum.value=0
        startStore().setHomeReloadPage(0)
      })
    }
		if (isToken.value) {
      getBalance()
      if(!dayReminder.value.isTure){
        setTimeout(()=>{
          advertisementRef.value.open(bulletinList.value)
        },1000)
      }else {
        getMesage()
      }
		}else {
      setTimeout(() => {
        advertisementRef.value.open(bulletinList.value)
      }, 1000)
    }


	})
</script>
<style lang="scss" scoped>

	/* 页面整体样式 */
	.container {
    background-color: $uni-default-back0Color;
		box-sizing: border-box;
		overflow: hidden;
    // #ifdef H5
    height:calc(100% - 50px);
    .navbarBox{
      :deep(.uv-navbar--fixed){
        position: relative;
      }
    }
    // #endif

		.h-top {
      color: #FFFFFF;
      height: 44px;
      image{
        margin-left: 18rpx;
      }
      .rmb-img{
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        overflow: hidden;
        background: $uni-default-color;
        font-size: 22rpx;
        margin-right: 10rpx;
        padding: 0;
        color: #FFFFFF;
        font-family: $uni-family-Bold;
      }
      view {
        padding: 0 5rpx;
        font-size: 30rpx;
      }
      .login-box {
        background: white;
        width: 104rpx;
        height: 54rpx;
        color: $uni-default-color;
        border-radius: 10rpx;
        font-size: 24rpx;
        margin-right: 20rpx;
      }
      .dl-box{
        width: 104rpx;
        height: 54rpx;
        border: solid 2rpx #ffffff;
        box-sizing: border-box;
        color: #ffffff;
        border-radius: 10rpx;
        font-size: 24rpx;
      }
		}

		.menu-list {
			width: calc(100% - 94rpx);
      height: 160rpx;
			padding:0 47rpx;

			.menu-items {
				margin-right: 59rpx;
				text-align: center;
				font-size: 28rpx;
        color: #818077;
				image {
					border-radius: 20rpx;
          width: 82rpx;
          height: 82rpx;
          margin-top: 8rpx;
          margin-bottom: 2rpx;
				}
        .name{
          width: 84rpx;
        }
				.action {
          color: $uni-default-xzColor;
          font-weight: 600;
				}
			}
		}

		.game-box {
			width: 100%;
      height: calc(100vh - 500rpx);
			margin-top: 10rpx;
			background: white;
			border-radius: 30rpx 30rpx 0 0;
			overflow: hidden;

			.notice-box {
				//border-bottom: 1px solid #cccccc;
        width: 710rpx;
        padding-left:30rpx;
        margin-top: 2rpx;
        margin-bottom: 20rpx;
        height: 60rpx;
			}
      .scrollBox{
        //width: calc(100% - 20rpx);
        //margin:0 10rpx;
        width: 100vw;
        overflow: hidden;
      }
			.game-menu {
				width: calc(100% - 60rpx);
				margin: 30rpx 30rpx 20rpx 30rpx;

				.menu-item {
					margin-right: 30rpx;
					border-radius: 12rpx;
					padding: 0 24rpx;
					height: 110rpx;
					border: 2px solid $uni-default-backColor;
					overflow: hidden;
					font-size: 26rpx;

					image {
						border-radius: 10rpx;
						width: 47rpx;
						height: 47rpx;
            margin-bottom: 12rpx;
					}

				}

				.action {
					background: $uni-default-color;
					border: 2px solid $uni-default-color;
					color: white;
				}
			}
		}


	}

	.search-box {
		position: fixed;
		right: 30rpx;
		top: 30%;
		z-index: 666;
		width: 60rpx;
		height: 60rpx;
		background: $uni-bg-color;
		border-radius: 50%;

		image {
			width: 40rpx;
			height: 40rpx;
		}
	}
	.rotate-box{
		transition: transform 1s ease; /* 平滑过渡效果 */
		 transform-origin: center center;
	}
  .hxb-home-box{
    width: 153rpx;
    height: 148rpx;
    position: absolute;
    bottom: 184rpx;
    right: 10rpx;
    image{
      width: 153rpx;
      height: 148rpx;
    }

  }
  .hby-home-box{
    width: 157rpx;
    height: 158rpx;
    position: fixed;
    bottom: 368rpx;
    right: 10rpx;
    image{
      width: 157rpx;
      height: 158rpx;
    }
    .time-box{
      width: 100%;
      height: 30rpx;
      position: absolute;
      z-index: 66;
      bottom: 32rpx;
      text-align: center;
      font-size: 16rpx;
      color: #FFFFFF;
      font-family: $uni-family-Bold;
      .ts{
        margin-bottom: 2rpx;
        color:  #fbe9c9;
      }
      .time__item{
        font-size: 18rpx;
        font-family: $uni-family-Bold;

      }
    }

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