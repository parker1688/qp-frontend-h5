import { userStore } from "@/stores/user"
import { startStore } from "@/stores/start"
import environment from '@/utils/environments.ts'
const baseUrl = environment.envConfigs.url

const GAME_TYPE_ALIAS_MAP: Record<string, string> = {
	elecgame: 'elecgame',
	slots: 'elecgame',
	'slot machines': 'elecgame',
	arcade: 'elecgame',
	chess: 'chess',
	table: 'chess',
	poker: 'chess',
	fish: 'fish',
	live: 'live',
	sport: 'sport',
	lottery: 'lottery',
	esport: 'esport'
}

export function normalizeGameType(value: string) {
	if (!value) return value
	const key = String(value).trim().toLowerCase()
	return GAME_TYPE_ALIAS_MAP[key] || key
}

//判断是否上一页
export const getCurrentPagesBut = () => {
	let isPrevPage = false
	let pages = getCurrentPages();   // 获取当前页面栈的实例
	let currPage = pages[pages.length - 1];   //当前页面
	let prevPage = pages[pages.length - 2];  //上一个页面
	if (prevPage && (prevPage.route || prevPage.__route__)) {
		isPrevPage = true
	}
	return isPrevPage

}



// 页面跳转封装
export const pagesRoute = () => {
	const isPrevPage = getCurrentPagesBut()
	if (isPrevPage) {
		uni.navigateBack()
	} else {
		let url = '/pages/tabBar/home/index'
		let type = userStore().customNum
		if (type == 1) {
			url = '/pages/tabBar/eventsManage/index'
		} else if (type == 2) {
			url = '/pages/tabBar/savingsAccount/index'
		} else if (type == 3) {
			url = '/pages/tabBar/bill/index'
		} else if (type == 4) {
			url = '/pages/tabBar/mine/index'
		}
		uni.switchTab({ url })
	}

}


//跳转页面
export const toPtah = (url : string, type : number = 1, isLogin : boolean = false) => {
	uni.getNetworkType({
		success: (res) => {
			if (res.networkType === 'none') {
				uni.navigateTo({ url:'/pages/noInternet/index' })
			}else {
				const isToken = userStore().token ? true : false
				if (!isToken && isLogin) {
					uni.navigateTo({ url: '/pages/login/index' })
					return
				}
				if (type === 0) {  //tabBar主页面
					uni.switchTab({ url })
				} else if (type === 1) {  //非 tabBar 页面，它会保留当前页面
					uni.navigateTo({ url })
				} else if (type === 2) {
					uni.redirectTo({ url })  //非 tabBar 页面，关闭当前页面
				} else if (type === 3) {  //关闭所有页面，打开到应用内的某个页面。
					uni.reLaunch({ url })
				} else if(type === 4){
					window.open(`https://${url}`,'_blank')
				}else {
					uni.navigateBack({
						delta: url
					})
				}
			}
		}
	});


}

//分割数组
export function pointsList(list : any) {
	if (!Array.isArray(list) || !list.length) {
		return []
	}
	let newList = []
	list.forEach(it => {
		const itList = it.game_type.split(',')
		const itNewList = itList.map(its => {
			let item = {
				...it
			}
			item.game_type = normalizeGameType(its)

			return item
		})
		newList = [...newList, ...itNewList]
	})
	return newList
}

