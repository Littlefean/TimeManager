# 前后端交互API



---

## 一个请求的描述内容

请求路径，请求类型，后端功能描述，后端响应格式

注：下面API中 后端响应格式与前端传来格式的代码块部分，虽然写的都是json对象的格式，理解的时候要理解成全是字符串，之所以外面没有套上双引号是因为加上双引号之后颜色不容易区分了。

## API

### /askWeek

类型：get

后端响应格式：

```json
['2022.7.4', '2022.7.5', '2022.7.6', '2022.7.7', '2022.7.8', '2022.7.9', '2022.7.10']

// 后端返回前端一个json表示的["" "" "" "" "" "" ""]数组，长度为7
// 数组里的每一个是字符串日期 "2019.5.15" 表示
```

后端行为：

计算一下现在的日期是多少



### /queryNextWeek

类型：POST

前端传来格式：

```json
['2022.7.4', '2022.7.5', '2022.7.6', '2022.7.7', '2022.7.8', '2022.7.9', '2022.7.10']
```

后端响应格式：

```json
['2022.7.11', '2022.7.12', '2022.7.13', '2022.7.14', '2022.7.15', '2022.7.16', '2022.7.17']
```

后端行为：

计算了一下下一周是什么



### /queryLastWeek

类型：POST

前端传来格式：

```json
['2022.7.4', '2022.7.5', '2022.7.6', '2022.7.7', '2022.7.8', '2022.7.9', '2022.7.10']
```

后端响应格式：

```json
['2022.7.11', '2022.7.12', '2022.7.13', '2022.7.14', '2022.7.15', '2022.7.16', '2022.7.17']
```

后端行为：

计算了一下上一周是什么





### /haveUser

类型：POST

前端传来格式：

```json
{"name": "xxxx"}
```

后端响应格式：

```json
true
```

后端行为：

检查了一下前端要查询的用户是不是在注册的用户里面



### /testPassword

类型：POST

前端传来格式：

```json
{"name": userStr, "password": passwordStr}
```

后端响应格式：

```json
true
```

后端行为：

根据数据，检查了一下库中的用户名所对应的密码，是否正确



### /register

类型：POST

前端传来格式：

```json
{
    "name": userName.value,
    "password": password.value,
    "email": email.value,
}
```

后端响应格式：

```json
{"word": "注册成功了啦！", "status": true}
{"word": "已经有这个用户名了，换一个名字", "status": false}
{"word": "用户名字符的长度必须在1到30以内", "status": false}
{"word": "邮箱不符合规范", "status": false}
// 其中一种
```

后端行为：

根据提交的注册用户的信息，检查数据库中是否已经有这个用户，以及这个用户的各种信息是否符合规范





### /userAddPeriod

类型：POST

前端传来格式：

```json
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
```

后端响应格式：

```json
"ok"
// 不重要
```

后端行为：

在这个对应用户的数据库表中添加前端传来的这一条目





### /userDelPeriod

类型：POST

前端传来格式：

```json
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
```

后端响应格式：

```json
"ok"
// 不重要
```

后端行为：

在这个对应用户的数据库表中删除前端传来的这一条目





### /userGetAllPeriod

类型：POST

前端传来格式：

```json
{"userName": userData.name}
```

后端响应格式：

```json
[
  {
    "start": "12:2",
    "dur": "12:2",
    "week": "1",
    "date": "2022.7.5",
    "obj": {
      "name": "英语",
      "color": "rgba(255, 0, 255, 1)",
      "fontColor": "rgba(255, 255, 255, 1)"
    },
    "disable": false
  },
  {
    "start": "7:9",
    "dur": "1:2",
    "week": "5",
    "date": "2022.7.9",
    "obj": {
      "name": "政治",
      "color": "rgba(255, 255, 0, 1)",
      "fontColor": "rgba(255, 0, 0, 1)"
    },
    "disable": false
  },
  {
    "start": "16:58",
    "dur": "3:11",
    "week": "4",
    "date": "2022.7.8",
    "obj": {
      "name": "英语",
      "color": "rgba(255, 0, 255, 1)",
      "fontColor": "rgba(255, 255, 255, 1)"
    },
    "disable": false
  },
  {
    "start": "20:28",
    "dur": "3:44",
    "week": "5",
    "date": "2022.7.9",
    "obj": {
      "name": "数学",
      "color": "rgba(0, 0, 255, 1)",
      "fontColor": "rgba(255, 255, 255, 1)"
    },
    "disable": false
  }
]
```

后端行为：

查询数据库中的用户，获取用户的全部记录时间段Period信息并发给前端



### /userAddTimeKind

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
    timeKind: {
        "title": title,
        "fillColor": fillColor,
        "borderColor": borderColor,
    }
}
```

后端响应格式：

```json
"ok"
// 不重要
```

后端行为：

在用户数据库中添加条目



### /userDelTimeKind

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
    "title": title,
}
```

后端响应格式：

```json
"ok"
// 不重要
```

