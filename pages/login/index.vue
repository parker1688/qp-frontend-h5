<template>
    <view class="lg-box overflow-y">
      <uv-navbar placeholder bgColor="#1c1c1c" leftIconColor="#fff" :autoBack="false" :titleStyle="{color:'#fff'}" title="登录&注册" >
        <template v-slot:left>
          <view class="uv-nav-slot" @click="leftClick">
            <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
          </view>
        </template>
      </uv-navbar>
      <view class=" u-flex-column u-flex-grow u-flex-end">
       <view  class="u-flex-shrink0 login-top u-flex-column u-flex-items-center">
             <image :src="baseImgUrl + bannerImg" style="width: 540rpx;height: 198rpx;"></image>
             <view class="text-box u-flex-center-between">
               <text>高端体验</text>  <text>至尊享受</text> <text>品质服务</text>
             </view>

       </view>
        <view class="logre-box u-flex-shrink0">
          <view class="table-box u-flex-center-between">
            <view  @click="tableBut(0)" :class="!tableNum?'action':'w35l'">
              <text>账号密码登录</text>
            </view>
            <view  @click="tableBut(1)" :class="tableNum?'action2':'w35r'">
              <text>用户名注册</text>
            </view>
          </view>
          <SignIn @gologin="gologin" v-if="tableNum"/>
          <log v-else/>
        </view>
      </view>
    </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed} from "vue";
const tableList =ref(['账号密码登录','用户名注册'])
import { onLoad, onShow } from "@dcloudio/uni-app";
const tableNum=ref(0)
import log from './log'
import SignIn from './SignIn'
import { userStore } from "@/stores/user"
import environment from '@/utils/environments.ts'
const baseImgUrl = environment.envConfigs.imgUrl
const bannerImg = computed(() => userStore().bannerImg)
import { toPtah } from "@/utils/index"
const leftClick=()=>{
  toPtah('/pages/tabBar/home/index',0)
}
const tableBut = (index:any) =>{
  tableNum.value = index
}
const gologin=()=>{
  tableNum.value = 0
}
onLoad((it:object)=>{
   if(it?.type){
     tableNum.value = it.type
   }
})
</script>

<style  lang="scss" scoped>
.lg-box{
  width: 100%;
  // #ifdef H5
  height: 100%;
  // #endif
  // #ifdef APP-PLUS || MP-WEIXIN
  height:100vh;
  // #endif
  background-color:$uni-default-back0Color;
  overflow: hidden;
  .login-top{
      height: 440rpx;
     image{
       width: 540rpx;
       height: 198rpx;
       margin-top: 50rpx;
     }
    .text-box{
      width: 540rpx;
      margin-top: 38rpx;
      text{
        font-family: $uni-family-Regular;
        font-size: 36rpx;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 2rpx;
        color: #f4e8da;
      }

    }
  }
  .logre-box{
    width: 100vw;
    .table-box{
      height: 112rpx;
      line-height: 112rpx;
      background-color: #e2e1e6;
      border-radius: 30rpx 30rpx 0 0;
      view{
        text-align: center;
        font-size: 35rpx;
        color: #000000;
        letter-spacing: 2rpx;
      }
      .w35l{
        width: 350rpx;
        text{
          margin-left: 25rpx;
        }
      }
      .w35r{
        width: 350rpx;
        text{
          margin-right: 21rpx;
        }
      }
      .action{
        color: $uni-default-color;
        width: 400rpx;
        height: 112rpx;
        background: url("/static/log/logl.png");
        background-size: 100% 100%;
        flex-shrink: 0;
        text{
          margin-right: 15rpx;
        }
      }
      .action2{
        color:$uni-default-color;
        width: 400rpx;
        height: 112rpx;
        background: url("/static/log/logr.png");
        background-size: 100% 100%;
        flex-shrink: 0;
        text{

          margin-left: 15rpx;
        }
      }
    }
  }


}
</style>
