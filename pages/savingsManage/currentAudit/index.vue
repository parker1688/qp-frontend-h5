<template>
  <view class="container">
    <view class="table-box u-flex">
      <view v-for="(it,index) in typeList" :key="index" class="u-flex-xy-center" @click="tableBut(it,index)" :class="{'action':index ==tableNum }">{{it.name}}</view>
    </view>
    <view class="u-flex menuList" v-if="!tableNum">
      <view class="wt34">流水时间</view>
      <view>需求打码</view>
      <view>设计打码</view>
      <view>状态</view>
    </view>
    <view class="u-flex menu1List" v-else>
      <view class="wt34">流水时间</view>
      <view>提现类型</view>
      <view>提现金额</view>
    </view>
      <scroll-view scroll-y="true" :style="`height:calc(${homeHeight -40}px - 130rpx)`" @scrolltolower="scrolltolower" :enable-flex="true">

        <view class="u-flex menuList list-box" v-if="!tableNum">
          <view class="font wt34">03-09 20:20:20</view>
          <view class="color0">300</view>
          <view class="color1">30</view>
          <view>状态</view>
        </view>
        <view class="u-flex menu1List list-box"  v-else>
          <view  class="font wt34">03-09 20:20:20</view>
          <view>提现类型</view>
          <view class="color1">+900</view>
        </view>
        <!--      <view v-if="!pager.loading&&pager.lists.length" class="u-flex-x-center" style="padding: 25rpx;font-size: 30rpx">已全部加载~</view>-->
        <!--      <uvNoData v-if="!pager.loading&&!pager.lists.length"/>-->
      </scroll-view>

  </view>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, shallowRef} from "vue";
import { usePaging } from "@/hooks/usePaging";
import { onLoad, onShow, onReady } from "@dcloudio/uni-app";
const typeList =ref([
  {name:'流水详情',type:1},
  {name:'资金明细',type:2}
])


const formData = reactive({
  funding_type:0,
  startAt:'',
  endAt:''
})


const tableNum=ref(0)
const tableBut = (it,index:any) =>{
  tableNum.value = index

}
const getStartAtEndAt=(type:number)=>{

}

onLoad(()=>{

})
onShow(()=>{

})

</script>

<style lang="scss" scoped>
/* 页面整体样式 */
.container {
  box-sizing: border-box;
  overflow: hidden;
  // #ifdef H5
  height: 100%;
  // #endif
  // #ifdef APP-PLUS || MP-WEIXIN
  height:100vh;
  // #endif
  background-color: $uni-text-color-disable;
  .h-top {
    color: white;
    .menuBox{
      font-size: 30rpx;
    }
    image{
      width: 50rpx;
      height: 55rpx;
      margin-right: 4rpx;
    }
  }
  .table-box{
    height: 80rpx;
    width: 80vw;
    border-radius: 40rpx;
    color: #FFFFFF;
    background: $uni-bg-color;
    margin: 20rpx auto ;
    view{
      flex: 1;
      text-align: center;
      color: $uni-text-color;
    }
    .action{
      color: $uni-bg-color;
      background:#f9ae3d;
      border-radius: 40rpx;
    }
  }
  .menuList{
    height: 80rpx;
    width: 100%;
    >view{
      width: 22%;
      line-height: 80rpx;
      text-align: center;
      font-size: 28rpx;
    }
    .wt34{
      width:34%;
    }
    .font{
      font-size: 24rpx;
    }

  }
  .menu1List{
    height: 80rpx;
    width: 100%;
    >view{
      width: 33%;
      line-height: 80rpx;
      text-align: center;
      font-size: 28rpx;
    }
    .wt34{
      width: 34%;
    }
    .font{
      font-size: 24rpx;
    }
  }
  .color0{
    color: $uni-color-primary;
  }
  .color1{
    color: $uni-color-cl;
  }
  .list-box{
    background: white;
    margin-bottom: 10rpx;
  }

}

</style>