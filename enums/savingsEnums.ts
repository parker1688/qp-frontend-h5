
//1:微信 2:银行卡 3:支付宝 4:钱包 5:数字人民币 6:数字货币 20 人工充值
export enum withdrawEnum {
    WX=1,
    CARD= 2,
    ZFB = 3,
    PURSR=4,
    NUMRMB=5,
    NUMHB=6,
    RGCZ=20,


}

//短信验证码场景tag
export enum tagEnum {
    BindBank='BindBank',  //绑定银行卡
    Blockchain= 'Blockchain', //绑定钱包地址
    BindOnline ='BindOnline',  //绑定在线提款账号
    UserWithdraw='UserWithdraw', //用户发起提款
    PhoneBind='PhoneBind',  //绑定手机
    ForgotPass='ForgotPass',//忘记密码
    AbnormalLogon='AbnormalLogon' //异常登录
}

//提现code类型
export enum channeEnum {
    VirtualCode='Virtual',  // 虚拟币提现
    BankCode= 'Bank', //银行卡提现
    AliPayCode ='AliPay',  //支付宝提现
}