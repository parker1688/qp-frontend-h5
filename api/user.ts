import request from '@/utils/request'

// //注册
export const register = (data: any) => {
    return request({ url: '/api/register',   method: 'POST',  body:data,  hideLoading: false,})
}
//登录
export const login = (data: any) => {
    return request({ url: '/api/login',   method: 'POST',  body:data,  hideLoading: false,})
}
//退出登录
export const logout = (data: any) => {
    return request({ url: '/api/userinfo/logout',   method: 'POST',  body:data,  hideLoading: true,})
}
//查询余额
export const userMoney = (data: any,hideLoading:boolean=true) => {
    return request({ url: '/api/wallet/center',   method: 'POST',  body:data,  hideLoading: hideLoading,})
}
//修改密码
export const updataPassword = (data: any) => {
    return request({ url: '/api/userinfo/password/reset',   method: 'POST',  body:data,  hideLoading: false,})
}


//免转登录场馆游戏
export const freeVenueLaunch = (data: any) => {
    return request({ url: '/api/venue/launch',   method: 'POST',  body:data,  hideLoading: false,})
}

//获取游戏列表
export const getGameList = (data: any) => {
    return request({ url: '/api/game/slots/get',   method: 'GET',  body:data,  hideLoading: false,})
}
//获取场馆列表二级菜单
export const getVenueList = (data: any) => {
    return request({ url: '/api/venue/list',   method: 'GET',  body:data,  hideLoading: true,})
}
//首页获取收藏列表
export const getHomeCollectList = (data: any) => {
    return request({ url: '/api/game/user/collect/list',   method: 'GET',  body:data,  hideLoading: false,})
}
//收藏
export const addCollect = (data: any) => {
    return request({ url: '/api/game/user/collect/add',   method: 'POST',  body:data,  hideLoading: false,})
}


//删除收藏
export const delCollect = (data: any) => {
    return request({ url: '/api/game/user/collect/del',   method: 'GET',  body:data,  hideLoading: false,})
}

//用户信息
export const getUserinfo = (data: any) => {
    return request({ url: '/api/userinfo/material',   method: 'GET',  body:data,  hideLoading: true,})
}
//修改用户信息
export const updateUserinfo = (data: any) => {
    return request({ url: '/api/userinfo/material/update',   method: 'POST',  body:data,  hideLoading: false,})
}

//一键回收场馆余额
export const allVenueRecover = (data: any) => {
    return request({ url: '/api/venue/recover',   method: 'GET',  body:data,  hideLoading: true,})
}
//一键回收所有场馆余额
export const allVenueRecoverAll = (data: any) => {
    return request({ url: '/api/venue/recoverall',   method: 'GET',  body:data,  hideLoading: true,})
}


//跑马灯
export const homenotifyMarqueeList = (data: any) => {
    return request({ url: '/api/site/notifyMarquee/list',   method: 'GET',  body:data,  hideLoading: false,})
}
//首页公告
export const homeBulletinList = (data: any) => {
    return request({ url: '/api/site/bulletin/list',   method: 'GET',  body:data,  hideLoading: false,})
}

//VIP列表
export const vipLevelList = (data: any) => {
    return request({ url: '/api/vip/level/list',   method: 'GET',  body:data,  hideLoading: false,})
}
//VIP 进度条
export const vipProgress = (data: any) => {
    return request({ url: '/api/vip/level/vipProgress',   method: 'GET',  body:data,  hideLoading: false,})
}
//VIP晋级奖金领取
export const vipUpApply = (data: any) => {
    return request({ url: '/api/gift/vipUp/apply',   method: 'GET',  body:data,  hideLoading: false,})
}
//VIP周奖金领取
export const weekApply = (data: any) => {
    return request({ url: '/api/gift/week/apply',   method: 'GET',  body:data,  hideLoading: false,})
}
//VIP月奖金领取
export const monthApply = (data: any) => {
    return request({ url: '/api/gift/month/apply',   method: 'GET',  body:data,  hideLoading: false,})
}
//活动列表
export const activityList = (data: any) => {
    return request({ url: '/api/activity/list',   method: 'GET',  body:data,  hideLoading: false,})
}
//活动详情
export const activityDetail = (data: any) => {
    return request({ url: '/api/activity/detail',   method: 'GET',  body:data,  hideLoading: false,})
}
//查询用户打码量
export const getRebate = (data: any) => {
    return request({ url: '/api/rebate/data',   method: 'POST',  body:data,  hideLoading: false,})
}
//洗码累计详情（洗码介绍）
export const getRebateIntro = (data: any) => {
    return request({ url: '/api/rebate/intro',   method: 'GET',  body:data,  hideLoading: false,})
}
//用户返水详情记录列表
export const getRebateDetailList = (data: any) => {
    return request({ url: '/api/rebate/detail/record/list',   method: 'GET',  body:data,  hideLoading: false,})
}


