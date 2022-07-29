# -*- encoding: utf-8 -*-
"""
PyCharm routes
2022年07月02日
by littlefean
"""
import os
import pathlib
import time
from datetime import datetime
from datetime import timedelta

from flask import request

from jsonDBDict import JsonDBDict
from globalData import app
from jsonDBList import JsonDBList
import json
import hashlib

from htmlFileStringify import htmlStringify
import stringTest

userDB = JsonDBDict("users")
# 网页字符串全局常量
PAGE_HTML = htmlStringify(f"TimeManagerClient{os.sep}index.html")


@app.route('/')
def index():
    """
    test
    :return:
    """
    return "学业繁忙，网站暂停"


@app.route('/timeManager')
def timeManager():
    """
    test
    :return:
    """
    print("有一个用户访问了网页")
    return PAGE_HTML


@app.route("/askWeek")
def askWeek():
    """
    前端询问后端当前这一周的每一天的具体日期，
    后端返回前端一个json表示的["" "" "" "" "" "" ""]数组，长度为7
    数组里的每一个是字符串日期 "2019.5.15" 表示
    :return:
    """
    d = datetime.now()
    w = d.weekday()
    dt = timedelta(days=w)
    firstDay = d - dt
    res = [firstDay + timedelta(days=i) for i in range(7)]
    newRes = [f"{item.year}.{item.month}.{item.day}" for item in res]
    print("访问了今天的日期")
    return json.dumps(newRes)


@app.route("/queryNextWeek", methods=['POST'])
def queryNextWeek():
    """
    前端拿着 "['2022.7.4', '2022.7.5', '2022.7.6', '2022.7.7', '2022.7.8', '2022.7.9', '2022.7.10']"
    问后端下一周是什么
    后端返回 "['2022.7.11', '2022.7.12', '2022.7.13', '2022.7.14', '2022.7.15', '2022.7.16', '2022.7.17']"
    :return:
    """
    print("收到了前端下一周的请求")
    data = json.loads(request.get_data(as_text=True))
    print(data, type(data))

    y, m, d = map(int, data[-1].split("."))
    weekend = datetime(y, m, d)
    res = [weekend + timedelta(days=i) for i in range(1, 7 + 1)]
    newRes = [f"{item.year}.{item.month}.{item.day}" for item in res]
    print(newRes)
    return json.dumps(newRes)


@app.route("/queryLastWeek", methods=['POST'])
def queryLastWeek():
    """
    上一周
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    y, m, d = map(int, data[0].split("."))
    weekend = datetime(y, m, d)
    res = [weekend - timedelta(days=i) for i in reversed(range(1, 7 + 1))]
    newRes = [f"{item.year}.{item.month}.{item.day}" for item in res]
    return json.dumps(newRes)


@app.route('/haveUser', methods=['POST'])
def haveUser():
    """
    检测一个用户是否存在
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    print(data, type(data))
    return json.dumps(True) if data["name"] in userDB else json.dumps(False)


def hash256(password: str) -> str:
    """
    将字符串转化为哈希
    :param password:
    :return:
    """
    m = hashlib.sha256()
    m.update(password.encode("utf-8"))
    return m.hexdigest()


