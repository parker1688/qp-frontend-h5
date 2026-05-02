<template>
    <view v-if="path"  class="iframe-box">
      <!--      #ifndef H5  -->
      <view class="lf-but" @click="pagesRoute" :style="`top: ${topHeight}px;` "></view>
      <iframe class="iframe-box" :src="path"  :style="`height:calc(100vh - ${topHeight}px); margin-top: ${topHeight}px;` "></iframe>
      <!--      #endif-->
      <!--      #ifdef H5  -->
      <iframe class="iframe-box" :src="path"  :style="`height:calc(${height - topHeight}px); margin-top: ${topHeight}px;` "></iframe>
      <!--      #endif-->

    </view>
</template>

<script lang="ts" setup>
import { onLoad, onShow } from "@dcloudio/uni-app";
import { userStore } from "@/stores/user"
import {pagesRoute } from "@/utils/index"
import {computed, ref} from "vue";
const path=ref('')
const topHeight = computed(() => {
  return  uni.getSystemInfoSync().statusBarHeight
})
const height = computed(() => {
  return  uni.getSystemInfoSync().windowHeight
})
onLoad(()=>{
  const  userData = userStore().userInfo
  const kfUrl=userStore().kfUrl
  if(userData?.user_id){
    path.value=`${kfUrl}&visiter_id=${userData.user_id}&visiter_name=${userData.nick_name||userData.user_name }&avatar=&groupid=0`
  }else {
    path.value=`${kfUrl}&visiter_id=&visiter_name=&avatar=&groupid=0`
  }
})
</script>

<style scoped>
.iframe-box{
  width: 100vw;
  position: relative;
  top: -1px;
  left: -1px;
  overflow: hidden;
}
.lf-but{
   height:88rpx;
   width: 150rpx;
   background: transparent;
   position: fixed;
   z-index: 666;
   left: 0;
}

</style>