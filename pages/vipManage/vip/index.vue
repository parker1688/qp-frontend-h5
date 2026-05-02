<template>
   <view class="container overflow-y">
<!--     <scroll-view scroll-y="true" style="height:100%" :enable-flex="true">-->
     <uv-navbar placeholder bgColor="#1c1c1c" style="z-index: 6666" @leftClick="pagesRoute" leftIconColor="#fff" :titleStyle="{color:'#fff'}" title="vip中心">
       <template v-slot:left>
         <view class="uv-nav-slot">
           <uv-icon name="/static/tx/fh.png" size="20"></uv-icon>
         </view>
       </template>
     </uv-navbar>
       <view class="user-box u-flex-x-center">
         <view class="user-info">
             <view class="info-item u-flex">
                <image :src="userData.avatar || '/static/my/user/mrtx.jpg'" />
                <view>	{{ userData.nick_name||userData.user_name }}</view>
                <view class="vip-back u-flex-xy-center">
                  <text>VIP{{vipData.nowLevel<2?1:vipData.nowLevel }}</text>
                </view>
             </view>
             <view class="vip-box u-flex-column u-flex-items-end u-flex-center">
                <view class="u-flex-center-between">
                  <view class="back-box">VIP{{ vipData.nowLevel<2?1:vipData.nowLevel }}<text>打码量：<text>{{ vipData.nowBetAmount }}/{{ vipData.nextBetAmount }}</text></text></view>
                  <view class="back-box">VIP{{vipData.nowLevel<2?2:vipData.nowLevel + 1}}</view>
                </view>
                <view>
                  <uv-line-progress :percentage="vipData.nowBetAmount/vipData.nextBetAmount * 100" inactiveColor="#dc9a5f" height="10rpx" :showText="false" activeColor="#000"></uv-line-progress>
                </view>
              </view>
         </view>
       </view>
       <view class="vipNum-box">
         <swiper class="swiper" :autoplay="false" :current="current" previous-margin="48rpx" next-margin="48rpx" style="height: 864rpx;" @change="swiperChange">
           <swiper-item  v-for="(its,indexs) in dtlList" :key="indexs"  >
              <view class="vipNum-item">
                  <view class="vip-top u-flex-center-between">
                     <view>
                        <view>
                           <image class="vip-icon" src="/static/vip/vip.png" ></image>
                           <image v-for="(it,indv) in its.levelList" :key="indv" class="vip-num" :src="'/static/vip/'+it+'.png'" ></image>
                           专属特权
                        </view>
                       <view class="num">
                         需要{{ its.min_bet_amount }}打码量
                       </view>
                     </view>
                     <view>
                       <image class="vip-dj" v-if="vipData.nowLevel == maxlevel" src="/static/vip/ymj.png"  ></image>
                       <image class="vip-dj" v-else-if="vipData.nowLevel == its.level" src="/static/vip/dqdj.png"  ></image>
                       <image class="vip-dj"  v-else-if="vipData.nowLevel <its.level" src="/static/vip/dsj.png"  ></image>
                       <image class="vip-dj" v-else src="/static/vip/ysj.png"  ></image>
                     </view>
                  </view>
                  <view class="vip-content u-flex u-flex-wrap">
                   <view v-for="(it,index) in its.vipList" class="u-flex-xy-center" :style="'background:url('+ getImg(index) +');background-size:100% 100%;'">
                       <view class="item-box u-flex-column u-flex-items-end u-flex-start">
                         <view class="name">{{it.name}}</view>
                         <view class="text">{{it.text}}</view>
                         <view class="border" :class="`border${index}`"></view>
                         <view class="monoy"><text>¥</text>{{it.monoy}}</view>
                         <view v-if="index==0 && indexs!=0">
                           <image class="vip-lq" @click="levelBut(its,index)" v-if="!it.type&&vipData.nowLevel >= its.level" src="/static/vip/ylq.png"></image>
                           <image class="vip-lq" @click="levelBut(its,index)" v-if="it.type&&vipData.nowLevel >= its.level" src="/static/vip/vip-lq.png"></image>
                           <image class="vip-nlq" v-if="!it.type&&vipData.nowLevel < its.level" src="/static/vip/vip-nlq.png"></image>
                         </view>
                         <view v-if="index<3&&index>0&& indexs!=0">
                           <image class="vip-lq" @click="levelBut(its,index)" v-if="it.type" src="/static/vip/vip-lq.png"></image>
                           <image class="vip-nlq" v-else src="/static/vip/vip-nlq.png"></image>
                         </view>
                       </view>
                   </view>
                  </view>
              </view>
           </swiper-item>
         </swiper>
       </view>
       <view class="vip-Num-box u-flex-column u-flex-xy-center">
          <view class="numTop">vip{{current + 1}}</view>
          <view class="u-flex num-box">
            <view  class="text">vip1</view>
            <view class="swiper-box">
              <swiper  :current="current" circular  style="height:30rpx;" :autoplay="false"  display-multiple-items="9">
                <swiper-item class="u-flex-xy-center" v-for="(item,index) in 40" :key="index">
                    <view class="yuan" :class="getCss(index)" ></view>
                </swiper-item>
              </swiper>
              <view class="back-top"></view>
            </view>
            <view  class="text">vip30</view>
          </view>
           <view class="u-flex hd-box u-flex-x-center u-flex-items-end"  @touchend="handleTouchEnd">
             上滑查看VIP详情
           </view>
       </view>
       <vipDetails ref="vipDetailsRef"/>
