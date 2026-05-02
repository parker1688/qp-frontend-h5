import { defineStore } from "pinia";
import { store } from 'pinia-plugin-persist'
import {logout} from "@/api/user";
import { toPtah } from "@/utils/index"
import {ref} from "vue";
export const startStore = defineStore("start", {
    state: () => ({
        dayTypeList:[
            {name:'今天',type:1},
            {name:'昨天',type:0},
            {name:'近7天',type:-7},
            {name:'近30天',type:-30}
        ],
        //首页1级分类
        menuOneList:[
            { id: 'id1', text: "娱乐场", venue_type: '', image: '/static/home/menu/cd1.png', imageOK: '/static/home/menu/cd11.png' },
            { id: 'id2', text: "电子", venue_type: 'elecgame', image: '/static/home/menu/dz1.png', imageOK: '/static/home/menu/dz11.png' },
            { id: 'id5', text: "棋牌", venue_type: 'chess', image: '/static/home/menu/qp1.png', imageOK: '/static/home/menu/qp11.png' },
            { id: 'id6', text: "捕鱼", venue_type: 'fish', image: '/static/home/menu/by1.png', imageOK: '/static/home/menu/by11.png' },
            { id: 'id3', text: "视讯", venue_type: 'live', image: '/static/home/menu/zr1.png', imageOK: '/static/home/menu/zr11.png' },
            { id: 'id7', text: "体育", venue_type: 'sport', image: '/static/home/menu/ty1.png', imageOK: '/static/home/menu/ty11.png' },
            { id: 'id4', text: "彩票", venue_type: 'lottery', image: '/static/home/menu/cp1.png', imageOK: '/static/home/menu/cp11.png' },
        ],
        //所有1级分类
        gameTypeList:[
            { id: 'id2', text: "电子", table: "电子",venue_type: 'elecgame', icon:"/static/home/menu/icon/dzicon.png",image: '/static/home/menu/dz1.png', imageOK: '/static/home/menu/dz11.png'  },
            { id: 'id5', text: "棋牌", table: "棋牌", venue_type: 'chess',icon:"/static/home/menu/icon/qpicon.png", image: '/static/home/menu/qp1.png', imageOK: '/static/home/menu/qp11.png'  },
            { id: 'id6', text: "捕鱼", table: "捕鱼",venue_type: 'fish', icon:"/static/home/menu/icon/byicon.png", image: '/static/home/menu/by1.png', imageOK: '/static/home/menu/by11.png' },
            { id: 'id3', text: "视讯", table: "视讯", venue_type: 'live',icon:"/static/home/menu/icon/zricon.png",image: '/static/home/menu/zr1.png', imageOK: '/static/home/menu/zr11.png' },
            { id: 'id7', text: "体育", table: "体育", venue_type: 'sport',icon:"/static/home/menu/icon/tyicon.png", image: '/static/home/menu/ty1.png', imageOK: '/static/home/menu/ty11.png' },
            { id: 'id4', text: "彩票", table: "彩票",venue_type: 'lottery',icon:"/static/home/menu/icon/cpicon.png",  image: '/static/home/menu/cp1.png', imageOK: '/static/home/menu/cp11.png' },
            { id: 'id8', text: "电竞", table: "电竞", venue_type: 'esport',icon:"/static/home/menu/icon/djicon.png", image: '/static/home/menu/dj1.png', imageOK: '/static/home/menu/dj11.png'  },
        ],
        venueGameType:['esport','lottery'] ,//娱乐场 特别类型
        billVenueGameType:['esport','lottery','sport'] ,//注单 特别类型
        venueGameListType:['esport','sport','live'],//娱乐场游戏列表里面特别处理
        isTrueBill:Boolean,//注单方法
        addEnvelopeNum:0,//回血红包数量
        homeReloadPage:0 //首页刷新
      //  redEnvelopeRainTime:0,//红包雨时间
    }),
    actions: {
        setHomeReloadPage(data: any){
            this.homeReloadPage=data
        },
        setIsTrueBill(data: any){
            this.isTrueBill=this.billVenueGameType.includes(data.gameType) && data.isSettled?true:false
        },
        setAddEnvelopeNum(data: any){
            this.addEnvelopeNum=data
        },
        // setRedEnvelopeRainTime(data: any){
        //     this.redEnvelopeRainTime=data
        //     // const interval = setInterval(() => {
        //     //     if (this.redEnvelopeRainTime > 0) {
        //     //         this.redEnvelopeRainTime--;
        //     //     } else {
        //     //         clearInterval(interval);
        //     //     }
        //     // }, 1000);
        // },
    },
    persist: false
});
