class TimeKind {
    /**
     *
     * @param name {String}
     * @param color {String}
     * @param fontColor {String}
     */
    constructor(name, color, fontColor) {
        this.name = name;
        this.color = color;
        this.fontColor = fontColor;
    }

    static FromObj(obj) {
        return new this(obj.name, obj.color, obj.fontColor);
    }

    /**
     *
     * <div class="time">
     <div class="name">英语</div>
     <div class="del">❎</div>
     </div>
     *
     *
     */
    toHtmlEle() {
        let res = div("", "time");
        let v1 = div(this.name, "name");
        v1.style.color = this.fontColor;
        v1.style.backgroundColor = this.color;
        let v2 = div("❎", "del");

        v2.addEventListener("click", () => {
            // 删除这个时间种类的网络请求
            // 向后端发送删除的请求
            oAjax.open("POST", `http://${ADDRESS}:${PORT}/userDelTimeKind`);
            oAjax.setRequestHeader("Content-Type", "application/json");
            oAjax.send(JSON.stringify({
                userName: userData.name,
                title: this.name
            }));
            oAjax.onload = () => {
                let res = JSON.parse(oAjax.responseText);
                if (res === "ok") {
                    alert("删除成功");
                }
            }
            // 前端删除
            res.style.display = "none";
        });

        res.appendChild(v1);
        res.appendChild(v2);
        return res;
    }
}


/**
 * 倒数日类
 * by littlefean
 */
class DDL {

    constructor(title, date) {
        this.title = title;
        this.date = date;
        this.remain = 0;
    }

    toJson() {

    }

    toHtmlElement() {
        /**
         * <div class="item">
         <div class="dayName">考研</div>
         <div class="noteWords">还有 <span class="finalDay">65</span> 天</div>
         <div class="del">❎</div>
         </div>
         */
        let res = div("", "item");
        let name = div(this.title, "dayName");
        let innerStr = `还有 <span class="finalDay">${this.remain}</span> 天`
        let remainDay = div(innerStr, "noteWords");
        let delBtn = div("❎", "del");

        /**
         * 添加删除事件
         */
        delBtn.addEventListener("click", () => {
            document.querySelector(`.DDLItems`).removeChild(res);

            // 向后端发送删除的请求
            oAjax.open("POST", `http://${ADDRESS}:${PORT}/userDelDDL`);
            oAjax.setRequestHeader("Content-Type", "application/json");
            oAjax.send(JSON.stringify({
                userName: userData.name,
                ddl: {
                    "title": this.title,
                    "date": this.date,
                }
            }));
            oAjax.onload = () => {
                let res = JSON.parse(oAjax.responseText);
                if (res === "ok") {
                    alert("删除成功");
                }
            }
        });

        res.appendChild(name);
        res.appendChild(remainDay);
        res.appendChild(delBtn);
        return res;
    }

    /**
     * 通过obj对象解析出来一个ddl对象
     * {
        "title": title,
        "date": "2011-5-1",
        "remain": 65
        }
     * @param obj
     * @constructor
     */
    static FromObj(obj) {
        console.log("ddl from obj", obj);
        let res = new this(obj.title, obj.date);
        res.remain = obj.remain;
        return res;
    }

}


/**
 * 周常事件类
 */
class WeekEvent {
    /**
     *
     * @param name {String}
     * @param weekList {Array}
     * @param startTime {String}
     * @param alarm {Boolean}
     */
    constructor(name, weekList, startTime, alarm) {
        this.name = name;
        this.weekList = weekList;
        this.startTime = startTime;
        this.alarm = alarm;
    }

    toObj() {
        return {
            name: this.name,
            weekList: this.weekList,
            startTime: this.startTime,
            alarm: this.alarm,
        }
    }

    static FromObj(obj) {
        return new this(obj.name, obj.weekList, obj.startTime, obj.alarm);
    }

