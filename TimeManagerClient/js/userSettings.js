/**
 * 此文件负责用户更改主题的功能
 * by littlefean
 */



/**
 * 用户的自定义设置类
 *
 * 目前的自定义设置只有主题颜色
 *
 */
class UserSettings {
    constructor() {

        // 四种更改主题的按钮
        this.s1EleBtn = $(".choiceStyle .s1");
        this.s2EleBtn = $(".choiceStyle .s2");
        this.s3EleBtn = $(".choiceStyle .s3");
        this.s4EleBtn = $(".choiceStyle .s4");

        // 整个大界面的背景
        this.backgroundEleList = [];
        // 小面板背景颜色
        this.pannelEleList = [];

        this.set("pinkStyle");
        this._bind();
    }

    /**
     * 获取到所有需要更新颜色的element，并添加到自身属性的数组
     * @private
     */
    _getEle() {
        // 先清空数组
        this.backgroundEleList = [];
        this.pannelEleList = [];

        // 更新背景
        for (let ele of $$(".view")) {
            this.backgroundEleList.push(ele);
        }
        for (let ele of $$(".num")) {
            this.backgroundEleList.push(ele);
        }
        // 面板
        this.pannelEleList.push($(".leftPageBtn"));
        this.pannelEleList.push($(".rightPageBtn"));
        this.pannelEleList.push($(".setModeBtn"));
        this.pannelEleList.push($(".modeChangeBtn"));
        this.pannelEleList.push($(".inputBox"));
        for (let ele of $$(".item")) {
            this.pannelEleList.push(ele);
        }
        for (let ele of $$(".checkItem")) {
            this.pannelEleList.push(ele);
        }
        for (let ele of $$(".lineBtn")) {
            this.pannelEleList.push(ele);
        }
    }

    /**
     * 更改设置
     * 此方法会更改界面的css颜色
     * 同时会更改全局属性user的style属性
     * @param styleName
     */
    set(styleName) {
        userData.style = styleName;
        this._getEle();

        /**
         *
         * div {
            background-color: ${Style[styleName].background};
            color: ${Style[styleName].normalWord};
        }
         *
         *
         * @type {string}
         */
        $(".jsControlCss").innerText = `
        
        .item {
            background-color: ${Style[styleName].panelBackground};
            color: ${Style[styleName].normalWord};
        }
        `;
        for (let ele of this.backgroundEleList) {
            ele.style.backgroundColor = Style[styleName].background;
        }

        for (let ele of this.pannelEleList) {
            ele.style.backgroundColor = Style[styleName].panelBackground;
        }
    }

    /**
     * 通过网络请求的方式更新用户的颜色风格
     * 用于一开始登录加载
     */
    update() {
        let oAjax2 = new XMLHttpRequest();
        oAjax2.open("POST", `http://${ADDRESS}:${PORT}/userGetSettings`);
        oAjax2.setRequestHeader("Content-Type", "application/json");
        oAjax2.send(JSON.stringify({
            userName: userData.name,
        }));
        oAjax2.onload = () => {
            let obj = JSON.parse(oAjax2.responseText)
            console.log("应该得到的主题颜色：", obj["style"])
            this.set(obj["style"])
        }
    }

    _bind() {
        let sendSet = (str) => {
            oAjax.open("POST", `http://${ADDRESS}:${PORT}/userSetSettings`);
            oAjax.setRequestHeader("Content-Type", "application/json");
            oAjax.send(JSON.stringify({
                userName: userData.name,
                settings: {
                    style: str
                }
            }));
            oAjax.onload = () => {
                if (JSON.parse(oAjax.responseText) === "ok") {

                }
            }
        }
        this.s1EleBtn.onclick = () => {
            this.set("pinkStyle");
            sendSet("pinkStyle");
        }
        this.s2EleBtn.onclick = () => {
            this.set("blueStyle");
            sendSet("blueStyle");
        }
        this.s3EleBtn.onclick = () => {
            this.set("yellowStyle");
            sendSet("yellowStyle");
        }
        this.s4EleBtn.onclick = () => {
            this.set("blackStyle");
            sendSet("blackStyle");
        }
    }


}
