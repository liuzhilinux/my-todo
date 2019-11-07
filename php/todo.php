<?php

new Todo();

/**
 * Class Ｔｏｄｏ 类。
 */
class Todo
{
    /**
     * @var string 数据库文件。
     */
    private $dbPath = __DIR__ . DIRECTORY_SEPARATOR . 'db';

    /**
     * @var string 动作。
     */
    private $verb;

    /**
     * @var int 任务序号。
     */
    private $n;

    /**
     * @var string 任务内容。
     */
    private $content;

    /**
     * @var string 移动步数。
     */
    private $n1;

    /**
     * @var string 要修改成的任务内容。
     */
    private $content1;

    /**
     * @var array 提示。
     */
    private $tips = [
        'no_content_err' => '请填写任务内容。',
        'task_no_exist_err' => '任务不存在。',
        'num_err' => '清输入合法的任务序号。',
        'step_err' => '清输入合法的移动步数。',
        'origin_content_is' => '原内容是：',
        'please_input_content' => '请输入要修改的内容：',
        'your_verb_is' => '你的动作是： ',
        'i_dont_know_what_your_want' => '我不知道你想干什么~',
        'are_you_sure_clear_all' => '确认清空所有任务吗？[N/y]',
    ];

    /**
     * @var array 任务列表。
     */
    private $list = [];

    /**
     * @var bool 是否为无效动作。
     */
    private $noAction = false;

    /**
     * @var bool 命令行的输入参数是否验证通过，当输入有误的情况下，不打印列表，不保存列表。
     */
    private $validated = true;

    /**
     * 构造对象、初始化并调用指令。
     * Ｔｏｄｏ constructor.
     */
    public function __construct()
    {
        global $argv;

        $verb = $this->verb = isset($argv[1]) ? $argv[1] : null;
        $this->n = isset($argv[2]) ? intval($argv[2]) - 1 : null;
        $this->content = isset($argv[2]) ? $argv[2] : null;
        $this->n1 = isset($argv[3]) ? intval($argv[3]) : null;
        $this->content1 = isset($argv[3]) ? $argv[3] : null;

        $this->init();

        $this->$verb();
    }

    /**
     * 销毁对象前打印任务列表并保存。
     */
    public function __destruct()
    {
        if ($this->validated) {
            if (!in_array($this->verb, ['list', 'clearall'])) $this->save();
            if (!in_array($this->verb, ['clearall'])) $this->display();
        }
    }

    /**
     * 在没有匹配指令的情况下的默认动作。
     *
     * @param $name
     * @param $arguments
     */
    public function __call($name, $arguments)
    {
        if ($name === 'list') return;

        $this->noAction = true;
        echo $this->tips['your_verb_is'], $name, "\n";
        echo $this->tips['i_dont_know_what_your_want'], "\n";
    }

    /**
     * 初始化，获取数据库数据。
     */
    private function init()
    {
        $db_path = $this->dbPath;

        if (file_exists($db_path)) {
            $handle = fopen($db_path, 'r');
            $list = fgets($handle);
            $this->list = json_decode($list, true) ?: [];
        } else {
            $handle = fopen($db_path, 'w');
            fwrite($handle, '[]');
        }
    }

