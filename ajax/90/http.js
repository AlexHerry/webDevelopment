const http = require('http');
const server = http.createServer();
const reurl = require('url');
const querystring = require('querystring');
const fs = require('fs');

const route = require('./route');

server.listen(90);

server.on('request', (req, res) => {
    var method = req.method;
    var url = reurl.parse(req.url);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET,POST,PUT,DELETE');
    // console.log(url.pathname);   
    if (url.pathname == '/all') {
        route.all(res);
    } else if (url.pathname == '/del') {
        route.del(querystring.parse(url.query).id, res);
    } else if (url.pathname == '/show') {
        route.show(querystring.parse(url.query).id, res);
    } else if (url.pathname == '/replace') {
        // console.log(url.pathname);
        route.replace(req, res);
    } else if (url.pathname == '/add') {
        route.add(req, res);
    } else {
        fs.readFile('.' + url.pathname, (err, data) => {
            res.end(data);
        })
    }
})