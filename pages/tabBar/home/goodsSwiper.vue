<template>
     <view class="yx-box">
       <view class="u-flex yx-box-top u-flex-between">
         <view class="u-flex-xy-center">
<!--           <view class="l-h"></view>-->
           <uv-icon :name="icon"  size="15"></uv-icon>
           <text style="margin-left: 8rpx">{{ gameName }}</text>
         </view>
         <view class="u-flex-xy-center"  v-if="!isTure">
           <view class="but-box u-flex-xy-center" :class="{action:!isTrueBut}" @click="currentLeft">
             <uv-icon name="play-left-fill" :color="!isTrueBut?'#fff':'#bcbccd'" size="8"></uv-icon>
           </view>
           <view class="but-box but-box1 u-flex-xy-center" :class="{action:isTrueBut}" @click="currentRight">
             <uv-icon name="play-right-fill" :color="isTrueBut?'#fff':'#bcbccd'" size="8"></uv-icon>
           </view>
         </view>
       </view>
       <view v-if="!isTure">
         <swiper class="swiper" :autoplay="false" :current="current" :style="swiperList[0].length>3?'height: 564rpx;':'height: 267rpx;'" @change="swiperChange">
           <swiper-item v-for="(its,indexs) in swiperList" :key="indexs"  >
             <view class="yx-list-box">
               <view class="u-flex u-flex-wrap u-flex-content-start">
                 <view v-for="(it,index) in its" :key="index" class="item-box">
                   <!--                 <view class="type u-flex-xy-center">{{ it.venue_code }}</view>-->
                   <!--                 <image  :src="it.img_icon"></image>-->
                   <uv-image mode="aspectFill" :src="baseImgUrl+it.img_icon" width="210rpx" radius="20rpx" height="263rpx" @click="gotoBut(it)">
                     <template v-slot:loading>
                       <image src="/static/search/ljz.png" style="width:120rpx;height:120rpx"></image>
                     </template>
                     <template v-slot:error>
                       <image :src="baseUrl+it.img_icon" style="width:210rpx;height:263rpx"></image>
                     </template>
                   </uv-image>
                   <view class="hwz-box u-flex-direction-column" v-if="it.is_maintain">
                     <image src="/static/home/whz.png"></image>
                     <text>维护中...</text>
                   </view>
                   <!--<view class="name u-flex-xy-center">-->
                   <!--     <view class="u-flex u-flex-nowrap">{{it.game_name}}</view>-->
                   <!-- </view>-->
                 </view>
               </view>
             </view>
           </swiper-item>
         </swiper>
       </view>
       <view v-else class="u-flex-xy-center" style="min-height: 265rpx">
         <view  v-for="(its,indexs) in swiperList" key="indexs">
           <view class="list-cg-item" v-for="(it,index) in its" @click="gotoBut(it)" :key="index" >
             <uv-image mode="aspectFill" :src="baseImgUrl+it.img_icon" :width="`calc(100vw - 60rpx)`" radius="20rpx" height="265rpx" style="margin-bottom: 20rpx">
               <template v-slot:loading>
                 <image src="/static/search/ljz.png" style="width:120rpx;height:120rpx"></image>
               </template>
               <template v-slot:error>
                 <image :src="baseUrl+it.img_icon" style="width:calc(100vh - 60rpx);height:265rpx"></image>
               </template>
             </uv-image>
             <view class="hwz-box u-flex-direction-column" v-if="it.is_maintain">
               <image src="/static/home/whz.png"></image>
               <text>维护中...</text>
             </view>
           </view>
           </view>
       </view>

     </view>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, shallowRef, watch } from "vue";
import {freeVenueLaunch} from "@/api/user";
import { userStore } from "@/stores/user"
import { startStore } from "@/stores/start"
const userDataStore = userStore();
import environment from '@/utils/environments.ts'
const baseUrl = environment.envConfigs.url
const baseImgUrl = environment.envConfigs.imgUrl
import { toPtah,openGame} from "@/utils/index"
import { getGtype} from "@/utils/venue"
const parent = withDefaults(
    defineProps<{
      list : Array,
      type:string
    }>(),
    {
      list: [],
      type:''
    }
)

const isTure=computed(()=> startStore().venueGameType.includes(parent.type))

const isListTure=computed(()=> startStore().venueGameListType.includes(parent.type))  //游戏进入第三方还是自己游戏列表

