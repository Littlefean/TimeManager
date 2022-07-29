/**
 * 时间片段类
 * by littlefean
 */
class TimePeriod {
    /**
     * 一个日期，能够准时的表示某年某日的某个时间段做了什么事情
     *
     * @param start {String} 日开始时间  "6:30"
     * @param dur {String} 持续时间   "2:31"
     * @param week {String} 周几的   "0" ~ "6"
     * @param date {String} 年月日  myDate.toString
     */
    constructor(start, dur, week, date) {
        this.start = start;
        this.dur = dur;
        this.week = week;
        this.date = date;
        this.obj = null;

        this.disable = false;
    }

    /**
     * 给这个时间段绑定上具体内容显示信息
     *
     {
            name: "数学",
            color: `rgba(0, 0, 255, 1)`,
            fontColor: `rgba(255, 255, 255, 1)`,
        },
     如果绑定的格式不对会显示“未知”
     * @param obj
     */
    setStyle(obj) {
        if (obj.hasOwnProperty("name") && obj.hasOwnProperty("color") && obj.hasOwnProperty("fontColor")) {
            this.obj = obj;
        } else {
            this.obj = {
                name: "未知",
                color: `rgba(0, 0, 255, 1)`,
                fontColor: `rgba(255, 255, 255, 1)`,
            };
        }
    }

    /**
     * 将这个对象字符串化
     * {"start":"7:25","dur":"0:55","week":"2","date":"2022.7.5",
     * "obj":{"name":"数学","color":"rgba(0, 0, 255, 1)","fontColor":"rgba(255, 255, 255, 1)"}}
     * @return {string}
     */
    toString() {
        return JSON.stringify(this);
    }

    /**
     * 根据开始和dur获取结束时间点的Date对象
     */
    getEndDate() {
        let sArr = this.start.split(":");
        let durArr = this.dur.split(":");
        let sH = +sArr[0];
        let sM = +sArr[1];
        let dH = +durArr[0];
        let dM = +durArr[1];
        let h = sH + dH;
        let m = sM + dM;
        let res = new Date();
        res.setHours(h);
        res.setMinutes(m);
        return res;
    }

    /**
     * 把一个时间字符串解析成日期对象
     * @param str "6:50"
     * @return {Date} 日期对象
     * @constructor
     */
    static TimeStrToDate(str) {
        let arr = str.split(":");
        let res = new Date();
        let h = arr[0];
        let m = arr[1];
        res.setHours(h);
        res.setMinutes(m);
        return res;
    }

    /**
     * 通过json字符串 解析一个实例
     * @constructor
     */
    static FromJsonString(jsonStr) {
        let obj = JSON.parse(jsonStr);
        return this.FromJson(obj);
    }

    /**
     * 通过json对象，解析成一个实例
     * @param jsonObj
     * @return {TimePeriod}
     * @constructor
     */
    static FromJson(jsonObj) {
        let res = new this(jsonObj.start, jsonObj.dur, jsonObj.week, jsonObj.date);
        res.setStyle(jsonObj.obj);
        return res;
    }

    /**
     * 把这个时间片段渲染到 canvas里面去
     * @param ctx  canvas的上下文对象
     * @param canvasWidth canvas的宽度
     * @param canvasHeight canvas的高度
     */
    rend(ctx, canvasWidth, canvasHeight) {
        let dayLen = canvasWidth / 7;

        let x = (+this.week) * dayLen;
        let y = this.getYPx(canvasHeight);
        let w = dayLen;
        let h = this.getHeightPx(canvasHeight);
        drawRectFill(ctx, x, y, w, h, this.obj.color);
        drawRectStroke(ctx, x, y, w, h, this.obj.fontColor);
        if (h > 10) {
            let fs = Math.min(20, h - 5);
            writeFont(ctx, this.obj.name, x + w / 2, y + h / 2, this.obj.fontColor, fs);
        } else {
            writeFont(ctx, this.obj.name, x + w / 2, y + h / 2, this.obj.fontColor, 5);
        }
    }

