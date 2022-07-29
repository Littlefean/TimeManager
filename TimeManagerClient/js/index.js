// 中间的高度是减去10% 再减去topArea高度
let marginT = 30;
let heightRes = winHeight * 0.9 - $(`.v1TopArea`).clientHeight;
let hourHeight = (heightRes - marginT) / hourList.length;

// 设置canvas大小
let canvasTable = new CanvasTimeTable(
    $(`.tableBgCanvas`),
    winWidth * 0.9,
    heightRes - marginT,
    hourHeight
);

function pageInitMain() {
    // 设置页面位置
    let downMenu = document.querySelector(`.downMenu`);
    let topView = document.querySelector(`.topView`);

    for (let i = 0; i < 4; i++) {
        let menu = downMenu.children[i];
        menu.addEventListener("click", () => {
            topView.style.left = `-${100 * i}%`;
            if (i === 0) {
                canvasTable.getPeriod();
            }
        });
    }
    topView.style.left = "0";  // 一开始就将第一页设置为首页
    canvasTable.getPeriod();
}

function pageInit1() {

    // v1界面设置
    let v1 = document.querySelector(`.v1`);

    v1.querySelector(`.page`).style.height = heightRes + "px";

    // 设置左侧刻度尺
    let ruler = v1.querySelector(".ruler");
    ruler.style.height = heightRes - marginT + "px";
    ruler.style.marginTop = marginT + "px";

    for (let i of hourList) {
        let b = div("", "block");
        b.style.height = hourHeight + "px";
        b.appendChild(div(`${i}`, "num"));
        ruler.appendChild(b);
    }

    // 设置右侧时间表
    let table = v1.querySelector(`.table`);
    let tableTitleLine = table.querySelector(`.marginT`);
    for (let i = 0; i < 7; i++) {
        // 添加标题
        let titleBlock = div("", "titleBlock");
        titleBlock.appendChild(div(weekNameDic[i], "weekTitle"));
        titleBlock.appendChild(div("?.??", "dateTitle"));
        tableTitleLine.appendChild(titleBlock);
    }
    /// 从观看模式切换到添加模式的btn
    let modeChangeBtn = document.querySelector(`.modeChangeBtn`);
    modeChangeBtn.onclick = function () {
        console.log(canvasTable.mood);
        if (canvasTable.mood !== "adding") {
            this.innerHTML = "正在添加时段"
            canvasTable.mood = "adding";
            // 更新用户时间种类信息
            let oAjax1 = new XMLHttpRequest();
            oAjax1.open("POST", `http://${ADDRESS}:${PORT}/userGetAllTimeKind`);
            oAjax1.setRequestHeader("Content-Type", "application/json");
            oAjax1.send(JSON.stringify({userName: userData.name}));
            oAjax1.onload = () => {
                console.log("接收到的东西：", JSON.parse(oAjax1.responseText));
                userData.addTimeKindList = JSON.parse(oAjax1.responseText);
            }
        } else {
            this.innerHTML = "手动添加时段";
            canvasTable.mood = "watching";
        }
    }

    // 更新日期周
    function updateWeekTitle() {
        let dateTitleList = document.getElementsByClassName(`dateTitle`);
        let i = 0
        for (let dateTitle of dateTitleList) {
            dateTitle.innerText = MyDate.FromString(nowWeek[i]).toStringDote();
            i++;
        }
    }

    // 写当前这一周日期的标题
    let oAjax3 = new XMLHttpRequest();
    oAjax3.open("GET", `http://${ADDRESS}:${PORT}/askWeek`);
    oAjax3.setRequestHeader("Content-Type", "application/json");
    oAjax3.send();
    oAjax3.onload = function () {
        nowWeek = JSON.parse(oAjax3.responseText);
        updateWeekTitle();
    }

    /**
     * 点击上一周下一周，会更新全局变量周数组，
     * 并且根据全局变量更新画板
     */

    let leftPageBtn = document.querySelector(`.leftPageBtn`);
    let rightPageBtn = document.querySelector(`.rightPageBtn`);

    let f = (str, that) => {
        that.setAttribute("disabled", "disabled");
        oAjax.open("POST", `http://${ADDRESS}:${PORT}/${str}`);
        oAjax.setRequestHeader("Content-Type", "application/json");
        oAjax.send(JSON.stringify(nowWeek));
        oAjax.onload = () => {
            that.removeAttribute("disabled");
            nowWeek = JSON.parse(oAjax.responseText);
            updateWeekTitle();
            canvasTable.refresh();
        }
    }

    // 上一周
    leftPageBtn.onclick = function () {
        f("queryLastWeek", this);
    }

    // 下一周
    rightPageBtn.onclick = function () {
        f("queryNextWeek", this);
    }

    // 设置活动分类界面 ===> 添加一种时间种类
    let setModeBtn = document.querySelector(".setModeBtn");
    let alertChangeMode = document.querySelector(`.alertChangeMode`);

    setModeBtn.onclick = function () {
        alertChangeMode.style.display = "block";
    }
    let cmCancelAdd = document.querySelector(`.cancelAdd`);
    cmCancelAdd.onclick = function () {
        alertChangeMode.style.display = "none";
    }

    let timeModeAdd = alertChangeMode.querySelector(".timeModeAdd");
    timeModeAdd.onclick = function () {
        // 确认添加
        // 先拿到三个数值属性
        let title = document.querySelector(`.KindTitle`).value;
        let fillColor = document.querySelector(`.fillColor`).value;
        let borderColor = document.querySelector(`.borderColor`).value;
        oAjax.open("POST", `http://${ADDRESS}:${PORT}/userAddTimeKind`);
        oAjax.setRequestHeader("Content-Type", "application/json");
        oAjax.send(JSON.stringify({
            userName: userData.name,
            timeKind: {
                title: title,
                fillColor: fillColor,
                borderColor: borderColor,
            }
        }));
        oAjax.onload = () => {
            let res = JSON.parse(oAjax.responseText);
            if (res === "ok") {
                alert("添加成功");
                alertChangeMode.style.display = "none";
            }
        }
    }
    let timeModeCancelAdd = alertChangeMode.querySelector(".cancelAdd");
    timeModeCancelAdd.onclick = function () {
        // 取消添加
        alertChangeMode.style.display = "none";
    }

}

