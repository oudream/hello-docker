
const dgram = require('dgram');
let fs = require('fs');

exports = module.exports = CjChannelUdp;

function CjChannelUdp() {
    this.connectState = CjChannelUdp.CI_ConnectState_Null;
    this._udpSocket = null;
    this.isAutoOpen = false;
    this.isAutoHeartbeat = false;
    this.connectParams = {LocalPort: 5555, LocalIpAddress: '127.0.0.1', RemotePort: 5556, RemoteIpAddress: '127.0.0.1'};
    this.onReceived = null;
}

CjChannelUdp.prototype.receivedData = function(data, rinfo) {
    console.log('received data: ', data.length);
    if (this.onReceived) this.onReceived(data);
  // var data = Buffer.from('hello')
  // this._udpSocket.send([data], rinfo.port, rinfo.address, (err) => {
  //   // client.close();
  // }
  // )
};

CjChannelUdp.prototype.sendData = function(data) {
    if (this.isOpen()) {
        if (Number.isNaN(parseInt(this.connectParams.RemotePort))) {
            return 0;
        }
        this._udpSocket.send(data, this.connectParams.RemotePort, this.connectParams.RemoteIpAddress, (err) => {
            if (err !== null) {
                console.log(err);
            }
        });
    }
    return 0;
};

CjChannelUdp.CI_ConnectState_Null = 0;
CjChannelUdp.CI_ConnectState_Disconnected = 1;
CjChannelUdp.CI_ConnectState_Connecting = 2;
CjChannelUdp.CI_ConnectState_ConnectTimeout = 3;
CjChannelUdp.CI_ConnectState_Connected = 4;

CjChannelUdp.CS_EntryRemoteIpAddress = 'RemoteIpAddress';
CjChannelUdp.CS_EntryRemotePort = 'RemotePort';
CjChannelUdp.CS_EntryLocalIpAddress = 'LocalIpAddress';
CjChannelUdp.CS_EntryLocalPort = 'LocalPort';

/**
 * @param option = {LocalIpAddress:'127.0.0.1', LocalPort: 5555, RemoteIpAddress: '127.0.0,.1', RemotePort: 5556};
 */
CjChannelUdp.prototype.open = function(option) {
    // var option = {port:5555, ip:'127.0.0.1'};
    if (this._udpSocket) {
        return;
    }
    if (this.connectState === CjChannelUdp.CI_ConnectState_Connecting) {
        return;
    }

    let self = this;

    if (option) self.connectParams = option;

    if (Number.isNaN(parseInt(self.connectParams.LocalPort))) {
        console.log('open fail. connectParams.LocalPort is invalid.');
        return;
    }

    if (Number.isNaN(parseInt(self.connectParams.RemotePort))) {
        console.log('connectParams.RemotePort is invalid.');
    }

    self.connectState = CjChannelUdp.CI_ConnectState_Connecting;

    let udpSocket = null;

    let connectTimeout = function() {
        self.connectState = CjChannelUdp.CI_ConnectState_ConnectTimeout;
        self._udpSocket = null;
        if (udpSocket) {
            udpSocket.close();
        }
        console.log('connect timeout.');
    };
    let timeout = setTimeout(connectTimeout, 5 * 1000);

    udpSocket = dgram.createSocket('udp4');

    udpSocket.on('error', function(err) {
        self._udpSocket = null;
        self.connectState = CjChannelUdp.CI_ConnectState_Disconnected;
        self.close();
    });

    udpSocket.on('message', function(msg, rinfo) {
        self.receivedData.call(self, msg, rinfo);
    });

    udpSocket.on('listening', function() {
        if (self._udpSocket) {
            console.log('had _udp, system error, or connect timeout.');
            return;
        }

        clearTimeout(timeout);

        // 'connect' listener
        console.log('connected to server!');

        self._udpSocket = udpSocket;
        self.connectState = CjChannelUdp.CI_ConnectState_Connected;
    });

    // if (self.connectParams.LocalIpAddress)
    //     udpSocket.bind(self.connectParams.LocalPort, self.connectParams.LocalIpAddress);
    // else
    udpSocket.bind(self.connectParams.LocalPort);

    self.checkChannel(3000);
};

CjChannelUdp.prototype.close = function() {
    if (this._udpSocket) {
        this._udpSocket = null;
        this._udpSocket.close();
    }
};

CjChannelUdp.prototype.isOpen = function() {
    return this._udpSocket && this.connectState == CjChannelUdp.CI_ConnectState_Connected;
};

CjChannelUdp.prototype.checkChannel = function(interval) {
    let udp = this;
    if (interval < 1000) {
        if (udp.checkChannelTimer) {
            clearTimeout(udp.checkChannelTimer);
        }
        return;
    }

    if (udp.checkChannelTimer) {
        clearTimeout(udp.checkChannelTimer);
    }

    var timeOut = function() {
        //* recycle connect
        if (udp.isAutoOpen) {
            if (!udp.isOpen()) {
                udp.open();
                console.log('timer auto open');
            }
        }

        //* recycle heart jump
        if (udp.isAutoHeartbeat) {
            if (udp.isOpen()) {
                udp.sendData('heart jump!\r\n');
                console.log('timer auto heart jump!');
            }
        }
        udp.checkChannelTimer = setTimeout(timeOut, interval);
    };
    udp.checkChannelTimer = setTimeout(timeOut, interval);
};

