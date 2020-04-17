#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
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

        # 任务列表。
        self.__list = []
        # 是否为无效动作。
        self.__noAction = False
        # 命令行的输入参数是否验证通过，当输入有误的情况下，不打印列表，不保存列表。
        self.__validated = True

        self.__init()

        self.__exec()

    # 销毁对象前打印任务列表并保存。
    def __del__(self):
        if self.__validated:
            if self.__verb not in ['list', 'clearall']:
                self.__save()
            if self.__verb not in ['clearall']:
                self.__display()

    # 初始化，获取数据库数据。
    def __init(self):
        try:
            with open(DB_PATH, 'r', encoding='utf-8') as f:
                self.__list = json.load(f)
        except FileNotFoundError:
            with open(DB_PATH, 'w', encoding='utf-8') as f:
                json.dump([], f)
        except json.decoder.JSONDecodeError:
            self.__list = []

    # 保存数据到数据库。
    def __save(self):
        with open(DB_PATH, 'w', encoding='utf-8') as f:
            json.dump(self.__list, f)

    # 执行操作。
    def __exec(self):
        verb = self.__verb

        if verb == 'list':
            pass
        elif verb == 'add':
            content = self.__content
            if self.__checkContent(content):
                self.__list.append({"content": content, "status": False})

    # 显示任务列表。
    def __display(self):
        print('')

        idxLen = len(str(len(self.__list)))
        for idx, item in enumerate(self.__list):
            idx = str(idx + 1)
            space = ' ' * (idxLen - len(idx))
            status = '[x]' if item['status'] else '[_]'
            content = item['content']
            print(space + idx + '.', status, content)

    # 检查任务内容是否填写。
    def __checkContent(self, content):
        if not content:
            self.__validated = False
            print(TIPS['no_content_err'])
            sys.exit()
        return True


if __name__ == '__main__':
    Todo()
