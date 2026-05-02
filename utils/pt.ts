import { userStore } from "@/stores/user"

//获取PT场馆路径
export function getPtUrl(item:any){
    const username = userStore().userInfo.user_name
    const realMode = 1;
    const language ="ZH-CN"
    const clientPlatform = "mobile"
    const casino = 'agdragon'


    const params = new URLSearchParams({
        gameCodeName: item.game_code,
        username,
        casino,
        clientPlatform,
        language,
        playMode: String(realMode),
        swipeUpOff: "true",
        tempToken: item.sessionToken
    });

    const gameUrl = "https://login-ag.agdragonbc.com/GameLauncher?" + params.toString();

    console.log(gameUrl);
    return gameUrl;

    // const gameUrl = "https://login-ag.agdragonbc.com/GameLauncher?gameCodeName=" + item.game_code + "&username=" + username
    //     + "&casino=" + casino + "&clientPlatform=" + clientPlatform + "&language=" + language
    //     + "&playMode=" + realMode + "&deposit=" + "&lobby=" + "&swipeUpOff=true" + "&tempToken=" + item.sessionToken ;
    // return gameUrl
}