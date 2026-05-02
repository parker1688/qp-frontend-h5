import { userMoney,getUserinfo,allVenueRecover,allVenueRecoverAll,vipProgress,getKfUrl,getVenueList,adsCarouselInfo,startInfo,getVersion} from '@/api/user'
import {rechargeChannelList,walletChannelOut} from '@/api/money'
import { userStore } from "@/stores/user"
import { toPtah ,menusFn,pointsList} from "@/utils/index"
import {formatDate} from "@/utils/time";
import { resolve } from 'dns';
//获取金额
const balance = async () => {
  await allVenueRecover()
  const money= await  userMoney()
  userStore().setUserBalance(money?.data)
  return new Promise((resolve)=>{
	  resolve(true)
  })
}
//获取全部获取金额
const balanceAll = async () => {
    await allVenueRecoverAll()
    const money= await  userMoney()
    userStore().setUserBalance(money.data)
    return new Promise((resolve)=>{
        resolve(true)
    })
}

//用户信息
const userinfo=async ()=>{
  const res= await  getUserinfo()
  userStore().setUserInfo(res.data)
}

//vip 进度条
const vipProgressBut=async ()=>{
  const res= await  vipProgress()
  userStore().setVipData(res.data)
}

//首页场馆
const getylGameList = async () => {
  const res = await getVenueList()
  const list= await pointsList(res.data)
  const resData  =await menusFn(list)
  userStore().setVenueGameData(resData)
  userStore().setAllVenueList(res.data)
}
//充值列表
const rechargeChannelListBut=async ()=>{
  const res=await rechargeChannelList()
  userStore().setTopUpMenuList(res.data)
}
//提款渠道列表
const walletChannelOutBut=async ()=>{
  const res =await  walletChannelOut()
  userStore().setWithdrawMenuList(res.data)
}

//启动页
const startInfoBut=async ()=>{
  const res= await startInfo()
  if(res.code == 0){
    userStore().setStartImg(res.data.screen_img)
  }


}

export function getRechargeWallet(){
  rechargeChannelListBut()
  walletChannelOutBut()
}

//首页弹窗处理
const dayReminder=()=>{
  const dayReminder=userStore().dayReminder
  const userInfo=userStore().userInfo
  const time=formatDate(new Date().getTime(),'Y-M-D')
  if(dayReminder.time != time || userInfo.user_id != dayReminder.user_id){
    const data={
      time:'',
      isTure:false,
      user_id:userInfo.user_id
    }
    userStore().setDayReminder(data)
  }
}
//新账号注册
const dayNewReminder=()=>{
    const data={
      time:'',
      isTure:false,
      user_id:''
    }
    userStore().setDayReminder(data)

}

const getVersionBut=()=>{
  getVersion().then(res => {userStore().setVersion(res.data.version)})
}

export function getylGameListBut(){
  getylGameList()
  // #ifndef H5
  const version= userStore().version
  if(!version){
    getVersionBut()
  }
  //#endif
  // #ifdef H5
  getVersionBut()
  //#endif
}

export function dayReminderBut(isTrue:boolean=true) {
  if(isTrue){
    dayReminder()
  }else {
    dayNewReminder()
  }

}

export function getVipProgressBut() {
  vipProgressBut()
}

export function getUserinfoBut() {
  userinfo()
}
export async function getBalance(isTrue:boolean=true) {

  if(isTrue){
    await balance()
  }else {
    await balanceAll()
  }
  return new Promise((resolve)=>{
	  resolve(true)
  })
}
export function getKfUrlBut() {
  getKfUrl().then(res=>{
    if(res?.data){
      userStore().setKfUrl(res.data?.link)
      userStore().setBannerImg(res.data?.banner_img)
      userStore().setMerchantData(res.data)

    }
  })
  adsCarouselInfo().then(res=>{
    userStore().setAppHomelunbo(res.data)
  })
  //#ifndef H5
 // startInfoBut()
   //#endif
}
