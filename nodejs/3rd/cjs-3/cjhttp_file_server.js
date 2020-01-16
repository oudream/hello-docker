'use strict';

let url = require('url');
let fs = require('fs');
let path = require('path');
let zlib = require('zlib');

exports = module.exports = FileServer;

function FileServer() {
    this.config = {
        expires: {
            fileMatch: /^(gif|png|jpg|js|css)$/ig,
            maxAge: 60 * 60 * 24 * 365,
        },

        compress: {
            match: /css|html/ig,
        },

        assetsPath: process.cwd(),

        homePage: 'index.html',

        notFoundPage: 'error.html',

    };
}

FileServer.mime = {
    'css': 'text/css',
    'gif': 'image/gif',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript',
    'json': 'application/json',
    'pdf': 'application/pdf',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'swf': 'application/x-shockwave-flash',
    'tiff': 'image/tiff',
    'txt': 'text/plain',
    'wav': 'audio/x-wav',
    'wma': 'audio/x-ms-wma',
    'wmv': 'video/x-ms-wmv',
    'xml': 'text/xml',
};

FileServer.parseRange = function(str, size) {
    if (str.indexOf(',') != -1) {
        return;
    }

    let range = str.split('-'),
        start = parseInt(range[0], 10),
        end = parseInt(range[1], 10);

    // Case: -100
    if (isNaN(start)) {
        start = size - end;
        end = size - 1;
        // Case: 100-
    } else if (isNaN(end)) {
        end = size - 1;
    }

    // Invalid
    if (isNaN(start) || isNaN(end) || start > end || end > size) {
        return;
    }

    return {start: start, end: end};
};

FileServer.prototype.dispatch = function(request, response) {
    let config = this.config;

    response.setHeader('Server', 'HttpFileServer-Node');
    response.setHeader('Accept-Ranges', 'bytes');
    let pathname = url.parse(request.url).pathname;
    console.log(pathname);
    if (pathname.slice(-1) === '/') {
        pathname = pathname + config.homePage;
    }
    let realPath = path.join(config.assetsPath, path.normalize(pathname.replace(/\.\./g, '')));

    let pathHandle = function(realPath) {
        fs.stat(realPath, function(err, stats) {
            if (err) {
                response.writeHead(404, 'Not Found', {'Content-Type': 'text/plain'});
                response.write('This request URL ' + pathname + ' was not found on this server.');
                response.end();
            } else {
                if (stats.isDirectory()) {
                    realPath = path.join(realPath, '/', config.homePage);
                    pathHandle(realPath);
                } else {
                    let ext = path.extname(realPath);
                    ext = ext ? ext.slice(1) : 'unknown';
                    let contentType = FileServer.mime[ext] || 'text/plain';
                    response.setHeader('Content-Type', contentType);
                    // response.setHeader('Content-Length', stats.size);

                    let lastModified = stats.mtime.toUTCString();
                    let ifModifiedSince = 'If-Modified-Since'.toLowerCase();
                    response.setHeader('Last-Modified', lastModified);

                    if (ext.match(config.expires.fileMatch)) {
                        let expires = new Date();
                        expires.setTime(expires.getTime() + config.expires.maxAge * 1000);
                        response.setHeader('Expires', expires.toUTCString());
                        response.setHeader('Cache-Control', 'max-age=' + config.expires.maxAge);
                    }

                    if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
                        response.writeHead(304, 'Not Modified');
                        response.end();
                    } else {
                        let compressHandle = function(raw, statusCode, reasonPhrase) {
                            let stream = raw;
                            let acceptEncoding = request.headers['accept-encoding'] || '';
                            let matched = ext.match(config.compress.match);

                            if (matched && acceptEncoding.match(/\bgzip\b/)) {
                                response.setHeader('Content-Encoding', 'gzip');
                                stream = raw.pipe(zlib.createGzip());
                            } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                                response.setHeader('Content-Encoding', 'deflate');
                                stream = raw.pipe(zlib.createDeflate());
                            }
                            response.writeHead(statusCode, reasonPhrase);
                            stream.pipe(response);
                        };

                        if (request.headers['range']) {
                            let range = FileServer.parseRange(request.headers['range'], stats.size);
                            if (range) {
                                response.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + stats.size);
                                response.setHeader('Content-Length', (range.end - range.start + 1));
                                let raw = fs.createReadStream(realPath, {'start': range.start, 'end': range.end});
                                compressHandle(raw, 206);
                            } else {
                                response.removeHeader('Content-Length');
                                response.writeHead(416);
                                response.end();
                            }
                        } else {
                            let raw = fs.createReadStream(realPath);
                            compressHandle(raw, 200);
                            // console.log(realPath)
                        }
                    }
                }
            }
        });
    };

    pathHandle(realPath);
};

