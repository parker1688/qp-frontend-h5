<template>
  <view class="topUp-box">
    <view class="muenType-box u-flex padding30">
      <view class="muenType" v-for="(it,index) in menuList" @click="menuBut(it,index)">
        <view class="item u-flex-direction-column " :class="{action:menuNum==index}">
          <view>{{it.channel_name}}</view>
          <image v-if="menuNum==index" class="xz"   :src="it.icon"></image>
        </view>
      </view>
    </view>
    <view class="u-flex-y-center ts">
      <view></view>可提现额度：￥
      <lable class="money">{{ userMoney?.ava_amount.toFixed(2) ||0 }}</lable>
      <text>（请添加{{menuData.text }}）</text>
    </view>
    <view class="rmb-box padding30">
      <view class="title">{{ menuData.table }}</view>
      <view class="add u-flex-xy-center" v-if="!selectList.length"  @click="addWithdrawBut">
         <uv-icon size="20" name="plus"></uv-icon>
         <view>添加{{ menuData.text }}</view>
      </view>
      <view v-else>
        <view class="tx-box u-flex-center-start" v-if="channeEnum.AliPayCode === menuData.channel_code" :style="'background:url('+baseUrl+selectData.img+');background-size: cover;'">
          <image :src="baseUrl+ selectData?.icon"></image>
          <view class="u-flex-grow">
            <view>{{ strLenght(selectData.account_holder) }}</view>
            <view class="zh">{{ strLenght(selectData.account_number,2) }}</view>
          </view>
          <uv-icon name="arrow-right" style="padding: 20rpx" color="#f5f5f5"  @click="addSelectBut"></uv-icon>
        </view>
        <view class="tx-box u-flex-center-start" v-else :style="'background:url('+baseUrl+selectData?.img+');background-size: cover'">
          <image :src="baseUrl+ selectData?.icon"></image>
          <view class="u-flex-grow">
            <view>{{ selectData?.account_bank_type || selectData?.blockchain }}</view>
            <view class="zh">●●●●  ●●●●  ●●●● {{ strLenght(selectData?.account_number ||selectData?.blockchain_address,4,0)}}</view>
          </view>
          <uv-icon name="arrow-right" style="padding: 20rpx" color="#f5f5f5"  @click="addSelectBut"></uv-icon>
        </view>
      </view>
      <view class="title">{{ menuData.moneyText }}</view>
      <view class="rmb-input  u-flex-y-center">
        <uv-input  maxlength="8"  v-model="formData.amount" type="number" border="none" @input="handleInput"
                   :placeholderStyle="{fontSize: '30rpx'}"  fontSize="24"  :placeholder="menuData.placeholder"></uv-input>
      </view>
    </view>
    <view class="padding30">
      <view class="but u-flex-xy-center"  v-if="formData.amount" @click="handleSubmit">
        立即提现
      </view>
      <view class="but butNOT u-flex-xy-center" v-else>
        立即提现
      </view>
      <view class="ts">
        <text>*</text> 提现需满足打码要求
      </view>
    </view>
    <selectTxPopup ref="addPopupRef" @getSelectData="getSelectDataBut"/>
    <hintPopup ref="hintPopupRef"/>
  </view>
</template>
<script lang="ts" setup>
import {computed, reactive, ref, shallowRef} from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import environment from '@/utils/environments.ts'
const baseUrl = environment.envConfigs.imgUrl
import {walletChannelOut,allBindOnline,AllBindBank,allBUindBlockchain,walletWithdraw,fxCurrency} from "@/api/money";
import { userStore } from "@/stores/user"
import { channeEnum} from '@/enums/savingsEnums'
import  hintPopup from './components/hint'
const userDataStore = userStore();
const isToken = computed(() => userDataStore.token ? true : false)
const userMoney = computed(() => userDataStore.userMoney)
const userData = computed(() => userDataStore.userInfo)
import selectTxPopup from "@/components/selectTxPopup/index.vue";
import { getBalance,getUserinfoBut} from "@/hooks/publicRequest";
import { toPtah} from "@/utils/index"
const addPopupRef=shallowRef()
const hintPopupRef=shallowRef()
const menuNum=ref(0)
const menuData=ref({})
const menuList=computed(()=>userDataStore.withdrawMenuList)
const min_amount =ref(105)
const max_amount=ref(20000)