<!--     </scroll-view>-->
   </view>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, shallowRef, watch } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { vipLevelList,vipUpApply,weekApply,monthApply} from "@/api/user";
import {getVipProgressBut ,getUserinfoBut} from "@/hooks/publicRequest";
import {pagesRoute} from "@/utils/index"
import vipDetails from "./details";
import { userStore } from "@/stores/user"
const userDataStore = userStore();
const vipData=computed(()=> userDataStore.vipData)
const userData = computed(() => userDataStore.userInfo)
const vipDetailsRef=shallowRef()
const maxlevel=ref(30)

const current=ref(vipData.value?.nowLevel || 0)
// 滑动切换时触发
//VIP晋级奖金领取
const vipUpApplyBut=async (level:any)=>{
  if(userData.value.is_bonus == 2){
    uni.showToast({icon: 'none',title: '您被禁止领取福利，请联系客服',})
    return
  }
  const res=await vipUpApply({level})
  uni.showToast({title: res.msg, duration:2000})
  await getVipList()
}
//VIP周奖金领取
const weekApplyBut=async ()=>{
  if(userData.value.is_bonus == 2){
    uni.showToast({icon: 'none',title: '您被禁止领取福利，请联系客服',})
    return
  }
  const res=await weekApply()
  uni.showToast({title: res.msg, duration:2000})
  await getVipList()

}
//VIP月奖金领取
const monthApplyBut=async ()=>{
  if(userData.value.is_bonus == 2){
    uni.showToast({icon: 'none',title: '您被禁止领取福利，请联系客服',})
    return
  }
  const res=await monthApply()
  uni.showToast({title: res.msg, duration:2000})
  await getVipList()

}

const levelBut=(it:any,index:number)=>{
   if(index == 0){
     vipUpApplyBut(it.level)
   }else if(index == 1){
     weekApplyBut()
   }else if(index == 2){
     monthApplyBut()
   }
}
const swiperChange=(e:any) =>{
  current.value=e.detail.current
}

const vipList=ref([
  {name:'晋级彩金',text:'晋级即可领取',type:0,monoy:'10'},
  {name:'周礼金',text:'每周一派发',type:1,monoy:'10'},
  {name:'月礼金',text:'每月1号派发',type:2,monoy:'10'},
  {name:'预期年收益',text:'等级高 收益高',type:1,monoy:'10'},
])

const dtlList=ref([])
const handleTouchEnd=(item:any)=>{
  vipDetailsRef.value.open(dtlList.value)
}

const getVipList=async ()=>{
  const res =await vipLevelList()
  const newArr=res.data.map(it=>{
    it.levels= it.level+''
    it.levelList=it.levels.split('')
    it.vipList=[
      {name:'晋级彩金',text:'晋级即可领取',type:it.upgrade_gift_apply,monoy:it.upgrade_gift},
      {name:'周礼金',text:'每周一派发',type:it.weekly_gift_apply,monoy:it.weekly_gift},
      {name:'月礼金',text:'每月1号派发',type:it.monthly_gift_apply,monoy:it.monthly_gift},
      {name:'年收益',text:'等级高 收益高',monoy:it.yearly_gift},
    ]
    return it
  })
  dtlList.value =  newArr.filter(item => item.level !== 0);
  maxlevel.value = dtlList.value[dtlList.value.length-1].level

}

const getImg=(type:number)=>{
  switch (type) {
      case 0:
        return '/static/vip/vip-b1.png'
      case 1:
        return '/static/vip/vip-b2.png'
      case 2:
        return '/static/vip/vip-b3.png'
      case 3:
        return '/static/vip/vip-b4.png'
      default :
        return ''
  }
}

const getCss=(type:number)=>{
  switch (type) {
    case current.value + 4 :
      return 'yuan1'
    case current.value - 1  + 4  :
    case current.value + 1   + 4 :
      return 'yuan2'
    case current.value - 2  + 4  :
    case current.value + 2  + 4 :
      return 'yuan3'
    default :
      return ''
  }
}

onLoad(async ()=>{
  getVipList()
  getVipProgressBut()
  getUserinfoBut()

})

</script>