@app.route('/testPassword', methods=['POST'])
def testPassword():
    """
    检测用户名的密码对不对
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    if data["name"] not in userDB:
        return json.dumps(False)
    else:
        return json.dumps(hash256(data["password"]) == userDB[data["name"]]["password"])


@app.route('/register', methods=['POST'])
def register():
    """
    用户发起了注册请求
    {
        "name": userName,
        "password": password,
        "email": email,
    }
    :return: {word: str, status: bool }
    """
    data = json.loads(request.get_data(as_text=True))
    # 这个注册的用户已经有了
    if data["name"] in userDB:
        return json.dumps({"word": "已经有这个用户名了，换一个名字", "status": False})
    # 进行一番验证
    if len(data["name"]) not in range(1, 30 + 1):
        return json.dumps({"word": "用户名字符的长度必须在1到30以内", "status": False})
    # 用户名的名字将会作为文件名的一部分，所以有严格的限制
    if not stringTest.accordFileName(data["name"]):
        return json.dumps({"word": "用户名中不能包含/\\^*:?><=.&%$#@`!~这些字符，这些字符似乎是在造反", "status": False})
    wordRes, passwordRes = stringTest.isPassword(data["password"])
    if not passwordRes:
        return json.dumps({"word": wordRes, "status": False})
    if not stringTest.isEmail(data["email"]):
        return json.dumps({"word": "邮箱不符合规范", "status": False})
    # 通过了数据验证，开始注册
    userDB.put(data["name"], {"email": data["email"], "password": hash256(data["password"])})
    userDB.save()
    return json.dumps({"word": "注册成功了啦！", "status": True})


@app.route("/userAddPeriod", methods=['POST'])
def userAddPeriod():
    """
    处理用户添加了一个时间段的情况
    前端发过来的格式：
    {
        userName: "张全蛋",
        period（字符串形式）: {
            "start":"7:25",
            "dur":"0:55",
            "week":"2",
            "date":"2022.7.5",
            "obj": {
                    "name":"数学",
                    "color":"rgba(0, 0, 255, 1)",
                    "fontColor":"rgba(255, 255, 255, 1)"
            }
       }
    }
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    userPeriodDb = JsonDBList(f"{name}period")
    userPeriodDb.add(data["period"])
    userPeriodDb.save()
    return json.dumps("ok")


@app.route("/userDelPeriod", methods=['POST'])
def userDelPeriod():
    """
    处理用户删除了一个时间段的情况
    前端发过来的格式：
    {
        userName: "张全蛋",
        period（字符串形式）: {
            "start":"7:25",
            "dur":"0:55",
            "week":"2",
            "date":"2022.7.5",
            "obj": {
                    "name":"数学",
                    "color":"rgba(0, 0, 255, 1)",
                    "fontColor":"rgba(255, 255, 255, 1)"
            }
       }
    }
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    print(f"用户{name}想要删除一段时间段：{data['period']}")
    userPeriodDb = JsonDBList(f"{name}period")
    res = userPeriodDb.remove(data["period"])
    userPeriodDb.save()
    return json.dumps({"delResult": res})


@app.route("/userGetAllPeriod", methods=['POST'])
def userGetAllPeriod():
    """
    用户获取所有的它现在已经存储过的时间段数据
    前端发的 {userName: userData.name}
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    userPeriodDb = JsonDBList(f"{name}period")
    return json.dumps(userPeriodDb.contentArr)


@app.route("/userAddTimeKind", methods=['POST'])
def userAddTimeKind():
    """
    用户增加一种时间
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    jdb = JsonDBDict(f"{name}TimeKind")
    print(data)
    jdb.put(data["timeKind"]["title"], {
        "fillColor": data["timeKind"]["fillColor"],
        "borderColor": data["timeKind"]["borderColor"],
    })
    jdb.save()
    return json.dumps("ok")


@app.route("/userDelTimeKind", methods=['POST'])
def userDelTimeKind():
    """
    用户删除一种时间
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    jdb = JsonDBDict(f"{name}TimeKind")
    jdb.remove(data["title"])
    jdb.save()
    return json.dumps("ok")


@app.route("/userGetAllTimeKind", methods=['POST'])
def userGetAllTimeKind():
    """
    获取用户的所有时间种类
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    content = JsonDBDict(f"{name}TimeKind").contentDic
    res = [{"name": k, "color": v["fillColor"], "fontColor": v["borderColor"]} for k, v in content.items()]
    return json.dumps(res)


@app.route("/userAddDDL", methods=['POST'])
def userAddDDL():
    """
    用户添加倒数日
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    jdb = JsonDBList(f"{name}DDL")
    jdb.add({
        "title": data["ddl"]["title"],
        "date": data["ddl"]["date"]
    })
    jdb.save()
    # 计算剩余天数
    return json.dumps(getAbsDay(data["ddl"]["date"]))


