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
                return int(re.match(r'^\d+', s).group(0))
            except:
                return 0

        args = sys.argv

        try:
            self.__verb = args[1]
        except:
            self.__verb = None
        try:
            self.__n = parseInt(args[2]) - 1
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

        content = self.__content
        content1 = self.__content1
        n = self.__n
        n1 = self.__n1
        if verb == 'list':
            pass
        elif verb == 'add':     # 添加任务。
            if self.__checkContent(content):
                self.__list.append({"content": content, "status": False})
        elif verb == 'done':    # 标记任务为完成。
            if self.__checkNum(n) and self.__checkTaskExist(n, self.__list):
                self.__list[n]['status'] = True
        elif verb == 'delete':  # 删除任务。
            if self.__checkNum(n) and self.__checkTaskExist(n, self.__list):
                self.__list.pop(n)
        elif verb == 'edit':    # 编辑任务内容，如果命令行参数里面没有带任务内容，则后续过程中询问内容。
            if self.__checkNum(n) and self.__checkTaskExist(n, self.__list):
                if content1 != None and len(content1) > 0:
                    pass
                else:
                    print(TIPS['origin_content_is'] +
                          self.__list[n]['content'])
                    while content1 == None or len(content1) <= 0:
                        content1 = input(TIPS['please_input_content'])
                self.__list[n]['content'] = content1
        elif verb == 'undone':  # 标记任务为已完成。
            if self.__checkNum(n) and self.__checkTaskExist(n, self.__list):
                self.__list[n]['status'] = False
        elif verb == 'moveup':  # 向上移动任务。
            if self.__checkNum(n) and self.__checkStep(n1) and self.__checkTaskExist(n, self.__list):
                idx = n - n1
                idx = 0 if idx < 0 else idx
                tasks = self.__list.pop(n)
                self.__list.insert(idx, tasks)
        elif verb == 'movedown':    # 向下移动任务。
            if self.__checkNum(n) and self.__checkStep(n1) and self.__checkTaskExist(n, self.__list):
                idx = n + n1
                listLen = len(self.__list)
                idx = listLen if idx > listLen else idx
                tasks = self.__list.pop(n)
                self.__list.insert(idx, tasks)
        elif verb == 'clearall':    # 清除所有任务。
            answer = None
            while answer == None or len(answer) <= 0:
                answer = input(TIPS['are_you_sure_clear_all']).strip().lower()
            if answer in ['n', 'no']:
                pass
            elif answer in ['y', 'yes']:
                self.__list = []
                self.__save()
        else:
            self.__noAction = True
            print(TIPS['your_verb_is'] + verb)
            print(TIPS['i_dont_know_what_your_want'])

    # 显示任务列表。
    def __display(self):
        if self.__noAction:
            return

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

    # 检查任务序号是否合法。
    def __checkNum(self, n):
        if n == None or not n >= 0:
            self.__validated = False
            print(TIPS['num_err'])
            sys.exit()
        return True

    # 检查列表中是否存在对应序号的任务。
    def __checkTaskExist(self, n, list):
        if n >= len(list):
            self.__validated = False
            print(TIPS['task_no_exist_err'])
            sys.exit()
        return True

    # 检查移动步数是否合法。
    def __checkStep(self, n1):
        if n1 == None or not n1 >= 0:
            self.__validated = False
            print(TIPS['step_err'])
            sys.exit()
        return True


if __name__ == '__main__':
    Todo()
