'use strict';

const path = require('path');
const fs = require('fs');

const DB = require('./db');

process.env.PROJECT_CONFIG_FP = path.resolve(__dirname, './simple.json');

// project config
let projectConfig = require(process.env.PROJECT_CONFIG_FP);

// projectConfig.spec.databases
// interface : [ dealRequest ] : projectConfig.spec.item
let _configDbs = projectConfig.spec.databases;
if (Array.isArray(_configDbs)) {
    for (let i = 0; i < _configDbs.length; i++) {
        let database = _configDbs[i];
        if (database.type === 'mysql') {
            // suport mysql
            let HttpMysqlServer = require('./../../../nodejs/3rd/csm-3/http_mysql_server');
            let httpMysqlServer = new HttpMysqlServer(database);
            database.dealRequest = httpMysqlServer.dealRequest;
        }
    }
}

// projectConfig.spec.httpServers
let _configHttpServers = projectConfig.spec.httpServers;
if (Array.isArray(_configHttpServers) && _configHttpServers.length>0) {
    let HttpServer = require('./../../../nodejs/3rd/csm-3/http_server.js');
    for (let i = 0; i < _configHttpServers.length; i++) {
        let httpServer = _configHttpServers[i];
        let listeningPort = httpServer.listeningPort;
        if (typeof listeningPort === 'number') {
            let routes = httpServer.routes;
            let hs = new HttpServer({
                port: listeningPort,
                staticAssetsPath: httpServer.staticAssetsPath ? path.resolve(__dirname, httpServer.staticAssetsPath) : path.resolve(__dirname, './../../assets'),
            });
            if (Array.isArray(routes)) {
                for (let j = 0; j < routes.length; j++) {
                    let route = routes[i];
                    if (! route.specItem) continue;
                    if (! route.name) continue;
                    if (! route.url) continue;
                    let specItem = projectConfig.spec[route.specItem];
                    if (Array.isArray(specItem)) {
                        let ele = specItem.find(function(element) {
                            if (element.name && element.name === route.name) {
                                return element;
                            }
                        });
                        if (ele && ele.dealRequest) {
                            hs.route.all(route.url, ele.dealRequest);
                            console.log('httpServer : ', listeningPort, ' , route : ', route.url)
                        }
                    }
                }
            }
        }
    }
}

