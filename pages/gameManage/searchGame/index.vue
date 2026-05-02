<template>
  <view class="container u-flex-column">
    <uv-navbar placeholder bgColor="#1c1c1c" title="游戏搜索" :safeAreaInsetTop="true"  @leftClick="pagesRoute" leftIconColor="#fff" :titleStyle="{color:'#fff'}">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
    </uv-navbar>
    <view class="search-box">
      <uv-search placeholder="请输入你要查找的游戏名称"  @custom="searchBut" v-model="formData.keyword" :actionStyle="{'color':'#ffffff'}"></uv-search>
    </view>
    <!--  #ifndef H5    -->
    <scroll-view scroll-y="true" :style="`height:calc(100vh - ${topHeight + 44 + 60}px)` " :enable-flex="true">
    <!--    #endif    -->
    <!--  #ifdef H5    -->
    <scroll-view scroll-y="true" class="u-flex-grow"  :style="`height:calc(100% - 50px)`"  :enable-flex="true">
<!--    <view style="height: 100rpx"></view>-->
    <!--    #endif    -->
      <view class="records-box u-flex u-flex-between">
         <view class="u-flex-column  u-flex-grow">
           <view class="title">历史记录</view>
           <view class="list u-flex u-flex-wrap u-flex-content-start">
             <view class="item" v-for="(it,index) in searchList" :key="index" @click="getKeyBut(it)">{{ it }}</view>
           </view>
         </view>
         <view class="u-flex-shrink0">
           <uv-icon @click="delSearchList" name="trash" color="#999999" size="30"></uv-icon>
         </view>
      </view>
      <view class="records-boxs" v-if="!islodLoading&&searchGameList.length" >
        <view class="title">搜索结果</view>
        <goodsList :list="searchGameList"/>
      </view>
      <view v-if="!islodLoading&&!searchGameList.length" style="width: 100%;text-align: center">
        <uvNoData/>
      </view>
      <view class="records-boxs" v-if="!islodLoading&&!searchGameList.length">
        <view class="title">热门游戏推荐</view>
        <goodsList :list="hotGameList"/>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { getGameList } from "@/api/user";
import {computed, ref,reactive} from "vue";
import {pagesRoute} from '@/utils/index.ts'
import { onLoad, onShow } from "@dcloudio/uni-app";
import goodsList from "@/components/goodsList/game";
const topHeight = computed(() => {
  return uni.getSystemInfoSync().statusBarHeight
})
import { userStore } from "@/stores/user"
const userDataStore = userStore();
const formData=reactive({
  keyword:''
})
const getKeyBut =(it:any)=>{
  formData.keyword=it
}
const searchBut=async (it:any)=>{
  if(!it){
    return
  }
  userDataStore.setSearchGameNameList(it)
  const searchList = gameList.value.filter(item => item.game_name.includes(it)  ||  item.game_name_pinyin.includes(it))
  const list=userDataStore.allVenueList
  searchGameList.value=searchList.map(it=>{
    const isData=list.find(its=>its.venue_code === it.venue_code)
    it.is_maintain=isData?isData.is_maintain : true
    return it
  })
  islodLoading.value=false
}
const islodLoading=ref(true)
const gameList=ref([])
const hotGameList=ref([])
const searchList=computed(()=>userDataStore.searchGameNameList)
const delSearchList =()=>{
  userDataStore.delSearchGameNameList()
}

const searchGameList=ref([])

//获取娱乐场 游戏
const getylGameListBut = async () => {
  const res = await getGameList()
  gameList.value= res.data
  const list=userDataStore.allVenueList
  gameList.value.forEach((it,index)=>{
    if(index<6){
      const isData=list.find(its=>its.venue_code === it.venue_code)
      hotGameList.value=[...hotGameList.value,{...it,is_maintain:isData?isData.is_maintain:true}]
    }
  })
}

onLoad(() => {
  getylGameListBut()
})



</script>

<style lang="scss" scoped>
.container{
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:$uni-bg-color-grey;
  .search-box{
    width: calc(100% - 40rpx);
    height: 100rpx;
    line-height: 100rpx;
    background: $uni-default-back3Color;
    padding:0 20rpx;
   // border-top:2rpx solid $uni-default-backColor ;
    //  #ifdef H5
    //position: fixed;
    //top: 44px;
    //z-index: 66669;
    //overflow: hidden;
    //#endif
  }
  .records-box{
    width:calc(100% - 50rpx);
    padding: 25rpx;
  }
  .records-boxs{
    //padding: 10rpx;
    .title{
      padding:0 25rpx;
    }
  }
  .title{
    font-size: 30rpx;
    font-weight: bold;
  }
  .list{
    .item{
      padding: 4rpx 15rpx;
      border-radius: 20rpx;
      font-size: 24rpx;
      background: $uni-bg-color;
      color:  $uni-default-backColor;;
     // border: 2rpx solid $uni-default-backColor;
      margin: 20rpx 20rpx 0 0 ;
    }
  }
}
</style>

