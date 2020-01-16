'use strict';

exports = module.exports = CjDbMysql;

let mysql = require('mysql');

/**
 * Class CjDbMysql
 * @constructor
 * @param option = {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'db1',
}
 */
function CjDbMysql(option) {
    this._option = {
        connectionLimit: option.connectionLimit ? option.connectionLimit : 10,
        host: option.host ? option.host : 'localhost',
        user: option.user ? option.user : 'root',
        password: option.password ? option.password : '123456',
        database: option.database ? option.database : 'db1',
    };
    this._pool = mysql.createPool(this._option);
}

CjDbMysql.prototype.close = function close() {
    this._pool.end();
    this._pool = null;
};

CjDbMysql.prototype.getOption = function getOption() {
    return this._option;
};

CjDbMysql.prototype.isOpen = function isOpen() {
    return this._pool !== null;
};

/**
 * CjDbMysql.prototype.query
 * @param {String} sql
 * @param {function} callback
 */
CjDbMysql.prototype.query = function query(sql, callback) {
    this._pool.getConnection(function(err, connection) {
        if (err) {
            console.log('CjDbMysql-query: ', err);
            callback(err);
            return;
        }
        // let sql = 'SELECT id,name FROM users';
        connection.query(sql, [], function(err, values, fields) {
            connection.release(); // always put connection back in pool after last query
            if (err) {
                console.log('CjDbMysql-query: ', err);
                callback(err);
                return;
            }
            callback(false, values, fields);
        });
    });
};

/**
 * CjDbMysql.prototype.queryPromise
 * @param {CjDbMysql} dbMysql
 * @param {String} sql
 * @param {Array} values
 * @return {Array}
 */
CjDbMysql.prototype.queryPromise = function(sql, values) {
    return new Promise((resolve, reject) => {
        this._pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    });
};

