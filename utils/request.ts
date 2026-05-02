
import environment from './environments.ts' // 环境，服务配置文件
import { userStore } from '@/stores/user'
import {getWindowUrl} from "./index";
import {toPtah} from "@/utils/index";


const baseUrl = environment.envConfigs.url
const apiServe = environment.SERVE_CTX
const VITE_APP_MODE = import.meta.env.VITE_APP_MODE

const CONTENT_TYPE = {
    JSON: 'application/json;charset=UTF-8',
    FORM_URLENCODED: 'application/x-www-form-urlencoded;charset=UTF-8',
    FORM_DATA: 'multipart/form-data;charset=UTF-8',
}

export interface requestType {
    code: number
    data?: any
    message: string
    status: boolean
}
type ServeType = 'AUTH' | 'PROPERTY' | 'FILE' | 'JOB' | 'BPM'

type HttpMethod = 'POST' | 'OPTIONS' | 'GET' | 'HEAD' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
type ContentType = 'JSON' | 'FORM_URLENCODED'
type PlatformType = 'h5' | 'ios' | 'android' | 'web'

const DEFAULT_SERVE: ServeType = 'AUTH'
const DEFAULT_METHOD: HttpMethod = 'GET'
const DEFAULT_CONTENT_TYPE: ContentType = 'JSON'
//#ifdef H5
const DEFAULT_PLATFARM_TYPE: PlatformType = 'h5'
//#endif
//#ifndef  H5
const DEFAULT_PLATFARM_TYPE: PlatformType = 'android'
//#endif

interface Request {
    serve?: ServeType
    url: string
    method: HttpMethod
    body?: any
    hideLoading?: boolean
    contentType?: ContentType
	MerchantCode: string
    headers?: any
    timeout?: number
}
const request = async ({
    serve = DEFAULT_SERVE,
    url = '',
    method = DEFAULT_METHOD,
    body = {},
    hideLoading = true, //是否显示请求loading
    contentType = DEFAULT_CONTENT_TYPE,
    headers = {},
    timeout = 6000,
}: Request): Promise<requestType> => {
    if (!hideLoading) {
        // uni.showLoading({
        //     mask: true,
        //     title: '加载中...'
        // })
    }
    url = baseUrl + apiServe[serve] + url
    const requestUrl = url
    const token = await userStore().token
    const merchantCode=await userStore().merchantCode
    const MerchantId=await userStore().agentId
	//#ifdef H5
    const MerchantUrl=getWindowUrl()
	//#endif
    const authHeaders = {
        Token: token ? `${token}` : '',
        merchantCode:merchantCode? `${merchantCode}`:'',
        ClientType:DEFAULT_PLATFARM_TYPE,
        language:'zh'
    }
    if(!merchantCode&&MerchantId){
        authHeaders.MerchantId=MerchantId
    }
	//#ifdef H5
	else if(!merchantCode&&MerchantUrl){
        authHeaders.MerchantUrl=MerchantUrl
    }
	//#endif

    try {
        const res: any = await uni.request({
            url: requestUrl,
            method: method,
            data: body,
            header: Object.assign(authHeaders, headers),
            timeout,
            enableCache: true, // 自动处理缓存
        })

        const { data ,statusCode}: any = res
        if (statusCode !== 200) {
            uni.showToast({
                icon: 'none',
                title: '系统错误！',
            })
            return Promise.reject('系统错误')
        }
        if (data.code == 0) {
            return Promise.resolve(data)
        }
        if(data.code ==100011){  //登录异常
            return Promise.resolve(data)
        }

        if (data.code == -401) {
            uni.showToast({
                icon: 'none',
                title: '您的帐号已在其他设备登录',
            })
            userStore().resetState()
            return

        }
        if(data.code ==7){
            toPtah('/pages/kf/index')
            return
        }

        if(data.msg){
            uni.showToast({
                icon: 'none',
                title: data.msg,
                duration:2000
            })
        }

        //异常抛出

        return Promise.reject(data)
    } catch (error) {
        return Promise.reject('请求失败')
    } finally {
        if (!hideLoading) {
         //   uni.hideLoading()
        }
    }
}
export default request