//获取娱乐场数据
export function menusFn(list : any, size : number = 6) {
	//电子
	const elecgameList=['PGDZ','JDB','FGDZ','CQ9','TYQP','BBIN','KYQP','AGZR','MTQP','MGDZ','JLDZ','WUGDZ','LYQP']
	//棋牌
	const chessList=['KYQP', 'TYQP', 'LYQP','FGDZ', 'MTQP', 'JDB', 'WALI', 'MGDZ']
	//捕鱼
	const fishLisy=['JDB', 'TYQP', 'MTQP', 'FGDZ', 'KYQP', 'LYQP', 'MGDZ']
	//体育
	const sportLisy=['WALI', 'BBIN', 'FBTY', 'HGTY']
	let map = new Map();
	list.forEach(item => {
		item.game_type = normalizeGameType(item.game_type)

		if (item.game_type_img && item.game_type_img.length) {
			item.game_type_img = item.game_type_img.map(its => {
				its.is_maintain = item.is_maintain
				its.game_type = normalizeGameType(its.game_type)
				return its
			})
			if (!map.has(item.game_type)) {
				map.set(item.game_type, []);
			}
			const res = item.game_type_img.find(it => it.game_type == item.game_type)
			if (res) {
				map.get(item.game_type).push(res);
			}
		}

	});
	const newAllLits = Array.from(map, ([game_type, list]) => ({ game_type, list }));
	const allLits=newAllLits.map(it=>{
		const hotList = it.list.filter((its: any) => Number(its?.hot) === 1)
		it.list = hotList.length ? hotList : it.list.filter(Boolean)
		if(it.game_type === 'elecgame'){
			it.list= cgSortedArray(it.list,elecgameList)
		}else if(it.game_type === 'chess'){
			it.list= cgSortedArray(it.list,chessList)
		}else if(it.game_type === 'fish'){
			it.list= cgSortedArray(it.list,fishLisy)
		}else if(it.game_type === 'sport'){
			it.list= cgSortedArray(it.list,sportLisy)
		}
		return it
	}).filter(it => it.list.length)
	const newMaps = allLits.map(it => {
		const ilist = menus23Fn(it.list, size)
		return {
			cgList: ilist,
			game_type: it.game_type
		}
	})
	const newMap = sortedArray(newMaps)
	return { newMap, allLits }
}


// 排序
export function sortedArray(list : Array) {
	//处理特殊数据类型
//	const venueGameType = startStore().venueGameType
//	const noSort = list.filter(item => !venueGameType.includes(item.game_type));
//	const toSort = list.filter(item => venueGameType.includes(item.game_type));
//	toSort.sort((a, b) => a.name.localeCompare(b.name)); // 根据需要排序的属性进行排序
//	return [...noSort, ...toSort]; // 将不排序的元素和排序后的元素合并

//	const sortList= startStore().gameTypeList.map(it=>it.venue_type)

	const sortList=["elecgame","chess","fish","live","sport","lottery","esport"]
	return	list.sort((a, b) => {
		let indexA = sortList.indexOf(a.game_type);
		let indexB = sortList.indexOf(b.game_type);
		return indexA - indexB;
	});

}

//场馆
export function cgSortedArray(list : Array,sortList: Array) {
	//处理特殊数据类型
	return	list.sort((a, b) => {
		let indexA = sortList.indexOf(a.venue_code);
		let indexB = sortList.indexOf(b.venue_code);
		return indexA - indexB;
	});

}

//2维转3维
export function menus23Fn(list : any, size : number) {
	const newList = []
	const total = Math.ceil(list.length / size)
	for (let i = 0; i < total; i++) {
		const it = list.slice(i * size, (i + 1) * size)
		newList.push(it)
	}

	return newList
}

//复制
export function copyText(text : any) {
	uni.setClipboardData({
		data: text,
		success: function () {
			uni.showToast({
				title: '复制成功！',
			})
		}
	});
}
//获取网站的URL
export function getWindowUrl() {
	const protocol = window.location.protocol + '//';
	const hostname = window.location.hostname
	const port = window.location.port ? ':' + window.location.port : ''
	return protocol + hostname + port
}

//打开游戏或者打开第三方
export function openGame(it:object){
	userStore().setGameUrl(it.gameUrl)
	toPtah('/pages/gameManage/game/index?title=' + it.title)
	//window.location.href = it.gameUrl
}
//充值
export function openSavingsAccount(url:string){
    //#ifndef H5
    toPtah('/pages/savingsManage/topUp/recharge?path='+url)

    //#endif
    //#ifdef H5
    setTimeout(()=>{
      window.open(url, '_blank');
    },200)
    //#endif

}


interface NavItem {
	level : number;
	name : string;
	image ?: string;
	image_path ?: string;
}

interface ParsedData {
	navList ?: NavItem[];
	content ?: string;
}

interface OriginalItem {
	id : string;
	key : string;
	name : string;
	data : string;
}