const gameName = computed(()=> {
  const res=  startStore().gameTypeList.find(it=>parent.type == it.venue_type)
  return res? res.table:''
})
const icon = computed(()=> {
  const res=   startStore().gameTypeList.find(it=>parent.type == it.venue_type)
  return res? res.icon:''
})
const isToken=computed(()=> userDataStore.token?true:false)
const emit = defineEmits(['loginBut'])
const swiperList=ref(parent.list)
const current =ref(0)
const isTrueBut=ref(true)
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
    game_code: getGame(item),
    gtype:getGtype(item)
  }
  const data=await freeVenueLaunch(pere)
  if(data.data.gameUrl){
    openGame({gameUrl:data.data.gameUrl,title:item.venue_name})
  }

}

//特殊类型判断 W
const getGame = (item:any) =>{
    if(item.game_type==="sport" && item.venue_code==="WALI"  ){
     return '100'
   } else if(item.game_type==="live" && item.venue_code==="WALI" ){
     return  '80'
   }else {
     return ''
   }

}

const gotoBut =(item:any) => {
  if (!isToken.value) {
    emit('loginBut')
    return
  }
  if(isListTure.value){
    freeVenueLaunchBut(item)
  }else {
    toPtah(`/pages/gameManage/searchVenueGame/index?game_type=${item.game_type}&venue_name=${item.venue_name + gameName.value}&venue_code=${item.venue_code}`)
  }


}

// 滑动切换时触发
const swiperChange=(e:any) =>{
  current.value=e.detail.current
  if(current.value>=swiperList.value.length -1){
    isTrueBut.value=false
  }
  if( current.value ==0){
    isTrueBut.value=true
  }
}

// 滑动结束时触发
const currentLeft=() => {
  if(current.value -1 <= 0){
    current.value =0
    isTrueBut.value=true
  }else {
    current.value =current.value -1
  }

}
const currentRight=() => {
    if(current.value>=swiperList.value.length -2){
      current.value =swiperList.value.length -1
      isTrueBut.value=false
    }else {
      current.value =current.value +1

    }

}

</script>

<style lang="scss" scoped>
.yx-box{
   width: 100vw;
  .yx-box-top{
    width:calc(100vw - 56rpx) ;
    padding:0 28rpx;
    height: 32rpx;
    margin-bottom: 23rpx;
    font-size: 28rpx;
    font-weight: 600;
    .l-h{
      width: 6rpx;
      height: 28rpx;
      background: $uni-default-color;
      border-radius:6px 0px 6px 0px;
      margin-right: 10rpx;
    }
    .but-box{
      width: 39rpx;
      height: 31rpx;
      border: 1px solid #e4e4e9;
      background:#e4e4e9;
      margin-left: 10rpx;
      border-radius: 20rpx 0 0 20rpx;
      box-sizing: border-box;
    }
    .but-box1{
      border-radius:0 20rpx  20rpx 0;
    }
    .action{
      border: 1px solid $uni-default-color;
      background: $uni-default-color;
    }
  }
  .swiper{
    width: 100vw;
    margin-bottom: 46rpx;
  }
  .yx-list-box{
    padding:0 28rpx;
    width:calc(100% - 56rpx) ;
    .item-box{
     // margin: 13rpx;
   //   margin:0 32rpx 34rpx 0;
      margin-right:calc((100% - 630rpx)/2);
      margin-bottom: 34rpx;
      position: relative;
      width: 210rpx;
      height: 263rpx;
      border-radius: 20rpx;
      overflow: hidden;
      .image{
        position: absolute;
        width: 210rpx;
        height: 263rpx;
        border-radius: 20rpx;
      }
    }
    .item-box:nth-child(3n){
      margin-right:0
    }
    .type{
      position: absolute;
      z-index: 6;
      top: 10rpx;
      left: 20rpx;
      width: 60rpx;
      height: 30rpx;
      font-size: 20rpx;
      font-weight: 600;
      background: #fff;
      border-radius: 10rpx;

    }
    .name{
      position: absolute;
      z-index: 6;
      bottom: 20rpx;
      width: 100%;
      view{
        padding: 2rpx;
        color: white;
        height: 30rpx;
        border-radius: 4rpx;
        font-size: 22rpx;
        background: $uni-default-color;
      }

    }
  }
  .list-cg-item{
    position: relative;
    width: 690rpx;
    height:265rpx;
    border-radius: 20rpx;
    overflow: hidden;
    margin-bottom: 20rpx;
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
      width:105rpx;
      height:120rpx
    }
    text{
      color: $uni-default-backColor;
      font-size: 20rpx;
      margin-top: 10rpx;

    }
  }
}
</style>