function pageInit2() {
    /**
     * 周常，倒数日界面
     */

        // 建立切换逻辑
    let page2Ele = $(`.v2`);
    let b1 = page2Ele.querySelector(`.checkItem1`);
    let b2 = page2Ele.querySelector(`.checkItem2`);
    let v1 = $(`.checkItemArea1`);
    let v2 = $(`.checkItemArea2`);
    new CheckTwoPanel(b1, b2, v1, v2);

    // 添加倒数日的按钮
    let addDDLBtn = $(`.addDDLBtn`);
    // 添加倒数日的弹窗
    let addDDLAlert = $(`.addDDLAlert`);
    let addCancel = addDDLAlert.querySelector(`.addCancel`);
    let addBtnOk = addDDLAlert.querySelector(`.addBtnOk`);

    let DDLAlertElement = new AlertEle(addDDLBtn, addBtnOk, addDDLAlert);
    DDLAlertElement.setCloseBtn(addCancel);

    // 创建一个倒数日按钮点击事件
    AlertEle.bindEvent(addBtnOk, () => {
        oAjax.open("POST", `http://${ADDRESS}:${PORT}/userAddDDL`);
        oAjax.setRequestHeader("Content-Type", "application/json");
        oAjax.send(JSON.stringify({
            userName: userData.name,
            ddl: {
                "title": DDLAlertElement.query(".title").value,
                "date": DDLAlertElement.query(".dateInput").value,
            }
        }));
        oAjax.onload = () => {
            let num = JSON.parse(oAjax.responseText);
            alert("添加成功！");
            // 显示到html上，添加到缓存中
            let ddl = new DDL(
                DDLAlertElement.query(".title").value,
                DDLAlertElement.query(".dateInput").value,
            );
            ddl.remain = num;
            $(`.DDLItems`).appendChild(ddl.toHtmlElement());
        }
    });
    // 周常事件部分
    let addWeekEventBtn = $(`.addWeekEventBtn`);
    let addWeekEventAlert = $(`.addWeekEventAlert`);
    let addWEBtnOk = $(`.addWeekEventAlert .addBtnOk`);
    let weAlertElement = new AlertEle(addWeekEventBtn, addWEBtnOk, addWeekEventAlert);
    weAlertElement.setCloseBtn($(`.addWeekEventAlert .addCancel`));
    // 创建一个周常事件
    AlertEle.bindEvent(addWEBtnOk, () => {
        let we = WeekEvent.FromHtmlInput();
        oAjax.open("POST", `http://${ADDRESS}:${PORT}/userAddWeekEvent`);
        oAjax.setRequestHeader("Content-Type", "application/json");
        oAjax.send(JSON.stringify({
            userName: userData.name,
            weekEvent: we.toObj()
        }));
        oAjax.onload = () => {
            let res = JSON.parse(oAjax.responseText);
            if (res === "ok") {
                alert("添加成功！");
                // 显示到html上
                $(`.weekEventItems`).appendChild(we.toHtmlElement());
            }
        }
    });

}

function pageInit3() {
    // 建立切换逻辑
    let page3Ele = $(`.v3`);
    let b1 = page3Ele.querySelector(`.checkItem1`);
    let b2 = page3Ele.querySelector(`.checkItem2`);
    let v1 = page3Ele.querySelector(`.checkItemArea1`);
    let v2 = page3Ele.querySelector(`.checkItemArea2`);
    let cp = new CheckTwoPanel(b1, b2, v1, v2);

    let inputBox = page3Ele.querySelector(".inputBox");
    let clearBtn = page3Ele.querySelector(`.clear`);

    clearBtn.addEventListener("click", () => {
        inputBox.innerHTML = "";
    });

    // 提交按钮
    let submitBtn = page3Ele.querySelector(".submit");
    submitBtn.addEventListener("click", () => {
        let u;
        if (cp.state === 1) {
            u = "userAddReflect";
        } else {
            u = "userAddInspiration";
        }
        oAjax.open("POST", `http://${ADDRESS}:${PORT}/${u}`);
        oAjax.setRequestHeader("Content-Type", "application/json");
        let mp = MassagePiece.FromString(inputBox.innerHTML);
        oAjax.send(JSON.stringify({
            userName: userData.name,
            Reflect: mp.toSendObj(),
            Inspiration: mp.toSendObj(),
        }));

        oAjax.onload = () => {
            let res = JSON.parse(oAjax.responseText);
            if (res === "ok") {
                alert("添加成功！");
                // 显示到html上
                page3Ele.querySelector(`.checkItemArea${cp.state}`).appendChild(mp.toHtmlEle(cp.state));
            }
        }
    });
}

function pageInit4() {
    // 切换主题颜色
    // 背景颜色设置
    new UserSettings();

    let changeCount = $(`.changeAccount`);
    changeCount.addEventListener("click", () => {
        // 切换账号的逻辑
        $(".loginView").style.display = "block";
    });

}

window.onload = function () {
    pageInitMain();
    pageInit1();
    pageInit2();
    pageInit3();
    pageInit4();
    console.log(navigator.userAgent);
}
