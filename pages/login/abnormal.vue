<template>
  <view>
    <uv-popup ref="loginPopup" mode="center" :closeOnClickOverlay="false" round="30">
      <view class="abnormal-box u-flex-column-center-start">
        <view class="u-flex-center-end">
          <uv-icon  @click="close" size="16" name="/static/log/close.png" ></uv-icon>
        </view>
        <view class="ts-top">
          <view>您的账号存在风险 </view>
          <view>已进入保护模式 </view>
        </view>
        <view class="yc">
          <view class="title">异常详情</view>
          <view v-if="abnormalData.login_ip"><text>异地IP：</text>{{ abnormalData.login_ip }}</view>
          <view class="visitor-box u-flex" v-if="abnormalData.login_visitor_id"><text>登录设备：</text>{{ abnormalData.login_visitor_id }}</view>
        </view>
        <view  class="but u-flex-x-center">
          <uv-button   customStyle="width: 386rpx;;height: 90rpx;
         	background-color: #ae8d45;font-size: 30rpx;color: #ffffff;border-radius: 49rpx;" @click="handleSubmit">立即恢复使用</uv-button>
        </view>
        <view class="kf">
          <image  @click="goToKF" class="sbww" src="/static/log/lxkf.png"></image>
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
const  close =() =>{
  loginPopup.value.close()

}
const goToKF=()=>{
  toPtah('/pages/kf/index')
}
const abnormalData=ref({})
const handleSubmit =()=>{

  toPtah('/pages/login/phoneCode?username='+ abnormalData.value.username )
}
const open =(item:any) =>{
  loginPopup.value.open()
  abnormalData.value=item
}
defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.abnormal-box{
  width: 573rpx;
  height: 887rpx;
  background: url("/static/log/abm-back.png");
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
  }
  .yc{
    font-size: 26rpx;
    margin-left: 40rpx;
    margin-top: 54rpx;
    .title{

      font-weight: 600;
      color: #202020;
    }
    >view{
      color: $uni-default-color;
    }
    .text{
      color: #202020;
    }
    .visitor-box{
      width: 100%;
      height: 40rpx;
      line-height: 40rpx;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .but{
    margin-top: 51rpx;
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