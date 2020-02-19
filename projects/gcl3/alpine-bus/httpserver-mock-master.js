'use strict';

let path = require('path');
let http = require('http');
const querystring = require('querystring');

let getContentDisposition = function(data) {
    let ss = data.split('\r\n');
    for (let i = 0; i < ss.length; i++) {
        let s = ss[i];
        let index = s.indexOf('name=');

    }
};

let server = http.createServer(function(req, res) {
    console.log(req);

    if (req.url.startsWith('/upload') && req.method.toLowerCase() === 'post') {
        let data = '';

        // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到data变量中
        req.on('data', function(chunk){
            data += chunk;
        });

        // 在end事件触发后，解释请求体，取出sql语句，然后向客户端返回。
        req.on('end', function() {
            let ss = data.match(/(file\.[^]*?[\S]*?--)/g);
            let fileInfo = {};
            ss.map(s => s.replace(/[ \f\n\r\t\v\-]/g, "")).forEach(s => {
                let a = s.split('"');
                if (a.length > 1) {
                    if (a[0] === 'file.size') {
                        fileInfo[a[0]] = Number(a[1]);
                    }
                    else {
                        fileInfo[a[0]] = a[1];
                    }
                }
            });
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end("OK, i am ---");
        })
    }

});

server.on('checkContinue', function(req, res) {
    let msg = 'step checkContinue' + Date();
    res.writeContinue();
    console.log(msg);
});

server.on('clientError', (err, socket) => {
    let msg = 'step clientError' + Date();
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    console.log(msg);
});

server.on('close', function() {
    let msg = 'step close' + Date();
    console.log(msg);
});

server.on('connect', function(req, socket, firstBodyChunk) {
    let msg = 'step connect' + Date();
    console.log(msg);
});

server.on('connection', function(connection) {
    let msg = 'step connection' + Date();
    console.log(msg);
});

server.on('upgrade', function(req, socket, head) {
    let msg = 'step upgrade' + Date();
    console.log(msg);
});

server.listen(2292);
console.log('http://localhost:%s', 2292);
