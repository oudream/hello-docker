'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');

require('./../../../nodejs/3rd/cjs-3/cjfs.js');

const odlLoader = require('./../../../projects/lishi/sharedb/odl-loader');


let mysqlConfig = require('./master.json');
const mysqlOption = mysqlConfig.database.mysql1;


let dtNow = Date.now();

let argv = {};
let argKey = '';
let argValue = '';
process.argv.forEach(function(arg) {
    if (arg.startsWith('-')) {
        if (argKey) {
            argv[argKey] = argValue;
        }
        argKey = arg;
        argValue = '';
        return;
    }
    if (argValue.length > 0)
        argValue += ' ' + arg;
    else
        argValue = arg;
});
if (argKey) {
    argv[argKey] = argValue;
}
console.log(argv);

const savePath = process.argv['-p'] ? process.argv['-p'] : (os.platform() === 'win32' ? 'd:/tmp/odl' : '/tmp/odl');
if (!fs.existsSync(savePath)) {
    console.log(' --- savePath --- : ');
    console.log(savePath);
    cjs.CjFs.mkdirMultiLevelSync(savePath);
}

let mysql = require('mysql');
let pool = null;
// let pool = mysql.createPool(mysqlOption);

//
// var sqlCommand = `
// create database test;
//
// use test;
//
// CREATE TABLE users (
//   id int(11) NOT NULL auto_increment,
//   name varchar(100) NOT NULL,
//   age int(3) NOT NULL,
//   email varchar(100) NOT NULL,
//   PRIMARY KEY (id)
// );
// `
function querySqlOnce(sql, values) {
    return new Promise((resolve, reject) => {
        var con = mysql.createConnection({
            host: mysqlOption.host,
            user: mysqlOption.user,
            password: mysqlOption.password,
            database: mysqlOption.database,
            multipleStatements: true // this allow you to run multiple queries at once.
        });

        con.connect(function(err) {
            if (err) throw err;
            // console.log("Connected yet no db is selected yet!");
            con.query(sql, values, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
                con.end();
            });
        });
    });
}

function execSql(sql) {
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log('error ' + String(i));
        }
        else {
            connection.query(sql, function(err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) exec");
            });
        }
    });
}

function querySql(sql) {
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log('error ' + String(i));
        }
        else {
            connection.query(sql, function(err, rows, fields) {
                if (err) throw err;
                console.log(rows.length + ' record(s) query');
                console.log(JSON.stringify(rows));
                console.log(JSON.stringify(fields));
            });
        }
    })
}

function querySqlPromise(sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            }
            else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    });
}

let countTestSql = 0;

function closePool() {
    if (countTestSql === 0) {
        pool.end();
    }
}

let insertObjs = {
    user: {
        data: [
            {
                id: 1,
                name: "admin",
                password: "admin",
            },
            {
                id: 2,
                name: "administrator",
                password: "administrator",
            }
        ]
    },
};

let selectConditions = {
    user: {
        start: 0,
        end: 20,
        attrs: [
            {
                name: 'name',
                operation: '%',
                value: 'a',
                isAnd: false
            },
            {
                name: 'id',
                operation: '>',
                value: 0,
                isAnd: true
            }
        ]
    },

};

async function testSql(odc) {
    countTestSql++;
    let odcName = odc.metadata.name;
    let fp = path.resolve(savePath, odcName + ".json");
    fs.writeFileSync(fp, JSON.stringify(odc));
    console.log('fs.writeFileSync(fp), fp: ', fp);

    let values = [];

    let sqlExist = odl.DbMysql.getExistSql(odc);
    try {
        values = await querySqlPromise(sqlExist);
    }
    catch (e) {
        console.log(e);
    }
    console.log('sqlExist: ', values);
    if (Array.isArray(values) && values.length > 0) {
        return;
    }

    let sqlDrop = odl.DbMysql.getDropSql(odc);
    // execSql(sqlDrop);
    values = await querySqlPromise(sqlDrop);
    console.log('sqlDrop: ', values);

    let sqlCreate = odl.DbMysql.getCreateSql(odc);
    fp = path.resolve(savePath, odcName + ".create.sql");
    fs.writeFileSync(fp, sqlCreate);
    console.log('fs.writeFileSync(fp), fp: ', fp);
    // execSql(sqlCreate);
    values = await querySqlPromise(sqlCreate);
    console.log('sqlCreate: ', values);

    let sqlCreateLog = odl.DbMysql.log.getCreateSql(odc);
    if (sqlCreateLog){
        fp = path.resolve(savePath, odcName + ".create-log.sql");
        fs.writeFileSync(fp, sqlCreateLog);
        console.log('fs.writeFileSync(fp), fp: ', fp);
        // execSql(sqlCreateLog);
        values = await querySqlPromise(sqlCreateLog);
        console.log('sqlCreateLog: ', values);
    }

    fp = path.resolve(savePath, odcName + ".insert.sql");
    let objs = insertObjs[odcName] ? insertObjs[odcName].data : undefined;
    if (objs) {
        let sqlsInsert = odl.DbMysql.getInsertSqlAry(odc, objs);
        fs.writeFileSync(fp, sqlsInsert.join('\n'));
        console.log('fs.writeFileSync(fp), fp: ', fp);
        for (let i = 0; i < sqlsInsert.length; i++) {
            let sql = sqlsInsert[i];
            // execSql(sql);
            values = await querySqlPromise(sql);
            console.log('sqlInsert: ', values, ' cost time: ', Date.now() - dtNow);
        }
    }

    let conditions = selectConditions[odcName];
    if (conditions) {
        let sqlSelect = odl.DbMysql.getSelectSql(odc, conditions);
        fp = path.resolve(savePath, odcName + ".select.sql");
        fs.writeFileSync(fp, sqlSelect);
        console.log('fs.writeFileSync(fp), fp: ', fp);
        // querySql(sqlSelect);
        values = await querySqlPromise(sqlSelect);
        console.log('sqlSelect: ', values);
    }

    let sqlSelectAll = odl.DbMysql.getSelectAllSql(odc);
    fp = path.resolve(savePath, odcName + ".select-all.sql");
    fs.writeFileSync(fp, sqlSelectAll);
    console.log('fs.writeFileSync(fp), fp: ', fp);
    // querySql(sqlSelectAll);
    values = await querySqlPromise(sqlSelectAll);
    console.log('sqlSelectAll: ', values);

    console.log(Date.now() - dtNow);

    countTestSql--;
    closePool();
}

async function testSqls() {
    let r = await querySqlOnce("CREATE DATABASE IF NOT EXISTS " + mysqlOption.database + " default charset utf8");
    console.log(r);
    pool = mysql.createPool(mysqlOption);
    let odcs = odl.getOdcs();
    await odcs.forEach(testSql);
}

// testSqls();

async function helloJpegToGuid() {
    let rows = await querySqlOnce(" SELECT ManID, ManLogo FROM Man; ");
    let p = path.resolve(path.dirname(process.argv[1]), "static/images");
    let pre = Date.now().toString() + '-' + Math.round(Math.random() * 1000000) + '-';
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let ManID = row["ManID"];
        let ManLogo = row["ManLogo"];
        let fn = pre + ManID.toString() + ".jpeg";
        let fp = path.resolve(p, fn);
        fs.writeFileSync(fp, ManLogo);
        let result = await querySqlOnce(" UPDATE Man SET ManLogoFileName = '"+fn+"' WHERE `ManID` = "+ManID);
        console.log('update result: ', result);
    }
    console.log(r);
}

helloJpegToGuid();

