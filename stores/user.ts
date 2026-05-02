import { defineStore } from "pinia";
import { store } from 'pinia-plugin-persist'
import {logout} from "@/api/user";
import { toPtah } from "@/utils/index"
import {ref} from "vue";
export const userStore = defineStore("user", {
  state: () => ({
    name: "11111",
    age: 30,
    customNum:0,//主页面
	locationInfo:{},
	token:'',
    userInfo:{},
    userMoney:{},
	navDetail:{},
    searchGameNameList:[],
    accountKey:{},  //用户账号
    vipData:{},//vip信息
    dayReminder:{ //今日提醒  0
       time:'',
       isTure:false
    },
    allVenueList:[],//场馆列表
   venueGameData:{},//场馆
   agentId:0,//推广ID
   merchantCode:'',//商户code
   merchantUrl:"",//商户URL
   kfUrl:'',//客服链接
   bannerImg:'',//首页log
   gameUrl:'', //游戏路径
   topUpMenuList:[],//充值
   withdrawMenuList:[], //提现
   appHomelunbo:[],//首页轮播
   merchantData:{},// 商户信息
   isDownShow:false,//首页下载
   startImg:'/static/logo/kpHome.gif',//启动页图片
   version:null,//版本号
   downVersionData:{},//热更新过程的参数变化
  }),
  actions: {
      setDownVersion(data: any){
          this.downVersionData=data
      },
      setVersion(data: any){
          this.version=data
      },
      setStartImg(data: any){
          this.startImg=data
      },
      setIsDownShow(data: any){
          this.isDownShow=data
      },
      setMerchantData(data: any){
          this.merchantData=data
      },
      setAppHomelunbo(data: any){
          this.appHomelunbo=data
      },
      setWithdrawMenuList(data: any){
         let list=[{type:'AliPay',text:'支付宝',table:'收款账号',moneyText:'提现金额',placeholder:'请输入提现金额',path:'/pages/savingsManage/zfb/index'},
                  {type:'Virtual',text:'虚拟钱包',table:'收款钱包',moneyText:'提币数量',placeholder:'请输入提币数量',path:'/pages/savingsManage/addPurse/index'},
                  {type:'Bank',text:'银行卡',table:'收款银行',moneyText:'提现金额',placeholder:'请输入提现金额',path:'/pages/savingsManage/bankCard/index'}]
          this.withdrawMenuList=data.map(it=>{
              const res=list.find(its=>its.type == it.channel_code)
              return {...it,...res}
          })

      },
      setTopUpMenuList(data: any){
          this.topUpMenuList=data
      },
      setVenueGameData(data: any) {
          this.venueGameData=data
      },
      setGameUrl(data: any) {
          this.gameUrl=data
      },
      setBannerImg(data: any) {
          this.bannerImg=data
      },
      setKfUrl(data: any) {
          this.kfUrl=data
      },
      setMerchantUrl(data: any) {
          this.merchantUrl=data
      },
      setMerchantCode(data: any) {
          this.merchantCode=data
      },
      setAgentId(data: any) {
          this.agentId=data
      },
      setCustomNum(data: any) {
          this.customNum=data
      },
      setAllVenueList(data: any) {
          this.allVenueList=data
      },
     setDayReminder(data: any) {
          this.dayReminder.time=data.time
          this.dayReminder.isTure=data.isTure
          this.dayReminder.user_id=data.user_id
     },
     setVipData(data: any) {
          this.vipData = data
     },
     setAccountKey(data: any) {
         this.accountKey = data
    },
    updateName(data: any) {
      this.name = newName;
    },
    incrementAge() {
      this.age++;
    },
	setAdderss(data: any) {
	    this.locationInfo=data
	},
	setToken(data: any) {
	    this.token=data
	},
    setUserInfo(data: any) {
       this.userInfo=data
    },
    setUserBalance(data: any) {
       this.userMoney=data
    },
	setNavDetail(data: any){
		this.navDetail=data
	},
    setSearchGameNameList(data: any) {
      const  res= this.searchGameNameList.find(it=>it == data )
        if(!res){
            this.searchGameNameList.unshift(data)
        }
    },
      delSearchGameNameList(data: any) {
          this.searchGameNameList=[]
      },
    resetState() {
          this.token = ''
          this.userInfo = {}
          this.userMoney = {}
          toPtah('/pages/tabBar/home/index',0)
    },
    logout() {
          return new Promise((resolve, reject) => {
              logout().then(async (res) => {
                     this.resetState()
                      uni.showToast({
                          title: res.msg
                      })
                     resolve(res.data)
                  })
                  .catch((error) => {
                      reject(error)
                  })
          })
      },
  },
  persist: {
    storage: {
      // 修改存储方式
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync
    }
  }
});
