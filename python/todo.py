#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys

class Todo(object):

    def __init__(self):
        print('Hola Mundo!')

        s1 = input('> ')
        print(s1)

        print(sys.argv)





if __name__ == '__main__':
    Todo()
