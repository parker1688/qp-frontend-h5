import request from '@/utils/request'

//充值渠道列表
export const rechargeChannelList = (data: any) => {
    return request({ url: '/api/recharge/channel',   method: 'POST',  body:data,  hideLoading: true,})
}
//用户充值
export const userChannel = (data: any) => {
    return request({ url: '/api/recharge/payment',   method: 'POST',  body:data,  hideLoading: false,})
}

//获取支付通道
export const getRechargeChannel = (data: any) => {
    return request({ url: '/api/recharge/payment/get',   method: 'POST',  body:data,  hideLoading: false,})
}

//交易记录
export const walletTransaction = (data: any) => {
    return request({ url: '/api/wallet/list/transaction',   method: 'POST',  body:data,  hideLoading: false,})
}


//注单列表
export const venueGameRecord = (data: any) => {
    return request({ url: '/api/venue/gameRecord',   method: 'GET',  body:data,  hideLoading: false,})
}
//注单未结算列表
export const venueGameRecordUnsettled = (data: any) => {
    return request({ url: '/api/venue/gameRecordUnsettled',   method: 'GET',  body:data,  hideLoading: false,})
}
//注单统计分类
export const venueGamestatis = (data: any) => {
    return request({ url: '/api/venue/statis',   method: 'GET',  body:data,  hideLoading: false,})
}


//绑定银行卡
export const bindBank = (data: any) => {
    return request({ url: '/api/bind/bank',   method: 'POST',  body:data,  hideLoading: false,})
}
//获取用户所有银行卡
export const AllBindBank = (data: any) => {
    return request({ url: '/api/bind/bank/get',   method: 'POST',  body:data,  hideLoading: true,})
}

//银行卡类型列表
export const AllBindBankType = (data: any) => {
    return request({ url: '/api/bind/bank/type',   method: 'POST',  body:data,  hideLoading: false,})
}


//绑定在线提款账号（支付宝，微信）
export const bindOnline = (data: any) => {
    return request({ url: '/api/bind/online',   method: 'POST',  body:data,  hideLoading: false,})
}
//获取（支付宝，微信）账号
export const allBindOnline = (data: any) => {
    return request({ url: '/api/bind/online/get',   method: 'POST',  body:data,  hideLoading: true,})
}

//绑定虚拟币提款地址
export const bindBlockchain = (data: any) => {
    return request({ url: '/api/bind/blockchain',   method: 'POST',  body:data,  hideLoading: false,})
}

//获取虚拟币 地址 列表
export const allBUindBlockchain = (data: any) => {
    return request({ url: '/api/bind/blockchain/get',   method: 'POST',  body:data,  hideLoading: true,})
}

//提款通道获取-钱包类型获取
export const allPaymentOut = (data: any) => {
    return request({ url: '/api/wallet/paymentOut',   method: 'POST',  body:data,  hideLoading: false,})
}
//代付图标获取-绑定银行卡类型
export const allChannelBankImg = (data: any) => {
    return request({ url: '/api/bind/channelBank/img',   method: 'POST',  body:data,  hideLoading: false,})
}


//发送短信验证码
export const getPhoneVeryCode = (data: any) => {
    return request({ url: '/api/userinfo/phone/veryCode',   method: 'POST',  body:data,  hideLoading: false,})
}


//提款渠道列表
export const walletChannelOut = (data: any) => {
    return request({ url: '/api/wallet/channelOut',   method: 'POST',  body:data,  hideLoading: false,})
}
//用户发起提款
export const walletWithdraw = (data: any) => {
    return request({ url: '/api/wallet/withdraw',   method: 'POST',  body:data,  hideLoading: false,})
}
//提款 记录
export const walletWithdrawList = (data: any) => {
    return request({ url: '/api/wallet/list/withdraw',   method: 'POST',  body:data,  hideLoading: false,})
}
//充值 记录
export const walletListDeposit = (data: any) => {
    return request({ url: '/api/wallet/list/deposit',   method: 'POST',  body:data,  hideLoading: false,})
}


//获取汇率接口
export const fxCurrency= (data: any) => {
    return request({ url: '/api/currency/fx',   method: 'GET',  body:data,  hideLoading: true,})
}