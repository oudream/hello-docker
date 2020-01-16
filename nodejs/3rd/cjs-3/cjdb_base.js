'use strict';

exports = module.exports = CjDbBase;

/**
 * Class CjDbBase
 * @constructor
 */
function CjDbBase() {
    this.onError = null;
    this.onOpened = null;
    this.onClosed = null;
    this.onDisconnected = null;
}

CjDbBase.prototype.open = function open() {};

CjDbBase.prototype.close = function close() {};

CjDbBase.prototype.isOpen = function isOpen() {};

/**
 * query data by sql
 * @param sql
 * @param callback : fn(data, err)
 */
CjDbBase.prototype.query = function query(sql, callback) {};
