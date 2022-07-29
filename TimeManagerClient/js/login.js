/**
 *
 * by littlefean
 */
{
    // 登录
    let loginView = document.querySelector(`.loginView`);
    // 登录与注册切换的逻辑
    let loginArea = document.querySelector(`.loginArea`);
    let regArea = document.querySelector(`.regArea`);
    let loginAreaBtn = d.get(".loginAreaBtn");
    let regAreaBtn = d.get(".regAreaBtn");
    regArea.style.display = "none";
    loginAreaBtn.onclick = function () {
        // 从注册界面切换到登录页面
        loginArea.style.display = "block";
        regArea.style.display = "none";
    }
    regAreaBtn.onclick = function () {
        // 从登录切换到注册
        loginArea.style.display = "none";
        regArea.style.display = "block";
    }

    // 先通过缓存检测，跳过登录
    if (localStorage.getItem("userName")) {
        loginView.style.display = "none";
        userData.name = localStorage.getItem("userName");
        loadUser();
        new UserSettings().update();
    }


    // 登录按钮逻辑
    let loginBtn = document.querySelector(`.loginBtn`);
    let loginUserName = d.get(`.loginUserName`);
    let loginUserPassword = d.get(`.loginUserPassword`);

    // 用户点击登录
    loginBtn.onclick = function () {
        // 检测是否能登录
        let userStr = loginUserName.value;
        let passwordStr = loginUserPassword.value;

        // 检测用户是否存在
        oAjax.open("POST", `http://${ADDRESS}:${PORT}/haveUser`);
        oAjax.setRequestHeader("Content-Type", "application/json");
        oAjax.send(JSON.stringify({"name": userStr}));

        oAjax.onload = function () {
            let res = JSON.parse(oAjax.responseText);
            if (res) {
                // 有这个用户
                oAjax.open("POST", `http://${ADDRESS}:${PORT}/testPassword`);
                oAjax.setRequestHeader("Content-Type", "application/json");
                oAjax.send(JSON.stringify({"name": userStr, "password": passwordStr}));
                oAjax.onload = function () {
                    if (JSON.parse(oAjax.responseText)) {
                        // 密码正确了
                        userData.name = userStr;
                        userData.password = passwordStr;

                        loadUser();
                        new UserSettings().update();
                        // 关闭登录页面
                        loginView.style.display = "none";

                        // 设置缓存
                        localStorage.setItem("userName", userData.name);
                    } else {
                        // 密码错了
                        alert("密码错误了啦");
                    }
                }

            } else {
                // 没有这个用户
                alert("没有这个用户名哦！检查一下是不是用户名写错了啦，如果还没注册先注册哦");
            }
        }


    }
}
