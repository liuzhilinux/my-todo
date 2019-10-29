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
     * @var string 动作.
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
        if (!in_array($this->verb, ['list', 'clearall'])) $this->save();
        if (!in_array($this->verb, ['clearall'])) $this->display();
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

    private function save()
    {
        $list = json_encode($this->list, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $handle = fopen($this->dbPath, 'w');
        fwrite($handle, $list);
    }

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

    private function add()
    {
        $this->list[] = ['content' => $this->content, 'status' => false];
    }

    private function done()
    {

    }

    private function delete()
    {

    }

    private function edit()
    {

    }

    private function undone()
    {

    }

    private function moveup()
    {

    }

    private function movedown()
    {

    }

    private function clearall()
    {

    }
}
