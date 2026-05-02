//前端日志

import {getClientlogs} from "@/api/user";
import {userStore} from "@/stores/user"
export function clientlogsBut(it:any){

    let  clienttype= ''
    //#ifdef H5
    clienttype= 'H5'
    //#endif
    // #ifdef APP-PLUS
    clienttype= checkPlatform()
    //#endif

    setTimeout(()=>{
        const version=userStore().version
        getClientlogs({ID:it.ID,data:JSON.stringify({...it.item,version,clienttype})})
    },1000)
}

const checkPlatform =()=> {
    const systemInfo = uni.getSystemInfoSync();
    if (systemInfo.platform === 'android') {
       return 'android'
        // 安卓平台下的代码
    } else if (systemInfo.platform === 'ios') {
        return 'ios'
        // iOS平台下的代码
    }
}