    /**
     * 保存数据到数据库。
     */
    private function save()
    {
        $list = json_encode($this->list, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $handle = fopen($this->dbPath, 'w');
        fwrite($handle, $list);
    }

    /**
     * 显示任务列表。
     */
    private function display()
    {
        echo "\n";
        // 保证列表中每一项任务的完成标记对齐。
        $list = $this->list;
        $idxLen = strlen(strval(count($list)));
        foreach ($list as $idx => $item) {
            $idx = strval($idx + 1);
            $space = str_repeat(' ', $idxLen - strlen($idx));
            $status = $item['status'] ? '[x]' : '[_]';
            $content = $item['content'];

            echo $space, $idx, '. ', $status, ' ', $content, "\n";
        }
    }

    /**
     * 添加任务。
     */
    private function add()
    {
        $content = $this->content;

        if ($this->checkContent($content)) {
            $this->list[] = ['content' => $content, 'status' => false];
        }
    }

    /**
     * 标记任务为完成。
     */
    private function done()
    {
        $n = $this->n;
        if ($this->checkNum($n) && $this->checkTaskExist($n, $this->list)) {
            $this->list[$n]['status'] = true;
        }
    }

    /**
     * 删除任务。
     */
    private function delete()
    {
        $n = $this->n;
        if ($this->checkNum($n) && $this->checkTaskExist($n, $this->list)) {
            unset($this->list[$n]);
        }
    }

    /**
     * 编辑任务内容，如果命令行参数里面没有带任务内容，则后续过程中询问内容。
     */
    private function edit()
    {
        $n = $this->n;
        if ($this->checkNum($n) && $this->checkTaskExist($n, $this->list)) {
            $content = $this->content1;

            if ($content) {
                $this->list[$n]['content'] = $content;
            } else {
                echo $this->tips['origin_content_is'] . $this->list[$n]['content'] . "\n";

                do {
                    echo $this->tips['please_input_content'];
                } while (mb_strlen($line = trim(fgets(STDIN))) === 0);

                $this->list[$n]['content'] = $line;
            }
        }
    }

    /**
     * 标记任务为已完成。
     */
    private function undone()
    {
        $n = $this->n;
        if ($this->checkNum($n) && $this->checkTaskExist($n, $this->list)) {
            $this->list[$n]['status'] = false;
        }
    }

    /**
     * 向上移动任务。
     */
    private function moveup()
    {
        $n = $this->n;
        $n1 = $this->n1;
        if ($this->checkNum($n) && $this->checkStep($n1) && $this->checkTaskExist($n, $this->list)) {
            $idx = $n - $n1;
            $idx = $idx < 0 ? 0 : $idx;
            $tasks = array_splice($this->list, $n, 1);
            array_splice($this->list, $idx, 0, $tasks);
        }
    }

    /**
     * 向下移动任务。
     */
    private function movedown()
    {
        $n = $this->n;
        $n1 = $this->n1;
        if ($this->checkNum($n) && $this->checkStep($n1) && $this->checkTaskExist($n, $this->list)) {
            $idx = $n + $n1;
            $listLen = count($this->list);
            $idx = $idx > $listLen ? $listLen : $idx;
            $tasks = array_splice($this->list, $n, 1);
            array_splice($this->list, $idx, 0, $tasks);
        }
    }

    /**
     * 清除所有任务。
     */
    private function clearall()
    {
        do {
            echo $this->tips['are_you_sure_clear_all'];
        } while (mb_strlen($line = trim(fgets(STDIN))) === 0);

        $line = strtolower($line);

        if (in_array($line, ['n', 'no'])) return;
        else if (in_array($line, ['y', 'yes'])) {
            $this->list = [];
            $this->save();
        }
    }

    /**
     * 检查任务内容是否填写。
     *
     * @param string $content 任务内容。
     *
     * @return bool true
     */
    private function checkContent($content)
    {
        if (empty($content)) {
            $this->validated = false;
            exit($this->tips['no_content_err'] . "\n");
        }

        return true;
    }

    /**
     * 检查任务序号是否合法。
     *
     * @param int $n 任务序号。
     *
     * @return bool true
     */
    private function checkNum($n)
    {
        if (empty($n) || is_nan($n)) {
            $this->validated = false;
            exit($this->tips['num_err'] . "\n");
        }

        return true;
    }

    /**
     * 检查列表中是否存在对应序号的任务。
     *
     * @param int $n      任务序号。
     * @param array $list 任务列表。
     *
     * @return bool true
     */
    private function checkTaskExist($n, $list)
    {
        if (!array_key_exists($n, $list)) {
            $this->validated = false;
            exit($this->tips['task_no_exist_err'] . "\n");
        }

        return true;
    }

    /**
     * 检查移动步数是否合法。
     *
     * @param int $n1 移动步数。
     *
     * @return bool true
     */
    private function checkStep($n1)
    {
        if (empty($n1) || is_nan($n1)) {
            $this->validated = false;
            exit($this->tips['step_err'] . "\n");
        }

        return true;
    }
}
