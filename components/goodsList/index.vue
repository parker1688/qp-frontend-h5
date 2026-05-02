<template>
  <view class="goods-box u-flex u-flex-wrap u-flex-content-start">
    <view v-for="(it,index) in parent.list" :key="index" class="item-box u-flex-direction-column" :class="isListTure?'cg-top':''">
      <view class="type u-flex-xy-center" v-if="!isListTure">
        <uv-icon size="25" v-if="parent.isCollect" @click="addCollectBut(it)" color="#ffffff" name="star"></uv-icon>
        <uv-icon size="25" v-else color="#B8741A" @click="delCollectBut(it.id)" name="star-fill"></uv-icon>
      </view>
      <view :class="isListTure?'imgsBox':'imgBox'">
        <uv-image mode="aspectFill"  @click="gameUrlTo(it)" :src="baseImgUrl+it.img_icon" width="100%" radius="20rpx" height="100%" :observeLazyLoad="true">
          <template v-slot:loading>
            <image src="/static/search/ljz.png" style="width:120rpx;height:120rpx"></image>
          </template>
          <template v-slot:error>
            <image :src="baseUrl+it.img_icon" style="width:100%;height:100%"></image>
          </template>
        </uv-image>
        <view class="hwz-box u-flex-direction-column" v-if="it.is_maintain">
          <image src="/static/home/whz.png"></image>
          <text>维护中...</text>
        </view>
      </view>
       <view class="name u-flex-xy-center" v-if="!isListTure">
        <view class="u-flex u-flex-nowrap">{{it.game_name || it.venue_name}}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {computed,ref} from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import environment from '@/utils/environments.ts'
import {getPtUrl} from '@/utils/pt.ts'
const baseUrl = environment.envConfigs.url
const baseImgUrl = environment.envConfigs.imgUrl
import {addCollect,delCollect,getVenueList,freeVenueLaunch} from "@/api/user";
import { openGame} from "@/utils/index"
import { getGtype} from "@/utils/venue"
const parent = withDefaults(
    defineProps<{
      list : Array,
      isCollect:boolean
      type:string,
    }>(),
    {
      type:'',
      list: [],
      isCollect:true,
    }
)
import { userStore } from "@/stores/user"
const userDataStore = userStore();
import { startStore } from "@/stores/start"
const emit = defineEmits(['delBut'])
const isToken=computed(()=> userDataStore.token?true:false)
const isListTure=computed(()=> startStore().venueGameListType.includes(parent.type))  //游戏进入第三方还是自己游戏列表
const gamecode=ref('')
const  addCollectBut=async (it:any)=>{
  if (!isToken.value) {
    emit('loginBut')
    return
  }
  const data={
    id:it.id,
    venue_code:it.venue_code,
    venue_type:it.venue_type,
    game_code:it.game_code,
    game_name:it.game_name,
    img_icon:it.img_icon,
  }
  const res =await addCollect(data)
  if(res.data){
    uni.showToast({
      title: '收藏成功！',
    })
  }
}
//进入游戏
const gameUrlTo =(item:any)=>{
  if (!isToken.value) {
    emit('loginBut')
    return
  }
  if(item.is_maintain){
    return
  }
  freeVenueLaunchBut(item)

}
const freeVenueLaunchBut=async (item:any)=>{
  const pere={
    venue_code:item.venue_code,
    game_code:getGameCode(item),
    tableId:item.id || '',
    gtype:getGtype(item)
  }
  const data=await freeVenueLaunch(pere)
  if(item.venue_code=="PTDZ"){
    const res=JSON.parse(data.data.gameUrl)
    const gameUrl=getPtUrl({...res.sessionToken,game_code:item.game_code})
    openGame({gameUrl:gameUrl,title:item.game_name || item.venue_name})
  } else if(data.data.gameUrl){
    openGame({gameUrl:data.data.gameUrl,title:item.game_name || item.venue_name})
  }
}

const getGameCode = (item:any) =>{
 if(item.game_type==="sport" && item.venue_code==="WALI"  ){
    return '100'
  } else if(item.game_type==="live" && item.venue_code==="WALI" ){
    return  '80'
  }else {
    return item.game_code || ''
  }

}

const  delCollectBut=async (id:any)=>{
  if (!isToken.value) {
    emit('loginBut')
    return
  }
  const res =await delCollect({id})
  if(res.data){
    emit('delBut', {id})
    uni.showToast({
      title: '删除成功！',
    })
  }

  onShow(async ()=>{

  })
}

</script>

<style lang="scss" scoped>
.goods-box{
  width:calc(100vw - 60rpx) ;
  padding:0 30rpx;
  .item-box{
    position: relative;
    width: 210rpx;
    height: 266rpx;
    border-radius: 26rpx;
    overflow: hidden;
    background:$uni-default-backf4Color;
    margin-right:calc((100% - 630rpx)/2);
    margin-bottom:30rpx ;
  }
  .cg-top{
    margin-top: 30rpx;
    margin-bottom:0;
  }
  .type{
    position: absolute;
    z-index: 66;
    top: 12rpx;
    right: 12rpx;
    width: 34rpx;
    height: 34rpx;
    background: #d5e0ed;
    border-radius: 50%;

  }
  .name{
    margin-top: 20rpx;
    view {
      padding: 2rpx;
      color: $uni-default-back0Color;
      height: 36rpx;
      border-radius: 4rpx;
      font-size:32rpx;
      overflow: hidden;
    }
  }
  .imgBox{
    position: relative;
    width: 163rpx;
    height: 165rpx;
    border-radius: 20rpx;
    overflow: hidden;
  }
  .imgsBox{
    position: relative;
    width: 210rpx;
    height: 266rpx;
    border-radius: 20rpx;
    overflow: hidden;
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
  .item-box:nth-child(3n){
    margin-right: 0;
  }
}
</style>