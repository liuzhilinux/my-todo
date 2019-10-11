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

            break;

        case 'movedown':

            break;

        case 'clearall':

            break;

        default:
            console.log('你的动作是： ' + verb);
            console.log('我不知道你想干什么~');
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
            console.log('输入的内容为空.');
            process.exit(0);
        }

        list.push({content, status: false});
    }

    function done(n) {
        if (Number.isNaN(n)) {
            console.log('未指定需要被标记为完成的任务序号.');
            process.exit(0);
        }

        if (list[n]) list[n].status = true;
    }

    function del(n) {
        if (Number.isNaN(n)) {
            console.log('未指定需要被删除的任务序号.');
            process.exit(0);
        }

        if (list[n]) list.splice(n, 1);
    }

    async function edit(n, content) {
        if (Number.isNaN(n)) {
            console.log('未指定需要被编辑的任务序号.');
            process.exit(0);
        }

        const task = list[n];

        if (typeof task === 'undefined') {
            console.log('要编辑的任务不存在.');
            process.exit(0);
        }

        if (typeof content === 'undefined') {
            console.log('原内容是：', task.content);
            task.content = await question('请输入要修改的内容：');
            console.log(task.content);
        } else {
            task.content = content;
        }
    }

    function undone(n) {
        if (Number.isNaN(n)) {
            console.log('未指定需要被标记为未完成的任务序号.');
            process.exit(0);
        }

        if (list[n]) list[n].status = false;
    }

    function question(query) {
        return new Promise(resolve => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                prompt: query
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
