<template>
   <view class="container">
     <uv-navbar bgColor="#cccccc" @leftClick="pagesRoute"  :placeholder="true" :safeAreaInsetTop="false">
       <template v-slot:left>
         <view class="uv-nav-slot">
           <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
         </view>
       </template>
       <template v-slot:center>
         <view class="uv-nav-slot">
           <uv-search placeholder="请输入搜索内容" :showAction="false" @search="searchBut" v-model="formData.keyword"></uv-search>
         </view>
       </template>
     </uv-navbar>
     <view class="content-box u-flex" :style="`height: ${ctHeight}px`">
          <view class="list-l u-flex-column-center-start u-flex-shrink0" :style="`height: ${ctHeight}px`">
               <view class="u-flex-column u-flex-items-center" v-for="(item,index) in menuList" :key="item.value" @click="menuBut(item,index)" :class="{'action':index == menuNun}">
                 <image style="width: 180rpx;height: 75rpx" src="https://pic2.zhimg.com/v2-94a0bc8b2774dc9a4dc9a7a01981d30b_1440w.jpg"></image>
                 <view>{{ item.venue_name }}</view>
               </view>
          </view>
          <view class="list-r u-flex-grow"  :style="`height: ${ctHeight}px`">
            <scroll-view  :style="`height: ${ctHeight}px`" scroll-y="true" @scrolltolower="scrolltolower">
              <view class="u-flex">
                <view class="list-content">
                  <view  v-for="item in dataList.filter((o,i)=>(((i+1)%2) === 1))" :key="item.index" @click="gameUrlTo(item)" class="item-box u-flex-column">
                    <view class="item-top">
                      <view class="type u-flex-xy-center">AG</view>
                      <image style="width:180rpx;height: 180rpx" :src="item.img_icon"></image>
                    </view>
                    <view class="u-flex">
                      <view class="name u-flex-xy-center">{{ item.game_name }}</view><uv-icon name="star" font-size="20" color="#f0ad4e"></uv-icon>
                    </view>
                  </view>
                </view>
                <view class="list-content">
                  <view v-for="item in dataList.filter((o,i)=>(((i+1)%2) === 0))" :key="item.index" @click="gameUrlTo(item)" class="item-box u-flex-column">
                    <view class="item-top">
                      <view class="type u-flex-xy-center">AG</view>
                      <image style="width:180rpx;height: 180rpx" :src="item.img_icon"></image>
                    </view>
                    <view class="u-flex">
                      <view class="name u-flex-xy-center">{{ item.game_name }}</view><uv-icon name="star" font-size="20" color="#f0ad4e"></uv-icon>
                    </view>
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>
     </view>
   </view>
</template>

<script lang="ts" setup>
import {getGameList,freeVenueLaunch,getVenueList} from "@/api/user";
import {pagesRoute } from "@/utils/index"
import {computed, ref} from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
const keyword=ref('')
const  ctHeight=computed(()=>{
  return uni.getSystemInfoSync().windowHeight - 44
})
const balance=ref(0)

const formData={
  venue_code:'',
  //keyword:'',
  game_type:'',
  hot:0
}

const yxData= ref({})

const dataList =ref([])
const scrolltolower = (item:any) =>{
}
const menuList = ref([])
const menuNun=ref(0)

const menuBut=(it,index)=>{
  menuNun.value=index
  formData.venue_code =it.venue_code
  formData.game_type =it.game_type
  getGameListBut()
}
const searchBut= (it:any)=>{
}
//进入游戏
const gameUrlTo =(item:any)=>{
  uni.showModal({
    title: '是否进入游戏',
    success: function (res) {
      if (res.confirm) {
        freeVenueLaunchBut(item)
      } else if (res.cancel) {
        //console.log('用户点击取消');
      }
    }
  });

}

const freeVenueLaunchBut=async (item:any)=>{
  const pere={
    venue_code:item.venue_code,
    game_code:item.game_code,
    tableId:item.id
  }
 const data=await freeVenueLaunch(pere)
  if(data.data.gameUrl){
    window.location.href = data.data.gameUrl
  }
}

//获取游戏列表
const getGameListBut = async() => {
  const data = await getGameList({venue_code:formData.venue_code})
  dataList.value=data.data

}
//获取场馆列表
const getVenueListBut = async() => {
  const data = await getVenueList()
  menuList.value=data.data
  formData.game_type=menuList.value[0].game_type || ''
  getGameListBut()
}


onLoad((it) => {
  const id='TYQP'
  formData.venue_code=id
  getVenueListBut()
})
onShow( () => {

})
</script>

<style lang="scss" scoped>
.container{
   width: 100%;
   height: 100vh;
   overflow: hidden;

}
.content-box{
    width: 100%;
    background-color: #555555;
   .list-l{
     width: 200rpx;
     border-right: 1px solid #cccccc;
     font-size: 32rpx;
     color: #f0ad4e;
     overflow-y:auto ;
     >view{
       padding: 4rpx 0;
       margin-top: 10rpx;
     }
     .action{
       background-color: #999999;
     }

   }
   .list-r{
     .item-box{
       width: 200rpx;
       height: 240rpx;
       margin-top: 20rpx;
       position: relative;
       padding:20rpx;
       overflow: hidden;
       margin-left: 20rpx;
       .item-top{
         width: 200rpx;
         height: 200rpx;
         overflow: hidden;
         image{
           border-radius: 50%;
           overflow: hidden;
           background: white;
         }
        .type{
           position: absolute;
           z-index: 6;
           top: 10rpx;
           left: 20rpx;
           width: 80rpx;
           height: 40rpx;
           font-size: 26rpx;
           font-weight: 600;
           background: #8400FF;
           border-radius: 10rpx;
           color: white;
         }
       }
       .name{
         background-color: #f1f1f1;
         color: #8400FF;
         height: 40rpx;
         font-size: 24rpx;
         border-radius: 20rpx;
         margin-right: 20rpx;
         flex: 1;
       }
     }

  }
}
</style>