<style lang="scss" scoped>
.container{
  width: 100vw;
  // #ifdef H5
  height: 100%;
  // #endif
  // #ifdef APP-PLUS || MP-WEIXIN
  height:100vh;
  // #endif
  background-color:$uni-bg-color;
  overflow: hidden;
  .user-box{
    width: 100vw;
    height: 348rpx;
    background:#1c1c1c ;
    overflow: hidden;
    .user-info{
      margin-top: 48rpx;
      width: 692rpx;
      height: 144rpx;
      .info-item{
        font-size: 30rpx;
        color: #ffffff;
        position: relative;
        z-index: 22;
        >view{
          margin-left: 40rpx;
        }
        .vip-back{
          font-size: 28rpx;
          font-weight: bold;
          text{
            margin-left: 20rpx;
          }
        }
        image{
          width: 86rpx;
          height: 85rpx;
          background-color: #ae8d45;
          box-shadow: 0rpx 5rpx 3rpx 0rpx #fece9a;
          border-radius: 50%;
          border: solid 2rpx #ffffff;
          overflow: hidden;
        }
        .vip-back{
          background: url("/static/vip/vip-back-top.png");
          background-size: 100% 100%;
          width: 135rpx;
          height: 44rpx;
          font-family: $uni-family-Heavy;
          font-size: 28rpx;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0rpx;
          color: #000000;
          text-align: right;
        }
      }
      .vip-box{
        width: 692rpx;
        height: 92rpx;
        position: relative;
        z-index: 11;
        margin-top: -30rpx;
        background-image: linear-gradient(90deg, #fae5c3 0%, #fecd98 100%);
        box-shadow: 0rpx 5rpx 10rpx 0rpx rgba(254, 206, 154, 0.15);
        border-radius:0 20rpx  20rpx 20rpx ;
        overflow: hidden;
        >view {
          width: 530rpx;
          font-size: 22rpx;
          margin-right: 30rpx;
          padding: 5rpx 0;
          text {
            font-size:24rpx;
            margin-left: 5rpx;
            color: #96521c;
            text{
              font-weight: bold;
            }
          }
        }

      }

    }
  }
  .vipNum-box{
     position: relative;
     margin-top: -80rpx;
     z-index: 6;
     overflow: hidden;
    .vipNum-item{
      width: 624rpx;
      margin:0 15rpx;
      height: 864rpx;
      background: url("/static/vip/vip-back1.png");
      background-size:100% 100%;
      overflow: hidden;
      .vip-top{
        height: 178rpx;
        width: 580rpx;
        margin: 0 22rpx;
        font-size: 30rpx;
        color: #000000;
        border-bottom: 2rpx dashed $uni-default-color;
        .vip-icon{
          width: 101rpx;
          height: 48rpx;
        }
        .vip-num{
          width: 30rpx;
          height: 52rpx;
          margin-left: 5rpx;
        }
        .num{
          font-size: 24rpx;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0rpx;
          color: #000000;
          margin-top: 24rpx;
        }
        .vip-dj{
          width: 147rpx;
          height: 54rpx;
        }
      }
      .vip-content{
        margin-top: 20rpx;
        margin-left: 4rpx;
        >view{
          width: 307rpx;
          height: 326rpx;

          .item-box{
            width: 205rpx;
            height: 260rpx;
            font-size: 28rpx;
            color: #1c1c1c;
            >view{
              margin-bottom: 10rpx;
            }
            .text{
              font-size: 22rpx;
              color: #a7663d;
            }
            .border{
              width: 18rpx;
              height: 6rpx;
              border-radius: 3rpx;
            }
            .border0{
              background-color: #ff5b00;
            }
            .border1{
              background-color: #ffba42;
            }
            .border2{
              background-color: #4b5ad7;
            }
            .border3{
              background-color: #5cb328;
            }
            .monoy{
              width: 205rpx;
              font-size: 36rpx;
              color: #ff8c00;
              text-align: center;
              text{
                font-size: 24rpx;
              }
            }
            .vip-lq{
              width: 114rpx;
              height: 55rpx;
              margin-right:40rpx ;
              margin-top: 10rpx;
            }
            .vip-nlq{
              width: 205rpx;
              height: 58rpx;
              margin-top: 10rpx;
            }
          }

        }
      }
    }
  }
  .vip-Num-box{
      margin-top: 64rpx;
      .numTop{
        font-size: 22rpx;
        color: #dd8955;
      }
      .num-box{
        margin-top:25rpx;
        .text{
          font-size: 18rpx;
          color: #a9a9b6;
        }
        .swiper-box{
          width: 400rpx;
          height: 30rpx;
          overflow: hidden;
          position: relative;
          .back-top{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 6;
          }
          .yuan{
            width: 10rpx;
            height: 10rpx;
            background-image: linear-gradient(90deg, #fae5c3 0%, #fecd98 100%);
            box-shadow: inset -1rpx -1rpx 0rpx 0rpx #fec98d;
            border-radius: 50%;
          }
          .yuan1{
            transform: scale(3);
          }
          .yuan2{
            transform: scale(2);
          }
          .yuan3{
            transform: scale(1.3);
          }
        }
      }
      .hd-box{
        height: 120rpx;
        width: 100%;
        font-size: 22rpx;
        color: #a9a9b6;
        margin-bottom: 40rpx;
      }



  }

}
</style>