def getAbsDay(futureDayStr: str) -> int:
    """
    通过一个未来时间字符串计算现在距离那个未来还有多少天
    :param futureDayStr: 未来时间字符串 "2033-10-19"
    :return: 155
    """
    y, m, d = map(int, futureDayStr.split("-"))
    d = datetime(y, m, d)
    now = datetime.now()
    return (d - now).days


@app.route("/userDelDDL", methods=['POST'])
def userDelDDL():
    """
    用户删除倒数日
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    jdb = JsonDBList(f"{name}DDL")
    jdb.remove({
        "title": data["ddl"]["title"],
        "date": data["ddl"]["date"]
    })
    jdb.save()
    return json.dumps("ok")


@app.route("/userGetAllDDL", methods=['POST'])
def userGetAllDDL():
    """
    用户获取所有倒数日
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    jdb1 = JsonDBList(f"{name}DDL")
    from copy import deepcopy
    res = deepcopy(jdb1.contentArr)
    print("res", type(res), res)
    for item in res:
        item["remain"] = getAbsDay(item["date"])
    return json.dumps(res)


@app.route("/userGetAllWeekEvent", methods=['POST'])
def userGetAllWeekEvent():
    """
    用户获取所有周常事件
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    jdb1 = JsonDBList(f"{name}WeekEvent")
    return json.dumps(jdb1.contentArr)


@app.route("/userAddWeekEvent", methods=['POST'])
def userAddWeekEvent():
    """
    用户添加一个周常事件
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    jdb = JsonDBList(f"{name}WeekEvent")
    jdb.add(data["weekEvent"])
    jdb.save()
    return json.dumps("ok")


@app.route("/userDelWeekEvent", methods=['POST'])
def userDelWeekEvent():
    """
    用户删除一个周常事件
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    jdb = JsonDBList(f"{name}WeekEvent")
    jdb.remove(data["weekEvent"])
    jdb.save()
    return json.dumps("ok")


@app.route("/userGetAllReflect", methods=['POST'])
def userGetAllReflect():
    """
    用户获取所有反思
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    jdb = JsonDBList(f"{name}Reflect")
    return json.dumps(jdb.contentArr)


@app.route("/userAddReflect", methods=['POST'])
def userAddReflect():
    """
    用户添加一条反思
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    putData = data["Reflect"]
    jdb = JsonDBList(f"{name}Reflect")
    jdb.add(putData)
    jdb.save()
    return json.dumps("ok")


@app.route("/userDelReflect", methods=['POST'])
def userDelReflect():
    """
    用户删除一条反思
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    delData = data["Reflect"]
    jdb = JsonDBList(f"{name}Reflect")
    jdb.remove(delData)
    jdb.save()
    return json.dumps("ok")


@app.route("/userGetAllInspiration", methods=['POST'])
def userGetAllInspiration():
    """
    用户获取所有反思
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    jdb = JsonDBList(f"{name}Inspiration")
    return json.dumps(jdb.contentArr)


@app.route("/userAddInspiration", methods=['POST'])
def userAddInspiration():
    """
    用户添加一条反思
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    putData = data["Inspiration"]
    jdb = JsonDBList(f"{name}Inspiration")
    jdb.add(putData)
    jdb.save()
    return json.dumps("ok")


@app.route("/userDelInspiration", methods=['POST'])
def userDelInspiration():
    """
    用户删除一条反思
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    delData = data["Inspiration"]
    jdb = JsonDBList(f"{name}Inspiration")
    jdb.remove(delData)
    jdb.save()
    return json.dumps("ok")


@app.route("/userGetSettings", methods=['POST'])
def userGetSettings():
    """
    用户获取设置信息
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    jdb = JsonDBDict(f"{name}Settings")
    if not jdb:
        jdb = {"style": "blueStyle"}
    return json.dumps(jdb.contentDic)


@app.route("/userSetSettings", methods=['POST'])
def userSetSettings():
    """
    用户设置信息
    :return:
    """
    data = json.loads(request.get_data(as_text=True))
    name = data["userName"]
    jdb = JsonDBDict(f"{name}Settings")
    jdb.setDic(data["settings"])
    jdb.save()
    return json.dumps("ok")


def main():
    return None


if __name__ == "__main__":
    main()
