/**
 * 时间画布类
 * by littlefean
 */
class CanvasTimeTable {
    /**
     *
     * @param canvasEle canvas标签
     * @param width {Number} 整个画布宽度
     * @param height {Number} 整个画布高度
     * @param hourHeight {Number} 每一个小时的高度
     */
    constructor(canvasEle, width, height, hourHeight) {
        this.ele = canvasEle;
        this.canvasW = width;
        this.canvasH = height;
        this.weekLen = this.canvasW / 7;

        this.hourHeight = hourHeight;

        this.ele.width = width * PR;
        this.ele.height = height * PR;
        this.ele.style.width = `${width}px`;
        this.ele.style.height = `${height}px`;

        this.ctx = canvasEle.getContext("2d");
        this.ctx.translate(0.5 * PR, 0.5 * PR);

        /**
         * adding 添加中
         * watching 默认观看中
         * @type {string}
         */
        this.mood = "watching";

        this.clear();
        this.drawFrame();
        // 添加点击修改删除事件

        // 踩坑：click事件和touch事件是冲突的

        let cls = this;

        /// 手机端滑动添加时间段
        let touchStartLoc = {x: null, y: null};
        let touchEndLoc = {x: null, y: null};
        let touchWeek = NaN;

        // 开始绘制
        canvasEle.addEventListener("touchstart", (e) => {
            let pX = e.targetTouches[0].pageX - (winWidth * 0.1);
            let pY = e.targetTouches[0].pageY - 90;  // 这个减去90是提前根据css算好的了，上面的90是提前固定规划好的了
            touchStartLoc.x = pX;
            touchStartLoc.y = pY;
            // 当前触摸的是星期几
            touchWeek = Math.floor(touchStartLoc.x / (this.canvasW / 7));  // week [0~6]
            if (this.mood === "adding") {
                // 画起始线段
                drawLine(
                    this.ctx,
                    touchWeek * this.weekLen,
                    touchStartLoc.y,
                    (touchWeek + 1) * this.weekLen, touchStartLoc.y,
                    2, "red"
                );
            }
        });

        // 绘制拖动
        canvasEle.addEventListener("touchmove", (e) => {
            if (this.mood !== "adding") {
                return;
            }
            let y = e.targetTouches[0].pageY - 90;  // 这个减去90是提前根据css算好的了，上面的90是提前固定规划好的了

            this.refresh();

            // 画一个矩形框
            let marginTop = Math.min(touchStartLoc.y, y);
            let height = Math.abs(touchStartLoc.y - y);
            drawRectStroke(this.ctx, this.weekLen * touchWeek, marginTop, this.weekLen, height, "red", 3);
            drawRectFill(this.ctx, this.weekLen * touchWeek, marginTop, this.weekLen, height, `rgba(255, 0, 0, 0.3)`);
            // 画移动的当前水平线
            drawLine(this.ctx, 0, y, this.canvasW, y);
        });

        // 结束绘制
        canvasEle.addEventListener("touchend", (e) => {
            // 当前触摸的是星期几
            touchWeek = Math.floor(touchStartLoc.x / (this.canvasW / 7));  // week [0~6]
            let pX = e.changedTouches[0].clientX - (winWidth * 0.1);
            let pY = e.changedTouches[0].clientY - 90;  // 这个减去90是提前根据css算好的了，上面的90是提前固定规划好的了
            touchEndLoc.x = pX;
            touchEndLoc.y = pY;
            if (this.mood === "watching") {
                // 点击一个时间段，会弹出这个时间段的属性界面
                let date = nowWeek[touchWeek];
                // 在所有的时间段中寻找
                let index = -1;
                for (let p of userData.periodList) {
                    index++;
                    if (p.date === date) {
                        // 如果刚好是这一天的，就看看是不是点到这个了
                        if (p.pxRangeIn(pY, cls.canvasH)) {
                            // 找到了要点击的时间段
                            // 弹出一个框，展示这个时间段的信息
                            let panelEle = document.querySelector(`.alertModifyTime`);
                            setTimeout(() => {
                                panelEle.style.display = "block";
                            }, 100);

                            panelEle.querySelector(".name").innerHTML = p.obj.name;
                            panelEle.querySelector(".startTime").innerHTML = p.start;
                            panelEle.querySelector(".durTime").innerHTML = p.dur;

                            // 设置这个弹窗的其他按钮
                            let delEle = panelEle.querySelector(`.delThis`);
                            delEle.onclick = function () {
                                // 将这个时间段删除
                                // 告诉后端我删除了一个时间段
                                // 发送给后端添加
                                oAjax.open("POST", `http://${ADDRESS}:${PORT}/userDelPeriod`);
                                oAjax.setRequestHeader("Content-Type", "application/json");
                                oAjax.send(JSON.stringify({
                                    userName: userData.name,
                                    period: JSON.parse(p.toString())
                                }));
                                oAjax.onload = () => {
                                    let res = JSON.parse(oAjax.responseText);
                                    userData.delPeriod(p);
                                    cls.refresh();
                                }
                                // 关闭面板
                                panelEle.style.display = "none";
                            }
                            let cancelModify = panelEle.querySelector(`.cancelModify`);
                            cancelModify.onclick = function () {
                                panelEle.style.display = "none";
                            }
                            break;
                        }

                    }
                }
            } else if (this.mood === "adding") {
                // // 触发添加段的功能
                // 先弹出框
                let cls = this;
                // 显示弹出框
                let alertWindow = document.querySelector(`.alertAddTime`);
                setTimeout(() => {
                    alertWindow.style.display = "block";
                }, 100);
                // 更新弹出框里面的选择
                let addMenu = document.querySelector(`.addMenu`);
                addMenu.innerHTML = "";
                for (let kind of userData.addTimeKindList) {
                    console.log("kind", kind);

                    let kindDiv = div(kind.name, "kind");
                    kindDiv.style.backgroundColor = kind.color;
                    kindDiv.style.color = kind.fontColor;

                    kindDiv.onclick = function () {
                        // 添加事件
                        let p = TimePeriod.InfoTo(
                            cls.canvasH,
                            touchStartLoc.y,
                            touchEndLoc.y,
                            touchWeek.toString(),
                            nowWeek[touchWeek]
                        );
                        p.setStyle(kind);
                        userData.periodList.push(p);
                        // cls.periods.push(p);

                        // 发送给后端添加
                        oAjax.open("POST", `http://${ADDRESS}:${PORT}/userAddPeriod`);
                        oAjax.setRequestHeader("Content-Type", "application/json");
                        oAjax.send(JSON.stringify({
                            userName: userData.name,
                            period: JSON.parse(p.toString())
                        }));

                        alertWindow.style.display = "none";
                        cls.refresh();
                    }
                    addMenu.appendChild(kindDiv);
                }
            }
        });

        // 添加时间段的按钮逻辑
        let alertAddTime = document.querySelector(`.alertAddTime`);
        let cancelAdd = alertAddTime.querySelector(`.cancelAdd`);
        // 取消添加时间段
        cancelAdd.addEventListener("click", () => {
            alertAddTime.style.display = "none";
            this.refresh();
        });
    }


