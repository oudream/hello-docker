'use strict';

const net = require('net');
const fs = require('fs');

exports = module.exports = CjChannelTcpclient;

function CjChannelTcpclient() {
    this.connectState = CjChannelTcpclient.CI_ConnectState_Null;
    this._tcpSocket = null;
    this.isAutoOpen = false;
    this.isAutoHeartbeat = false;
    this.connectParams = {RemotePort: 5555, RemoteIpAddress: '127.0.0.1'};
    this.onReceived = null;
}

CjChannelTcpclient.prototype.receivedData = function(data) {
    console.log('received data: ', data.length);
    if (this.onReceived) {
        this.onReceived(data);
    }
  // console.log(data.toString());
  // fs.writeFile('f:/002.txt', data, function (err) {
  //     if (err) {+
  //         console.log(err);
  //     }
  // });
};

CjChannelTcpclient.prototype.sendData = function(data) {
    if (this.isOpen()) {
        return this._tcpSocket.write(data);
    }
    return 0;
};

CjChannelTcpclient.CI_ConnectState_Null = 0;
CjChannelTcpclient.CI_ConnectState_Disconnected = 1;
CjChannelTcpclient.CI_ConnectState_Connecting = 2;
CjChannelTcpclient.CI_ConnectState_ConnectTimeout = 3;
CjChannelTcpclient.CI_ConnectState_Connected = 4;

CjChannelTcpclient.CS_EntryRemoteIpAddress = 'RemoteIpAddress';
CjChannelTcpclient.CS_EntryRemotePort = 'RemotePort';
CjChannelTcpclient.CS_EntryLocalIpAddress = 'LocalIpAddress';
CjChannelTcpclient.CS_EntryLocalPort = 'LocalPort';

/**
 * @param option = {RemotePort:5555, RemoteIpAddress:'127.0.0.1'};
 */
CjChannelTcpclient.prototype.open = function(option) {
  // var option = {port:5555, ip:'127.0.0.1'};
    if (this._tcpSocket) {
        return;
    }
    if (this.connectState === CjChannelTcpclient.CI_ConnectState_Connecting) {
        return;
    }

    let self = this;

    if (option) {
        self.connectParams = option;
    }

    self.connectState = CjChannelTcpclient.CI_ConnectState_Connecting;

    let tcpSocket = null;

    let connectTimeout = function() {
        self.connectState = CjChannelTcpclient.CI_ConnectState_ConnectTimeout;
        self._tcpSocket = null;
        if (tcpSocket) {
            tcpSocket.end();
        }
        console.log('connect timeout.');
    };
    let timeout = setTimeout(connectTimeout, 5 * 1000);

    try {
        tcpSocket = net.createConnection({
            port: self.connectParams.RemotePort,
            host: self.connectParams.RemoteIpAddress,
        }, function() {
            if (self._tcpSocket) {
                tcpSocket.end();
                console.log('had _client, system error, or connect timeout.');
                return;
            }

            clearTimeout(timeout);

      // 'connect' listener
            console.log('connected to server!');

            self._tcpSocket = tcpSocket;
            self.connectState = CjChannelTcpclient.CI_ConnectState_Connected;
        });

        tcpSocket.on('data', function(data) {
            self.receivedData.call(self, data);
        });

        tcpSocket.on('end', function() {
            self._tcpSocket = null;
            self.connectState = CjChannelTcpclient.CI_ConnectState_Disconnected;
        });

        tcpSocket.on('error', function(err) {
            self._tcpSocket = null;
            self.connectState = CjChannelTcpclient.CI_ConnectState_Disconnected;
            console.log(err);
        });
    } catch (e) {
        console.log(e);
    }

    self.checkChannel(3000);
};

CjChannelTcpclient.prototype.close = function() {
    this.checkChannel(0);
    if (this._tcpSocket) {
        this._tcpSocket = null;
        this._tcpSocket.end();
    }
};

CjChannelTcpclient.prototype.isOpen = function() {
    return this._tcpSocket && this.connectState === CjChannelTcpclient.CI_ConnectState_Connected;
};

CjChannelTcpclient.prototype.checkChannel = function(interval) {
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
                console.log('timer auto open : ', self.connectParams, self.isOpen());
            }
        }

    //* recycle heart jump
        if (self.isAutoHeartbeat) {
            if (self.isOpen()) {
                self.sendData('heart jump!\r\n');
                console.log('timer auto heart jump!');
            }
        }
        self.checkTimer = setTimeout(timeOut, interval);
    };
    self.checkTimer = setTimeout(timeOut, interval);
};

