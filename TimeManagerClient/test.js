/**
 *
 * by littlefean
 */

let PORT = 10007;
let URL = "localhost";
// let URL = "127.0.0.1";
// let URL = "124.221.150.160";


let oAjax = new XMLHttpRequest();

function post() {
    // post
    console.log("点击了post按钮");
    oAjax.open("POST", `http://${URL}:${PORT}/post`);
    oAjax.setRequestHeader("Content-Type", "application/json");
    oAjax.send(JSON.stringify({"abc": 123}));
    // post请求不能返回结果
}

function get() {
    // get
    console.log("点击了get按钮");
    oAjax.open("get", `http://${URL}:${PORT}/get`, true);
    oAjax.setRequestHeader("Content-Type", "application/json"); // "text/plain"
    oAjax.send();
    oAjax.onload = function () {
        alert("get 请求发送成功，返回结果" + oAjax.responseText);
    }
}

function writeFont(ctx, content, x, y, color = "black", fontSize = 20) {
    console.log("写文字", content);
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px "微软雅黑"`;           //设置字体
    ctx.textBaseline = "middle";            //设置字体底线对齐绘制基线
    ctx.textAlign = "center";                 //设置字体对齐的方式
    ctx.fillText(content, x, y);
}



window.onload = function () {
    // let getBtn = document.querySelector(`.get`);
    // getBtn.onclick = get;
    //
    // let postBtn = document.querySelector(`.post`);
    // postBtn.onclick = post;

    let canvas = document.querySelector(`canvas`);
    let ctx = canvas.getContext("2d");
    writeFont(ctx, "aababa精忠报国", 0, 0);

    let pointList = [];
    // 点击加段测试
    let testBox = document.querySelector(`.testBox`);
    //
    // testBox.addEventListener("click", (e) => {
    //     let pX = e.clientX - testBox.offsetLeft;
    //     let pY = e.clientY - testBox.offsetTop;
    //
    //     pointList.push([pX, pY]);
    //
    //     if (pointList.length >= 2) {
    //         let last1 = pointList[pointList.length - 1];
    //         let last2 = pointList[pointList.length - 2];
    //         if (last1[1] > last2[1]) {
    //             // 第二次点击的点在第一次点击的点下面才能放置
    //             let div = document.createElement("div");
    //             div.style.height = last1[1] - last2[1] + "px";
    //             div.style.marginTop = last2[1] + "px";
    //             div.classList.add("putBox");
    //             testBox.append(div);
    //         }
    //     }
    // });
    /**
     * 总结一下，
     * 手机端手指按下的属性是 touchstart，
     * 手指移动事件是 touchmove
     * 手指抬起属性是 touchend
     *
     * 想要获取手指触发点相对于点击的位置，
     * 可以
     * let pX = e.targetTouches[0].pageX - testBox.offsetLeft;
     let pY = e.targetTouches[0].pageY - testBox.offsetTop;
     * 如果是电脑端的画，
     * let pX = e.clientX - testBox.offsetLeft;
     * let pY = e.clientY - testBox.offsetTop;
     *
     */


    testBox.addEventListener("touchstart", (e) => {
        console.log("down");
        pointList = [];
        let pX = e.targetTouches[0].pageX - testBox.offsetLeft;
        let pY = e.targetTouches[0].pageY - testBox.offsetTop;
        pointList.push([pX, pY]);
    });

    testBox.addEventListener("touchend", (e) => {
        console.log("end");
        let pX = e.clientX - testBox.offsetLeft;
        let pY = e.clientY - testBox.offsetTop;
        pointList.push([pX, pY]);
        console.log(pointList);
        if (pointList.length >= 2) {
            let last1 = pointList[1];
            let last2 = pointList[0];
            {
                // 第二次点击的点在第一次点击的点下面才能放置
                let div = document.createElement("div");
                div.style.height = Math.abs(last1[1] - last2[1]) + "px";
                div.style.marginTop = Math.min(last2[1], last2[1]) + "px";
                div.classList.add("putBox");
                testBox.append(div);
            }
        }
    })
}
