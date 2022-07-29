
/**
 * 整个界面加载用户的信息
 * 一般是当用户登录了之后触发、而不是一打开应用就触发
 *
 * 还要提前清除掉以前的画面内容
 * by littlefean
 */
function loadUser() {
    let DDLArr = [];
    let WeekEventArr = [];  // 缓存起来
    let weekEventItems = $(`.weekEventItems`);
    let DDLItems = $(`.DDLItems`);

    // 获取用户所有的倒数日
    let oAjax1 = new XMLHttpRequest();
    oAjax1.open("POST", `http://${ADDRESS}:${PORT}/userGetAllDDL`);
    oAjax1.setRequestHeader("Content-Type", "application/json");
    oAjax1.send(JSON.stringify({userName: userData.name}));
    oAjax1.onload = () => {
        let arr = JSON.parse(oAjax1.responseText);
        if (DDLArr.length === 0) {
            DDLItems.innerHTML = "";
            // 说明还没有缓存，也没有添加html
            for (let item of arr) {
                let ddl = DDL.FromObj(item);
                // 渲染到html上面
                DDLArr.push(item);
                DDLItems.appendChild(ddl.toHtmlElement());
            }
        }
    }

    // 获取用户所有的周常事件
    let oAjax2 = new XMLHttpRequest();
    oAjax2.open("POST", `http://${ADDRESS}:${PORT}/userGetAllWeekEvent`);
    oAjax2.setRequestHeader("Content-Type", "application/json");
    oAjax2.send(JSON.stringify({
        userName: userData.name,
    }));
    oAjax2.onload = () => {
        let arr = JSON.parse(oAjax2.responseText);
        if (WeekEventArr.length === 0) {
            weekEventItems.innerHTML = "";
            // 说明还没有缓存，也没有添加html
            for (let item of arr) {
                let we = WeekEvent.FromObj(item);
                // 渲染到html上面
                WeekEventArr.push(item);
                weekEventItems.appendChild(we.toHtmlElement());
            }
        }
    }
    // 获取所有反思
    {
        let page3Ele = $(`.v3`);
        // 一上来就加载
        let oAjax2 = new XMLHttpRequest();
        oAjax2.open("POST", `http://${ADDRESS}:${PORT}/userGetAllReflect`);
        oAjax2.setRequestHeader("Content-Type", "application/json");
        oAjax2.send(JSON.stringify({userName: userData.name}));
        oAjax2.onload = () => {
            let resArr = JSON.parse(oAjax2.responseText);
            page3Ele.querySelector(`.checkItemArea1`).innerHTML = "";
            for (let item of resArr) {
                let obj = MassagePiece.FromObj(item);
                // 显示到html上
                page3Ele.querySelector(`.checkItemArea1`).appendChild(obj.toHtmlEle(1));
            }
        }
        // 加载所有灵感
        let oAjax3 = new XMLHttpRequest();
        oAjax3.open("POST", `http://${ADDRESS}:${PORT}/userGetAllInspiration`);
        oAjax3.setRequestHeader("Content-Type", "application/json");
        oAjax3.send(JSON.stringify({userName: userData.name}));
        oAjax3.onload = () => {
            let resArr = JSON.parse(oAjax3.responseText);
            page3Ele.querySelector(`.checkItemArea2`).innerHTML = "";
            for (let item of resArr) {
                let obj = MassagePiece.FromObj(item);
                // 显示到html上
                page3Ele.querySelector(`.checkItemArea2`).appendChild(obj.toHtmlEle(2));
            }
        }

    }

    {
        // 姓名处理
        let menuBtn4 = $(`.menuBtn4`);
        menuBtn4.addEventListener("click", () => {
            $(`#userName`).innerHTML = userData.name;
        })

        let v4 = $(`.v4`);

        // 时间类型删除管理
        let timeKind = v4.querySelector('.timeKind');

        // 加载所有时间种类
        let oAjax3 = new XMLHttpRequest();
        oAjax3.open("POST", `http://${ADDRESS}:${PORT}/userGetAllTimeKind`);
        oAjax3.setRequestHeader("Content-Type", "application/json");
        oAjax3.send(JSON.stringify({userName: userData.name}));
        oAjax3.onload = () => {
            let resArr = JSON.parse(oAjax3.responseText);
            timeKind.innerHTML = "";
            for (let item of resArr) {
                let obj = TimeKind.FromObj(item);
                // 显示到html上
                timeKind.appendChild(obj.toHtmlEle());
            }
        }
    }
}
