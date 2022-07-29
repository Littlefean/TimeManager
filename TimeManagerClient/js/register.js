/**
 * 注册模块
 * by littlefean
 */

{
    let regArea = document.querySelector(`.regArea`);
    let userName = regArea.querySelector(`.userRegName`);
    let password = regArea.querySelector(`.userRegPassword1`);
    let email = regArea.querySelector(`.userRegEmail`);

    // 开始注册的按钮点击逻辑
    let regBtn = regArea.querySelector(`.regBtn`);
    console.log(regBtn);
    regBtn.onclick = function () {
        console.log("点击了注册按钮");
        // 前端进行检测
        // 前端检测通过
        oAjax.open("POST", `http://${ADDRESS}:${PORT}/register`);
        oAjax.setRequestHeader("Content-Type", "application/json");
        oAjax.send(JSON.stringify({
            "name": userName.value,
            "password": password.value,
            "email": email.value,
        }));

        oAjax.onload = function () {
            let res = JSON.parse(oAjax.responseText);
            alert(res["word"]);
            if (res["status"]) {
                // 从注册切换到登录界面
                let loginArea = document.querySelector(`.loginArea`);
                let regArea = document.querySelector(`.regArea`);
                loginArea.style.display = "block";
                regArea.style.display = "none";
            }
        }

    }
}