    /**
     * 获取当前对象的顶部点举例画布顶部的距离px
     * @param canvasHeight
     */
    getYPx(canvasHeight) {
        let hourHeight = canvasHeight / 20;  // 一个小时有多高的px
        let startArr = this.start.split(":");
        let t1 = +startArr[0];
        let t2 = +startArr[1];

        // 首先，t1不可能是 2 3 4 5
        // t1 是6~12正常处理，1时候特殊处理
        // t1 不可能是12，会是0
        if (t1 === 1) {
            t1 = 25;
        } else if (t1 === 0) {
            t1 = 24;
        }
        t1 -= 6;
        let res = t1 * hourHeight;
        res += hourHeight * (t2 / 60);
        return res;
    }

    /**
     * 获取当前对象的高度(持续时间)px
     */
    getHeightPx(canvasHeight) {
        let d2 = new Date(2001, 1, 1, 6, 0, 0);
        let durArr = this.dur.split(":");
        d2.setHours(d2.getHours() + +durArr[0]);
        d2.setMinutes(+durArr[1]);
        return TimePeriod.DateToPxHeight(d2, canvasHeight);
    }

    /**
     * 返回一个y值(px)，是否在当前时间段所表示的区域内
     * 用于点击检测
     * @param px
     * @param canvasHeight
     */
    pxRangeIn(px, canvasHeight) {
        let y = this.getYPx(canvasHeight);
        let h = this.getHeightPx(canvasHeight);
        return y <= px && px <= y + h;
    }

    /**
     * 根据canvas上的高度位置来返回当前的时间点
     * @param n 高度位置px，0表示最上面
     * @param canvasHeight  整个canvas最高有多高
     */
    static PxHeightToTimePoint(n, canvasHeight) {
        // 已经知道，整个画布被分为了20个小时，从上午六点开始的
        let res = new Date();
        let f = Math.floor;
        let hourHeight = canvasHeight / 20;  // 一个小时有多高的px

        let hCount = f(n / hourHeight);
        res.setHours(6 + hCount);
        let hRemain = f(n % hourHeight);  // 剩下不足1小时高度的高度有多少px
        let m = f(60 * (hRemain / hourHeight));
        res.setMinutes(m);
        return res;
    }

    /**
     * 将一个日期时间点对象转化为canvas里的高度
     * @param d {Date}
     * @param canvasHeight {Number}
     */
    static DateToPxHeight(d, canvasHeight) {
        let res = 0;
        let hourHeight = canvasHeight / 20;  // 一个小时有多高的px
        let hourCount = d.getHours() - 6;
        res += hourHeight * hourCount;
        // 加上分钟的部分
        res += hourHeight * (d.getMinutes() / 60);
        return res;
    }


    /**
     * 此方法用于 在 canvas上手指滑动来触发 的生成实例的方法
     * @param canvasHeight  画布高度
     * @param y1 第一个高度
     * @param y2 第二个高度
     * @param week {String} 周几
     * @param dateString {String} 日期字符串
     * @constructor
     */
    static InfoTo(canvasHeight, y1, y2, week, dateString) {
        let start = this.PxHeightToTimePoint(Math.min(y1, y2), canvasHeight);

        let startStr = `${start.getHours()}:${start.getMinutes()}`;

        let height = Math.abs(y1 - y2);
        let dur = this.PxHeightToTimePoint(height, canvasHeight);
        let durStr = `${dur.getHours() - 6}:${dur.getMinutes()}`;

        return new this(startStr, durStr, week, dateString);
    }
}

// date 内置对象的的用法
// let a = new Date();
// console.log(a);
// console.log(a.getHours())
// console.log(a.getMinutes())
// console.log(a.getSeconds())
// a.setHours(6 + 12);
// console.log(a.getHours())

// bug
// let b = new Date();
// console.log(b.toJSON());  // string
//
// let t = new TimePeriod("7:25", "0:55", "2", "2022.7.5");
// t.setStyle({
//     name: "数学",
//     color: `rgba(0, 0, 255, 1)`,
//     fontColor: `rgba(255, 255, 255, 1)`,
// })
// console.log(t.toString())
