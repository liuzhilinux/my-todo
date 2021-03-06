# SPEC

[TOC]

## 命令行

命令的基本格式：

```
todo <operation> [arg1 arg2]

<operation>:
    add content            # 添加任务
    list                   # 列出所有任务
    done n                 # 标记第 n 条任务为完成
    delete n               # 删除第 n 条任务
    edit n [content]       # 编辑第 n 条任务，后面可接要修改的内容
    undone n               # 标记第 n 条任务为未完成
    moveup n [step=1]      # 向上移动 step 步第 n 条任务
    movedown n [step=1]    # 向下移动 step 步第 n 条任务
    clearall               # 清空列表
```

说明：

1. 如果使用命令 `todo edit n` 后面未接上要编辑的内容时，则执行命令时会询问你输入要编辑的内容。
2. 当使用命令 `todo moveup n` 向上移动任务的距离超过第一条任务的时候，则这条任务将被移动到第一条。
3. 当使用命令 `todo movedown n` 向下移动任务的距离超过最后一条任务的时候，则这条任务将被移动到最后一条。
4. 删除、标记为完成、标记为未完成、编辑等，当输入的任务编号对应任务不存在，则会有相应的提示。



## 保存的数据格式

任务列表以数组形式保存，每一个任务的数据结构如下：

```json
{
	"content": "任务内容",
    "status": true  // true 为已完成， false 为未完成。
}
```



## 任务列表的展示方式

例子：

```
1. [X]: 接女神
2. [_]: 接备胎
3. [_]: 和女神结婚
```

说明：

1. 已完成的任务标记为 `[X]` ，未完成的任务标记为 `[_]` 。
2. 任务编号的小数点 `.` 应该对齐，比如，当列表中有十条或以上的任务时，展示第一条到第九条任务的编号前面加一个空格，这样第九条任务和第十条任务的编号后面的小数点是对齐的。

