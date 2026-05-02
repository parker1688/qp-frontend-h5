<template>
  <div>
    <uv-overlay :show="show">
      <view class="menu-top u-flex u-flex-items-start">
        <view class="day-box">
          <view class="u-flex u-flex-between ">
            {{ parent.title }}
          </view>
          <view class="dayList-box  u-flex u-flex-wrap" v-if="!isImgTrue">
            <view class="dayItem u-flex-xy-center u-flex-shrink0" v-for="(it,index) in parent.list" :class="{action:index==dayNum}" :key="index" @click="dayBut(it,index)">
                <view v-if="it.name"> {{it.name}}</view>
            </view>
          </view>
          <view class="imgList-box  u-flex u-flex-wrap" v-else>
            <view class="dayItem u-flex-xy-center u-flex-shrink0" v-for="(it,index) in parent.list" :class="{action:index==dayNum}" :key="index" @click="dayBut(it,index)">
                  <image  style="width: 120rpx;height: 120rpx" :src="it.img"></image>
            </view>
          </view>
          <view class="u-flex u-flex-around daybut">
            <view class="u-flex-xy-center cz" @click="close"> {{ parent.notTetx }}</view>
            <view class="u-flex-xy-center qr u-flex-grow" @click="dayOkBut"> {{ parent.oKtext }}</view>
          </view>
        </view>
      </view>
    </uv-overlay>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, shallowRef} from "vue";
const show=ref(false)

const emit = defineEmits(['getData'])
const dayNum=ref(-1)
const parent = withDefaults(
    defineProps<{
      list : Array,
      notTetx:String,
      oKtext:String,
      title:String,
      isImgTrue:Boolean,
    }>(),
    {
      title:'查询时间',
      notTetx:'取消',
      oKtext:'确定',
      isImgTrue:false,
      list: []
    }
)

const itemValue=ref({})
const dayBut=(it:any,index:number)=>{
  dayNum.value=index
  itemValue.value=it
}
const open=(type)=>{
  show.value=true
  const index= parent.list.findIndex(its=>its.type ==type)
  dayNum.value=index
}

const dayOkBut=()=>{
  emit('getData',itemValue.value)
  show.value=false
}

const close=()=>{
  show.value=false
  if( parent.notTetx == '重置'){
    dayNum.value= -1
    emit('getData')
  }
}
defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.menu-top{
  width: 100%;
  background: #FFFFFF;
  font-size: 24rpx;
  .day-box{
    width: 100vw;
    min-height: 300rpx;
    padding: 30rpx 0;
    z-index: 6666;
    position: fixed;
    left: 0;
    bottom: 0;
    background: white;
    border-radius: 30rpx 30rpx 0 0 ;
    >view:first-child{
      border-bottom: 2rpx solid #666666;
      font-size: 30rpx;
      height: 60rpx;
      padding: 0 25rpx;
    }
    .dayList-Img-box{
      margin-top: 30rpx;
      padding:0 25rpx;
      .dayItem{
        width: 200rpx;
        height: 60rpx;
        border-radius: 30rpx;
        border: 2px solid $uni-default-back6Color;
        margin-right:calc((100vw - 650rpx)/2);
        margin-bottom: 20rpx;
        font-size: 28rpx;
      }
      .dayItem:nth-child(3n){
        margin-right:0;
      }
      .action {
        color: $uni-default-color;
        border: 2px solid $uni-default-color;
      }
    }
    .imgList-box{
      margin-top: 30rpx;
      padding:0 25rpx;
      .dayItem{
        width: 120rpx;
        height: 120rpx;
        border-radius: 30rpx;
        margin-right:30rpx ;
        box-sizing: border-box;
      }
      .action {
        color: $uni-default-color;
        border: 2px solid $uni-default-color;
        background: $uni-default-color;
      }
    }
    .dayList-box{
      margin-top: 24rpx;
      padding:0 30rpx;
      margin-right: 0;
      .dayItem{
        width: 206rpx;
        height: 60rpx;
        border-radius: 30rpx;
        border: 2rpx solid $uni-bg-color-grey;
        margin-right:calc((100vw - 678rpx)/2);
        margin-bottom: 20rpx;
        font-size: 28rpx;
        background-color: $uni-bg-color-grey;
        box-sizing: border-box;
        color: #3c3c3c;
      }
      .dayItem:nth-child(3n){
        margin-right:0;
      }
      .action {
        color: $uni-default-color;
        border: 2rpx solid $uni-default-color;
        background-color: $uni-text-color-inverse;
        box-sizing: border-box;
      }
    }
    .daybut{
      margin: 40rpx;
      .cz{
        background: $uni-default-xzColor;
        border: 2rpx solid $uni-default-xzColor;
        color: $uni-default-color;
        font-family: $uni-family-Medium;
        font-size: 28rpx;
      }
      .qr{
        color: $uni-default-color;
        color: #FFFFFF;
        margin-left: 20rpx;
        width: 446rpx;
        font-family: $uni-family-Medium;
        font-size: 28rpx;
      }
      >view{
        width: 206rpx;
        height: 76rpx;
        background: $uni-default-color;
        border: 2rpx solid $uni-default-color;
        border-radius: 38rpx;
        color: #FFFFFF;
      }
    }
  }
}

</style>