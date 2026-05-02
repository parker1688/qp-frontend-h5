<template>
    <view class="topUp-box">
       <view class="muen-box padding30">
          <view class="title"><text>*</text> 支付方式</view>
          <view class="list-item u-flex u-flex-wrap">
            <view class="item-box u-flex-direction-column u-flex-shrink0" v-for="(it,index) in menuList" :key="index"
                  :class="{action:index ===menuNum}" @click="menuBut(it,index)">
              <image class="img" :src="baseUrl+it.icon"></image>
              <view>
                {{it.channel_name}}
              </view>
              <image class="tj" v-if="it.hot" src="/static/savingsAccount/tj.png"></image>
              <image class="xz" v-if="menuNum==index" src="/static/savingsAccount/xz.png"></image>
            </view>
          </view>
       </view>
       <view class="muenType-box padding30">
         <view class="title titles"><text>*</text> 选择渠道</view>
         <scroll-view scroll-x="true" :enable-flex="true" style="height: 110rpx"  :scroll-with-animation="true">
           <view class="muenType u-flex">
                <view class="item u-flex-direction-column u-flex-shrink0"  v-for="(it,index) in channelData" :class="{action:index ===channelNum}" @click="channelIndex(it,index)">
                    <view>{{ it.pay_alias_name }}<text v-if="it.bonus_rate">（充值加赠{{it.bonus_rate * 100}}%）</text></view>
                    <view class="text">单笔金额{{ it.min_amount }}-{{ it.max_amount }}元</view>
                    <image class="xz" v-if="channelNum===index"  src="/static/savingsAccount/xz.png"></image>
                    <view class="zs u-flex-xy-center" v-if="it.bonus_rate">
                      送{{it.bonus_rate * 100}}%
                    </view>
                </view>
         </view>
         </scroll-view>
       </view>
        <view class="rmb-box">
          <view class="title"><text>*</text> 存款金额</view>
          <view class="rmb-input  u-flex-y-center">
            <image class="USDT2" v-if="withdrawEnum.NUMHB === channel_type" src="/static/savingsAccount/USDT2.png"></image>
            <image class="rmb" v-else src="/static/savingsAccount/rmb.png"></image>
            <uv-input  maxlength="8" disabled  v-model="formData.amount" disabledColor="#ffffff" border="none"
                       :placeholderStyle="{fontSize: '30rpx'}"     placeholder="选定金额" fontSize="24"></uv-input>
          </view>
          <view class="moneyList u-flex u-flex-wrap" v-if="amountList.length">
             <view class="u-flex-xy-center" v-for="(it,index) in amountList"  @click="getMoney(it,index)" :class="{action:index==amountNum}">
               <image class="rmb" v-if="withdrawEnum.NUMHB === channel_type" src="/static/savingsAccount/usdt1.png"></image>
               <image class="rmb" v-else src="/static/savingsAccount/rmb.png"></image>
               {{ it }}
             </view>
          </view>
          <view class="but u-flex-xy-center" v-if="formData.amount" @click="handleSubmit" >
            立即存款
          </view>
          <view class="but butNOT u-flex-xy-center" v-else>
            立即存款
          </view>
          <view class="ts" v-if="remark">
            <text>*</text>{{ remark }}
          </view>
          <view class="ts">
            <text>*</text> 请如需帮助请联系在线客服
          </view>
        </view>
        <uv-modal ref="modal"  align="center" :closeOnClickOverlay="false" showCancelButton    @confirm="confirm">
          <view class="slot-content">
            <text style="font-size: 28rpx;color: #000000;font-weight: bold">是否去支付？</text>
          </view>
        </uv-modal>
    </view>
