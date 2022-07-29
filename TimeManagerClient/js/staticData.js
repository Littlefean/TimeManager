/**
 *
 * by littlefean
 */
let d = document;
d.get = document.querySelector;

let PORT = 10007;
let ADDRESS = "localhost";

let URL = `http://${ADDRESS}:${PORT}/get`;

let oAjax = new XMLHttpRequest();


// 获取设备像素比、canvas解决模糊问题用的

let PR = window.devicePixelRatio;

// 获取窗口宽度
let winWidth;
let winHeight;
if (window.innerWidth) {
    winWidth = window.innerWidth;
} else if ((document.body) && (document.body.clientWidth)) {
    winWidth = document.body.clientWidth;
}
// 获取窗口高度
if (window.innerHeight) {
    winHeight = window.innerHeight;
} else if ((document.body) && (document.body.clientHeight)) {
    winHeight = document.body.clientHeight;
}

let weekNameDic = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
let hourList = [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1];


let nowWeek = ["?", "?", "?", "?", "?", "?", "?"];

let Style = {
    pinkStyle: {
        background: "#fad9eb",
        panelBackground: "#ec8ec1",
        lightWord: "#fff",
        normalWord: "#222",
        dashLine: "#333",
    },
    blueStyle: {
        background: "#d9ebfa",
        panelBackground: "#8ec6ec",
        lightWord: "#fff",
        normalWord: "#222",
        dashLine: "#333",
    },
    yellowStyle: {
        background: "#faf0d9",
        panelBackground: "#ecd38e",
        lightWord: "#fff",
        normalWord: "#222",
        dashLine: "#333",
    },
    blackStyle: {
        background: "#202020",
        panelBackground: "#575757",
        lightWord: "#b6b6b6",
        normalWord: "#fff",
        dashLine: "#777",
    }
};
// 用户信息
let userData = {
    name: "张全蛋",
    password: "123456",
    style: "pinkStyle",
    /**
     * @type {[TimePeriod]}
     */
    periodList: [],

    /**
     * 前端删除一个元素的方法，该方法会修改 periodList
     */
    delPeriod: function (obj) {
        let newList = [];
        for (let item of this.periodList) {
            if (JSON.stringify(item) === JSON.stringify(obj)) {
                continue;
            }
            newList.push(item);
        }
        this.periodList = newList;
    },

    // 添加时间面板的种类
    addTimeKindList: [
        {
            name: "数学",
            color: `rgba(0, 0, 255, 1)`,
            fontColor: `rgba(255, 255, 255, 1)`,
        },
        {
            name: "英语",
            color: `rgba(255, 0, 255, 1)`,
            fontColor: `rgba(255, 255, 255, 1)`,
        },
        {
            name: "政治",
            color: `rgba(255, 255, 0, 1)`,
            fontColor: `rgba(255, 0, 0, 1)`,
        },
        {
            name: "吃饭",
            color: `rgb(153, 215, 18)`,
            fontColor: `rgb(168, 79, 0)`,
        },
        {
            name: "睡觉",
            color: `rgb(20, 98, 85)`,
            fontColor: `rgb(255, 255, 255)`,
        },
    ]
}