//用户返水记录
export const getRebateRecordList = (data: any) => {
    return request({ url: '/api/rebate/record/list',   method: 'GET',  body:data,  hideLoading: false,})
}
//返水洗码
export const rebateApply = (data: any) => {
    return request({ url: '/api/rebate/apply',   method: 'POST',  body:data,  hideLoading: false,})
}

//短消息列表
export const messageList= (data: any) => {
    return request({ url: '/api/site/message/list',   method: 'GET',  body:data,  hideLoading: false,})
}

export const xtMessageList= (data: any) => {
    return request({ url: '',   method: 'GET',  body:data,  hideLoading: false,})
}
//短消息已读
export const readMessage= (data: any) => {
    return request({ url: '/api/site/message/update/read',   method: 'POST',  body:data,  hideLoading: false,})
}
//删除短消息
export const delMessage= (data: any) => {
    return request({ url: '/api/site/message/del',   method: 'POST',  body:data,  hideLoading: false,})
}

//修改用户邮箱
export const updateEmail= (data: any) => {
    return request({ url: '/api/userinfo/update/email',   method: 'POST',  body:data,  hideLoading: false,})
}

//绑定手机号码
export const updatePhone= (data: any) => {
    return request({ url: '/api/userinfo/update/phone',   method: 'POST',  body:data,  hideLoading: false,})
}

//用户报表
export const userReport= (data: any) => {
    return request({ url: '/api/userinfo/report',   method: 'GET',  body:data,  hideLoading: false,})
}

//推广页统计
export const inviteAave= (data: any) => {
    return request({ url: '/api/invite/save',   method: 'POST',  body:data,  hideLoading: false,})
}

//忘记密码确认信息
export const passwordForgot= (data: any) => {
    return request({ url: '/api/userinfo/password/forgot',   method: 'POST',  body:data,  hideLoading: false,})
}
//忘记密码密码更新
export const passwordForgotUpdate= (data: any) => {
    return request({ url: '/api/userinfo/password/forgot/update',   method: 'POST',  body:data,  hideLoading: false,})
}
//异常登录恢复接口
export const loginAbnormalRecover= (data: any) => {
    return request({ url: '/api/login/abnormal/recover',   method: 'POST',  body:data,  hideLoading: false,})
}

export const getMerchantCode= (data: any) => {
    return request({ url: '/api/merchant/code',   method: 'GET',  body:data,  hideLoading: true,})
}
//大厅客服链接
export const getKfUrl= (data: any) => {
    return request({ url: '/api/customer/link',   method: 'GET',  body:data,  hideLoading: true,})
}
//文本导航
export const getNavConfig= (data: any) => {
    return request({ url: '/api/guide/info',   method: 'GET',  body:data,  hideLoading: true,})
}

//公告栏信息接口
export const adsCarouselInfo= (data: any) => {
    return request({ url: '/api/adsCarousel/info',   method: 'GET',  body:data,  hideLoading: true,})
}

//签到信息
export const getCheckInInfo= (data: any) => {
    return request({ url: '/api/dailyBonus/info',   method: 'GET',  body:data,  hideLoading: true,})
}

//签到按钮
export const checkIn= (data: any) => {
    return request({ url: '/api/dailyBonus/reward',   method: 'POST',  body:data,  hideLoading: true,})
}

//启动页
export const startInfo= (data: any) => {
    return request({ url: '/api/splashScreen/info',   method: 'GET',  body:data,  hideLoading: true,})
}

//任务列表
export const taskList= (data: any) => {
    return request({ url: '/api/userTask/list',   method: 'GET',  body:data,  hideLoading: true,})
}

//任务领取
export const getTask= (data: any) => {
    return request({ url: '/api/userTask/reward',   method: 'POST',  body:data,  hideLoading: true,})
}


//版本管理
export const getVersion= (data: any) => {
    return request({ url: '/api/server/version',   method: 'GET',  body:data,  hideLoading: true,})
}



//前端临时日志接口
export const getClientlogs= (data: any) => {
    return request({ url: '/api/clientlogs',   method: 'POST',  body:data,  hideLoading: true,})
}

//活动红包信息接口
export const getActivityInfo= (data: any) => {
    return request({ url: '/api/user/activity/info',   method: 'GET',  body:data,  hideLoading: true,})
}

export const getActivityInfoReward= (data: any) => {
    return request({ url: '/api/user/activity/reward',   method: 'POST',  body:data,  hideLoading: true,})
}