const formData = reactive({
  bank_id: '',
  online_id:'',
  virtual_id:'',
  channel_code: '',
  withdraw_type:'',
  amount: undefined
})
const menuMap=ref([
  {type:'AliPay',text:'支付宝',table:'收款账号',moneyText:'提现金额',placeholder:'请输入提现金额',path:'/pages/savingsManage/zfb/index'},
  {type:'Virtual',text:'虚拟钱包',table:'收款钱包',moneyText:'提币数量',placeholder:'请输入提币数量',path:'/pages/savingsManage/addPurse/index'},
  {type:'Bank',text:'银行卡',table:'收款银行',moneyText:'提现金额',placeholder:'请输入提现金额',path:'/pages/savingsManage/bankCard/index'}
])
const ratePrice=ref(0) //汇率

const BankList=ref([])
const BlockchainList=ref([])
const AliPayList=ref([])
const money =ref(undefined)
const selectList=ref([]) //选择列表
const selectData=ref({}) //选择列表

const menuBut=(it:object,index:number)=>{
  menuNum.value=index
  menuData.value=it
  min_amount.value=it.min_amount
  max_amount.value=it.max_amount
  selectList.value=[]
  selectData.value={}
  getSelectList()
}
//添加提款钱包 支付宝 =
const addWithdrawBut=()=>{
  toPtah(menuData.value.path)
}
//选择提款钱包
const addSelectBut=()=>{
  addPopupRef.value?.open({
    selectList:selectList.value,
    selectId:selectData.value.id,
    menuData:menuData.value
  })
}

//提款渠道
const walletChannelOutBut=async ()=>{
  menuNum.value =0
  menuData.value=menuList.value[menuNum.value]
  getSelectList()
}
const strLenght=(str:any,num:number = 1,type:number=1)=>{
  return type===1?(str.slice(0,num) + '****' +str.slice(0 - num)) :  str.slice(0 - num)
}
//获取提现列表
const  getSelectList = () =>{
   const type=menuData.value.channel_code
   min_amount.value=menuData.value.min_amount
   max_amount.value=menuData.value.max_amount
   if(channeEnum.VirtualCode === type){
     selectList.value= BlockchainList.value
   }else if(channeEnum.BankCode === type){
     selectList.value=BankList.value
   }else if(channeEnum.AliPayCode === type){
     selectList.value=AliPayList.value
   }
   if(selectList.value.length) selectData.value = selectList.value[0]

}
const  getlist=async ()=>{
  //绑定钱包地址
  const resBlockchain=await allBUindBlockchain()
  //银行卡
  const resBank=await AllBindBank()
  //支付宝
  const resAliPay=await allBindOnline()
  if(resBank.data){
    BankList.value=resBank.data
  }
  if(resAliPay.data){
    AliPayList.value=resAliPay.data
  }
  if(resBlockchain.data){
    BlockchainList.value=resBlockchain.data
  }
}
const getSelectDataBut=(it:object)=>{
  selectData.value=it
}

const handleInput =(event:number) => {

  // 获取输入值
  let value = event
  // 移除非数字和非点字符
  value = value.replace(/[^\d.]/g, '');
  // 限制只能有一个点
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  // 限制小数点后只能有两位数字
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  value = value.replace(/(\.\d\d).*$/, '$1');
  const maxMoney=userMoney.value?.ava_amount>max_amount.value? max_amount.value : userMoney.value?.ava_amount
  if(value> maxMoney) value =maxMoney
  // 更新数据模型
  setTimeout(()=>{
    formData.amount = value
  })
}
// 提交数据
const handleSubmit =  () => {

  if(!formData.amount){
    uni.showToast({icon: 'none',title: '请输入金额'})
    return
  }
  if(formData.amount < min_amount.value){
    uni.showToast({ icon: 'none',title: `最小提币${min_amount.value}元`})
    return
  }
  if(formData.amount > 20000){
    uni.showToast({ icon: 'none',title: '最大提币20000元'})
    return
  }
  if(userData.value.is_withdraw == 2){
    uni.showToast({icon: 'none',title: '您被禁止提现，请联系客服'})
    return
  }
  if(selectList.value.length == 0){
    const tsD=menuList.value[menuNum.value]
    uni.showToast({ icon: 'none',title: '请添加'+ tsD.table})
    return
  }
  if(menuData.value.type ==channeEnum.VirtualCode){
    hintPopupRef.value.open({money:formData.amount,ratePrice:ratePrice.value},()=>{
      handleSubmitbut()
    })
  }else {
    handleSubmitbut()
  }


}
const handleSubmitbut =async()=>{
  formData.channel_code=menuData.value.channel_code
  formData.amount=  Number(formData.amount)
  //提款类型 1 银行卡 3 虚拟币 4 支付宝微信提款
  if(channeEnum.VirtualCode === formData.channel_code){
    formData.virtual_id=selectData.value.id
    formData.withdraw_type=3
  }else if(channeEnum.BankCode === formData.channel_code){
    formData.bank_id=selectData.value.id
    formData.withdraw_type=1
  }else if(channeEnum.AliPayCode === formData.channel_code){
    formData.online_id=selectData.value.id
    formData.withdraw_type=4
  }
  const res =await walletWithdraw(formData)
  if(res.data){
    uni.showToast({title: res.msg})
    formData.amount = null
    setTimeout(()=>{
      getBalance()
    },1500)
  }

}
const getFxCurrency = async () =>{
  const res=await fxCurrency()
  ratePrice.value =res.data.ratePrice
}
onShow(async ()=>{
  if(isToken.value){
    await getlist()
    await walletChannelOutBut()
    getBalance()
    getUserinfoBut()
   // getFxCurrency()
  }else {
    toPtah('/pages/login/index')
  }

})

