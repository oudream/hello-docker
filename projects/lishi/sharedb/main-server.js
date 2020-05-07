const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');

// vue admin package filepath
process.env.CVUE3_WEB_P  = path.resolve(__dirname, './../../../assets/lishi/sharedb');
process.env.CVUE3_NODE_P  = __dirname;
process.env.CVUE3_ROOT_P  = path.resolve(__dirname, './../../..');

let config = require(path.resolve(process.env.CVUE3_NODE_P, './config'))

const odlLoader = require('./odl-loader');
const unmock = require('./unmock');

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


// default options
app.use(fileUpload());

app.post('/upload', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file1 = req.files.file;
    let bn = path.basename(file1.name);
    let p = path.resolve(path.dirname(process.argv[1]), "static/images");
    let pre = Date.now().toString() + '-' + Math.round(Math.random() * 1000000) + "-" + bn;
    // Use the mv() method to place the file somewhere on your server
    file1.mv(path.resolve(p, pre), function(err) {
        if (err)
            return res.status(500).send(err);

        res.send(pre);
    });
});

let db = httpMysqlServer;
let httpServer = app;

httpServer.use(express.static(__dirname));
// let staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
// httpServer.static(staticPath, express.static('./static'))

unmock.init(httpServer, db);
odlLoader.init(httpServer, db);

// default port where dev server listens for incoming traffic
let port = process.env.PORT || config.dev.port;

// GET method route
let server = httpServer.listen(port, '0.0.0.0');
console.log('http://localhost:'+port)
