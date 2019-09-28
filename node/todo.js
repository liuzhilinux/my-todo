(function () {
    const fs = require('fs');
    const path = require('path');
    const argv = process.argv;

    const dbPath = __dirname + path.sep + 'db';

    const verb = argv[2];
    const content = argv[3];
    const content1 = argv[4];

    var list = [];

    init();

    switch (verb) {
        case 'add':
            add(content);
            save();
            display();
            break;

    }

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

})();
