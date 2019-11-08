const http = require('http');
const server = http.createServer();
const reurl = require('url');
const fs = require('fs');

server.listen(80);

server.on('request', (req, res) => {
    var method = req.method;
    var url = reurl.parse(req.url);
    if (method == 'GET') {
        if (url.pathname == '/show') {
            // res.end('4444')
            fs.readFile('./show.html', 'utf8', function (err, data) {
                if (!err) {
                    // console.log(data);
                    res.end(data);
                }
            })
        } else if (url.pathname == '/replace') {
            fs.readFile('./replace.html', 'utf8', function (err, data) {
                if (!err) {
                    res.end(data);
                }
            })
        } else if (url.pathname == '/add') {
            fs.readFile('./add.html', 'utf8', function (err, data) {
                if (!err) {
                    res.end(data);
                }
            })
        } else {
            fs.readFile('.' + url.pathname, (err, data) => {
                res.end(data);
            })
        }
    }
})