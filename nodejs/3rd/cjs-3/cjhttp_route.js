'use strict';

let http = require('http');
require('./cjinterinfo_lang.js');
require('./cjstring_lang.js');

exports = module.exports = Route;

let toString = Object.prototype.toString;

function Route() {
    this.stack = [];
}

// [ 'get', 'post', 'put', 'head', 'delete' ]
Route.methods = function() {
    return http.METHODS && http.METHODS.map(function lowerCaseMethod(method) {
        return method.toLowerCase();
    });
}();
Route.methods.push('all');

Route.methods.forEach(function(method) {
    Route.prototype[method] = function(path, handle) {
        // cjs.debug('Route %s %s', method, this.path);
        let layer = new Layer(method, path, handle);
        // cjs.debug('Layer.isValid=', layer.isValid);
        // this.methods[method] = true;
        this.stack.push(layer);
        return layer.isValid;
    };
});

Route.prototype.handle = function handle(req, res, out) {
    // cjs.debug('Route %s %s', req.method, req.url);
    let self = this;
    let stack = self.stack;
    let layer;
    let path = req.url;
    let method = req.method;
    let match = false;
    let idx = 0;
    while (match !== true && idx < stack.length) {
        layer = stack[idx++];
        match = layer.match(method, path);
        if (match) {
            layer.handle_request(req, res, out);
        }
    }
    return match;
};

function Layer(method, path, handle) {
    let regexp = typeof path === 'string' ? new RegExp(path) : null;
    if (regexp === null && path instanceof RegExp) regexp = path;
    let bIsValid = typeof method === 'string' && (typeof path === 'string' || path instanceof RegExp) && typeof handle === 'function';
    let bMethodIsAll = cjs.CjString.equalCase(method, 'all');
    let bPathIsAll = path === '/';
    let sErrorMsg = bIsValid ? '' : 'method:' + toString.call(method);
    this.method = method;
    this.path = path;
    this.handle = handle;
    this.regexp = regexp ? regexp : new RegExp('');
    this.methodIsAll = bMethodIsAll;
    this.pathIsAll = bPathIsAll;
    this.errorMsg = sErrorMsg;
    this.isValid = bIsValid;
}

Layer.prototype.handle_request = function handle(req, res, out) {
    let fn = this.handle;

    if (fn.length > 2) {
        if (typeof out === 'function') out('handle_request fn.length>2');
        return;
    }

    try {
        fn(req, res);
    } catch (err) {
        if (typeof out === 'function') out(err);
    }
};

Layer.prototype.match = function match(method, path) {
    let bMethod = this.isValid && (this.methodIsAll || (typeof method === 'string' && method.toLowerCase() === this.method));
    return bMethod && (this.pathIsAll || this.regexp.test(path));
};
