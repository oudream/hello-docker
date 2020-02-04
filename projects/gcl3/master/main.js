const path = require('path');
const fs = require('fs');

// vue admin package filepath
process.env.CVUEADMIN_PROJECT_P = path.resolve(__dirname, './../../../assets/gcl3/master');
process.env.CVUEADMIN_PACKAGE_FP = path.resolve(__dirname, './package.json');
process.env.CVUEADMIN_CONFIG_P = path.resolve(__dirname, './cvue-admin');
process.env.CVUEADMIN_MYSQL_CONFIG_FP = path.resolve(__dirname, './master.json');
process.env.CVUEADMIN_INDEX_PAGE_FP = path.resolve(__dirname, './cvue-admin/index.html');

let config = require(process.env.CVUEADMIN_CONFIG_P)

const DevServer = require('./../../../nodejs/3rd/cvue-3/admin/dev-server');
const odlLoader = require('./odl-loader');
const unmock = require('./unmock');
const DockerServer = require('./docker-server');

global.EventBus = global.EventBus || require('./event-bus');

let express = require('express')
let app = express()

const HttpMysqlServer = require('./../../../nodejs/3rd/csm-3/http_mysql_server')
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
let server = httpServer.listen(port);
