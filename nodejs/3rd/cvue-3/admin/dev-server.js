require('./check-versions')()

if (!process.env.CVUEADMIN_CONFIG_P) {
    throw new Error('process.env.CVUEADMIN_CONFIG_P is invalid! ' + __filename)
}

let config = require(process.env.CVUEADMIN_CONFIG_P)
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

let opn = require('opn')
let path = require('path')
let express = require('express')
let webpack = require('webpack')
let proxyMiddleware = require('http-proxy-middleware')

let webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
let port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
let autoOpenBrowser = !!config.dev.autoOpenBrowser

let compiler = webpack(webpackConfig)

let devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})

let hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {
    }
})
// force page reload when html-webpack-plugin template changes
compiler.hooks.compilation.tap('html-webpack-plugin-after-emit', () => {
    hotMiddleware.publish({
        action: 'reload'
    });
});

let DevServer = function() {
    let _resolve;
    let readyPromise = new Promise(resolve => {
        _resolve = resolve
    });

    this._resolve = _resolve;
    this.ready = readyPromise;
};

DevServer.prototype.init = function(httpServer, db) {

    // handle fallback for HTML5 history API
    httpServer.use(require('connect-history-api-fallback')());

    // serve webpack bundle output
    httpServer.use(devMiddleware)

    // enable hot-reload and state-preserving
    // compilation error display
    httpServer.use(hotMiddleware)

    // serve pure static assets
    let staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
    httpServer.use(staticPath, express.static('./static'))

    let uri = 'http://localhost:' + port;

    console.log('> Starting dev server...');
    devMiddleware.waitUntilValid(() => {
        console.log('> Listening at ' + uri + '\n')
        // when env is testing, don't need open it
        if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
            opn(uri)
        }
        this._resolve()
    });
};

exports = module.exports = DevServer;
