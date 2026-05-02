<template>
  <view>
    <uv-tabbar :value="parent.current" placeholder inactiveColor="#3a3a3a" :customStyle="{fontSize:'22rpx'}" activeColor="#ae8d45" @change="changeBut">
      <uv-tabbar-item v-for="(item,index) in tabbarList" :text="item.text" :key="index" :class="{'dot':item.dot}" style="position: relative;">
        <template v-slot:active-icon>
          <image class="icon" :src="item.selectedIconPath" style="width: 44rpx;height: 44rpx"></image>
        </template>
        <template v-slot:inactive-icon>
          <image class="icon" :src="item.iconPath" style="width: 44rpx;height: 44rpx"></image>
        </template>
      </uv-tabbar-item>
    </uv-tabbar>
    <loginPopup ref="loginPopupRef" />
  </view>
</template>

<script lang="ts" setup>
import {computed, ref, shallowRef, watch} from 'vue'
import loginPopup from "@/components/loginPopup/index";
  import { userStore } from "@/stores/user"
import {toPtah} from "@/utils/index";
  const userDataStore = userStore();
  const isToken = computed(() => userDataStore.token ? true : false)
  const loginPopupRef = shallowRef()
	const parent = withDefaults(
		defineProps<{
			current : number
		}>(),
		{
			current: 0
		}
	)
	const tabbarList = ref(
		[
      {
        "pagePath": "/pages/tabBar/home/index",
        "text": "首页",
        "iconPath": "/static/tabbar/home1.png",
        "selectedIconPath": "/static/tabbar/home11.png"
      },
      {
        "pagePath": "/pages/tabBar/eventsManage/index",
        "text": "活动",
        "iconPath": "/static/tabbar/hd1.png",
        "selectedIconPath": "/static/tabbar/hd11.png",
		"dot":false
      },
      {
        "pagePath": "/pages/tabBar/savingsAccount/index",
        "text": "充提",
        "iconPath": "/static/tabbar/ct1.png",
        "selectedIconPath": "/static/tabbar/ct11.png"
      },
      {
        "pagePath": "/pages/tabBar/bill/index",
        "text": "注单",
        "iconPath": "/static/tabbar/zd1.png",
        "selectedIconPath": "/static/tabbar/zd11.png"
      },
      {
        "pagePath": "/pages/tabBar/mine/index",
        "text": "我的",
        "iconPath": "/static/tabbar/wd1.png",
        "selectedIconPath": "/static/tabbar/wd11.png"
      }
		]
	)
  const HapticFeedbackPlugin=()=>{
    // #ifdef APP-PLUS
    let platform=uni.getSystemInfoSync().platform
    if (platform == "ios") {
      let UIImpactFeedbackGenerator = plus.ios.importClass('UIImpactFeedbackGenerator');
      let impact = new UIImpactFeedbackGenerator();
      impact.prepare();
      impact.init(1);
      impact.impactOccurred();
    }
    if (platform == "android") {
      uni.vibrateShort({ type: 'light' }); // Android 使用默认震动
    }
    //#endif
  }

  const changeBut = (item : any) => {
		const data = tabbarList.value[item]
    if(item>1 && !isToken.value){
      loginPopupRef.value.open()
      //#ifndef H5
      HapticFeedbackPlugin()
      //#endif
      return
    }
	//	uni.switchTab({ url: data.pagePath })
    toPtah(data.pagePath,0)
    //#ifndef H5
    HapticFeedbackPlugin()
    //#endif

	}
</script>
<style lang='scss' scoped>
	.dot::after{
		content: '';
		  position: absolute;
		  top: 10rpx;
		  right: 28rpx;
		  width: 24rpx;
		  height: 24rpx;
		  background-image: url('/static/mission/alert.png');
		  background-size: contain;
		  background-repeat: no-repeat;
	}
</style>