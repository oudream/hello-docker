'use strict';

let path = require('path');
let http = require('http');
const querystring = require('querystring');

let server = http.createServer(function(req, res) {
    console.log(req);
    res.end("OK, i am ---");
});

// this.route.all(/\/(.){0,}.cgi/, function (req, res) {
//    res.end('Hello World!');
// });

// this.route.all(/^\/upload/, function (req, res) {
//     let form = new formidable.IncomingForm(),
//         files = [],
//         fields = [];
//
//     form.uploadDir = os.tmpdir();
//
//     form
//         .on('field', function(field, value) {
//             console.log(field, value);
//             fields.push([field, value]);
//         })
//         .on('file', function(field, file) {
//             console.log(field, file);
//             files.push([field, file]);
//         })
//         .on('end', function() {
//             console.log('-> upload done');
//             res.writeHead(200, {'content-type': 'text/plain'});
//             res.write('received fields:\n\n '+util.inspect(fields));
//             res.write('\n\n');
//             res.end('received files:\n\n '+util.inspect(files));
//         });
//     form.parse(req);
// });

// this.route.all(/\/(.){0,}.sql/, function (req, res) {
//
//
//     // 定义了一个data变量，用于暂存请求体的信息
//     let data = '';
//
//     // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到data变量中
//     req.on('data', function(chunk){
//         data += chunk;
//     });
//
//     // 在end事件触发后，解释请求体，取出sql语句，然后向客户端返回。
//     req.on('end', function(){
//         // data = querystring.parse(data);
//         data = JSON.parse(data);
//         console.log(data);
//         res.writeHead(200, {'Content-Type': 'text/plain'});
//         res.end();
//     });
//
// });

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

server.listen(8080);
console.log('http://localhost:%s', 8080);
