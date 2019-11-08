const fs = require('fs');
const formidable = require('formidable');


module.exports = {
    all(res) {
        fs.readFile('./db.json', (err, data) => {
            res.end(data);
        })
    },
    del(id, res) {
        // console.log(id);
        fs.readFile('./db.json', (err, data) => {
            if (!err) {
                var lis = JSON.parse(data);
                for (var i = 0; i < lis.length; i++) {
                    if (id == lis[i].id) {
                        lis.splice(i, 1);
                        fs.writeFile('./db.json', JSON.stringify(lis, null, 4), err => 0);
                        res.end('OK');
                    }
                }
            }
        })
    },
    show(id, res) {
        fs.readFile('./db.json', (err, data) => {
            if (!err) {
                var lis = JSON.parse(data);
                for (var i = 0; i < lis.length; i++) {
                    if (id == lis[i].id) {
                        res.end(JSON.stringify(lis[i]));
                    }
                }
            }
        })
    },
    replace(req, res) {
        var form = new formidable.IncomingForm();
        form.uploadDir = './temp'
        form.parse(req, (err, fields, files) => {
            // console.log(err);
            if (!err) {
                fs.readFile('./db.json', 'utf-8', (err, data) => {
                    if (!err) {
                        var lis = JSON.parse(data);
                        for (var i = 0; i < lis.length; i++) {
                            if (fields.id == lis[i].id) {
                                // console.log(fields)
                                lis[i].id = fields.id;
                                lis[i].name = fields.name;
                                lis[i].nengli = fields.nengli;
                                lis[i].jituan = fields.jituan;
                                if (files.img.name != '') {
                                    lis[i].img = files.img.name;
                                    fs.rename(files.img.path, './img/' + files.img.name, err => 0)
                                }

                                fs.writeFile('./db.json', JSON.stringify(lis, null, 4), err => 0);
                                res.end('<script>location.href="/"</script>');
                            }
                        }
                    }
                })
            }
        })
    },
    add(req, res) {
        var form = new formidable.IncomingForm();
        form.uploadDir = './temp'
        form.parse(req, (err, fields, files) => {
            if (!err) {
                fs.readFile('./db.json', 'utf-8', (err, data) => {
                    if (!err) {
                        var lis = JSON.parse(data);
                        fields.id = lis.length + 1;
                        fields.img = files.img.name;
                        lis.push(fields);
                        fs.rename(files.img.path, './img/' + files.img.name, err => 0);
                        fs.writeFile('./db.json', JSON.stringify(lis, null, 4), (err) => 0);
                        res.end('OK');
                    }
                })
            }
        })
    }
}