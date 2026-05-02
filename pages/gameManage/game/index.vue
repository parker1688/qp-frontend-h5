<template>
    <view class="box">
      <uv-navbar v-if="!isAll" placeholder bgColor="#1c1c1c"    leftIconColor="#fff" :titleStyle="{color:'#fff'}" :title="title">
        <template v-slot:left>
          <view class="uv-nav-slot" @click="pagesRoute">
            <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
          </view>
          <view class="uv-nav-slot" style="margin-left: 60rpx" @click="updataGame">
            <uv-icon name="reload" color="#ffffff" size="26"></uv-icon>
          </view>
        </template>
        <template v-slot:right>
          <view class="uv-nav-slot" @click="updataAll" >
            <uv-icon name="/static/logo/qp.png" size="20"></uv-icon>
          </view>
        </template>
      </uv-navbar>

      <view class="iframe-box" v-if="path">
        <image class="qpimg" v-if="isAll" :style="`top:${topHeight - 35}px`" @click.stop="updataAll" src="/static/logo/nqp.png"></image>
        <!--        #ifndef H5-->
        <iframe class="iframe-box" :src="path"  :style="isAll?`height:100vh` :`height:calc(100vh - ${topHeight}px)` "   @load="iframeLoaded"></iframe>
          <!--        #endif-->
        <!--        #ifdef H5-->
        <iframe class="iframe-box" :src="path"  :style="isAll?`height:${Height}px` :`height:calc(${Height - topHeight}px)` "  @load="iframeLoaded"></iframe>
        <!--        #endif-->
      </view>
      <image class="loading" v-if="loadingShow" src="/static/logo/loading.gif"></image>
    </view>
</template>

<script lang="ts" setup>
import { onLoad, onShow,onHide ,onUnload} from "@dcloudio/uni-app";
import { userStore } from "@/stores/user"
import { computed, reactive, ref, shallowRef} from "vue";
import { toPtah } from "@/utils/index"
const webview=shallowRef()
const isAll = ref(false)
const path=ref(userStore().gameUrl)
const Height = computed(() => {
  return uni.getSystemInfoSync().windowHeight
})

const topHeight = computed(() => {
  return  uni.getSystemInfoSync().statusBarHeight + 44
})
const loadingShow=ref(false)
const title=ref('')

const iframeLoaded=()=>{
  setTimeout(()=>{
    loadingShow.value=false
  },1500)
}

const pagesRoute=()=>{
  toPtah('/pages/tabBar/home/index',0)
  // #ifdef APP-PLUS
  plus.navigator.setFullscreen(false);
  plus.navigator.showSystemNavigation()
  // #endif
}
const updataAll=()=>{
  isAll.value = !isAll.value
  // #ifdef APP-PLUS
  if(isAll.value){
    plus.navigator.setFullscreen(true);
    plus.navigator.hideSystemNavigation()
  }else{
    plus.navigator.setFullscreen(false);
    plus.navigator.showSystemNavigation()
  }
  // #endif
}

const updataGame=()=>{
  path.value = ''
  setTimeout(()=>{
    path.value=userStore().gameUrl
    loadingShow.value=true
  },10)
}

onLoad((e)=>{
  title.value=e.title
  // #ifdef APP-PLUS
  plus.screen.unlockOrientation();
  // #endif
  // #ifdef H5
  screen.orientation.lock('landscape');
  // #endif

  loadingShow.value=true

})
onUnload(()=> {
  // #ifdef APP-PLUS
  plus.navigator.setFullscreen(false);
  plus.navigator.showSystemNavigation()
  plus.screen.lockOrientation('portrait-primary');
  // #endif
  // #ifdef H5
  screen.orientation.lock('portrait');
  // #endif
  loadingShow.value=false
})
</script>

<style scoped lang="scss">
.box{
  width: 100%;
  height: 100vh;
  touch-action: pan-y; /* 只允许垂直滑动 */
  padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.1 */
  padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.1 */
  .loading{
    width: 200rpx;
    height: 200rpx;
    position: absolute;
    z-index: 6666;
    left:calc(50% - 100rpx);
    top: calc(50% - 100rpx);
  }
  .iframe-box{
    width: 100%;
    position: relative;
    top: -1px;
    left: -1px;
    .qpimg{
      width: 120rpx;
      height: 30rpx;
      position: fixed;
      left:calc(50% - 60rpx);
     // top:100px;
      z-index: 600;
    }
  }
}
</style>