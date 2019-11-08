const fs = require('fs');
const template = require('art-template');
template.defaults.root = './view';
module.exports = {
    find(res) {
        fs.readFile('./db.json', 'utf8', (err, data) => {
            if (!err) {
                var db_data = JSON.parse(data);
                var html = template('./index.html', {
                    db_data
                });
                //     var html = ``;
                //     for (var i = 0; i < db_data.length; i++) {
                //         html += `<tr>
                //                         <td>${db_data[i].id}</td>
                //                         <td>${db_data[i].name}</td>
                //                         <td>${db_data[i].nengli}</td>
                //                         <td>${db_data[i].jituan}</td>
                //                         <td><img src='../img/${db_data[i].img}'</td>
                //                         <td>
                //                             <a href="#">查看</a> 
                //                             <a href="#">修改</a>
                //                             <a href="#">删除</a>
                //                         </td>
                //                         </tr>`
                //     }
                //     var reg = /{hh}/;
                //     var new_data = da.replace(reg, html);
                res.end(html);
            }
        })
    },
    show(id, res) {
        fs.readFile('./db.json', 'utf8', (err, data) => {
            if (!err) {
                var db_data = JSON.parse(data);
                var a;
                for (var i = 0; i < db_data.length; i++) {
                    if (id == db_data[i].id) {
                        var a = db_data[i];
                    }
                }
                var html = template('./getone.html', a);
                res.end(html);
            }
        })
    },
    replace(id, res) {
        fs.readFile('./db.json', 'utf8', (err, data) => {
            if (!err) {
                var db_data = JSON.parse(data);
                var a;
                for (var i = 0; i < db_data.length; i++) {
                    if (id == db_data[i].id) {
                        var a = db_data[i];
                    }
                }
                var html = template('./replace.html', a);
                res.end(html);
            }
        })
    }
}