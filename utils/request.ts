import environment from './environments.ts'
import { userStore } from '@/stores/user'
import { getWindowUrl } from "./index"
import { toPtah } from "@/utils/index"

const baseUrl = environment.envConfigs.url
const apiServe = environment.SERVE_CTX

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
const DEFAULT_PLATFARM_TYPE: PlatformType =
    (typeof window !== 'undefined' ? 'h5' : 'android') as PlatformType

const CSRF_HEADER_KEY = 'X-CSRF-Token'
const CSRF_COOKIE_KEY = 'CSRF-Token'

const getCookieValue = (name: string): string => {
    if (typeof document === 'undefined' || !document.cookie) {
        return ''
    }
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : ''
}

const setCookieValue = (name: string, value: string) => {
    if (typeof document === 'undefined' || !name || !value) {
        return
    }
    try {
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/`
    } catch (e) {}
}

const getSameOriginUrl = (path: string): string => {
    if (typeof window !== 'undefined' && window.location?.origin) {
        return `${window.location.origin}${path}`
    }
    return path
}

const ensureCsrfToken = async (forceRefresh = false): Promise<string> => {
    // #ifdef H5
    const existing = getCookieValue(CSRF_COOKIE_KEY)
    if (!forceRefresh && existing) {
        return existing
    }

    const csrfBootstrapUrls = [
        getSameOriginUrl('/h5-api/api/csrf-token'),
        getSameOriginUrl('/api/csrf-token'),
        getSameOriginUrl('/h5-api/api/base/nologin/csrf-token'),
        getSameOriginUrl('/api/base/nologin/csrf-token'),
    ]

    for (const csrfBootstrapUrl of csrfBootstrapUrls) {
        try {
            const res: any = await uni.request({
                url: csrfBootstrapUrl,
                method: 'GET',
                timeout: 6000,
            })
            const headerToken =
                res?.header?.[CSRF_HEADER_KEY] ||
                res?.header?.[CSRF_HEADER_KEY.toLowerCase()] ||
                ''
            const cookieToken = getCookieValue(CSRF_COOKIE_KEY)
            if (!cookieToken && headerToken) {
                setCookieValue(CSRF_COOKIE_KEY, headerToken)
            }
            if (headerToken || cookieToken) {
                return headerToken || getCookieValue(CSRF_COOKIE_KEY) || cookieToken
            }
        } catch (e) {
            // try next endpoint
        }
    }

    return ''
    // #endif

    // #ifndef H5
    return ''
    // #endif
}

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
    hideLoading = true,
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
    
    // ========== 关键修改：H5 生产环境使用 /h5-api 代理 ==========
    let requestUrl: string
    // #ifdef H5
    const isLocalHost = typeof window !== 'undefined' &&
        /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(window.location.host)
    if (isLocalHost) {
        // 开发环境
        requestUrl = baseUrl + url
    } else {
        // 生产环境：强制使用当前页面 origin，避免 http/https 协议错位
        requestUrl = getSameOriginUrl('/h5-api' + url)
    }
    // #endif
    // #ifndef H5
    // 非 H5 平台（App等）
    requestUrl = baseUrl + apiServe[serve] + url
    // #endif
    // ========================================================
    
    const token = await userStore().token
    const merchantCode = await userStore().merchantCode
    const MerchantId = await userStore().agentId
    //#ifdef H5
    const MerchantUrl = getWindowUrl()
    //#endif
    const authHeaders: Record<string, string | number> = {
        Token: token ? `${token}` : '',
        merchantCode: merchantCode ? `${merchantCode}` : '',
        ClientType: DEFAULT_PLATFARM_TYPE,
        language: 'zh'
    }
    const upperMethod = String(method || '').toUpperCase()
    //#ifdef H5
    if (!merchantCode && MerchantId) {
        authHeaders.MerchantId = MerchantId
    } else if (!merchantCode && MerchantUrl) {
        authHeaders.MerchantUrl = MerchantUrl
    }
    if (upperMethod !== 'GET' && upperMethod !== 'HEAD' && upperMethod !== 'OPTIONS') {
        const csrfToken = await ensureCsrfToken()
        if (csrfToken) {
            authHeaders[CSRF_HEADER_KEY] = csrfToken
        }
    }
    //#endif
    //#ifndef H5
    if (!merchantCode && MerchantId) {
        authHeaders.MerchantId = MerchantId
    }
    //#endif

    try {
        const requestConfig: any = {
            url: requestUrl,
            method: method,
            data: body,
            header: Object.assign(authHeaders, headers),
            timeout,
            enableCache: true,
            withCredentials: true,
        }

        const res: any = await uni.request(requestConfig)
        const resData = res?.data

        // H5 场景下 -400 常见于 CSRF 首次未对齐，强制刷新 token 后重试一次。
        if (resData?.code === -400 && upperMethod !== 'GET' && upperMethod !== 'HEAD' && upperMethod !== 'OPTIONS') {
            const retryToken = await ensureCsrfToken(true)
            if (retryToken) {
                const retryHeaders = Object.assign({}, authHeaders, headers, { [CSRF_HEADER_KEY]: retryToken })
                const retryRes: any = await uni.request({
                    ...requestConfig,
                    header: retryHeaders,
                })
                if (retryRes?.statusCode === 200) {
                    const retryData = retryRes?.data
                    if (retryData?.code === 0 || retryData?.code === 100011) {
                        return Promise.resolve(retryData)
                    }
                }
            }
        }

        const statusCode: number = res?.statusCode
        const responsePayload: any = res?.data
        if (statusCode !== 200) {
            uni.showToast({
                icon: 'none',
                title: '系统错误！',
            })
            return Promise.reject('系统错误')
        }
        if (responsePayload?.code == 0) {
            return Promise.resolve(responsePayload)
        }
        if (responsePayload?.code == 100011) {
            return Promise.resolve(responsePayload)
        }

        if (responsePayload?.code == -401) {
            uni.showToast({
                icon: 'none',
                title: '您的帐号已在其他设备登录',
            })
            userStore().resetState()
            return
        }
        if (responsePayload?.code == 7) {
            toPtah('/pages/kf/index')
            return
        }

        if (responsePayload?.msg) {
            uni.showToast({
                icon: 'none',
                title: responsePayload.msg,
                duration: 2000
            })
        }

        return Promise.reject(responsePayload)
    } catch (error) {
        // 保留原始错误，便于定位是网络/CORS/超时还是业务 reject
        console.error('[request error]', {
            url: requestUrl,
            method,
            error,
        })
        return Promise.reject(error)
    } finally {
        if (!hideLoading) {
            // uni.hideLoading()
        }
    }
}

export default request