后端行为：

在用户数据库中删除条目



### /userGetAllTimeKind

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
}
```

后端响应格式：

```json
[
    {
        name: "数学",
        color: `rgba(0, 0, 255, 1)`,
        fontColor: `rgba(255, 255, 255, 1)`,
    },
    {
        name: "英语",
        color: `rgba(255, 0, 255, 1)`,
        fontColor: `rgba(255, 255, 255, 1)`,
    },
    {
        name: "政治",
        color: `rgba(255, 255, 0, 1)`,
        fontColor: `rgba(255, 0, 0, 1)`,
    },
    {
        name: "吃饭",
        color: `rgb(153, 215, 18)`,
        fontColor: `rgb(168, 79, 0)`,
    },
    {
        name: "睡觉",
        color: `rgb(20, 98, 85)`,
        fontColor: `rgb(255, 255, 255)`,
    },
]
```

后端行为：

获取一个用户的所有种类数据





### /userAddDDL

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
    ddl: {
        "title": title,
        "date": "2011-5-1",
    }
}
```

后端响应格式：

```json
65
```

后端行为：

在用户数据库中添加条目，添加一个倒数日，并返回前端倒数日



### /userDelDDL

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
    ddl: {
        "title": title,
        "date": "2011-5-1",
    }
}
```

后端响应格式：

```json
"ok"
// 不重要
```

后端行为：

在用户数据库中添加条目，删除一个倒数日





### /userGetAllDDL

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
}
```

后端响应格式：

```json
[
    {
        "title": title,
        "date": "2011-5-1",
        "remain": 65
    },
    {
        "title": title,
        "date": "2011-5-1",
        "remain": 65
    }
    ...
]
```

后端行为：

找到用户的倒数日，计算每一个剩余天数并返回



### /userGetAllWeekEvent

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
}
```

后端响应格式：

```json
[
    {
        "title": "上课",
        "week": [1, 2, 3, 4, 5, 6, 7],
        "startTime": "13:15",
        "alarm": false,
    },
    {
        "title": "打比赛",
        "week": [6],
        "startTime": "13:15",
        "alarm": true,
    },
    ...
]
```

后端行为：

找到用户的所有周常事件并发送给前端



### /userAddWeekEvent

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
    "weekEvent": {
        "title": "上课",
        "week": [1, 2, 3, 4, 5, 6, 7],
        "startTime": "13:15",
        "alarm": false,
    }
}
```

后端响应格式：

```json
"ok"
```

后端行为：

找到用户，并给用户添加一条周常信息

### /userDelWeekEvent

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
    "weekEvent": {
        "title": "上课",
        "week": [1, 2, 3, 4, 5, 6, 7],
        "startTime": "13:15",
        "alarm": false,
    }
}
```

后端响应格式：

```json
"ok"
```

后端行为：

找到用户，删除用户的一条信息





### /userGetAllReflect

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
}
```

后端响应格式：

```json
[
    {
        "content": "xxxxx",
        "date": "2019-05-10"
    },
    {
        "content": "xxxxx",
        "date": "2019-05-10"
    },
    ...
]
```

后端行为：

找到用户的所有反思内容并发送给前端



### /userAddReflect

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
    "Reflect": {
        "content": "xxxxx",
        "date": "2019-05-10"
    }
}
```

后端响应格式：

```json
"ok"
```

后端行为：

找到用户，并给用户添加一条反思内容

### /userDelReflect

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
    "Reflect": {
        "content": "xxxxx",
        "date": "2019-05-10"
    }
}
```

后端响应格式：

```json
"ok"
```

后端行为：

找到用户，删除用户的一条信息







### /userGetAllInspiration

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
}
```

后端响应格式：

```json
[
    {
        "content": "xxxxx",
        "date": "2019-05-10"
    },
    {
        "content": "xxxxx",
        "date": "2019-05-10"
    },
    ...
]
```

后端行为：

找到用户的所有灵感内容并发送给前端



### /userAddInspiration

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
    "Inspiration": {
        "content": "xxxxx",
        "date": "2019-05-10"
    }
}
```

后端响应格式：

```json
"ok"
```

后端行为：

找到用户，并给用户添加一条灵感内容

### /userDelInspiration

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋",
    "Inspiration": {
        "content": "xxxxx",
        "date": "2019-05-10"
    }
}
```

后端响应格式：

```json
"ok"
```

后端行为：

找到用户，删除用户的一条信息



### /userGetSettings

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋"
}
```

后端响应格式：

```json
settings: {
    style: "pinkStyle",
}
// 以上其中一种
```

后端行为：

找到用户，获取用户的主题信息，如果没有找到，则默认返回pinkStyle

### /userSetSettings

类型：POST

前端传来格式：

```json
{
    userName: "张全蛋"
    settings: {
    	style: "pinkStyle",
	}
}
```

后端响应格式：

```json
"ok"
```

后端行为：

找到用户，修改用户的主题信息







