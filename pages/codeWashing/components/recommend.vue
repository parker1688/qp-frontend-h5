<template>
  <view>
    <uv-overlay :show="show" @click="close">
      <view class="overlay-box u-flex-column u-flex-between u-flex-items-center" @click.stop="">
        <view class="top"></view>
        <view class="dtls-box">
          <view class="title-box u-flex-column u-flex-items-center">
            <view class="title">洗码累计详情</view>
            <view class="text">累计有效投注额提升，洗码比例也会提示，参考下表</view>
          </view>
          <view class="list-title  u-flex">
            <view>游戏类型</view>
            <view class="tz">累计有效投注额</view>
            <view>洗码比例</view>
          </view>
          <scroll-view ref="scrollRef"  :scroll-top="scrollTop"  @scroll="scroll" scroll-y="true"  style="height: 470rpx">
            <view class="dtl-box">

              <view class="list-box  u-flex" v-for="(item,index) in list" :key="index">
                <view class="u-flex-xy-center">{{ getVenueName(item) }}</view>
                <view class="tz">{{ item.min_bet_amount }}~{{ item.max_bet_amount }}</view>
                <view>{{ item.bonus_rate }}</view>
              </view>
            </view>
          </scroll-view>

          <view class="but-top u-flex-xy-center" @click="close">我知道了</view>
          <view style="height: 40rpx" ></view>
        </view>
      </view>
    </uv-overlay>
  </view>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, shallowRef, watch } from "vue";
import { getRebateIntro } from "@/api/user";
const  scrollRef =shallowRef()
const scrollTop=ref(0)
const show=ref(false)
const list=ref([])
import { userStore } from "@/stores/user"
import { startStore } from "@/stores/start"
const gameTypeList=computed(()=>startStore().gameTypeList)
const getVenueName=(item:any)=>{
  const resText=gameTypeList.value.find(it=>item.game_type ==it.venue_type)
  if(resText){
    return resText?.text
  }else {
    return ''
  }
}
const getList= async ()=>{
 const res=await  getRebateIntro()
  list.value=res.data
}

const close=()=>{
  show.value=false
}

const open=(it:any)=>{
  show.value=true
  getList()
}



defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.overlay-box{
  width: 100%;
  position: fixed;
  height: 950rpx;
  bottom:0;
  .top{
    width: 150rpx;
    height: 20rpx;
    background: #FFFFFF;
    border-radius:10rpx;
  }
  .dtls-box{
    width: 100%;
    border-radius:40rpx 40rpx 0 0;
    background: $uni-bg-color-hover;
    height: 900rpx;
    overflow: hidden;
    .title-box{
      height: 140rpx;
      padding-bottom: 18rpx;
      background: #FFFFFF;
      font-family: $uni-family-Bold;
      .title{
        font-size: 36rpx;
        margin-top: 30rpx;
        margin-bottom: 20rpx;
      }
      .text{
        font-size: 24rpx;
        font-family:$uni-family-Medium;
      }
    }
    .list-title{
      background: $uni-default-back-color;
      height: 72rpx;
      >view{
        color: $uni-default-color;
        width: 20%;
        flex-shrink: 0; /* 防止收缩 */
        text-align: center;
        line-height: 72rpx;
        font-size: 24rpx;
      }
      .tz{
        width: 60%;
      }
    }
  }
  .dtl-box{
    background: #FFFFFF;
    width: 100%;
    border-radius:40rpx;
    .list-box{
      height: 58rpx;
      background: #f5f5f5;
      >view{
        color: $uni-default-back3Color;
        width: 20%;
        flex-shrink: 0; /* 防止收缩 */
        font-family:$uni-family-Medium;
        font-size: 22rpx;
        text-align: center;
        line-height: 58rpx;
        flex-shrink: 0;

      }
      .tz{
        width: 60%;
      }
    }
    .list-box:nth-child(2n){
      background:$uni-bg-color;
    }
    .but{
      height: 80rpx;
      text-align: center;
      line-height: 80rpx;
      font-size: 24rpx;
    }
  }
  .dtl-vip-box{
    margin-top: 40rpx;
    border-radius:40rpx;
    background: #FFFFFF;
    padding-bottom: 25rpx;
    .title-box{
      font-weight: 600;
      font-size: 34rpx;
      height: 100rpx;

    }
    .item-list{
      padding: 0 25rpx;
      color: $uni-default-back0Color;
      .title{
        font-size: 34rpx;
        margin-bottom: 20rpx;
      }
      .text{
        font-size: 24rpx;
        margin-bottom: 40rpx;
      }
    }
  }
  .but-top{
    width: 566rpx;
    height: 99rpx;
    background-color: $uni-default-color;
    border-radius: 49rpx;
    font-family: $uni-family-Bold;
    font-size: 34rpx;
    color: #ffffff;
    margin:40rpx auto;
  }
}
</style>