</script>

<style lang="scss" scoped>
.title{
  font-size: 28rpx;
  font-weight: 600;
  text{
    color:#D9001B;
  }
}
.padding30{
  padding: 30rpx;
}
.ts{
  width: calc(100% - 60rpx);
  margin: 20rpx 30rpx;
  font-size: 22rpx;
  color: $uni-default-back3Color;
  >view{
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background: $uni-default-color;
    margin-right: 10rpx;
  }
  text{
    color:$uni-default-backColor ;
  }
  .money{
    font-size:32rpx;
    color: #0f0f0f;
  }
}
.but{
  margin: 40rpx auto;
  background: $uni-default-color;
  font-size: 34rpx;
  color: #FFFFFF;
  width: 688rpx;
  height: 96rpx;
  border-radius: 48rpx;
}
.butNOT{
  background: $uni-default-xzColor;
}
.rmb-box{
   background: white;
   margin: 30rpx;
   border-radius: 12rpx;
   padding: 45rpx 24rpx 0 24rpx;
   overflow: hidden;
  .rmb-input{
    width: 640rpx;
    height: 80rpx;
    background: white;
    margin-top: 70rpx;
    margin-bottom: 34rpx;
    border-bottom: 4rpx solid $uni-default-back0Color ;

  }
  .rmb{
    width: 40rpx;
    height: 40rpx;
  }
  .moneyList{
    width: 620rpx;
    font-size: 26rpx;
    padding:0 20rpx;
    >view{
      width: 120rpx;
      height: 60rpx;
      border-radius: 10rpx;
      background: white;
      margin: 10rpx 45rpx  20rpx 0;
    }
    >view:nth-child(4n){
      margin-right: 0;
    }
    .rmb{
      width: 25rpx;
      height: 25rpx;
    }
  }

  .ts{
    width: 690rpx;
    margin-bottom:10rpx;
    font-size: 20rpx;
    color:$uni-default-back6Color

  }
  .add{
    width: 644rpx;
    height: 98rpx;
    background-color: #f7f7f7;
    border-radius: 16rpx;
    border: dashed 3rpx #000000;
    font-weight: 600;
    margin: 33rpx 0;
    view{
      margin-left: 20rpx;
    }
  }
}
.tx-box{
  width: 644rpx;
  height: 98rpx;
  background-color: #007ffe;
  border-radius: 16rpx;
  font-size: 22rpx;
  color: #FFFFFF;
  margin: 33rpx 0;
  image{
    width: 69rpx;
    height: 69rpx;
    margin:16rpx 24rpx;
    background:#ffffff;
  }
  .zh{
    font-size: 28rpx;
  }


}
.muenType-box{
  .muenType{
    margin-right: 34rpx;
    .item{
      position: relative;
      width: 198rpx;
      height: 82rpx;
      border-radius:10rpx ;
      background: #FFFFFF;
      overflow: hidden;
      font-size: 26rpx;
      color: #1c1c1c;

      .text{
        font-size: 16rpx;
        color: $uni-default-back6Color;
      }
      .xz{
        position: absolute;
        bottom: -1rpx;
        right:  -1rpx;
        width: 40rpx;
        height: 40rpx;
      }
    }
    .action{
      border: 2rpx solid $uni-default-color;
      box-sizing: border-box;
      font-weight: 600;
    }
  }

}

</style>