</template>
<script lang="ts" setup>
import { rechargeChannelList, getRechargeChannel, userChannel } from "@/api/money";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { withdrawEnum} from '@/enums/savingsEnums'
import environment from '@/utils/environments.ts'
const baseUrl = environment.envConfigs.imgUrl
import { toPtah,openSavingsAccount} from "@/utils/index"
import { computed, reactive, ref, shallowRef, watch } from "vue";
import { userStore } from "@/stores/user"
const userDataStore = userStore();
const isToken = computed(() => userDataStore.token ? true : false)
const menuNum=ref(0)
const channelNum=ref(0)
const amountNum=ref(-1)
//const menuList=ref<Array>([
  // {img:'/static/savingsAccount/xl.png',name:'虚拟币充值',type:'xl',istj:true},
  // {img:'/static/savingsAccount/zfb.png',name:'支付宝支付',type:'zfb',istj:false},
  // {img:'/static/savingsAccount/wx.png',name:'微信支付',type:'wx',istj:false},
  // {img:'/static/savingsAccount/sz.jpg',name:'数字人民币',type:'sz',istj:false},
  // {img:'/static/savingsAccount/lyk.png',name:'银联在线充值',type:'lyk',istj:true},
  // {img:'/static/savingsAccount/usdt.png',name:'USDT转账',type:'usdt',istj:true}
//])
const menuList=computed(()=>userDataStore.topUpMenuList)
const channel_type=ref(-1) //货币类型
const modal=shallowRef()
const formData = reactive({
  channel_code: '',
  payment_code: '',
  pay_id:'',
  amount: undefined
})
const remark =ref(undefined)
const channelData=ref<Array>([])
const amountList=ref<Array>([])
const money =ref(undefined)
const getMoney =(it:string,index:number) =>{
  formData.amount = + it
  amountNum.value=index
}

const menuBut=(it:any,index:number)=>{
  menuNum.value=index
  channel_type.value=it.channel_type
  channelNum.value=0
  amountNum.value=-1
  formData.amount=''
  amountList.value=[]
  remark.value=''
  getRechargeChannelBut()
}

// const rechargeChannelListBut=async ()=>{
//   const res=await rechargeChannelList()
//   menuList.value=res.data
//   channel_type.value=menuList.value[0]?.channel_type
//   getRechargeChannelBut()
// }
const getRechargeChannelBut = async()=>{
  if( !menuList.value.length){
    return
  }
  const data= menuList.value[menuNum.value]
  const res= await getRechargeChannel({channel_code:data.channel_code})
  if(res.data){
    channelData.value=res.data.map(it=>{
      it.amountList=it.amount_range.split(',')
      return it
    })
    amountList.value=channelData.value[channelNum.value].amountList
    formData.payment_code=channelData.value[channelNum.value].payment_code
    formData.channel_code=channelData.value[channelNum.value].channel_code
    formData.pay_id=channelData.value[channelNum.value].pay_id
    remark.value=channelData.value[channelNum.value].remark
  }



}
const  channelIndex =(it:any,index:number)=>{
  channelNum.value=index
  amountList.value=channelData.value[channelNum.value].amountList
  formData.payment_code=it.payment_code
  formData.channel_code=it.channel_code
  formData.pay_id=it.pay_id
  formData.amount=undefined
  remark.value=it.remark
  amountNum.value=-1
}
// 提交数据
// const handleSubmit =  async () => {
//   modal.value?.open()
// }
const handleSubmit=async ()=>{
  const res =await userChannel(formData)
  if(res.data){
    openSavingsAccount(res.data.link)
  }
}
onShow(()=>{
  if(isToken.value){
    if(menuList.value.length){
      channel_type.value=menuList.value[0]?.channel_type
    }
    menuNum.value=0
    getRechargeChannelBut()
  }else {
    toPtah('/pages/login/index')
  }
})
onLoad(()=>{


})
</script>

