<template>
  <view class="container"

  >
    <uv-navbar placeholder bgColor="#1c1c1c"  autoBack leftIconColor="#1c1c1c" :titleStyle="{color:'#fff'}" title="活动">
		<template v-slot:center>
		  <view class="h-top">
		    <view class="menuBox  u-flex">
		      <view style="position: relative;" v-for="(it,index) in menuList" :key="index" @click="menuBut(index)"  :class="{action:index==menuNum}">
				  <!-- <myBadge style="right: -10rpx;top:6rpx" v-if="it.ifBadge"></myBadge> -->
				<!-- <uv-badge v-if="it.ifBadge" style="position: absolute;right: -10rpx;" type="error" max="99" :value="0" isDot></uv-badge> -->
				{{it.title}}
			  </view>
				
			</view>
		  </view>
		</template>
      <template v-slot:right>
        <view class="uv-nav-slot u-flex-center-end" @click="goToKF">
			<uv-icon name="/static/kf/kf.png" size="19" ></uv-icon>
			<text class="kfClass">客服</text>
        </view>
      </template>
    </uv-navbar>
	<loginPopup ref="loginPopupRef" />
	
    <activity v-if="menuNum==0"/>
	<mession v-if="menuNum==1"></mession>
    <tabBar :current="1" />
  </view>
</template>

<script lang="ts" setup>
import {computed,ref,shallowRef} from "vue";
import loginPopup from "@/components/loginPopup/index";

import myBadge from '@/components/myBadge/index.vue'
import activity from  './activity'
import mession from './mission.vue'

import { onLoad, onShow } from "@dcloudio/uni-app";
import { toPtah } from "@/utils/index"
  import { userStore } from "@/stores/user"
  const userDataStore = userStore();
  const isToken = computed(() => userDataStore.token ? true : false)
  const loginPopupRef = shallowRef()

const menuList=ref([{title:"活动",ifBadge:false}
,{title:"任务",ifBadge:true}
])
const menuNum=ref(0)

const menuBut =(index:any)=>{
	
	if(index==1&&!isToken.value){
		loginPopupRef.value.open()
	}else{
		 menuNum.value=index
	}
	
 
}
const botHeight = computed(() => {
  return  (50 + uni.getSystemInfoSync().safeAreaInsets.bottom)+'px'
})
onLoad(() => {
  uni.hideTabBar()
})
const goToKF=()=>{
  toPtah('/pages/kf/index')
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  // #ifdef H5
  height:100%;
  // #endif
  // #ifdef APP-PLUS || MP-WEIXIN
   height:100vh;
 //  #endif
  background-color:$uni-default-back0Color;
  overflow: hidden;
  .uv-nav-slot{
    color: #FFFFFF;
  }
  .h-top {
    color: white;
    .menuBox{
      font-size: 32rpx;
      >view{
        color: $uni-default-backColor;
      }
      >view:first-child{
        margin-right: 40rpx;
      }
      .action{
        color: white;
      }
    }
    image{
      width: 50rpx;
      height: 55rpx;
      margin-right: 4rpx;
    }
  }

}

</style>