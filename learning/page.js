const fs = require('fs')
const replace = require('./replace')
module.exports = {
    index(res) {
        replace.find(res);
    },
    other(url, res) {
        fs.readFile('.' + url, (err, data) => {
            if (!err) {
                res.end(data);
            }
        })
    },
    add(res) {
        fs.readFile('./view/add.html', (err, data) => {
            if (!err) {
                res.end(data);
            }
        })
    },
    getone(id, res) {
        replace.show(id, res);
    },
    replace(id, res) {
        replace.replace(id, res);
    },
    del(id, res) {
        fs.readFile('./db.json', 'utf8', (err, data) => {
            var lis = JSON.parse(data);

            for (var i = 0; i < lis.length; i++) {
                if (lis[i].id == id) {
                    lis.splice(i, 1);
                    fs.writeFile('./db.json', JSON.stringify(lis, null, 4), err => 0);
                    res.setHeader('Content-Type', 'text/html; charset=utf-8');
                    res.end('<script>alert("删除成功");location.href="/"</script>');
                    // res.end('123');
                }
            }
        })
    }

}