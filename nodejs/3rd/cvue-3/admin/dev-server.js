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

require('./../../../../assets/3rd/odl-3/odl')
require('./../../../../assets/3rd/odl-3/odl_n_mysql')
require('./../../../../assets/3rd/odl-3/odl_n_vue')
require('./../../../../assets/3rd/odl-3/odl_n_token')
require('./../../../../assets/projects/default/odl/department')
require('./../../../../assets/projects/default/odl/role_group')
require('./../../../../assets/projects/default/odl/user')
require('./../../../../assets/projects/default/odl/material')
require('./../../../../assets/projects/default/odl/position')
require('./../../../../assets/projects/default/odl/reader')
require('./../../../../assets/projects/default/odl/status')
require('./../../../../assets/projects/default/odl/recording')

let webpackConfig = require('./webpack.dev.conf')
let unmock = require('./unmock/unmock')

// default port where dev server listens for incoming traffic
let port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
let autoOpenBrowser = !!config.dev.autoOpenBrowser

let app = express()
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

// suport mysql
let HttpMysqlServer = require('./../../csm-3/http_mysql_server')
let httpMysqlServer = null
if (process.env.CVUEADMIN_MYSQL_CONFIG_FP) {
    let mysqlConfig = require(process.env.CVUEADMIN_MYSQL_CONFIG_FP)
    if (mysqlConfig.database && mysqlConfig.database.mysql1) {
        httpMysqlServer = new HttpMysqlServer(mysqlConfig.database.mysql1)
    }
    else {
        console.log('CVUEADMIN_MYSQL_CONFIG_FP is invalid : ', process.env.CVUEADMIN_MYSQL_CONFIG_FP)
    }
}

unmock.initApp(app, httpMysqlServer)

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
let staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

let uri = 'http://localhost:' + port

let _resolve
let readyPromise = new Promise(resolve => {
    _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }
    _resolve()
})

// GET method route
let server = app.listen(port)

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
}
