'use strict';

let WebSocketServer = require('ws').Server;
const CjTransferBase = require('./cjtransfer_base');

exports = module.exports = CjTransferWebsocketServer;

let WEBSOCKET_IP = '127.0.0.1';
let WEBSOCKET_PORT = 9101;

/**
 * Class CjTransferWebsocketServer
 * @constructor
 */
function CjTransferWebsocketServer() {
    CjTransferBase.call(this);
    this.connectState = CjTransferWebsocketServer.CI_ConnectState_Null;
    this._ws = null;
    this.isAutoOpen = false;
    this.isAutoHeartbeat = false;
    this.connectParams = {RemotePort: WEBSOCKET_PORT, RemoteIpAddress: WEBSOCKET_IP};
    this.clientId = 0;
    this.clientReceivedCount = 0;
    this.serverSentBytes = 0;
    this.onReceived = null;
}

CjTransferWebsocketServer.prototype = Object.create(CjTransferBase.prototype);
CjTransferWebsocketServer.prototype.constructor = CjTransferWebsocketServer;

CjTransferWebsocketServer.prototype.sendData = function(data) {
    if (this.isOpen()) {
        this._ws.send(data);
        this.serverSentBytes += data.length;
    }
};

CjTransferWebsocketServer.CI_ConnectState_Null = 0;
CjTransferWebsocketServer.CI_ConnectState_Disconnected = 1;
CjTransferWebsocketServer.CI_ConnectState_Connecting = 2;
CjTransferWebsocketServer.CI_ConnectState_ConnectTimeout = 3;
CjTransferWebsocketServer.CI_ConnectState_Connected = 4;

CjTransferWebsocketServer.CS_EntryRemoteIpAddress = 'RemoteIpAddress';
CjTransferWebsocketServer.CS_EntryRemotePort = 'RemotePort';
CjTransferWebsocketServer.CS_EntryLocalIpAddress = 'LocalIpAddress';
CjTransferWebsocketServer.CS_EntryLocalPort = 'LocalPort';

/**
 * @param {object}option = {RemotePort:5555, RemoteIpAddress:'127.0.0.1'};
 */
CjTransferWebsocketServer.prototype.open = function(option) {
    // var option = {port:5555, ip:'127.0.0.1'};
    if (this._ws) {
        return;
    }
    if (this.connectState === CjTransferWebsocketServer.CI_ConnectState_Connecting) {
        return;
    }

    let self = this;

    if (option) {
        self.connectParams = option;
    }

    self.connectState = CjTransferWebsocketServer.CI_ConnectState_Connecting;

    let wss = null;

    let connectTimeout = function() {
        self.connectState = CjTransferWebsocketServer.CI_ConnectState_ConnectTimeout;
        self._ws = null;
        if (wss) {
            wss.close();
            wss.end();
        }
        console.log('WebSocket: connect timeout.');
    };
    let timeout = setTimeout(connectTimeout, 5 * 1000);

    try {
        let wss = new WebSocketServer({port: self.connectParams.RemotePort});
        wss.on('connection', function(ws) {
            if (self._ws) {
                self.close();
                console.log('WebSocket: had _client, system error, or connect timeout.');
            }
            self._ws = ws;
            self.connectState = CjTransferWebsocketServer.CI_ConnectState_Connected;
            clearTimeout(timeout);
            self.clientId++;
            console.log('WebSocket: Client #%d connected', self.clientId);

            ws.on('message', function(data) {
                if (self.onReceived) {
                    self.onReceived(data);
                }
                self.clientReceivedCount += data.length;
            });

            ws.on('close', function() {
                self._ws = null;
                self.connectState = CjTransferWebsocketServer.CI_ConnectState_Disconnected;
                console.log('WebSocket: Client #%d disconnected', self.clientId);
            });

            ws.on('error', function(e) {
                self._ws = null;
                self.connectState = CjTransferWebsocketServer.CI_ConnectState_Disconnected;
                console.log('WebSocket: Client #%d error: %s', self.clientId, e.message);
            });
        });
    } catch (e) {
        console.log(e);
    }

    self.checkChannel(3000);
};

CjTransferWebsocketServer.prototype.close = function() {
    this.checkChannel(0);
    if (this._ws) {
        this._ws = null;
        this._ws.end();
    }
};

CjTransferWebsocketServer.prototype.isOpen = function() {
    return this._ws && this.connectState === CjTransferWebsocketServer.CI_ConnectState_Connected;
};

CjTransferWebsocketServer.prototype.checkChannel = function(interval) {
    let self = this;
    if (interval < 1000) {
        if (self.checkTimer) {
            clearTimeout(self.checkTimer);
            self.checkTimer = null;
        }
        return;
    }

    if (self.checkTimer) {
        clearTimeout(self.checkTimer);
    }

    let timeOut = function() {
        //* recycle connect
        if (self.isAutoOpen) {
            if (!self.isOpen()) {
                self.open();
                console.log('WebSocket: timer auto open');
            }
        }

        //* recycle heart jump
        if (self.isAutoHeartbeat) {
            if (self.isOpen()) {
                self.sendData('heart jump!\r\n');
                console.log('WebSocket: timer auto heart jump!');
            }
        }
        self.checkTimer = setTimeout(timeOut, interval);
    };
    self.checkTimer = setTimeout(timeOut, interval);
};

