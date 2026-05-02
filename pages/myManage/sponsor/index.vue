<template>
  <view class="box">
		<uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute" leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="官方赞助">
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
        <view style="margin-bottom: 18rpx" v-for="item,index in data" :key="index">
          <image @click="goDetails(item)" style="width: 100vw;height:340rpx;border-radius: 26rpx;"
            :src="item.banner"></image>
        </view>
      </scroll-view>
    </view>
	</view>
</template>

<script setup lang="ts">
	import { toPtah, formatFlexibleHierarchy, pagesRoute } from "@/utils/index"
	import { getNavConfig } from "@/api/user";
	// import { userStore } from "@/stores/user"
	import { computed, ref, onMounted, reactive } from "vue";
	import environment from '@/utils/environments.ts'

	const baseUrl = environment.envConfigs.url
	// const data : any = ref({})
	// const userDataStore = userStore();
	const homeHeight = computed(() => {
		return uni.getSystemInfoSync().windowHeight
	})
	const data=reactive([
		{banner:'/static/my/support/pagcor_banner.png',type:'pagcor'},
		{banner:'/static/my/support/fc_banner.png',type:'fc'},
		{banner:'/static/my/support/by_banner.png',type:'by'},
		{banner:'/static/my/support/PG_banner.png',type:'PG'},
	])
  const topHeight = computed(() => {
    return 44 + uni.getSystemInfoSync().statusBarHeight
  })
	const goDetails = (item : any) => {
		// userDataStore.setNavDetail(item)
		toPtah(`/pages/myManage/sponsor/details?type=${item.type}`)
	}
	// onMounted(() => {
	// 	init()
	// })
	// const init = async () => {
	// 	const res = await getNavConfig(0)
	// 	const d : any = formatFlexibleHierarchy(res.data)
	// 	data.value = d.find((i : any) => i.key == "support")
	// 	console.log(data.value)
	// }
</script>

<style scoped lang="scss">
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
</style>