    /**
     * 把当前自己这个对象转换成html元素
     * <div class="item">
     <div class="eventName">打leetcode周赛</div>
     <div class="time">每周日上午10点</div>
     <div class="note">🔔</div>
     <div class="del">❎</div>
     </div>
     */
    toHtmlElement() {
        let res = div("", "item");
        let d1 = div(this.name, "eventName");
        let everyWeekStr = "每周";
        for (let number of this.weekList) {
            everyWeekStr += number.toString();
        }
        everyWeekStr += " ";
        everyWeekStr += this.startTime;
        let d2 = div(everyWeekStr, "time");
        let d3 = div("🔔", "note");
        let d4 = div("❎", "del");
        d4.onclick = () => {
            // 触发删除方法
            let itemsEle = document.querySelector(`.weekEventItems`);
            itemsEle.removeChild(res);

            // 向后端发送删除的请求
            oAjax.open("POST", `http://${ADDRESS}:${PORT}/userDelWeekEvent`);
            oAjax.setRequestHeader("Content-Type", "application/json");

            oAjax.send(JSON.stringify({
                userName: userData.name,
                weekEvent: {
                    "title": this.name,
                    "week": this.weekList,
                    "startTime": this.startTime,
                    "alarm": this.alarm,
                }
            }));
            oAjax.onload = () => {
                let res = JSON.parse(oAjax.responseText);
                if (res === "ok") {
                    alert("删除成功");
                }
            }
        };
        res.appendChild(d1);
        res.appendChild(d2);
        if (this.alarm) {
            res.appendChild(d3);
        }
        res.appendChild(d4);
        return res;
    }

    /**
     * 通过html的一堆乱七八糟的input标签中拿到信息创建实例
     * @constructor
     */
    static FromHtmlInput() {
        let ele = document.querySelector(`.addWeekEventAlert`);
        let title = ele.querySelector(".title").value;
        let weekChoiceArr = ele.querySelectorAll(".weekChoice");
        let arr = [];
        let chineseArr = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        for (let i = 0; i < 7; i++) {
            if (weekChoiceArr[i].checked) {
                arr.push(chineseArr[i]);
            }
        }
        let startTime = ele.querySelector(`.timeInput`).value;
        let ifAlarm = ele.querySelector(`.alarmChoice`).checked;
        return new this(title, arr, startTime, ifAlarm);
    }

}

/**
 * 消息条，用于这个项目中的反思总结与灵感
 */
class MassagePiece {
    /**
     *
     * @param content {String}
     * @param date {MyDate}
     */
    constructor(content, date) {
        this.content = content;
        this.date = date;
    }

    /**
     * 根据内容以及当前时间构造一个实例
     * @param content
     * @return {MassagePiece}
     * @constructor
     */
    static FromString(content) {
        return new this(content, MyDate.FromNow());
    }

    /**
     * 将json对象解析成一个实例
     * @param obj
     * @constructor
     */
    static FromObj(obj) {
        return new this(obj.content, MyDate.FromString_(obj.date));
    }

    /**
     * 此方法返回一个object，用于发送给后端
     */
    toSendObj() {
        console.log("准备发送的", this.date);
        return {
            "content": this.content,
            "date": this.date.toString_()
        }
    }

    /**
     <div class="item">
     <div class="time">2019-15-6</div>
     <div class="content">我今天吃了两碗饭，感觉身体好好</div>
     <div class="edit">✍</div>
     <div class="del">❎</div>
     </div>
     */
    toHtmlEle(type) {
        let res = div("", "item");
        let v1 = div(this.date.toString_(), "time");
        let v2 = div(this.content, "content");
        // let v3 = div("✍", "edit");
        let v4 = div("❎", "del");
        v4.addEventListener("click", () => {

            // document.querySelector(`.v3Area .checkItemArea1`).removeChild(res);
            res.style.display = "none";
            // 向后端发送删除的请求
            let u;
            if (type === 1) {
                u = "Reflect";
            } else {
                u = "Inspiration";
            }
            oAjax.open("POST", `http://${ADDRESS}:${PORT}/userDel${u}`);

            oAjax.setRequestHeader("Content-Type", "application/json");

            oAjax.send(JSON.stringify({
                userName: userData.name,
                Reflect: this.toSendObj(),
                Inspiration: this.toSendObj(),
            }));
            oAjax.onload = () => {
                let res = JSON.parse(oAjax.responseText);
                if (res === "ok") {
                    alert("删除成功");
                }
            }
        });
        res.appendChild(v1);
        res.appendChild(v2);
        res.appendChild(v4);
        return res;
    }
}
