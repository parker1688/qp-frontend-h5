<template>
  <view class="myInfo-box overflow-y">
    <uv-navbar placeholder bgColor="#1c1c1c" @leftClick="pagesRoute"  leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="个人中心">
      <template v-slot:left>
        <view class="uv-nav-slot">
          <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
        </view>
      </template>
    </uv-navbar>

    <!--     #ifdef H5-->
    <view class="myInfo u-flex-grow" style="min-height:calc(100% - 152rpx);">
    <!--      #endif-->
      <!--     #ifdef APP-PLUS || MP-WEIXIN-->
    <view class="myInfo u-flex-grow" :style="`min-height:calc(100vh - 152rpx - ${topHeight}px);`">
    <!--  #endif  -->
      <view class="routrList">
        <view class="list-box " v-for="(item,index) in routrList"  :key="index" @click="goToPath(item)">
          <view class="u-flex-center-between">
            <view class="u-flex-center-start">
              <uv-icon size="50rpx" :name="item.icon"></uv-icon>
              <view class="title u-flex-column-start-between">
                <view style="font-size: 28rpx;">{{ item.name }}</view>
                <view style="font-size: 22rpx;color: #999;">{{ item.text }}</view>
              </view>
            </view>
            <view v-if="item.code">
              <text v-if="item.type" class="copyColor" @click.stop="copyTextBut(item.name)" >{{item.code}}</text>
              <text v-else class="textColor">{{item.code}}</text>
            </view>
            <view v-else>
              <view class="u-flex-xy-center" v-if="!item.path&&index == 2" @click.stop="kfbut">
                <text v-if="item.value" class="value" style="margin-right: 44rpx">{{item.value}}</text>
                <uv-icon  v-if="!item.code&&!item.type" size="30rpx" color="#c7c7c7" name="arrow-right" ></uv-icon>
              </view>
              <view class="u-flex-xy-center" v-else>
                <text v-if="item.value" style="margin-right: 44rpx" class="value">{{item.value}}</text>
                <uv-icon  v-if="!item.code&&!item.type" size="30rpx" color="#c7c7c7"  name="arrow-right" @click=""></uv-icon>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <kfPopup ref="kfPopupRef"/>
  </view>
</template>

<script lang="ts" setup>
import {ref, reactive, shallowRef, computed,watch,watchEffect} from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { copyText,toPtah,pagesRoute} from "@/utils/index"
import { userStore } from "@/stores/user"
import kfPopup from './kfPopup'
import {getUserinfoBut} from "@/hooks/publicRequest";
const userDataStore = userStore();
const userData = computed(() => userDataStore.userInfo)
const kfPopupRef=shallowRef()
const copyTextBut=(text:any)=>{
  copyText(text)
}
const strLenght=(str:any,num:number = 1)=>{
  return str.slice(0,num -1) + '****' +str.slice(0 - num)
}
const routrList =ref([])
watch(()=>userDataStore.userInfo,(newVal)=>{
  routrList.value =[
    {icon:'/static/my/user/user.png' , name:'个人资料',text:'修改完善个人信息',value:'',path:'/pages/myManage/updateUser/index',code:'',type:0},
    {icon:'/static/my/user/emall.png' , name:'邮箱验证',text:'绑定邮箱，接受相关彩金赠送信息',value:userData.value.email?'已绑定':'未绑定',path:'/pages/myManage/mailbox/index',code:'',type:0},
    {icon:'/static/my/user/yhk.png' , name:'手机号验证',text:userData.value.tel?strLenght(userData.value.tel,4)+'，如需修改请联系客服':'绑定真实手机号码',value:userData.value.tel?'已绑定':'未绑定',path:userData.value.tel?'':'/pages/myManage/updatePhone/index',code:'',type:0},
    {icon:'/static/my/user/yhk.png' , name:'银行卡提现管理',text:'银行卡提现方式管理',value:'',path:'/pages/savingsManage/bankCard/list',code:'',type:0},
    {icon:'/static/my/user/xnb.png' , name:'虚拟钱包提现管理',text:'虚拟钱包提现方式管理',value:'',path:'/pages/savingsManage/addPurse/list',code:'',type:0},
    {icon:'/static/my/user/zfb.png' , name:'支付宝提现管理',text:'支付宝提现方式管理',value:'',path:'/pages/savingsManage/zfb/list',code:'',type:0},
    {icon:'/static/my/user/pad.png' , name:'修改密码',text:'定期修改有利于账号安全',value:'',path:'/pages/myManage/updatePaw/index',code:'',type:0},
    {icon:'/static/my/user/ID.png' , name:userData.value.user_id,text:'我的ID',value:'',path:'',code:'复制',type:1}
  ]
})
const topHeight = computed(() => {
  return uni.getSystemInfoSync().statusBarHeight
})

const kfbut=()=>{
  kfPopupRef.value?.open()
}


onShow(() => {
  getUserinfoBut()
})
const goToPath=(it:any)=>{
  if(it.path){
    toPtah(it.path)
  }
}
</script>

<style  lang="scss" scoped>
.myInfo-box{
  background-color: $uni-default-back0Color;
  overflow: hidden;
  // #ifdef H5
  height: 100%;
  // #endif
  // #ifdef APP-PLUS || MP-WEIXIN
  height:100vh;
  // #endif
  .myInfo{
    margin-top: 76rpx;
    width: 100%;
    background-color: $uni-bg-color-grey;
    border-radius: 30rpx 30rpx 0 0;
  }
  .routrList{
    padding-bottom: 20rpx;
  }
}

.textColor{
  color: $uni-color-cl;
}

.copyColor{
  color:  $uni-color-primary;
  font-size: 24rpx;
}
.list-box{
  width: 100vw;
  height: 116rpx;
  background-color: #ffffff;
  border-radius: 30rpx;
  margin-top: 20rpx;
  overflow: hidden;
  .value{
    color: #7a7683;
    font-size: 24rpx;
  }
  .title{
    margin-left: 20rpx;
    height: 66rpx;
  }
  >view{
    width:calc(100vw - 50rpx);
    height: 66rpx;
    margin:25rpx 30rpx;
  }
}
//.list-box:nth-child(2),.list-box:nth-child(4){
//  border-radius: 30rpx 30rpx 0 0;
//  >view{
//    border-bottom: 2rpx solid $uni-text-color-disable;
//  }
//}
//.list-box:nth-child(5){
//  border-radius: 0!important;
//  margin-top: 0;
//  >view{
//    border-bottom: 2rpx solid $uni-text-color-disable;
//  }
//
//}
//.list-box:nth-child(3),.list-box:nth-child(6){
//  margin-top: 0;
//  border-radius:0 0 30rpx 30rpx ;
//}
</style>
