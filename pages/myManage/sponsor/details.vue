<template>
	<view class="box">
		<uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute" leftIconColor="#fff"
			:titleStyle="{color:'#fff'}" title="官方赞助">
			<template v-slot:left>
				<view class="uv-nav-slot">
					<uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
				</view>
			</template>
		</uv-navbar>
    <!--        #ifdef H5-->
    <view class="scroll-box">
      <!--  #endif-->
      <!--        #ifdef APP-PLUS || MP-WEIXIN-->
      <view class="scroll-box" :style=" `height:calc(100vh - ${topHeight}px);`" >
        <!--  #endif-->
      <scroll-view scroll-y="true" :style="`height:calc(${homeHeight - 44}px )`" :enable-flex="true">
		  <image class="img" :src="src"></image>
        <!-- <uv-parse :content="userDataStore.navDetail.content"></uv-parse> -->
      </scroll-view>
    </view>
	</view>
</template>

<script setup>
	import {
		pagesRoute
	} from "@/utils/index"
	import {
		computed,
		ref
	} from "vue";
	import { onLoad, onShow } from "@dcloudio/uni-app";
	const type = ref("")
	const src = computed(()=>`/static/my/support/${type.value}_detail.png`)
	onLoad((param)=>{
		type.value=param.type
	})
	const homeHeight = computed(() => {
		return uni.getSystemInfoSync().windowHeight
	})
</script>

<style lang="scss" scoped>
.box{
  background:#1c1c1c!important;
}
.scroll-box {
  //#ifdef H5
  height: 100%;
  //#endif
  border-radius: 30rpx 30rpx 0 0;
  overflow: hidden;
  background-color: $uni-bg-color-grey;
}
.img{
	width: 100%;
	height: 100%;
}
</style>