interface MenuNode {
	id : string;
	key : string;
	name : string;
	level : number;
	image ?: string;
	image_path ?: string;
	content ?: string;
	children ?: MenuNode[];
}

export function formatFlexibleHierarchy(data: OriginalItem[]): MenuNode[] {
    const rootNodesMap: Record<string, MenuNode> = {};
    const level0NodesMap: Record<string, Record<string, MenuNode>> = {};
    const level1NodesMap: Record<string, Record<string, Record<string, MenuNode>>> = {};

    data.forEach(item => {
        try {
            const parsedData: ParsedData = JSON.parse(item.data);
            if (!parsedData.navList) return;

            const compositeKey = `${item.key}-${item.name}`;
            const processedContent = parsedData.content?.replace(/\/api\/upload\//g, `${baseUrl}/api/upload/`);

            // 初始化根节点
            if (!rootNodesMap[compositeKey]) {
                rootNodesMap[compositeKey] = {
                    id: `root-${compositeKey}`,
                    key: item.key,
                    name: item.name,
                    level: -1,
                    children: []
                };
            }

            // 初始化level0节点映射
            if (!level0NodesMap[compositeKey]) {
                level0NodesMap[compositeKey] = {};
            }

            // 初始化level1节点映射
            if (!level1NodesMap[compositeKey]) {
                level1NodesMap[compositeKey] = {};
            }

            // 处理level0节点
            const level0Items = parsedData.navList.filter(item => item.level === 0);
            level0Items.forEach(level0Item => {
                const level0Name = level0Item.name;
                const level0NodeId = `${compositeKey}-level0-${level0Name}`;

                if (!level0NodesMap[compositeKey][level0Name]) {
                    level0NodesMap[compositeKey][level0Name] = {
                        id: level0NodeId,
                        key: item.key,
                        name: level0Name,
                        level: 0,
                        image: level0Item.image,
                        image_path: level0Item.image_path,
                        children: []
                    };
                    rootNodesMap[compositeKey].children!.push(level0NodesMap[compositeKey][level0Name]);
                }

                // 处理level1节点（保持原有逻辑，确保children数量不变）
                const level1Items = parsedData.navList.filter(item => item.level === 1);
                level1Items.forEach(level1Item => {
                    const level1Name = level1Item.name;
                    const level1NodeId = `${compositeKey}-level1-${level1Name}`;

                    if (!level1NodesMap[compositeKey][level0Name]) {
                        level1NodesMap[compositeKey][level0Name] = {};
                    }

                    if (!level1NodesMap[compositeKey][level0Name][level1Name]) {
                        const level1Node: MenuNode = {
                            id: level1NodeId,
                            key: item.key,
                            name: level1Name,
                            level: 1,
                            image: level1Item.image,
                            image_path: level1Item.image_path,
                            children: []
                        };
                        level1NodesMap[compositeKey][level0Name][level1Name] = level1Node;
                        level0NodesMap[compositeKey][level0Name].children!.push(level1Node);
                    }

                    // 处理level2节点（递归部分）
                    const level2Items = parsedData.navList.filter(item => item.level === 2);
                    level2Items.forEach(level2Item => {
                        const level2NodeId = `${level1NodesMap[compositeKey][level0Name][level1Name].id}-${level2Item.name}`;
                        const level2Node: MenuNode = {
                            id: level2NodeId,
                            key: item.key,
                            name: level2Item.name,
                            level: 2,
                            image: level2Item.image,
                            image_path: level2Item.image_path,
                            content: processedContent // level2作为最末级节点携带内容
                        };
                        level1NodesMap[compositeKey][level0Name][level1Name].children!.push(level2Node);
                    });

                    // 如果没有level2节点，将内容放在level1
                    if (level2Items.length === 0 && processedContent) {
                        level1NodesMap[compositeKey][level0Name][level1Name].content = processedContent;
                    }
                });

                // 如果没有level1节点，将内容放在level0
                if (level1Items.length === 0 && processedContent) {
                    level0NodesMap[compositeKey][level0Name].content = processedContent;
                }
            });
        } catch (e) {
            console.error(`Error parsing item ${item.id}:`, e);
        }
    });

    return Object.values(rootNodesMap);
}