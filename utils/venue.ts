export const  getGtype = (item:any) =>{
    //     if(item.game_type==="elecgame" && item.venue_code==="BBIN"  ){
    //     return 62
    // }else if(item.game_type==="lottery" && item.venue_code==="BBIN" ){
    //      return  63
    //  }else if(item.game_type==="fish" && item.venue_code==="BBIN" ){
    //     return  66
    // }else
    if(item.game_type==="live" && item.venue_code==="BBIN" ){
        return  60
    }else if(item.game_type==="sport" && item.venue_code==="BBIN"  ){
         return 64
     }else  {
        return item.gtype || 0
    }
}
