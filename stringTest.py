# -*- encoding: utf-8 -*-
"""
PyCharm stringTest
字符串检测
2022年07月03日
by littlefean
"""
from typing import *
import re


def isPassword(string: str):
    """
    检测是不是符合要求的密码
    :param string:
    :return: (提示符号, 是否成功)
    """
    password: str = string
    if len(password) not in range(6, 16 + 1):
        return "密码长度不符合要求", False
    for char in password:
        if char.isdigit():
            continue
        if char.isalpha():
            continue
        if char in ["_", "."]:
            continue
        return f"密码中含有非法字符【{char}】，注意：密码只能包含字母数字、下划线和点", False
    return "密码符合要求", True


def isEmail(string: str):
    if type(string) != str:
        print("检测邮件字符串是否符合规则的时候发现这个字符串根本不是字符串", type(string))
        return False
    regex = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')
    return re.fullmatch(regex, string)


def accordFileName(string: str) -> bool:
    """
    检测一个字符串是否符合文件名的前缀名
    要求，不能包含一些文件夹不能包含的字符
    :param string:
    :return:
    """
    return all(char not in "/\\^*:?><=.&%$#@`!~" for char in string)


def main():
    return None


if __name__ == "__main__":
    main()
