# -*- encoding: utf-8 -*-
"""
自己实现的数据库类
2022年06月30日
by littlefean
"""
from typing import *
import json


class JsonDBList:
    def __init__(self, fileName: str):
        """
        初始化一个list类型json数据库
        这个数据库的结构是
        [ {}, {}, {}, {} ... ]
        :param fileName: json文件前缀名
        """
        self.file = f"myDB/jsonDB/{fileName}.json"
        try:
            with open(self.file, "r", encoding="utf-8") as f:
                js = f.read()
                self.contentArr: list = json.loads(js)
        except FileNotFoundError:
            with open(self.file, "w", encoding="utf-8") as f:
                f.write("[]")
                self.contentArr: list = []

    def add(self, item: dict):
        """
        往json数据库中添加一个字典对象
        仅仅修改内存，不保存
        """
        self.contentArr.append(item)

    def save(self):
        """保存一下这个json对象"""
        with open(self.file, "w", encoding="utf-8") as f:
            f.write(json.dumps(self.contentArr, ensure_ascii=False))

    def __contains__(self, item: dict):
        """简单的判定一个静态数据是否存在"""
        return False if type(item) is not dict else item in self.contentArr

    def remove(self, value) -> str:
        """
        从数据库中找到一个数据并删除
        返回删除的情况字符串
        """
        if value in self.contentArr:
            self.contentArr.remove(value)
            return "已经删除"
        else:
            return "库里没有这个要删除的东西"

    def findObj(self, attr: str, value):
        """从自身数据库中查找第一个匹配这个的项目"""
        return next((obj for obj in self.contentArr if attr in obj and obj[attr] == value), None)

    def modifyObjValue(self, findAttr: str, findValue, modifyAttr: str, modifyValue):
        """实现修改功能"""
        for obj in self.contentArr:
            if findAttr in obj and obj[findAttr] == findValue:
                if modifyAttr in obj:
                    obj[modifyAttr] = modifyValue
                return True
        return False


def main():
    return None


if __name__ == "__main__":
    main()
