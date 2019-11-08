const page = require('./page');
// const querystring = require('querystring')
const fdm = require('formidable');
const url = require('url');
const fs = require('fs');
module.exports = {
    // 接收对象
    // 绑定事件
    request(server) {
        server.on('request', (req, res) => {
            var method = req.method;
            var reurl = url.parse(req.url, true).pathname;
            var id = url.parse(req.url, true).query;
            // var host = req.headers.host
            if (method == 'GET') {
                if (reurl == '/') {
                    page.index(res);
                } else if (reurl == '/add') {
                    page.add(res);
                } else if (reurl == '/getone') {
                    page.getone(id.id, res);
                } else if (reurl == '/replace') {
                    page.replace(id.id, res);
                } else if (reurl == '/del') {
                    page.del(id.id, res);
                } else {
                    page.other(reurl, res);
                }
            } else if (method == 'POST') {
                if (reurl == '/add') {
                    var fl = new fdm.IncomingForm();
                    fl.uploadDir = './Temp';
                    fl.parse(req, (err, fields, files) => {
                        if (!err) {
                            var a = Math.random()
                            var suf = files.img.name.split('.');
                            fs.readFile('./db.json', 'utf8', (err, data) => {
                                if (!err) {
                                    var lis = JSON.parse(data);
                                    fs.rename(files.img.path, './img/' + a + lis.length + 1 + '.' + suf[suf.length - 1], (err) => 0);
                                    var lis_2 = fields;
                                    lis_2.id = lis.length + 1;
                                    lis_2.img = '' + a + lis.length + 1 + '.' + suf[suf.length - 1];
                                    lis.push(lis_2);
                                    fs.writeFile('./db.json', JSON.stringify(lis, null, 4), (err) => 0)
                                }
                            })
                        }
                    })
                    res.end('<script>location.href="/"</script>');
                } else if (reurl == '/replace') {
                    var fl = new fdm.IncomingForm();
                    fl.uploadDir = './Temp';
                    fl.parse(req, (err, fields, files) => {
                        if (!err) {
                            fs.readFile('./db.json', 'utf8', (err, data) => {
                                if (!err) {
                                    var lis = JSON.parse(data);
                                    var lis_2 = fields;
                                    var suf = files.img.name.split('.');
                                    var num = Math.random();
                                    for (var i = 0; i < lis.length; i++) {
                                        if (lis_2.id == lis[i].id) {
                                            if (files.img.name != '') {
                                                fs.rename(files.img.path, './img/' + num + lis_2.id + '.' + suf[suf.length - 1], (err) => 0);
                                                if (lis[i].img != '') {
                                                    fs.unlink('./img/' + lis[i].img, err => 0);
                                                }
                                            }
                                            lis[i] = lis_2;
                                            if (files.img.name != '') {
                                                lis[i].img = '' + num + lis_2.id + '.' + suf[suf.length - 1];
                                            }
                                        }
                                    }
                                    fs.writeFile('./db.json', JSON.stringify(lis, null, 4), (err) => 0)
                                }
                            })
                        }
                    })
                    res.end('<script>location.href="/"</script>');
                } else {
                    res.end('error');
                }
            } else {
                console.log('error');
                res.end('error');
            }
        })
    }
}