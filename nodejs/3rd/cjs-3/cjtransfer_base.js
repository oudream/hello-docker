'use strict';

exports = module.exports = CjTransferServerBase;

/**
 * Class CjTransferServerBase
 * @constructor
 */
function CjTransferServerBase() {
    this.onReceived = null;
    this.onError = null;
    this.onOpened = null;
    this.onClosed = null;
    this.onDisconnected = null;
}

CjTransferServerBase.prototype.open = function open() {
};

CjTransferServerBase.prototype.close = function close() {
};

CjTransferServerBase.prototype.isOpen = function isOpen() {
};

CjTransferServerBase.prototype.broadcast = function broadcast() {
};

/**
 * Class CjTransferConnectorBase
 * @constructor
 */
function CjTransferConnectorBase() {
}

CjTransferConnectorBase.prototype.send = function send() {
};
