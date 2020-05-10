const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const sqlite3 = require('sqlite3');

process.env.CVUE3_WEB_P  = path.normalize(path.resolve(__dirname, './../../../assets/lishi/sharedb'));
process.env.CVUE3_NODE_P  = path.normalize(__dirname);
process.env.CVUE3_ROOT_P  = path.normalize(path.resolve(__dirname, './../../..'));

const deployPath = path.normalize(path.resolve(__dirname, './..'));
const dbFilePath = '/opt/limi/lishi/build/alignerchen/lsmasterlite.db';
// const dbFilePath = path.normalize(path.resolve(deployPath, "../alignerchen/lsmasterlite.db"));

const hostAddress = '122.51.12.151';
// const hostAddress = 'localhost';
const imagePath = '/static/images';
const odoPath = '/odo/query';

const odlLoader = require('./odl-loader');
const LogRecord = odl.findOdc('log_record');

const ERROR_CANNOT_OPEN_DB = 0xFF;
const ERROR_CANNOT_CREATE_TABLE = 0xFE;
const ERROR_CANNOT_FIND_ODC = 0xFD;
const ERROR_CANNOT_FIND_PLUGIN = 0xFC;
const ERROR_CANNOT_FIND_ODO = 0xFB;


function _openDb(fpDb) {
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

function _queryOne(db, sql) {
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

function _queryAll(db, sql) {
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

function _runAll(db, sqls) {
    db.run("BEGIN");

    db.parallelize(function() {
        var stmt1 = db.prepare("INSERT INTO foo VALUES (?, ?)");
        var stmt2 = db.prepare("INSERT INTO foo VALUES (?, ?)");
        for (var i = 0; i < iterations; i++) {
            stmt1.run(i, 'Row ' + i);
            i++;
            stmt2.run(i, 'Row ' + i);
        }
        stmt1.finalize();
        stmt2.finalize();
    });

    db.run("COMMIT");
}

function _runOne(db, sql, param) {
    return new Promise((resolve, reject) => {
        let callback = function(err, row) {
            if (err) {
                reject(err);
            }
            else {
                resolve(row);
            }
        };

        if (Array.isArray(param)) {
            db.run(sql, ...param, callback);
        } else {
            db.run(sql, callback);
        }
    });
}

async function openDb() {
    let db1 = null;
    await _openDb(dbFilePath).then(
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
    if (sql) {
        await _queryOne(db, sql).then(
            row2 => {
                row1 = row2;
            },
            err => {
                console.log(err);
            }
        );
    }
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
    if (sql) {
        await _queryAll(db, sql).then(
            rows2 => {
                rows1 = rows2;
            },
            err => {
                console.log(err);
            }
        );
    }
    return rows1;
}

async function runOne(db, sql) {
    let rows1 = null;
    if (sql) {
        await _runOne(db, sql).then(
            rows2 => {
                rows1 = rows2;
            },
            err => {
                console.log(err);
            }
        );
    }
    return rows1;
}

async function runAll(db, sqls, params) {
    let rows1 = null;
    let err1 = null;
    if (sqls) {
        await _runOne(db, "BEGIN").then(
            rows2 => {
                rows1 = rows2;
            },
            err2 => {
                err1 = err2;
            }
        );

        if (err1) return 0;

        for (let i = 0; i < sqls.length; i++) {
            let sql = sqls[i];
            let param = null;
            if (Array.isArray(params) && params.length > i) {
                param = params[i];
            }
            await _runOne(db, sql, param).then(
                rows2 => {
                    rows1 = rows2;
                },
                err2 => {
                    err1 = err2;
                }
            );
            if (err1) {
                await _runOne(db, "ROLLBACK").then(
                    rows2 => {
                        rows1 = rows2;
                    },
                    err2 => {
                    }
                );
                return 0;
            }
        }

        await _runOne(db, "COMMIT").then(
            rows2 => {
                rows1 = rows2;
            },
            err2 => {
                err1 = err2;
            }
        );
        if (err1) {
            await _runOne(db, "ROLLBACK").then(
                rows2 => {
                    rows1 = rows2;
                },
                err2 => {
                }
            );
            return 0;
        }
    }
    return err1 ? 0 : sqls.length;
}

async function helloSelectManOne(db) {
    let row = await queryOne(db, " SELECT ManID, ManLogo FROM Man1; ");
    console.log(row);
}

async function helloSelectManAll(db) {
    let rows = await queryAll(db, " SELECT ManID, ManLogo FROM Man1; ");
    console.log(rows);
}

async function helloRunManAll(db) {
    let createSql = 'CREATE TABLE "t1" (\n' +
        '  "f1" integer,\n' +
        '  "f2" real,\n' +
        '  "f3" text,\n' +
        '  "f4" blob,\n' +
        '  "f5" integer DEFAULT 2\n' +
        ');';

    let insertSql1 = 'INSERT INTO "main"."t1"("f1", "f2", "f3", "f4", "f5") VALUES (1, 123.456, \'i = 1, i * i is 1\', X\'0102030405\', \'1\');';
    let insertSql2 = 'INSERT INTO "main"."t1"("f1", "f2", "f3", "f4", "f5") VALUES (2, 493.824, \'i = 2, i * i is 4\', X\'020406080A\', \'8\');';
    let insertSql3 = 'INSERT INTO "main"."t1"("f1", "f2", "f3", "f4", "f5") VALUES (3, 1111.104, \'i = 3, i * i is 9\', ?, \'27\');';

    let sqls = [createSql, insertSql1, insertSql2, insertSql3];
    let buffer = fs.readFileSync('/opt/limi/hello-docker/projects/lishi/sharedb/static/jpg/log1.jpeg');
    let params = [null, null, null, [buffer]];

    let r = await runAll(db, sqls, params);
    console.log(r);
}

function _requestUrl2(options) {
    return new Promise((resolve, reject) => {
        const port = options.port === 443 ? https : http;
        port.request(options, (error, res, body) => {
            if (error) reject(error);
            if (res.statusCode !== 200) {
                reject({
                    code: res.statusCode,
                    message: ''
                });
            } else {
                resolve(body);
            }
        });
    });
}

// https://nodejs.org/zh-cn/docs/guides/anatomy-of-an-http-transaction/
function _requestUrl(options, data) {
    return new Promise((resolve, reject) => {
        const port = options.port === 443 ? https : http;
        // let output = '';
        let chunks = [];
        const req = port.request(options, (res) => {
            console.log(`${options.host} : ${res.statusCode}`);
            // res.setEncoding('utf8');

            res.on('data', (chunk) => {
                // output += chunk;
                chunks.push(chunk);
            });

            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject({
                            code: res.statusCode,
                            message: ''
                        });
                }
                else {
                    // resolve(output);
                    resolve(chunks);
                }
            });
        });

        req.on('error', (err) => {
            reject({
                code: err.name,
                message: err.message
            });
        });

        if (data) {
            req.write(data);
        }

        req.end();
    });
}

async function requestUrl(options, data) {
    let obj1 = null;
    await _requestUrl(options, data).then(
        obj2 => {
            obj1 = obj2;
        },
        err => {
            console.log(err);
        }
    );
    return obj1;
}

function getHttpOptions(path=imagePath, method='GET') {
    return {
        host: hostAddress,
        port: 2293,
        path: path,
        method: method,
        headers: {
            'POWERED-BY-AID': 'Approve',
            'Content-Type': 'application/json'
        }
    };
}

function getOdoParam(odcName) {
    return {
        session: Date.now(),
        odc: odcName,
        action: 'ls',
        queryCounter: true,
        conditions: {
            attrs: []
        }
    };
}

async function getOdoQuery(params) {
    if (params.data) odl.DbMysql.fromM(params.odc, params.data);
    let options =  getHttpOptions(odoPath, 'POST');
    let chunks = await requestUrl(options, JSON.stringify(params));
    if (chunks) {
        let sJson = Buffer.concat(chunks).toString();
        try {
            let obj = JSON.parse(sJson);
            if (obj && obj.action === 'ls' && obj.data) {
                odl.DbMysql.toM(obj.odc, obj.data);
            }
            return obj;
        }
        catch (e) {
            console.log(e);
        }
    }
    return null;
}

async function helloGetImage1() {
    let options =  getHttpOptions(imagePath+'/1588566790569-412-1.jpeg');
    let chunks = await requestUrl(options);
    if (chunks) {
        let fp = '/tmp/' + Date.now() + '.jpeg';
        fs.writeFileSync(fp, Buffer.concat(chunks));
        console.log(fp);
    }
    // http://122.51.12.151:2293/static/images/1588566790569-412-1.jpeg
}

async function helloGetOdo1() {
    let params = getOdoParam(LogRecord.metadata.name);
    params.conditions.attrs.push({
        name: 'id',
        operation: '=',
        value: 1
    });
    let odos = await getOdoQuery(params);
    console.log(odos);
}

async function main() {
    let db = await openDb();
    if (!db) {
        process.exit(ERROR_CANNOT_OPEN_DB);
    }

    async function prepareOdcTable_l(odcName) {
        const odc = odl.findOdc(odcName);
        let sql = odl.DbSqlite.getExistSql(odc);
        let row = await queryOne(db, sql);
        if (! row) {
            sql = odl.DbSqlite.getCreateSql(odc);
            row = await queryOne(db, sql);
        }
        return row !== null;
    }

    async function getLogRecordKeyMax_l() {
        let sql = odl.DbSqlite.getSelectKeyMaxSql(LogRecord);
        let row = await queryOne(db, sql);
        return odl.DbSqlite.getSelectKeyMaxValue(row);
    }

    async function getLogRecords_r() {
        let maxKey = await getLogRecordKeyMax_l(db);
        let params = getOdoParam(LogRecord.metadata.name);
        let nObj = odl.DbMysql.getSimilar(LogRecord);
        params.conditions.attrs.push({
            name: nObj.spec.table.key.name,
            operation: '>',
            value: maxKey
        });
        return await getOdoQuery(params);
    }

    // * LogRecord { id(auto), action, time, odc, table, name, field, value }
    async function syncLogRecords(logRecord) {
        let action = logRecord['action'];
        let time = logRecord['time'];
        let odcName = logRecord['odc'];
        let tableName = logRecord['table'];
        let attrName = logRecord['name'];
        let fieldName = logRecord['field'];
        let fieldValue = logRecord['value'];
        const odc = odl.findOdc(odcName);
        if (! odc) {
            return 0;
        }
        let nObj = odl.DbSqlite.getSimilar(odc);
        if (! nObj) {
            return 0;
        }
        if (! nObj.spec.table || ! nObj.spec.table.sync) {
            return 0;
        }
        let params = getOdoParam(odc.metadata.name);
        params.conditions.attrs.push({
            name: attrName,
            operation: '=',
            value: fieldValue
        });
        let odo = await getOdoQuery(params);
        if (! odo) {
            process.exit(ERROR_CANNOT_FIND_ODO)
        }
        let attrs = nObj.spec.attrs;
        for (let i = 0; i < attrs.length; i++) {
            let attr = attrs[i];

        }
    }

    let bCreate = await prepareOdcTable_l(LogRecord.metadata.name);
    if (!bCreate) {
        process.exit(ERROR_CANNOT_CREATE_TABLE);
    }

    let logRecords = await getLogRecords_r();

    if (logRecords && logRecords.data) {
        for (let i = 0; i < logRecords.data.length; i++) {
            await syncLogRecords(logRecords.data[i]);
        }
    }
    // await helloSelectManOne(db);
    // await helloSelectManAll(db);
    await helloRunManAll(db);
    // await helloGetImage1();
    // await helloGetOdo1();
}

main();
