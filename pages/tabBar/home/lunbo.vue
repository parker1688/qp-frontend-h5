<template>
  <swiper class="swiper u-flex-shrink0" autoplay  circular style="width:100%;height:276rpx;">
    <swiper-item v-for="(its,indexs) in swiperList" :key="indexs"  >
      <uv-image mode="aspectFill" :src="baseImgUrl+its.sources" width="100%" radius="20rpx" height="276rpx">
        <template v-slot:loading>
          <image src="/static/search/ljz.png" style="width:120rpx;height:120rpx"></image>
        </template>
        <template v-slot:error>
          <image :src="baseUrl+its.sources" style="width:100%;height:276rpx"></image>
        </template>
      </uv-image>
    </swiper-item>
  </swiper>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, shallowRef, watch } from "vue";
import environment from '@/utils/environments.ts'
const baseUrl = environment.envConfigs.url
const baseImgUrl = environment.envConfigs.imgUrl
import { userStore } from "@/stores/user"
const userDataStore = userStore();
const swiperList=computed(()=>userDataStore.appHomelunbo)
</script>