<style lang="scss" scoped>
.title{
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 26rpx;
  text{
    color:#D9001B;
  }
}
.padding30{
  padding:28rpx 30rpx;
}
.topUp-box{
  padding-bottom:100rpx;
}
.rmb-box{
  margin: 20rpx 30rpx 50rpx 30rpx;
  .rmb-input{
    width:100%;
    height: 98rpx;
    background: white;
    border-radius: 16rpx;
    border: solid 2rpx #000000;
    box-sizing: border-box;
    .rmb{
      width: 34rpx;
      height: 34rpx;
      margin: 0 17rpx;
    }
    .USDT2{
      width: 50rpx;
      height: 30rpx;
      margin: 0 17rpx;
    }
  }

  .moneyList{
    width:100%;
    font-size: 26rpx;
    margin-top: 26rpx;
    >view{
      width: 164rpx;
      height: 80rpx;
      border-radius: 16rpx;
      background: white;
      margin-right: calc((100vw - 716rpx)/3);
      margin-bottom:10rpx ;
      font-size: 36rpx;
      font-weight: 600;

    }
    >view:nth-child(4n){
      margin-right: 0;
    }
    .rmb{
      width: 18rpx;
      height: 18rpx;
      margin: 0 6rpx;
    }
    .action{
      border: solid 2rpx #000000;
      box-sizing: border-box;
    }
  }
  .but{
    width:100%;
    height: 96rpx;
    border-radius: 48rpx;
    margin: 26rpx 0;
    background: $uni-default-color;
    font-size: 34rpx;
    color: #FFFFFF;
  }
  .butNOT{
    background: $uni-default-xzColor;
  }
  .ts{
    width:100%;
    margin-bottom: 10rpx;
    font-size: 20rpx;
    color: $uni-default-back6Color;
  }
}
.muenType-box{
  margin-top: 8rpx;
  .titles{
    margin-bottom: 0;
  }
  .muenType{
    margin-top: 26rpx;
    .item{
      margin-right: 30rpx;
      position: relative;
      font-size: 22rpx;
      background: #FFFFFF;
      min-width: 310rpx;
      padding: 0 10rpx;
      height: 82rpx;
      border-radius: 10rpx;
      border: solid 2rpx $uni-default-color;
      box-sizing: border-box;
       >view:first-child{
         font-weight: 600;
       }
      .text{
        font-size: 20rpx;
        color: $uni-text-color-grey;
      }
      .xz{
        position: absolute;
        bottom: -1rpx;
        right: 0;
        width: 45rpx;
        height: 45rpx;
       // border-radius:0 0 30rpx ;
      }
      .zs{
        position: absolute;
        top: -20rpx;
        right: -20rpx;
        width: 80rpx;
        height: 35rpx;
        padding-bottom: 10rpx;
        color: white;
        font-size: 20rpx;
        font-weight: normal;
        font-stretch: normal;
        background: url("/static/savingsAccount/zsm.png");
        background-size:100% 100%;
      }
    }
    .action{
      border: 3rpx solid $uni-default-color;
      box-sizing: border-box;
    }
  }

}
.muen-box{
  .action{
    border: 2rpx solid $uni-default-color;
    box-sizing: border-box;
    font-weight: 600;
  }
  .list-item{
    width:100%;
  }
 .item-box{
   width: 160rpx;
   height: 116rpx;
   border-radius: 16rpx;
   position: relative;
   font-size: 22rpx;
   background: #FFFFFF;
   margin-right:calc((100% - 640rpx)/3);
   overflow: hidden;
   color: #1c1c1c;
   margin-bottom: 16rpx;
   box-sizing: border-box;
   .tj{
     position: absolute;
     top: 0;
     right: 0;
     width: 70rpx;
     height: 70rpx;
   }
   .xz{
     position: absolute;
     bottom: 0;
     right: 0;
     width: 50rpx;
     height: 50rpx;
   }
   .img{
     width: 60rpx;
     height:60rpx;
     margin-bottom: 6rpx;

   }

 }
  .item-box:nth-child(4n){
    margin-right: 0;
  }
}
</style>