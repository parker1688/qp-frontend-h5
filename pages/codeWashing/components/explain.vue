<template>
  <view>
    <uv-overlay :show="show" @click="close">
      <view class="overlay-box u-flex-column u-flex-between u-flex-items-center" @click.stop="">
        <view class="top"></view>
        <view class="dtls-box">
          <view class="title-box u-flex-column u-flex-items-center">
            <view class="title">洗码说明</view>
          </view>
          <scroll-view ref="scrollRef"  :scroll-top="scrollTop"  @scroll="scroll" scroll-y="true"  style="height:570rpx">
            <view  class="list-box">
              <view v-for="(it,index) in list" :key="index" class="list-item u-flex-start-between">
                <label>{{index+1}}.</label>
                <view class="u-flex-grow" v-html="it"></view>
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
const  scrollRef =shallowRef()
const scrollTop=ref(0)
const show=ref(false)

const  list=ref([
    '返水金额=有效投注额*当前洗码比例',
    '每次领取返水后，有效投注额会归零重新统计，当前下注金额也会按照最近领取的时间节点重新统计',
    '可在<text style="color: #ff0000;">【当前洗码详情】</text>查看实时的有效投注额与洗码比例',
    `可在<text style="color: #ff0000;">【返水记录】</text>中查看每笔返水的记录`,
    `随着累计有效投注额的提升，洗码比例也会提升，详情可查看<text style="color: #ff0000;">【洗码介绍】</text>表，统计历史有效投注额`,
    `点击<text style="color: #ff0000;">【领取返水】</text>即可领取返水奖励，领取需要满足<text style="color: #ff0000;">【最小金额】</text>，若不满足则无法领取`,
    `洗码礼金无上限，多玩多送`,
    `本平台保留活动所有权力，包括但不限于:任何会员或者团体以不正常的方式进行投注，如无风险投注、对赌行为或者机械下注等方式套取洗码礼金，平台方有权在不通知的情况`
])


const close=()=>{
  show.value=false
}

const open=(it:any)=>{
  show.value=true
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
      height: 97rpx;
      margin-bottom: 26rpx;
      background: $uni-bg-color;
      .title{
        font-family: $uni-family-Bold;
        font-size: 36rpx;
        color: #1c1c1c;
        margin-top: 30rpx;
      }
    }

  }
  .list-box{
    width: calc(100% - 60rpx);
    padding:60rpx 30rpx 30rpx 30rpx;
    background: #FFFFFF;
    >view{
      margin-bottom: 30rpx;
      font-size: 26rpx;
      color: #1c1c1c;
      font-family: $uni-family-Regular;
      label{
        font-family: $uni-family-Bold;
        margin-right: 16rpx;
      }
    }

  }
  .list-box:first-child{

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