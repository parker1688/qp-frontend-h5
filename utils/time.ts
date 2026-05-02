export function formatDate(value :any = Date.now(), format:string = "Y-M-D h:m:s") {
    //判断时间是否为时间戳
    if(!/^[0-9]+$/.test(value)){
      //  value= new Date(value.replace(/-/g, '/')).getTime()
        value= new Date(value).getTime()
    }
    const formatNum = n => `0${n}`.slice(-2);
    const date = new Date(value)
    const fmtList = ["Y", "M", "D", "h", "m", "s"];
    const rtList = [];
    rtList.push(date.getFullYear().toString());
    rtList.push(formatNum(date.getMonth() + 1));
    rtList.push(formatNum(date.getDate()));
    rtList.push(formatNum(date.getHours()));
    rtList.push(formatNum(date.getMinutes()));
    rtList.push(formatNum(date.getSeconds()));
    for (let i = 0; i < rtList.length; i++) {
        format = format.replace(fmtList[i], rtList[i]);
    }
    return format;
}

//获取时间处理方法
export function getDayTime(num:number){
    const starTtime=new Date().getTime()
    const numTime= starTtime -  num * 86400000
    const startAt=formatDate(numTime,"Y-M-D") + ' 00:00:00'
    let endAt=''
    if(num == 1){
        endAt= formatDate(numTime,"Y-M-D") + ' 23:59:59'
    }else {
        endAt= formatDate(starTtime,"Y-M-D h:m:s")
    }
    return  {startAt,endAt}
}