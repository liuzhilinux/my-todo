(function () {
    const fs = require('fs');
    const path = require('path');
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

            break;

        case 'undone':

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

    if ('list' !== verb) save();

    display();


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
        list.push({content, status: false});
    }

    function done(n) {
        if (list[n]) list[n].status = true;
    }

    function del(n) {
        if (list[n]) list.splice(n, 1);
    }
})();
