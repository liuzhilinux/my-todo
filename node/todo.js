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

    function save() {
        fs.writeFileSync(dbPath, JSON.stringify(list));
    }

    function display() {
        console.log('');
        let idxLen = String(list.length).length;
        list.forEach((item, idx) => {
            idx = String(idx + 1);
            let space = ' '.repeat(idxLen - idx.length);
            let status = item.status ? '[x]' : '[_]';
            let content = item.content;

            console.log(space + idx + '. ' + status + ' ' + content);
        });
    }

    function add(content) {
        if (checkContent(content)) list.push({content, status: false});
    }

    function done(n) {
        if (checkNum(n) && checkTaskExist(n, list)) list[n].status = true;
    }

    function del(n) {
        if (checkNum(n) && checkTaskExist(n, list)) list.splice(n, 1);
    }

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

    function undone(n) {
        if (checkNum(n) && checkTaskExist(n, list)) list[n].status = false;
    }

    function moveup(n, n1) {
        if (checkNum(n) && checkStep(n1) && checkTaskExist(n, list)) {
            let idx = n - n1;
            idx = idx < 0 ? 0 : idx;
            let task = list.splice(n, 1);
            list.splice(idx, 0, ...task);
        }
    }

    function movedown(n, n1) {
        if (checkNum(n) && checkStep(n1) && checkTaskExist(n, list)) {
            let idx = n + n1;
            idx = idx > list.length ? list.length : idx;
            let task = list.splice(n, 1);
            list.splice(idx, 0, ...task);
        }
    }

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


    function checkContent(content) {
        if (typeof content === 'undefined') {
            console.log(tips.no_content_err);
            process.exit(0);
        }

        return true;
    }

    function checkNum(n) {
        if (Number.isNaN(n)) {
            console.log(tips.num_err);
            process.exit(0);
        }

        return true;
    }

    function checkTaskExist(n, list) {
        if (typeof list[n] === 'undefined') {
            console.log(tips.task_no_exist_err);
            process.exit(0);
        }

        return true;
    }

    function checkStep(n1) {
        if (Number.isNaN(n1)) {
            console.log(tips.step_err);
            process.exit(0);
        }

        return true;
    }

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
