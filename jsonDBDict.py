# -*- encoding: utf-8 -*-
"""
自己实现的数据库类
2022年07月03日
by littlefean
"""
from typing import *
import json


class JsonDBDict:
    def __init__(self, fileName: str):
        """
        初始化一个Dict类型json数据库
        这个数据库的结构是
        {
          "xxx": ...,
          "xxx1": ...,
          "xxx2": ...,
        }
        其中 key 只能是字符串类型
        其中 ... 可以是字符串类型、数字类型、布尔类型、列表类型、字典类型，不能有集合类型。
        :param fileName: json文件前缀名
        """
        self.file = f"myDB/jsonDB/{fileName}.json"
        try:
            with open(self.file, "r", encoding="utf-8") as f:
                js = f.read()
                self.contentDic = json.loads(js)
        except FileNotFoundError:
            with open(self.file, "w", encoding="utf-8") as f:
                f.write("{}")
                self.contentDic = {}
        ...

    def setDic(self, dic: dict):
        """直接让一个字典设置成这个数据库里的内容，覆盖"""
        self.contentDic = dic

    def __contains__(self, string: str):
        """简单的判定一个静态数据是否存在"""
        return string in self.contentDic

    def __getitem__(self, item: str):
        return self.contentDic.get(item)

    def put(self, key: str, value):
        """
        放置数据
        :param key: 添加的键
        :param value: 值
        :return: 无
        """
        if type(key) is not str:
            return
        self.contentDic[key] = value

    def remove(self, key: str):
        """删除某一条数据"""
        if key in self.contentDic:
            del self.contentDic[key]

    def getAllJson(self):
        """返回该文件内所有内容的json化格式字符串"""
        return json.dumps(self.contentDic)

    def save(self):
        """保存一下这个json对象"""
        with open(self.file, "w", encoding="utf-8") as f:
            f.write(json.dumps(self.contentDic, ensure_ascii=False))


def main():
    return None


if __name__ == "__main__":
    main()
