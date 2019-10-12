(function () {
    const fs = require('fs');
    const path = require('path');
    const readline = require('readline');

    const argv = process.argv;

    const dbPath = __dirname + path.sep + 'db';

    const verb = argv[2];
    const n = parseInt(argv[3]) - 1;
    const content = argv[3];
    const n1 = parseInt(argv[4]);
    const content1 = argv[4];

    const tips = {
        no_content_err: '请填写任务内容。',
        task_no_exist_err: '任务不存在。',
        num_err: '清输入合法的任务序号。',
        step_err: '清输入合法的移动步数。',
        origin_content_is: '原内容是：',
        please_input_content: '请输入要修改的内容：',
        your_verb_is: '你的动作是： ',
        i_dont_know_what_your_want: '我不知道你想干什么~',
        are_you_sure_clear_all: '确认清空所有任务吗？[Y/n]',
    };

    var list = [];

    var noAction = false;

    init();

    switch (verb) {
        case 'add':
            add(content);
            break;

        case 'list':
            break;

        case 'done':
            done(n);
            break;

        case 'delete':
            del(n);
            break;

        case 'edit':
            (async () => {
                await edit(n, content1);
                save();
                display();
            })();
            break;

        case 'undone':
            undone(n);
            break;

        case 'moveup':
            moveup(n, n1);
            break;

        case 'movedown':
            movedown(n, n1);
            break;

        case 'clearall':
            (async () => {
                await clearall();
                save();
            })();
            break;

        default:
            noAction = true;
            console.log(tips.your_verb_is + verb);
            console.log(tips.i_dont_know_what_your_want);
            break;
    }

    if (!['list', 'edit', 'clearall'].includes(verb) && !noAction) save();

    if (!['edit', 'clearall'].includes(verb)) display();


    /* ================ helper ================ */


    /**
     * 初始化。
     */
    function init() {
        if (fs.existsSync(dbPath)) {
            list = fs.readFileSync(dbPath, {encoding: 'utf8'});

            try {
                list = JSON.parse(list);
            } catch (e) {
                // ...
            }
        } else {
            fs.writeFileSync(dbPath, '[]');
        }
    }

    /**
     * 保存数据。
     */
    function save() {
        fs.writeFileSync(dbPath, JSON.stringify(list));
    }

    /**
     * 显示任务列表。
     */
    function display() {
        console.log('');
        // 保证列表中每一项任务的完成标记对齐。
        let idxLen = String(list.length).length;
        list.forEach((item, idx) => {
            idx = String(idx + 1);
            let space = ' '.repeat(idxLen - idx.length);
            let status = item.status ? '[x]' : '[_]';
            let content = item.content;

            console.log(space + idx + '. ' + status + ' ' + content);
        });
    }

    /**
     * 添加任务。
     * @param content 任务内容。
     */
    function add(content) {
        if (checkContent(content)) list.push({content, status: false});
    }

    /**
     * 标记任务为完成。
     * @param n 要标记的任务序号。
     */
    function done(n) {
        if (checkNum(n) && checkTaskExist(n, list)) list[n].status = true;
    }

    /**
     * 删除任务。
     * @param n 要删除的任务序号。
     */
    function del(n) {
        if (checkNum(n) && checkTaskExist(n, list)) list.splice(n, 1);
    }

    /**
     * 编辑任务内容，如果命令行参数里面没有带任务内容，则后续过程中询问内容。
     * @param n 要编辑的任务序号。
     * @param content 命令行参数中获取到的任务内容。
     * @return {Promise<void>}
     */
    async function edit(n, content) {
        if (checkNum(n) && checkTaskExist(n, list)) {
            const task = list[n];

            if (typeof content === 'undefined') {
                console.log(tips.origin_content_is, task.content);
                task.content = await ask(tips.please_input_content);
            } else {
                task.content = content;
            }
        }
    }

    /**
     * 标记任务为已完成。
     * @param n 要标记为完成的任务序号。
     */
    function undone(n) {
        if (checkNum(n) && checkTaskExist(n, list)) list[n].status = false;
    }

    /**
     * 向上移动任务。
     * @param n 要向上移动的任务序号。
     * @param n1 要移动的步数。
     */
    function moveup(n, n1) {
        if (checkNum(n) && checkStep(n1) && checkTaskExist(n, list)) {
            let idx = n - n1;
            idx = idx < 0 ? 0 : idx;
            let task = list.splice(n, 1);
            list.splice(idx, 0, ...task);
        }
    }

    /**
     * 向下移动任务。
     * @param n 要向下移动的任务序号。
     * @param n1 要移动的步数。
     */
    function movedown(n, n1) {
        if (checkNum(n) && checkStep(n1) && checkTaskExist(n, list)) {
            let idx = n + n1;
            idx = idx > list.length ? list.length : idx;
            let task = list.splice(n, 1);
            list.splice(idx, 0, ...task);
        }
    }

    /**
     * 清除所有任务。
     * @return {Promise<boolean>}
     */
    async function clearall() {
        let answer = await ask(tips.are_you_sure_clear_all);

        answer = answer.toLowerCase();

        if (['n', 'no'].includes(answer)) return false;
        else if (['y', 'yes'].includes(answer)) {
            list = [];
            return true;
        }
    }


    /* ================ common func ================ */


    /**
     * 检查任务内容是否填写。
     * @param content 任务内容。
     * @return {boolean} true
     */
    function checkContent(content) {
        if (typeof content === 'undefined') {
            console.log(tips.no_content_err);
            process.exit(0);
        }

        return true;
    }

    /**
     * 检查任务序号是否合法。
     * @param n 任务序号。
     * @return {boolean} true
     */
    function checkNum(n) {
        if (Number.isNaN(n)) {
            console.log(tips.num_err);
            process.exit(0);
        }

        return true;
    }

    /**
     * 检查列表中是否存在对应序号的任务。
     * @param n 任务序号。
     * @param list 任务列表。
     * @return {boolean} true
     */
    function checkTaskExist(n, list) {
        if (typeof list[n] === 'undefined') {
            console.log(tips.task_no_exist_err);
            process.exit(0);
        }

        return true;
    }

    /**
     * 检查移动步数是否合法。
     * @param n1 移动步数。
     * @return {boolean} true
     */
    function checkStep(n1) {
        if (Number.isNaN(n1)) {
            console.log(tips.step_err);
            process.exit(0);
        }

        return true;
    }

    /**
     * 命令行提问互动。
     * @param question 问题。
     * @return {Promise<Promise>}  异步 Promise 对象。
     */
    function ask(question) {
        return new Promise(resolve => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                prompt: question
            });

            rl.prompt();

            rl.on('line', (line) => {
                if (0 === line.length) rl.prompt();
                else {
                    resolve(line);
                    rl.close();
                }
            });
        });
    }
})();
