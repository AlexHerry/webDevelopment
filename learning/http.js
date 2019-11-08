// 创建http服务器

const http = require('http');
var server = http.createServer();

server.listen(80, () => {
    console.log('IP:127.0.0.1; PORT:80');
})

const start = require('./router');
start.request(server);