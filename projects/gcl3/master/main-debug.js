const path = require('path');
const fs = require('fs-extra');

// vue admin package filepath
process.env.CVUE3_WEB_P  = path.resolve(__dirname, './../../../assets/gcl3/master');
process.env.CVUE3_NODE_P  = __dirname;
process.env.CVUE3_ROOT_P  = path.resolve(__dirname, './../../..');

let config = require(path.resolve(process.env.CVUE3_NODE_P, './config'))

const DevServer = require('./../../../nodejs/3rd/cvue-3/admin/dev-server');
const odlLoader = require('./odl-loader');
const unmock = require('./unmock');
const DockerServer = require('./docker-server');

global.EventBus = global.EventBus || require('./event-bus');

let express = require('express')
let app = express()

const HttpMysqlServer = require('./../../../nodejs/3rd/csm-3/http_mysql_server')
let httpMysqlServer = null
if (path.resolve(__dirname, './master.json')) {
    let mysqlConfig = require(path.resolve(__dirname, './master.json'))
    if (mysqlConfig.database && mysqlConfig.database.mysql1) {
        httpMysqlServer = new HttpMysqlServer(mysqlConfig.database.mysql1)
    }
    else {
        console.log('CVUEADMIN_MYSQL_CONFIG_FP is invalid : ', path.resolve(__dirname, './master.json'))
    }
}

let db = httpMysqlServer;
let httpServer = app;
let devServer = new DevServer();
let dockerServer = new DockerServer();

unmock.init(httpServer, db);
odlLoader.init(httpServer, db);
devServer.init(httpServer, db);
dockerServer.init(httpServer, db);
dockerServer.start();

// default port where dev server listens for incoming traffic
let port = process.env.PORT || config.dev.port;

// GET method route
let server = httpServer.listen(port, '0.0.0.0');
