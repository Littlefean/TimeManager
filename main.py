# -*- encoding: utf-8 -*-
"""
项目运行主模块 文件
2022年06月29日
by littlefean
"""

from routes import *


def main():
    print("app run")

    app.run(port=10007)
    return None


if __name__ == "__main__":
    main()
