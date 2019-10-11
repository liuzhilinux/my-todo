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
    };

    var list = [];

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

            break;

        case 'clearall':

            break;

        default:
            console.log(tips.your_verb_is + verb);
            console.log(tips.i_dont_know_what_your_want);
            break;
    }

    if (!['list', 'edit'].includes(verb)) save();

    if (!['edit'].includes(verb)) display();


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
        if (typeof content === 'undefined') {
            console.log(tips.no_content_err);
            process.exit(0);
        }

        list.push({content, status: false});
    }

    function done(n) {
        if (Number.isNaN(n)) {
            console.log(tips.num_err);
            process.exit(0);
        }

        if (list[n]) list[n].status = true;
    }

    function del(n) {
        if (Number.isNaN(n)) {
            console.log(tips.num_err);
            process.exit(0);
        }

        if (list[n]) list.splice(n, 1);
    }

    async function edit(n, content) {
        if (Number.isNaN(n)) {
            console.log(tips.num_err);
            process.exit(0);
        }

        const task = list[n];

        if (typeof task === 'undefined') {
            console.log(tips.task_no_exist_err);
            process.exit(0);
        }

        if (typeof content === 'undefined') {
            console.log(tips.origin_content_is, task.content);
            task.content = await ask(tips.please_input_content);
            console.log('');
        } else {
            task.content = content;
        }
    }

    function undone(n) {
        if (Number.isNaN(n)) {
            console.log(tips.num_err);
            process.exit(0);
        }

        if (list[n]) list[n].status = false;
    }

    function moveup(n, n1) {
        if (Number.isNaN(n)) {
            console.log(tips.num_err);
            process.exit(0);
        }

        if (Number.isNaN(n1)) {
            console.log(tips.step_err);
            process.exit(0);
        }

        if (typeof list[n] === 'undefined') {

        }

        let idx = n - n1;
        idx = idx < 0 ? 0 : idx;
        let task = list.splice(n, 1);
        list.splice(idx, 0, ...task);
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
