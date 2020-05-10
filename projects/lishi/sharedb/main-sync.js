const path = require('path');
const http = require('http');
const https = require('https');
const sqlite3 = require('sqlite3').verbose();

const getHttpOptions = () => {
    return {
        host: 'localhost',
        port: 2293,
        path: '/static/images',
        method: 'GET',
        headers: {
            'POWERED-BY-AID': 'Approve',
            'Content-Type': 'application/json'
        }
    };
};

process.env.CVUE3_WEB_P  = path.normalize(path.resolve(__dirname, './../../../assets/lishi/sharedb'));
process.env.CVUE3_NODE_P  = path.normalize(__dirname);
process.env.CVUE3_ROOT_P  = path.normalize(path.resolve(__dirname, './../../..'));

const deployPath = path.normalize(path.resolve(__dirname, './..'));
const dbFilePath = path.normalize(path.resolve(deployPath, "../alignerchen/lsmasterlite.db"));

function openDatabase(fpDb) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(fpDb, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(db);
            }
        });

    });
}

function sqlQueryOne(db, sql) {
    return new Promise((resolve, reject) => {
        let callback = function(err, row) {
            if (err) {
                reject(err);
            }
            else {
                resolve(row);
            }
        };

        db.get(sql, callback);
    });
}

function sqlQueryAll(db, sql) {
    return new Promise((resolve, reject) => {
        let callback = function(err, rows) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        };

        db.all(sql, callback);
    });
}

async function openDb() {
    let db1 = null;
    await openDatabase(dbFilePath).then(
        db2 => {
            db1 = db2;
        },
        err => {
            console.log(err);
        }
    );
    return db1;
}

/**
 * query one row
 * @param db
 * @param sql
 * @returns {Array / null}
 */
async function queryOne(db, sql) {
    let row1 = null;
    await sqlQueryOne(db, sql).then(
        row2 => {
            row1 = row2;
        },
        err => {
            console.log(err);
        }
    );
    return row1;
}

/**
 * query all row
 * @param db
 * @param sql
 * @returns {Promise<null>}
 */
async function queryAll(db, sql) {
    let rows1 = null;
    await sqlQueryAll(db, sql).then(
        rows2 => {
            rows1 = rows2;
        },
        err => {
            console.log(err);
        }
    );
    return rows1;
}

async function helloSelectManOne(db) {
    let row = await queryOne(db, " SELECT ManID, ManLogo FROM Man1; ");
    console.log(row);
}

async function helloSelectManAll(db) {
    let rows = await queryAll(db, " SELECT ManID, ManLogo FROM Man1; ");
    console.log(rows);
}


const getAjax = (options, onResult) => {
    console.log('rest::getJSON');
    const port = options.port == 443 ? https : http;

    let output = '';

    const req = port.request(options, (res) => {
        console.log(`${options.host} : ${res.statusCode}`);
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            output += chunk;
        });

        res.on('end', () => {
            let obj = JSON.parse(output);

            onResult(res.statusCode, obj);
        });
    });

    req.on('error', (err) => {
        // res.send('error: ' + err.message);
    });

    req.end();
};

const getQueryOdoParam = (odcName) => {
    return {
        session: Date.now(),
        odc: odcName,
        action: 'ls',
        queryCounter: true,
        conditions: {
            attrs: []
        }
    };
};

const getOdoQuery = params =>{
    if (params.data) odl.DbMysql.fromM(params.odc, params.data);
    return axios.post(`${base}/odo/query`, params).then(res => {
        let rs = res.data;
        if (rs && rs.action === 'ls' && rs.data) {
            odl.DbMysql.toM(rs.odc, rs.data);
        }
        return rs;
    });
};


db.serialize(function() {
    db.run("CREATE TABLE lorem (info TEXT)");

    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        console.log(row.id + ": " + row.info);
    });
});

db.close();

const odlLoader = require('./odl-loader');
const LogRecord = odl.findOdc('log_record');


function sqlQueryOne(sql) {
    return new Promise((resolve, reject) => {
        let callback = function(err, row) {
            if (err) {
                reject(err);
            }
            else {
                resolve(row);
            }
        };

        db.get(sql, callback);
    });
}

function sqlQueryAll(sql) {
    return new Promise((resolve, reject) => {
        let callback = function(err, rows) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        };

        db.all(sql, callback);
    });
}

const loadLogRecords = () => {
    let param = getQueryOdoParam(LogRecord.metadata.name);
    param.conditions.attrs.push({
        name: 'id',
        operation: '>',
        value: 1,
        isAnd: filter.isAnd
    });
};

async function loadLocalLogRecords() {
    let sqlExist = odl.DbSqlite.getExistSql(LogRecord);
    try {
        let row = await sqlQueryOne(sqlExist);

    }
    catch (e) {
        console.log(e);
    }


    let row = await sqlQueryOne(" SELECT ManID, ManLogo FROM Man; ");
    console.assert(typeof row === 'object')
    console.log(row);
}

let localLogRecords = loadLocalLogRecords();

process.exit(0x01);
