<template>
  <view>
    <uv-popup ref="loginPopup" mode="center" :closeOnClickOverlay="false" round="30">
      <view class="abnormal-box u-flex-column-center-start">
        <view class="u-flex-center-end">
          <uv-icon  @click="close" size="16" name="/static/log/close.png" ></uv-icon>
        </view>
        <view class="ts-top">
          您的账号存在风险
        </view>
        <view class="yc">
          <view class="title">异常详情</view>
          <view v-if="abnormalData.login_ip"><text class="u-flex-shrink0">异地IP：</text>{{ abnormalData.login_ip }}</view>
          <view class="visitor-box u-flex" v-if="abnormalData.login_visitor_id"><text class="u-flex-shrink0">登录设备：</text>{{ abnormalData.login_visitor_id }}</view>
        </view>
        <view  class="but u-flex-x-center">
          <uv-button   customStyle="width: 386rpx;;height: 90rpx;
         	background-color: #ae8d45;border-radius: 49rpx;" @click="handleSubmit"><text class="butText">确 定</text></uv-button>
        </view>
      </view>
    </uv-popup>
  </view>
</template>

<script lang="ts" setup>
import { toPtah } from "@/utils/index"
import { computed, reactive, ref, shallowRef, watch } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
const loginPopup = shallowRef()
const funObject=ref(null)
const  close =() =>{
  loginPopup.value.close()

}

const abnormalData=ref({})
const handleSubmit =()=>{
  if(funObject.value) funObject.value()
  close()
  setTimeout(()=>{
    funObject.value=null
  })

}
const open =(item:any,fun:any) =>{
  loginPopup.value.open()
  funObject.value=fun
  abnormalData.value=item
}
defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.abnormal-box{
  width: 574rpx;
  height: 788rpx;
  background: url("/static/log/ipyc.png");
  background-size: 100% 100%;
  >view{
    width: calc(100% - 66rpx);
    margin-top: 33rpx;
  }
  .ts-top{
    margin-top: 300rpx;
    font-size: 40rpx;
    line-height: 50rpx;
    font-weight: 600;
    color: #202020;
    text-align: center;
    font-family: $uni-family-Bold;

  }
  .yc{
    font-size: 26rpx;
    margin-left: 40rpx;
    margin-top: 54rpx;
    font-family: $uni-family-Regular;
    .title{
      font-weight: 600;
      color: #202020;
      font-family: $uni-family-Bold;
    }
    >view{
      color: $uni-default-color;
    }
    text{
      font-family: $uni-family-Regular;
      color: #202020;

    }
    .visitor-box{
      width: 90%;
      height: 40rpx;
      line-height: 40rpx;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .but{
    margin-top: 51rpx;
    .butText{
      font-family: $uni-family-Bold;
      font-size: 34rpx;
      letter-spacing: 2rpx;
      color: #ffffff;
    }
  }
  .kf{
    margin-top: 42rpx;
    text-align: center;
    .sbww{
      width: 166rpx;
      height: 28rpx;
    }
  }
  :deep(.uv-form-item__body){
    padding:20rpx 0 10rpx 0;
  }
}
</style>