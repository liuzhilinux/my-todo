#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import sys

TIPS = {
    'no_content_err': '请填写任务内容。',
    'task_no_exist_err': '任务不存在。',
    'num_err': '清输入合法的任务序号。',
    'step_err': '清输入合法的移动步数。',
    'origin_content_is': '原内容是：',
    'please_input_content': '请输入要修改的内容：',
    'your_verb_is': '你的动作是： ',
    'i_dont_know_what_your_want': '我不知道你想干什么~',
    'are_you_sure_clear_all': '确认清空所有任务吗？[N/y]',
}

DB_PATH = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'db')

# Ｔｏｄｏ 类。


class Todo(object):

    # 构造对象、初始化并调用指令。
    def __init__(self):

        # 类似 JavaScript 的 parseInt 函数。
        def parseInt(s):
            try:
                return re.match(r'^\d+', s).group(0)
            except:
                return 0

        args = sys.argv

        try:
            self.__verb = args[1]
        except:
            self.__verb = None
        try:
            self.__n = parseInt(args[2])
        except:
            self.__n = None
        try:
            self.__content = args[2]
        except:
            self.__content = None
        try:
            self.__n1 = parseInt(args[3])
        except:
            self.__n1 = None
        try:
            self.__content1 = args[3]
        except:
            self.__content1 = None

        self.init()

        self.exec()

    # 销毁对象前打印任务列表并保存。
    def __del__(self):
        pass
    
    # 初始化，获取数据库数据。
    def init(self):
        pass

    # 执行操作。
    def exec(self):
        pass

if __name__ == '__main__':
    Todo()
