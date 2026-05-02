
   export const monitouzhu = [{
        id: 1,
        name: "让球",
        main: [{
            id: 1,
            title: "阿森纳 ",
            detail: "0",
            odds: 1.98,
            sort: "",
            icon: "win",
            desc: "平手盘（0）时投注获胜的队伍为赢，阿森纳获胜",
            desc1: "故投注阿森纳（0）为赢"
        }, {
            id: 2,
            title: "阿森纳 ",
            detail: "-0/0.5",
            odds: 1.98,
            sort: "",
            icon: "win",
            desc: "切尔西获得受让分后，让分结果为：2-0或2-0.5，均为阿森纳获胜",
            desc1: "故投注阿森纳（-0/0.5）为赢"
        }, {
            id: 3,
            title: "阿森纳 ",
            detail: "-1",
            odds: 1.98,
            sort: "",
            icon: "win",
            desc: "切尔西获得受让分后，让分结果为：2-1，阿森纳获胜",
            desc1: "故投注阿森纳（-1）为赢"
        }, {
            id: 4,
            title: "阿森纳 ",
            detail: "-1.5/2",
            odds: 1.98,
            sort: "down",
            icon: "winhalf",
            desc: "切尔西获得受让分后，让分结果为：2-1.5或2-2，2-1.5时阿森纳获胜，2-2时为和局，一半的赛果为阿森纳获胜",
            desc1: "故投注阿森纳（-1.5/2）为赢一半"
        }],
        guest: [{
            id: 5,
            title: "切尔西 ",
            detail: "0",
            odds: 1.98,
            sort: "upward",
            icon: "lose",
            desc: "平手盘（0）时投注获胜的队伍为赢，切尔西败北",
            desc1: "故投注切尔西（0）为输"
        }, {
            id: 6,
            title: "切尔西 ",
            detail: "+0/0.5",
            odds: 1.98,
            sort: "",
            icon: "lose",
            desc: "切尔西获得受让分后，让分结果为：2-0或2-0.5，均为切尔西败北",
            desc1: "故投注切尔西（+0/0.5）为输"
        }, {
            id: 7,
            title: "切尔西 ",
            detail: "+1",
            odds: 1.98,
            sort: "down",
            icon: "lose",
            desc: "切尔西获得受让分后，让分结果为：2-1，切尔西败北",
            desc1: "故投注切尔西（+1）为输"
        }, {
            id: 8,
            title: "切尔西 ",
            detail: "+1.5/2",
            odds: 1.98,
            sort: "",
            icon: "losehalf",
            desc: "切尔西获得受让分后，让分结果为：2-1.5或2-2，2-1.5切尔西败北，2-2时为和局，一半的赛果为切尔西败北",
            desc1: "故投注切尔西（+1.5/2）为输一半"
        }]
    }, {
        id: 2,
        name: "大小",
        main: [{
            id: 1,
            title: "投注:大 ",
            detail: "大1.5",
            odds: 1.98,
            sort: "",
            icon: "win",
            desc: "进球数为2，大于1.5",
            desc1: "故投注（大1.5）为赢"
        }, {
            id: 2,
            title: "投注:大 ",
            detail: "大1.5/2",
            odds: 1.98,
            sort: "",
            icon: "winhalf",
            desc: "进球数为2，大于投注盘1.5为赢，等于投注盘2为打和；一半结果为赢。",
            desc1: "故投注（大1.5/2）为赢一半"
        }, {
            id: 3,
            title: "投注:大 ",
            detail: "大2",
            odds: 1.98,
            sort: "",
            icon: "with",
            desc: "进球数为2，等于投注盘2为打和，和局退款。",
            desc1: "故投注（大2）为退回本金"
        }, {
            id: 4,
            title: "投注:大 ",
            detail: "大2/2.5",
            odds: 1.98,
            sort: "down",
            icon: "losehalf",
            desc: "进球数为2，等于投注盘2为打和，小于投注2.5为输，一半的结果为输。",
            desc1: "故投注（大2/2.5）为输一半"
        }],
        guest: [{
            id: 5,
            title: "投注:小 ",
            detail: "小1.5",
            odds: 1.98,
            sort: "upward",
            icon: "lose",
            desc: "进球数为2，大于1.5",
            desc1: "故投注（小1.5）为输"
        }, {
            id: 6,
            title: "投注:小 ",
            detail: "小1.5/2",
            odds: 1.98,
            sort: "",
            icon: "losehalf",
            desc: "进球数为2，大于投注盘1.5为赢，等于投注盘2为打和；一半结果为赢。",
            desc1: "故投注（小1.5/2）为输一半"
        }, {
            id: 7,
            title: "投注:小 ",
            detail: "小2",
            odds: 1.98,
            sort: "down",
            icon: "with",
            desc: "进球数为2，等于投注盘2为打和，和局退款。",
            desc1: "故投注（小2）为退回本金"
        }, {
            id: 8,
            title: "投注:小 ",
            detail: "小2/2.5",
            odds: 1.98,
            sort: "",
            icon: "winhalf",
            desc: "进球数为2，等于投注盘2为打和，小于投注2.5为赢，一半的结果为赢。",
            desc1: "故投注（小2/2.5）为赢一半"
        }]
    }, {
        id: 3,
        name: "独赢",
        main: [{
            id: 1,
            title: "主胜 ",
            detail: "主胜",
            odds: 1.98,
            sort: "",
            icon: "win",
            desc: "阿森纳赢2球，获胜",
            desc1: "故投注（主胜）为赢"
        }, {
            id: 2,
            title: "和局 ",
            detail: "和局",
            odds: 1.98,
            sort: "",
            icon: "lose",
            desc: "阿森纳赢2球，非和局",
            desc1: "故投注（和局）为输"
        }, {
            id: 3,
            title: "客胜 ",
            detail: "客胜",
            odds: 1.98,
            sort: "",
            icon: "lose",
            desc: "切尔西输2球，败北",
            desc1: "故投注（客胜）为输"
        }]
    }, {
        id: 4,
        name: "角球",
        main: [{
            id: 1,
            title: "阿森纳 ",
            detail: "-1.5",
            odds: 1.98,
            sort: "",
            icon: "win",
            desc: "切尔西获得受让分后，角球让分结果为：7-6.5，阿森纳获胜",
            desc1: "故投注阿森纳（-1.5）为赢"
        }, {
            id: 2,
            title: "阿森纳 ",
            detail: "-1.5/2",
            odds: 1.98,
            sort: "",
            icon: "winhalf",
            desc: "切尔西获得受让分后，角球让分结果为：7-6.5或7-7，7-6.5阿森纳获胜，7-7时为和局，一半的赛果为阿森纳获胜",
            desc1: "故投注阿森纳（-1.5/2）为赢一半"
        }],
        guest: [{
            id: 3,
            title: "切尔西 ",
            detail: "+1.5",
            odds: 1.98,
            sort: "",
            icon: "lose",
            desc: "切尔西获得受让分后，角球让分结果为：7-6.5，切尔西败北",
            desc1: "故投注切尔西（+1.5）为输"
        }, {
            id: 4,
            title: "切尔西 ",
            detail: "+1.5/2",
            odds: 1.98,
            sort: "",
            icon: "losehalf",
            desc: "切尔西获得受让分后，角球让分结果为：7-6.5或7-7，7-6.5阿森纳获胜，7-7时为和局，一半的赛果为切尔西败北",
            desc1: "故投注切尔西（+1.5/2）为输一半"
        }]
    }, {
        id: 5,
        name: "单双",
        main: [{
            id: 1,
            title: "单",
            detail: "单",
            odds: 1.98,
            sort: "",
            icon: "lose",
            desc: "进球数为2，为双数",
            desc1: "故投注（单）为输"
        }, {
            id: 2,
            title: "双",
            detail: "双",
            odds: 1.98,
            sort: "",
            icon: "win",
            desc: "进球数为2，为双数",
            desc1: "故投注（双）为赢"
        }]
    }, {
        id: 6,
        name: "波胆",
        main: [{
            id: 1,
            title: "投注：",
            detail: "2-0",
            odds: 1.98,
            sort: "",
            icon: "win",
            desc: "赛果与投注项完全一致",
            desc1: "故投注（2-0）为赢"
        }, {
            id: 2,
            title: "投注：",
            detail: "其他比分",
            odds: 1.98,
            sort: "",
            icon: "lose",
            desc: `仅当赛果与所有比分选项不一致时，投注"其他比分"为赢；当前有与赛果比分一致的投注项`,
            desc1: "故投注（其他比分）为输"
        }, {
            id: 3,
            title: "投注：",
            detail: "0-2",
            odds: 1.98,
            sort: "",
            icon: "lose",
            desc: "投注比分与赛果比分不一致",
            desc1: "故投注（0-2）为输"
        }]
    }];
