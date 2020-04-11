#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import sys

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


if __name__ == '__main__':
    Todo()
