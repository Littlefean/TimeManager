/**
 * 组件库
 * by littlefean
 */


/**
 * 一种弹窗组件
 */
class AlertEle {
    /**
     *
     * @param openBtn {HTMLElement}
     * @param closeBtn {HTMLElement}
     * @param panelEle {HTMLElement}
     */
    constructor(openBtn, closeBtn, panelEle) {
        // 面板
        this.panelEle = panelEle;
        // 触发面板开启的按钮
        this.openBtn = openBtn;
        // 触发面板关闭的按钮
        this.closeBtn = closeBtn;
        this.setInit();
    }

    setInit() {
        this.panelEle.style.display = "none"; // 一开始是关闭的状态
        this.openBtn.addEventListener("click", () => {
            this.panelEle.style.display = "block";
        })
        this.closeBtn.addEventListener("click", () => {
            this.panelEle.style.display = "none";
        })
    }

    /**
     * 让一个按钮具有关闭面板的功能
     * @param btnEle
     */
    setCloseBtn(btnEle) {
        btnEle.addEventListener("click", () => {
            this.panelEle.style.display = "none";
        })
    }

    /**
     * 给一个btn添加绑定事件
     * @param btn
     * @param func {Function}
     */
    static bindEvent(btn, func) {
        btn.addEventListener("click", func);
    }

    /**
     * 在当前面板组件中查找一个元素
     * @param queryStr
     */
    query(queryStr) {
        return this.panelEle.querySelector(queryStr);
    }
}

/**
 * 一种双菜单切换组件
 */
class CheckTwoPanel {

    /**
     *
     * @param menuBtn1 {HTMLElement} 按钮1
     * @param menuBtn2 {HTMLElement}
     * @param view1 {HTMLElement} 按钮1点击后显示的div1
     * @param view2 {HTMLElement}
     */
    constructor(menuBtn1, menuBtn2, view1, view2) {
        this.menuBtn1 = menuBtn1;
        this.menuBtn2 = menuBtn2;
        this.view1 = view1;
        this.view2 = view2;
        this.init();
        this.state = 1;  // 1 or 2 表示当前正在显示的是第几个
    }

    /**
     * 设置切换逻辑
     */
    init() {
        this.menuBtn1.addEventListener("click", () => {
            closeDiv(this.view2);
            showDiv(this.view1);
            this.state = 1;
        });
        this.menuBtn2.addEventListener("click", () => {
            closeDiv(this.view1);
            showDiv(this.view2);
            this.state = 2;
        });
    }

}


function closeDiv(div) {
    div.style.display = "none";
}

function showDiv(div) {
    div.style.display = "block";
}