    /**
     * 刷新显示 重新绘制
     * 重绘框架，并检测所有时间端，把这一周所有的时间端都画出来
     * 依赖全局变量 userData.periodList
     * 以及 nowWeek
     */
    refresh() {
        this.clear();
        this.drawFrame();
        // 绘制当前所有的时间段
        for (let p of userData.periodList) {
            if (p.disable) {
                continue;
            }
            // 检测这个段是不是在当前的周里
            for (let dateStr of nowWeek) {
                if (dateStr === p.date) {
                    // 在这周里，开始渲染
                    p.rend(this.ctx, this.canvasW, this.canvasH);
                    break;
                }
            }
        }
    }

    /**
     * 从后端获取用户所有 Period 并刷新
     * 保存到全局变量 userData.periodList 中
     */
    getPeriod() {
        oAjax.open("POST", `http://${ADDRESS}:${PORT}/userGetAllPeriod`);
        oAjax.setRequestHeader("Content-Type", "application/json");
        let sendStr = JSON.stringify({userName: userData.name});
        oAjax.send(sendStr);
        oAjax.onload = () => {
            let res = JSON.parse(oAjax.responseText);
            // 后端的直接覆盖前端
            userData.periodList = [];
            for (let item of res) {
                let itemObj = TimePeriod.FromJson(item);
                userData.periodList.push(itemObj);
            }
            this.refresh();
        }
    }

    /**
     * 清除画面
     */
    clear() {
        drawRectFill(this.ctx, 0, 0, this.canvasW, this.canvasH, Style[userData.style].background);
    }

    /**
     * 绘制框架表格
     */
    drawFrame() {
        // 画竖线
        for (let i = 0; i < 7; i++) {
            let x = this.canvasW / 7 * i;
            drawLine(this.ctx, x, 0, x, this.canvasH,
                1, Style[userData.style].normalWord);
        }
        //注意不加单位
        // 画横线
        for (let i = 0; i < hourList.length; i++) {
            drawLine(
                this.ctx, 0, i * this.hourHeight, this.canvasW, i * this.hourHeight,
                1, Style[userData.style].dashLine, true
            );
        }

        // 画重要横线
        for (let n of [6, 12]) {
            drawLine(
                this.ctx, 0, n * this.hourHeight, this.canvasW, n * this.hourHeight,
                2, "hotpink", false
            );
        }
    }

    /**
     * 重新设置大小
     * 画布的宽度和高度被重新设置的时候，里面画的东西会被清除掉
     * @param width {Number}
     * @param height {Number}
     */
    resetSize(width, height) {
        this.canvasH = height;
        this.canvasW = width;
        this.ele.width = width;
        this.ele.height = height;
        this.weekLen = this.canvasW / 7;
        this.drawFrame();
    }
}
