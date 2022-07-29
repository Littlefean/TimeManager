# -*- encoding: utf-8 -*-
"""
存放全局模块的
2022年07月02日
by littlefean
"""
from typing import *

from flask import Flask
from flask_cors import *  # 导入模块

app = Flask(__name__)
CORS(app, supports_credentials=True)
