'use strict';

const CjChannelUdp = require('./../cjs-3/cjchannel_udp');
const fs = require('fs');
const path = require('path');
const util = require('util');

exports = module.exports = PsmProtocol;

let crc16Table = [
    0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7,
    0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef,
    0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
    0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de,
    0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485,
    0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
    0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4,
    0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc,
    0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
    0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b,
    0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12,
    0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
    0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41,
    0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49,
    0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
    0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78,
    0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f,
    0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
    0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e,
    0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256,
    0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
    0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405,
    0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c,
    0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
    0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab,
    0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3,
    0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
    0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92,
    0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9,
    0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
    0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8,
    0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0,
];

if (typeof Int32Array !== 'undefined') {
    crc16Table = new Int32Array(crc16Table);
}

function crc16(buf, iOffset, length) {
    let crc = 0;
    let byte;
    for (let i = iOffset; i < length; i++) {
        byte = buf[i];
        crc = (crc16Table[((crc >> 8) ^ byte) & 0xff] ^ (crc << 8)) & 0xffff;
    }
    return crc;
}


//* * body
//* 1 head
//    uint    head;

//* 2 front
//    ushort  version;

//* 3 dataLength
//    ushort  dataLength;

//* 4 body
function PsmPacketBody() {
    this.frameType = 0; // send received calcer : IEC104
    this.sourceOriginal = 0;
    this.sourceAddress = 0;
    this.resFrame = 0;
    this.targetAddress = 0;
    // 4(head) + 2 + 2 + 10 + 2
    this.controlWord = 0; // short controlWord; short frameNo;
    //  + 24 + 2(crc)
    this.command = 0;
    this.reason = 0;
    this.resCommand = 0;
    this.container = 0;
    this.paramType = 0;
    this.paramCount = 0;
}

PsmPacketBody.byteCout = 48;

PsmPacketBody.prototype.fromBuffer = function(buf, offset) {
    let offset2 = offset;
    this.frameType = buf.readInt32LE(offset2, true);
    offset2 += 4;
    this.sourceOriginal = buf.readInt32LE(offset2, true);
    offset2 += 4;
    this.sourceAddress = buf.readInt32LE(offset2, true);
    offset2 += 4;
    this.resFrame = buf.readInt32LE(offset2, true);
    offset2 += 4;
    this.targetAddress = buf.readInt32LE(offset2, true);
    offset2 += 4;
    this.controlWord = buf.readInt32LE(offset2, true);
    offset2 += 4;
    this.command = buf.readInt32LE(offset2, true);
    offset2 += 4;
    this.reason = buf.readInt32LE(offset2, true);
    offset2 += 4;
    this.resCommand = buf.readInt32LE(offset2, true);
    offset2 += 4;
    this.container = buf.readInt32LE(offset2, true);
    offset2 += 4;
    this.paramType = buf.readInt32LE(offset2, true);
    offset2 += 4;
    this.paramCount = buf.readInt32LE(offset2, true);
    offset2 += 4;
    return offset2;
};

PsmPacketBody.prototype.toBuffer = function() {
    let rBuf = Buffer.allocUnsafe(PsmPacketBody.byteCout);
    let iOffset = 0;
    rBuf.writeInt32LE(this.frameType, iOffset, true);
    iOffset += 4;
    rBuf.writeInt32LE(this.sourceOriginal, iOffset, true);
    iOffset += 4;
    rBuf.writeInt32LE(this.sourceAddress, iOffset, true);
    iOffset += 4;
    rBuf.writeInt32LE(this.resFrame, iOffset, true);
    iOffset += 4;
    rBuf.writeInt32LE(this.targetAddress, iOffset, true);
    iOffset += 4;
    rBuf.writeInt32LE(this.controlWord, iOffset, true);
    iOffset += 4;
    rBuf.writeInt32LE(this.command, iOffset, true);
    iOffset += 4;
    rBuf.writeInt32LE(this.reason, iOffset, true);
    iOffset += 4;
    rBuf.writeInt32LE(this.resCommand, iOffset, true);
    iOffset += 4;
    rBuf.writeInt32LE(this.container, iOffset, true);
    iOffset += 4;
    rBuf.writeInt32LE(this.paramType, iOffset, true);
    iOffset += 4;
    rBuf.writeInt32LE(this.paramCount, iOffset, true);
    return rBuf;
};

//* 5 data
//  char data[dataLength]

//* 6 crc
//    int  crc;


//* * define
/**
 * PsmDefine
 * @constructor
 */
function PsmDefine() {
}

PsmDefine.CI_psm_packet_max = 3980;
PsmDefine.CI_PSM_PACKET_DATA = 4000;
PsmDefine.c_psm_head = 0x5aa55aa5;
PsmDefine.CIPsmControlCode_Initiactive = 0x4000;
PsmDefine.CIPsmControlCode_Passivity = 0x8000;
PsmDefine.CIPsmControlCode_NACK = 0xC000;

PsmDefine.ci_psm_packet_default_size = 1024 * 2;
PsmDefine.ci_psm_fix_size = (PsmPacketBody.byteCout + 10);
PsmDefine.ci_psm_packet_default_count = function(byteCout) {
    return ( (PsmDefine.ci_psm_packet_default_size - PsmDefine.ci_psm_fix_size) / byteCout );
};

PsmDefine.PACKAGE_MAX_SIZE = 4096;
PsmDefine.PACKAGE_MAX_BUF_SIZE = PsmDefine.PACKAGE_MAX_SIZE * 3;

PsmDefine.DealReplyType_Error_Data = (-1);


PsmDefine.ci_psm_process_result_message_command = 0x101;
PsmDefine.ci_psm_process_result_file_write = 0x102;
PsmDefine.ci_psm_process_result_realtime_data_request = 0x103;
PsmDefine.ci_psm_process_result_realtime_data_post = 0x104;

PsmDefine.ci_psm_process_received_message_command = 0x201;
PsmDefine.ci_psm_process_received_file_write = 0x202;
PsmDefine.ci_psm_process_received_realtime_data_request = 0x203;
PsmDefine.ci_psm_process_received_realtime_data_post = 0x204;

/*
 命令码：分127个区
 核心区有：7个，其它是扩展区
 核心区0x01000000：平台环境、网络环境（局域网、广域网）
 核心区0x02000000：系统、框架、程序运行环境
 核心区0x03000000：APP、应用程序、进程、消息、文件
 核心区0x04000000：（所在的APP产生的）配置、固化、整参
 核心区0x05000000：（所在的APP产生的）实时、动态数据、日常活动、事件、告警
 核心区0x06000000：（所在的APP产生的）控制、命令、任务
 核心区0x07000000：（所在的APP产生的）日志、历史查询、分析、业务支持
 */

PsmDefine.gct_core1_base = (0x01000000);
PsmDefine.gct_core2_base = (0x02000000);
PsmDefine.gct_core3_base = (0x03000000);
PsmDefine.gct_core4_base = (0x04000000);
PsmDefine.gct_core5_base = (0x05000000);
PsmDefine.gct_core6_base = (0x06000000);
PsmDefine.gct_core7_base = (0x07000000);

// link check
PsmDefine.gct_channel_base = (PsmDefine.gct_core1_base + (0x050000));
PsmDefine.gct_channel_hand = (PsmDefine.gct_channel_base + (0x0202));
PsmDefine.gct_channel_check = (PsmDefine.gct_channel_base + (0x0302));

// message
PsmDefine.gct_message_base = (PsmDefine.gct_core3_base + (0x050000));
// 0x03050101 03 05 01 01
PsmDefine.gct_message_command_param = (PsmDefine.gct_message_base + (0x0101));

// file
PsmDefine.gct_file_base = (PsmDefine.gct_core3_base + (0x060000));
// PsmDefine.gct_file_information_read = (PsmDefine.gct_file_base + (0x0101));
// 0x03060102 03 06 01 02
PsmDefine.gct_file_information_write = (PsmDefine.gct_file_base + (0x0102));
// PsmDefine.gct_file_content_read = (PsmDefine.gct_file_base + (0x0201));
// 0x03060202 03 06 02 02
PsmDefine.gct_file_content_write = (PsmDefine.gct_file_base + (0x0202));
// 0x03060302 03 06 03 02
PsmDefine.gct_file_shell = (PsmDefine.gct_file_base + (0x0302));

// realtime
PsmDefine.gct_realtime_base = (PsmDefine.gct_core5_base + (0x050000));
// 0x05050101 05 05 01 01
PsmDefine.gct_realtime_data_request = (PsmDefine.gct_realtime_base + (0x0101));
// 0x05050101 05 05 01 02
PsmDefine.gct_realtime_data_post = (PsmDefine.gct_realtime_base + (0x0102));

PsmDefine.GM_req_sys_login_1 = 'req.sys.user.login.1';
PsmDefine.GM_req_db_sql_execute_1 = 'req.db.sql.execute.1';
PsmDefine.GM_req_db_sql_select_1 = 'req.db.sql.select.1';

PsmDefine.GM_resp_sys_login_1 = 'resp.sys.user.login.1';
PsmDefine.GM_resp_db_sql_execute_1 = 'resp.db.sql.execute.1';
PsmDefine.GM_resp_db_sql_select_1 = 'resp.db.sql.select.1';

PsmDefine.CS_EntryPsmStationNumSource = 'PsmStationNumSource';
PsmDefine.CS_EntryPsmStationNumTarget = 'PsmStationNumTarget';

PsmDefine.CS_EntryPsmSentReason = 'PsmSentReason';
PsmDefine.CS_EntryPsmSentContainerId = 'PsmSentContainerId';
PsmDefine.CS_EntryPsmSentSourceId = 'PsmSentSourceId';
PsmDefine.CS_EntryPsmSentTargetId = 'PsmSentTargetId';
PsmDefine.CS_EntryPsmSentTag = 'PsmSentTag';
PsmDefine.CS_EntryPsmHeartJumpInterval = 'PsmHeartJumpInterval';
PsmDefine.CS_EntryPsmYxSendInterval = 'PsmSendYxInterval';
PsmDefine.CS_EntryPsmYcSendInterval = 'PsmSendYcInterval';
PsmDefine.CS_EntryPsmYwSendInterval = 'PsmSendYwInterval';


PsmDefine.DealReplyType_None = 0;
PsmDefine.DealReplyType_Ack = 1;
PsmDefine.DealReplyType_Nack = 2;
PsmDefine.DealReplyType_Define = 3;


//* *
function PsmAttach(iReason = 0, iContainerId = 0, iSourceId = 0, iTargetId = 0, iTag = 0) {
    this.reason = iReason;
    this.containerId = iContainerId;
    this.sourceId = iSourceId;
    this.targetId = iTargetId;
    this.tag = iTag;
}

/**
 * UserException
 * @param message
 * @constructor
 */
function UserException(message) {
    this.message = message;
    this.name = 'UserException';
}

/**
 * BasAttr
 * @param name
 * @param size
 * @param type
 * @param encoding
 * @constructor
 */
function BaseAttr(name, size, type, encoding) {
    if (!name) {
        throw new UserException('invalid name');
    }
    this.name = name;
    this.size = size;
    this.type = type;
    this.encoding = encoding;
}

BaseAttr.CI_Type_None = 0;
BaseAttr.CI_Type_int = 1;
BaseAttr.CI_Type_long = 2;
BaseAttr.CI_Type_float = 3;
BaseAttr.CI_Type_double = 4;
BaseAttr.CI_Type_string = 5;

/**
 * PsmRealtimeDataStruct
 * @constructor
 */
function PsmRealtimeDataStruct() {
    this.stack = [];
    this.paramType = 0;
    this.byteCount = 0;
}

PsmRealtimeDataStruct.structs = new Map();

PsmRealtimeDataStruct.getByteCount = function(stack) {
    let iSize = 0;
    let attr;
    let idx = 0;
    while (idx < stack.length) {
        attr = stack[idx++];
        iSize += attr.size;
    }
    return iSize;
};

PsmRealtimeDataStruct.prototype.add = function(name, size = 4, type = BaseAttr.CI_Type_int, encoding = 'ascii') {
    if (size === 4 && type !== BaseAttr.CI_Type_int) {
        return;
    }
    this.stack.push(new BaseAttr(name, size, type, encoding));
};

PsmRealtimeDataStruct.prototype.setParamType = function(paramType) {
    this.paramType = paramType;
    this.byteCount = PsmRealtimeDataStruct.getByteCount(this.stack);
    PsmRealtimeDataStruct.structs.set(paramType, this);
};

PsmRealtimeDataStruct.prototype.toBuffer = function(objs) {
    if (!(objs instanceof Array)) {
        return Buffer.allocUnsafe(0);
    }
    let rBuf = Buffer.allocUnsafe(this.byteCount * objs.length);
    let obj;
    let stack = this.stack;
    let stackLength = stack.length;
    let i, j;
    let attr;
    let value;
    let iOffset = 0;
    for (i = 0; i < objs.length; i++) {
        obj = objs[i];
        for (j = 0; j < stackLength; j++) {
            attr = stack[j];
            value = obj[attr.name];
            switch (attr.type) {
            case BaseAttr.CI_Type_int:
                if (attr.size > 4) {
                    rBuf.writeInt32LE(value, iOffset, true);
                    iOffset += 4;
                } else {
                    rBuf.writeIntLE(value, iOffset, attr.size, true);
                    iOffset += attr.size;
                }
                break;
            case BaseAttr.CI_Type_long:
                rBuf.writeIntLE(value, iOffset, 6, true);
                iOffset += 8;
                break;
            case BaseAttr.CI_Type_float:
                rBuf.writeFloatLE(value, iOffset, true);
                iOffset += 4;
                break;
            case BaseAttr.CI_Type_double:
                rBuf.writeDoubleLE(value, iOffset, true);
                iOffset += 8;
                break;
            case BaseAttr.CI_Type_string:
                if (value.length > attr.size) {
                    rBuf.write(value, iOffset, attr.size);
                } else {
                    rBuf.write(value, iOffset, value.length);
                    rBuf[iOffset + value.length] = 0;
                }
                iOffset += attr.size;
                break;
            default:

                break;
            }
        }
    }
    return rBuf;
};

PsmRealtimeDataStruct.prototype.fromBuffer = function(bufData) {
    let objs = [];
    if (!(bufData instanceof Buffer)) {
        return objs;
    }
    let stack = this.stack;
    let stackLength = stack.length;
    let i, j;
    let attr;
    let value;
    let iOffset = 0;
    let iCount = bufData.length / this.byteCount;
    for (i = 0; i < iCount; i++) {
        let obj = {};
        for (j = 0; j < stackLength; j++) {
            attr = stack[j];
            switch (attr.type) {
            case BaseAttr.CI_Type_int:
                if (attr.size > 4) {
                    value = bufData.readInt32LE(iOffset, 4, true);
                    iOffset += 4;
                } else {
                    value = bufData.readIntLE(iOffset, attr.size, true);
                    iOffset += attr.size;
                }
                break;
            case BaseAttr.CI_Type_long:
                value = bufData.readIntLE(iOffset, 6, true);
                iOffset += 8;
                break;
            case BaseAttr.CI_Type_float:
                value = bufData.readFloatLE(iOffset, 4, true);
                iOffset += 4;
                break;
            case BaseAttr.CI_Type_double:
                value = bufData.readDoubleLE(iOffset, 8, true);
                iOffset += 8;
                break;
            case BaseAttr.CI_Type_string:
                value = bufData.toString('utf8', iOffset, iOffset + attr.size);
                iOffset += attr.size;
                break;
            default:
                    //
                break;
            }
            Object.defineProperty(obj, attr.name, {
                configurable: true,
                enumerable: true,
                value: value,
            });
        }
        objs.push(obj);
    }
    return objs;
};


function PsmReceivePacket() {
    this._head = 0;
    this._front = 0;
    this._dataLength = 0;
    this._body = new PsmPacketBody();
    this._end = 0;

    this._state = 0;
    this._dataOffset = 0;

    // recvCache : recv data -> push to recvCache
    this.recvCache = Buffer.allocUnsafeSlow(PsmDefine.PACKAGE_MAX_BUF_SIZE);
    this.recvOffset = 0;
    this.dealOffset = 0;

    this.onReceivedPacket = 0;
}

/**
 * only deal on complete psm packet
 * @param data
 */
PsmReceivePacket.prototype.doReceived = function(data) {
    if (!data) {
        throw new UserException('BasParser.prototype.handleRecv(buf) : invalid buf!');
    }
    if (data.length > PsmDefine.PACKAGE_MAX_SIZE) {
        console.log('BasParser.prototype.handleRecv(buf) : data.length > PsmDefine.PACKAGE_MAX_SIZE!');
        return;
    }
    if (data.length > (PsmDefine.PACKAGE_MAX_BUF_SIZE - this.recvOffset)) {
        let iNoDeal = this.recvOffset - this.dealOffset;
        if (iNoDeal > PsmDefine.PACKAGE_MAX_SIZE) {
            this.recvOffset = 0;
            console.log('BasParser.prototype.handleRecv(buf) : iNoDeal > PsmDefine.PACKAGE_MAX_SIZE!');
        } else {
            this.recvCache.copy(this.recvCache, 0, this.dealOffset, this.recvOffset);
            this.recvOffset = iNoDeal;
        }
        this.dealOffset = 0;
    }
    data.copy(this.recvCache, this.recvOffset);
    this.recvOffset += data.length;
    this.dealCache();
};

PsmReceivePacket.prototype.dealCache = function() {
    let index = this.dealOffset;
    let end = this.recvOffset;
    let buf = this.recvCache;
    let state = this._state;
    if (end - index < PsmDefine.ci_psm_fix_size) {
        return;
    }
    while (index < end) {
        switch (state) {
        case 0: {
            this._head = buf.readInt32LE(index, true);
            index += 4;
            if (this._head === PsmDefine.c_psm_head) {
                state = 1;
            }
        }
            break;
        case 1: {
            this._front = buf.readInt16LE(index, true);
            index += 2;
            state = 2;
        }
            break;
        case 2: {
            this._dataLength = buf.readInt16LE(index, true);
            index += 2;
            state = 3;
        }
            break;
        case 3: {
            index = this._body.fromBuffer(buf, index);
            this._dataOffset = index;
            state = (this._dataLength > 0) ? 4 : 5;
        }
            break;
        case 4: {
            if (index >= (this._dataOffset + this._dataLength)) {
                state = 5;
                break;
            }
            ++index;
        }
            break;
        case 5: {
            if (end - index > 1) {
                this._end = buf.readInt16LE(index, true);
                index += 2;
                state = 0;
                    // todo:best:crc
                if (this.onReceivedPacket) {
                    this.onReceivedPacket();
                }
            }
        }
            break;
        default:
            break;
        }
    }
    this.dealOffset = index;
    this._state = state;
};


function packetPsmSend(body, bufData) {
    let r = Buffer.allocUnsafe(PsmDefine.ci_psm_fix_size + bufData.length);
    let iOffset = 0;
    r.writeInt32LE(PsmDefine.c_psm_head, iOffset, true);
    iOffset += 4;
    r.writeInt16LE(1, iOffset, true);
    iOffset += 2;
    r.writeInt16LE(bufData.length, iOffset, true);
    iOffset += 2;
    let bufBody = body.toBuffer();
    bufBody.copy(r, iOffset);
    iOffset += bufBody.length;
    bufData.copy(r, iOffset);
    iOffset += bufData.length;
    let crc = crc16(r, 0, iOffset);
    r.writeInt16LE(crc, iOffset, true);
    return r;
}

function PsmFileDataInfo(fileName = '', fileDir = '', fileSize = 0, fileData = [], attach = null) {
    this.fileName = fileName;
    this.fileDir = fileDir;
    this.fileSize = fileSize;
    this.fileData = fileData;
    this.attach = attach;
}

PsmFileDataInfo.getFileSize = function(fileData) {
    let iFileSize = 0;
    for (let i = 0; i < fileData.length; i++) {
        iFileSize += fileData[i].length;
    }
    return iFileSize;
};

function PsmProtocol() {
    let self = this;

    this._psmExplainNotify = null;
    this._psmExplainWrite = null;

    this._receiveFileCurrentDataInfo = new PsmFileDataInfo();
    this._receivedFileSize = 0; // int
    this._receiveFileInfoTargetId = 0; // int

    this._sendFileCurrentDataInfo = new PsmFileDataInfo();
    this._sendFileQueueDataInfos = [];
    this._sendFilePathes = new Map(); // std::map<std::string, PsmAttach>
    this._sendFileCurrentIndex = 0; // int
    this._sendFileTime = 0; // msepoch_t
    this._sendingFileTime = 0; // msepoch_t

    this._sendFileInfoName = '';
    this._sendFileInfoSize = 0;
    this._sendFileInfoAttach = new PsmAttach(); // PsmAttach
    this._sendFileTexts = [];// std::vector<std::string>

    this._sendFileSreamInfos = []; // std::queue<CxFileSystem::PathInfo>
    this._sendFileSreamDatas = []; // std::queue<std::vector<std::string> >
    this._sendFileSreamAttach = []; // std::queue<PsmAttach>

    this._lastReceivedDataTime = 0; // msepoch_t
    this._sentSourceId = 0; // int
    this._sentTargetId = 0; // int

    // //*lock
    // std::queue<PsmMessage> _processMessages;
    // std::queue<PsmFile> _processFiles;
    // std::queue<PsmData> _processRealtimeDataRequests;
    // std::queue<PsmRealtimeData> _processRealtimeDatas;
    // std::queue<PsmFile> _processResultFiles;
    this._fileSavePath = ''; // std::string
    // //#lock
    // CxMutex _processLock;

    //* receivePacket
    let receivePacket = new PsmReceivePacket();
    receivePacket.onReceivedPacket = function() {
        self.dealPacket();
    };

    //* channel
    let channel = new CjChannelUdp();
    channel.isAutoOpen = true;
    channel.onReceived = function(data) {
        receivePacket.doReceived(data);
    };

    this.fns = new Map();
    this.fnAllPacket = null;
    this.channel = channel;
    this.receivePacket = receivePacket;

    //* on
    this.onReceivedMessage = null; // onReceivedMessage(sCommand, sParam, attach)
    this.onReceivedFile = null; // onReceivedFile(PsmFileDataInfo)
    this.onReceivedRealtimeDataPost = null; // onReceivedRealtimeDataPost(iParamType, bufParam, iParamCount, attach)
    this.onReceivedRealtimeDataStruct = null; // onReceivedRealtimeDataStruct(iParamType, structs, attach)
    this.onReceivedRealtimeDataRequest = null; // onReceivedRealtimeDataRequest(attach)
    this.onSentMessage = null; // onSentMessage(iResult, sCommand, sParam, attach)
    this.onSentFile = null; // onSentFile(iResult, sFilePath) || onSentFile(iResult, PsmFileDataInfo)
}

/**
 *
 * @param option = {LocalIpAddress:'127.0.0.1', LocalPort: 5555, RemoteIpAddress: '127.0.0,.1', RemotePort: 5556, FileSavePath: '/temp'};
 */
PsmProtocol.prototype.start = function(option) {
    // tcpclient1.open({port: 5556, host: '127.0.0.1'});
    this.channel.open(option);
    this.checkProtocol(1000);
    this._fileSavePath = option.FileSavePath;
};

PsmProtocol.prototype.stop = function() {
    this.checkProtocol(0);
    this.channel.close();
};

// this._body, this.recvCache, this._dataOffset, this._dataLength
PsmProtocol.prototype.dealPacket = function() {
    let body = this.receivePacket._body;
    if (body.controlWord === PsmDefine.CIPsmControlCode_NACK) {
        this.dealNack(body);
    } else {
        let bufData = Buffer.allocUnsafe(this.receivePacket._dataLength);
        this.receivePacket.recvCache.copy(bufData, 0, this.receivePacket._dataOffset, this.receivePacket._dataOffset + this.receivePacket._dataLength);
        let iDeal = 0;
        switch (body.command) {
            //* heart jump
        case PsmDefine.gct_channel_hand: {
            iDeal = PsmDefine.DealReplyType_Ack;
        }
            break;
            //* message
        case PsmDefine.gct_message_command_param: {
            iDeal = this.dealMessageCommand(body, bufData);
        }
            break;
            //* realtime
        case PsmDefine.gct_realtime_data_request: {
            iDeal = this.dealRealtimeRequest(body, bufData);
        }
            break;
        case PsmDefine.gct_realtime_data_post: {
            iDeal = this.dealRealtimePost(body, bufData);
        }
            break;
            //* file
        case PsmDefine.gct_file_information_write: {
            iDeal = this.dealFileInformationWrite(body, bufData);
        }
            break;
        case PsmDefine.gct_file_content_write: {
            iDeal = this.dealFileDataWrite(body, bufData);
        }
            break;
        case PsmDefine.gct_file_shell:
//            iDeal = this.dealFileShell();
            break;
        default:
            break;
        }
        if (iDeal === PsmDefine.DealReplyType_Ack) {
            let iReason = body.reason;
            let iContainerId = body.container;
            let iSourceID = body.targetAddress;
            let iTargetId = body.sourceAddress;
            let iTag = body.resCommand;
            let attach = new PsmAttach(iReason, iContainerId, iSourceID, iTargetId, iTag);
            this.responseAck(body.command, attach);
        } else if (iDeal < 0) {
            let iReason = body.reason;
            let iContainerId = body.container;
            let iSourceID = body.targetAddress;
            let iTargetId = body.sourceAddress;
            let iTag = body.resCommand;
            let attach = new PsmAttach(iReason, iContainerId, iSourceID, iTargetId, iTag);
            this.responseNack(body.command, iDeal, attach);
        }
    }
};

PsmProtocol.prototype.dealNack = function(body) {
    switch (body.command) {
    case PsmDefine.gct_file_information_write:
    case PsmDefine.gct_file_content_write: {
        if (body.command === PsmDefine.gct_file_information_write) {
            this._sendFileCurrentIndex = -1;
        }
        ++this._sendFileCurrentIndex;
        if (this._sendFileCurrentIndex < this._sendFileCurrentDataInfo.fileData.length) {
            let fileData = this._sendFileCurrentDataInfo.fileData[this._sendFileCurrentIndex];
            let iReason = body.reason;
            let iContainerId = body.container;
            let iSourceID = body.targetAddress;
            let iTargetId = body.sourceAddress;
            let iTag = body.resCommand;
            let attach = new PsmAttach(iReason, iContainerId, iSourceID, iTargetId, iTag);
            this.sendFileData(fileData, attach);
        } else {
            this.sendFileComplete();
            this._sendFileCurrentIndex = -1;
            this._sendFileTime = 0;
            this._sendingFileTime = 0;
            this.sendNextFilePath();
        }
    }
        break;
    default:
        break;
    }
};

PsmProtocol.prototype.dealMessageCommand = function(body, bufData) {
    if (bufData.length > 0) {
        let iParam = bufData.indexOf(0);
        let sCommand = bufData.toString('utf8', 0, iParam);
        let iParamLength = bufData.readInt32LE(iParam + 1);
        let sParam = '';
        if (iParamLength > 0) {
            sParam = bufData.toString('utf8', iParam + 5);
        }
        let iReason = body.reason;
        let iContainerId = body.container;
        let iSourceID = body.sourceOriginal;
        let iTargetId = body.targetAddress;
        let iTag = body.resCommand;
        let attach = new PsmAttach(iReason, iContainerId, iSourceID, iTargetId, iTag);
        this.receivedMessageCommand(sCommand, sParam, attach);
        return PsmDefine.DealReplyType_Ack;
    }
    return PsmDefine.DealReplyType_Error_Data;
};

PsmProtocol.prototype.dealFileInformationWrite = function(body, bufData) {
    let pathInfo = PsmProtocol.pathInfoFromBuffer(bufData);
    this._receiveFileCurrentDataInfo.fileName = pathInfo[0];
    this._receiveFileCurrentDataInfo.fileSize = pathInfo[1];
    if (this._receiveFileCurrentDataInfo.fileSize > 0) {
        this._receiveFileCurrentDataInfo.fileData = [];
        this._receivedFileSize = 0;
        this._receiveFileInfoTargetId = body.targetAddress;
        return PsmDefine.DealReplyType_Ack;
    } else {
        return PsmDefine.DealReplyType_Error_Data;
    }
};

PsmProtocol.prototype.dealFileDataWrite = function(body, bufData) {
    if (bufData.length <= 0) {
        return;
    }
    this._receiveFileCurrentDataInfo.fileData.push(bufData);
    this._receivedFileSize += bufData.length;
    if (this._receivedFileSize >= this._receiveFileCurrentDataInfo.fileSize) {
        let iReason = body.reason;
        let iContainerId = body.container;
        let iSourceID = body.sourceOriginal;
        let iTargetId = this._receiveFileInfoTargetId;// body.targetAddress;
        let iTag = body.resCommand;
        this._receiveFileCurrentDataInfo.attach = new PsmAttach(iReason, iContainerId, iSourceID, iTargetId, iTag);
        this.receivedFileWrite();
    }
};

PsmProtocol.prototype.dealRealtimeRequest = function(body, bufData) {
    let iReason = body.reason;
    let iContainerId = body.container;
    let iSourceID = body.sourceOriginal;
    let iTargetId = body.targetAddress;
    let iTag = body.resCommand;
    let attach = new PsmAttach(iReason, iContainerId, iSourceID, iTargetId, iTag);
    this.receivedRealtimeDataRequest(attach);
    return PsmDefine.DealReplyType_Define;
};

PsmProtocol.prototype.dealRealtimePost = function(body, bufData) {
    if (bufData.length > 0) {
        let iReason = body.reason;
        let iContainerId = body.container;
        let iSourceID = body.sourceOriginal;
        let iTargetId = body.targetAddress;
        let iTag = body.resCommand;
        let attach = new PsmAttach(iReason, iContainerId, iSourceID, iTargetId, iTag);
        this.receivedRealtimeDataPost(body.paramType, bufData, body.paramCount, attach);
        return PsmDefine.DealReplyType_Ack;
    }
    return PsmDefine.DealReplyType_Error_Data;
};

PsmProtocol.prototype.postMessageCommand = function(sCommand, sParam = '', attach = null) {
    if (!(typeof sCommand === 'string' || sCommand instanceof String)) {
        return -1;
    }
    if (!(typeof sParam === 'string' || sParam instanceof String)) {
        return -1;
    }
    let bufCommand = Buffer.from(sCommand);
    let bufParam = Buffer.from(sParam);
    let bufData = Buffer.allocUnsafe(bufCommand.length + 1 + 4 + bufParam.length);
    let iOffset = 0;
    bufCommand.copy(bufData, iOffset);
    iOffset += bufCommand.length;
    bufData.writeInt8(0, iOffset, true);
    iOffset += 1;
    bufData.writeInt32LE(bufParam.length, iOffset, true);
    iOffset += 4;
    bufParam.copy(bufData, iOffset);
    return this.postData(PsmDefine.gct_message_command_param, 0, bufData, 0, attach);
};

PsmProtocol.prototype.postFile = function(sFilePath, attach = null) {
    this._sendFilePathes.set(sFilePath, attach);
    return this.sendNextFilePath();
};

PsmProtocol.prototype.postFileData = function(fileName, fileData, attach = null) {
    let fileDataInfo = new PsmFileDataInfo(fileName, '', PsmFileDataInfo.getFileSize(fileData), fileData, attach);
    this._sendFileQueueDataInfos.push(fileDataInfo);
    return this.sendNextFilePath();
};

PsmProtocol.prototype.postRealtimeDataRequest = function(attach = null) {
    return this.postData(PsmDefine.gct_realtime_data_request, 0, 0, 0, attach);
};

PsmProtocol.prototype.postRealtimeDataPost = function(iParamType, bufParam, iParamCount, attach = null) {
    return this.postData(PsmDefine.gct_realtime_data_post, iParamType, bufParam, iParamCount, attach);
};

PsmProtocol.prototype.postRealtimeDataStructsPost = function(iParamType, structs, attach = null) {
    let struct = PsmRealtimeDataStruct.structs.get(iParamType);
    if (struct) {
        let bufData = struct.toBuffer(structs);
        if (bufData.length > 0) {
            return this.postData(PsmDefine.gct_realtime_data_post, iParamType, bufData, structs.length, attach);
        } else {
            return -2;
        }
    } else {
        return -1;
    }
};

PsmProtocol.prototype.postHeartJump = function(attach = null) {
    return this.postData(PsmDefine.gct_channel_hand, 0, 0, 1, attach);
};

PsmProtocol.prototype.sendFileData = function(fileData, attach) {
    this.postData(PsmDefine.gct_file_content_write, 0, fileData, 0, attach);
    this._sendingFileTime = Date.now();
};

/**
 *
 * @param sFilePath
 * @param fnAfterLoad = function(iResult, <Array<buffer>>fileDatas)
 * @param iSpitLength
 */
PsmProtocol.loadFile = function(sFilePath, fnAfterLoad, iSpitLength = 1024) {
    if (!(fnAfterLoad instanceof Function)) {
        return;
    }
    const readable = fs.createReadStream(sFilePath);
    let iResult = 0;
    let rFileDatas = [];
    readable.on('error', (err) => {
        iResult = -1;
        fnAfterLoad(iResult);
    });
    readable.on('readable', () => {
        let chunk;
        while (null !== (chunk = readable.read(iSpitLength))) {
            rFileDatas.push(chunk);
            iResult += chunk.length;
        }
    });
    readable.on('end', function() {
        fnAfterLoad(iResult, rFileDatas);
    });
};

PsmProtocol.prototype.sendNextFilePath = function() {
    let r = 0;
    let self = this;
    if (self._sendFilePathes.size > 100) {
        self._sendFilePathes.clear();
        r = -2;
        return r;
    }
    if (self._sendFileQueueDataInfos.size > 100) {
        self._sendFileQueueDataInfos = [];
        r = -2;
        return r;
    }
    if (self._sendFileTime === 0 && self._sendingFileTime === 0) {
        if (self._sendFileQueueDataInfos.size() > 0) {
            self._sendFileCurrentDataInfo = self._sendFileQueueDataInfos.shift();
            self._sendFileTime = Date.now();
            r = self.sendFileInfo();
        } else {
            let sFilePath = null, attach = null;
            for ([sFilePath, attach] of self._sendFilePathes) {
                break;
            }
            if (sFilePath !== null) {
                self._sendFilePathes.delete(sFilePath);
                PsmProtocol.loadFile(sFilePath, function(iResult, fileDates) {
                    if (iResult > 0) {
                        self._sendFileCurrentDataInfo = new PsmFileDataInfo(path.basename(sFilePath), path.dirname(sFilePath), iResult, fileDates, attach);
                        self._sendFileTime = Date.now();
                        r = self.sendFileInfo();
                    } else {
                        if (self.onSentFile) {
                            self.onSentFile(-3, sFilePath);
                        }
                    }
                });
            } else {
                r = -4;
            }
        }
    } else {
        r = 1;
    }
    return r;
};

PsmProtocol.prototype.sendFileComplete = function() {
    if (this.onSentFile) {
        this.onSentFile(this._sendFileCurrentDataInfo.fileSize, this._sendFileCurrentDataInfo);
    }
};

PsmProtocol.prototype.sendFileInfo = function() {
    let bufData = PsmProtocol.pathInfoToBuffer(this._sendFileCurrentDataInfo.fileName, this._sendFileCurrentDataInfo.fileSize);
    return this.postData(PsmDefine.gct_file_information_write, 0, bufData, 0, this._sendFileCurrentDataInfo.attach);
};

PsmProtocol.pathInfoToBuffer = function(fileName, fileSize) {
    let bufFileName = new Buffer(fileName);
    let r = Buffer.allocUnsafe(bufFileName.length + 5);
    bufFileName.copy(r, 0);
    r.writeInt8(0, bufFileName.length, true);
    r.writeInt32LE(fileSize, bufFileName.length + 1, true);
    return r;
};

PsmProtocol.pathInfoFromBuffer = function(buf) {
    let rFileName = buf.toString('utf8', 0, buf.length - 5);
    let rFileSize = buf.readInt32LE(buf.length - 4, true);
    return [rFileName, rFileSize];
};

/**
 *
 * @param iCommand
 * @param iParamType
 * @param bufData
 * @param iParamCount
 * @param attach
 * @returns int
 */
PsmProtocol.prototype.postData = function(iCommand, iParamType, bufData, iParamCount, attach = null) {
    let iReason = 0;
    let iContainerId = 0;
    let iSourceId = 0;
    let iTargetId = 0;
    let iTag = 0;
    if (attach !== null) {
        iReason = attach.reason;
        iContainerId = attach.containerId;
        iSourceId = attach.sourceId;
        iTargetId = attach.targetId;
        iTag = attach.tag;
    }
    let body = new PsmPacketBody();
    body.sourceOriginal = iSourceId;
    if (this._sentSourceId > 0) {
        body.sourceAddress = this._sentSourceId;
    } else {
        body.sourceAddress = iSourceId;
    }
    body.resFrame = 0;
    if (this._sentTargetId > 0) {
        body.targetAddress = this._sentTargetId;
    } else {
        body.targetAddress = iTargetId;
    }
    body.controlWord = PsmDefine.CIPsmControlCode_Initiactive;
    body.command = iCommand;
    body.reason = iReason;
    body.resCommand = iTag;
    body.container = iContainerId;
    body.paramType = iParamType;
    body.paramCount = iParamCount;
    return this.postPacketData(body, bufData);
};

/**
 *
 * @param iCommand
 * @param attach
 * @returns int
 */
PsmProtocol.prototype.responseAck = function(iCommand, attach) {
    let iReason = 0;
    let iContainerId = 0;
    let iSourceId = 0;
    let iTargetId = 0;
    let iTag = 0;
    if (attach !== null) {
        iContainerId = attach.containerId;
        iSourceId = attach.sourceId;
        iTargetId = attach.targetId;
        iTag = attach.tag;
    }
    let body = new PsmPacketBody();
    body.frameType = 0;
    body.sourceOriginal = iSourceId;
    if (this._sentSourceId > 0) {
        body.sourceAddress = this._sentSourceId;
    } else {
        body.sourceAddress = iSourceId;
    }
    body.resFrame = 0;
    body.targetAddress = iTargetId;
    body.controlWord = PsmDefine.CIPsmControlCode_NACK;
    body.command = iCommand;
    body.reason = iReason;
    body.resCommand = iTag;
    body.container = iContainerId;
    body.paramType = 0;
    body.paramCount = 0;
    return this.postPacketData(body, Buffer.allocUnsafe(0));
};

/**
 *
 * @param iCommand
 * @param iErrorid
 * @param attach
 * @returns int
 */
PsmProtocol.prototype.responseNack = function(iCommand, iErrorid, attach) {
    let iReason = iErrorid;
    let iContainerId = 0;
    let iSourceId = 0;
    let iTargetId = 0;
    let iTag = 0;
    if (attach !== null) {
        iContainerId = attach.containerId;
        iSourceId = attach.sourceId;
        iTargetId = attach.targetId;
        iTag = attach.tag;
    }
    let body = new PsmPacketBody();
    body.frameType = 0;
    body.sourceOriginal = iSourceId;
    if (this._sentSourceId > 0) {
        body.sourceAddress = this._sentSourceId;
    } else {
        body.sourceAddress = iSourceId;
    }
    body.resFrame = 0;
    body.targetAddress = iTargetId;
    body.command = iCommand;
    body.reason = iReason;
    body.resCommand = iTag;
    body.container = iContainerId;
    body.paramType = 0;
    body.paramCount = 0;
    return this.postPacketData(body, Buffer.allocUnsafe(0));
};

/**
 * postPacketData
 * @param {Object}body
 * @param {Buffer}bufData
 * @return {Number}int
 */
PsmProtocol.prototype.postPacketData = function(body, bufData) {
    let buf = packetPsmSend(body, bufData);
    return this.channel.sendData(buf);
};


/**
 * reportSelf
 * @return {String}string
 */
PsmProtocol.prototype.reportSelf = function() {
    let sLastTime = new Date(this._lastReceivedDataTime);
    return util.format(' sentSourceId: %d, sentTargetId: %d, lastReceivedDataTime: %s ',
        this._sentSourceId, this._sentTargetId, sLastTime);
};

PsmProtocol.prototype.checkProtocol = function(interval) {
    let self = this;
    if (interval < 1000) {
        if (self.checkTimer) {
            clearTimeout(self.checkTimer);
        }
        return;
    }

    if (self.checkTimer) {
        clearTimeout(self.checkTimer);
    }

    let timeOut = function() {
        // 发送超时
        if (self._sendingFileTime !== 0) {
            if ((Date.now() - self._sendingFileTime) > 1000) {
                self._sendFileCurrentDataInfo = new PsmFileDataInfo();
                self._sendFileCurrentIndex = -1;
                self._sendFileTime = 0;
                self._sendingFileTime = 0;
            }
        } else if (self._sendFileTime !== 0) {
            if ((Date.now() - self._sendFileTime) > 1000) {
                self._sendFileCurrentDataInfo = new PsmFileDataInfo();
                self._sendFileCurrentIndex = -1;
                self._sendFileTime = 0;
                self._sendingFileTime = 0;
            }
        }

        self.checkTimer = setTimeout(timeOut, interval);
    };
    self.checkTimer = setTimeout(timeOut, interval);
};

PsmProtocol.prototype.receivedMessageCommand = function(sCommand, sParam, attach) {
    if (this.onReceivedMessage instanceof Function) {
        this.onReceivedMessage(sCommand, sParam, attach);
    }
};

PsmProtocol.prototype.receivedFileWrite = function() {
    if (this.onReceivedFile instanceof Function) {
        this.onReceivedFile(this._receiveFileCurrentDataInfo);
    }
};

PsmProtocol.prototype.receivedRealtimeDataRequest = function(attach) {
    if (this.onReceivedRealtimeDataRequest instanceof Function) {
        this.onReceivedRealtimeDataRequest(attach);
    }
};

PsmProtocol.prototype.receivedRealtimeDataPost = function(iParamType, bufParam, iParamCount, attach) {
    if (this.onReceivedRealtimeDataPost instanceof Function) {
        this.onReceivedRealtimeDataPost(iParamType, bufParam, iParamCount, attach);
    }
    if (this.onReceivedRealtimeDataStruct instanceof Function) {
        let struct = PsmRealtimeDataStruct.structs.get(iParamType);
        if (struct) {
            let objs = struct.fromBuffer(bufParam);
            this.onReceivedRealtimeDataStruct(iParamType, objs, attach);
        }
    }
};

PsmProtocol.prototype.on = function(command, fn) {
    this.fns.set(command, fn);
};

PsmProtocol.prototype.dispatch = function(command, msgObj) {
    let fn = this.fns.get(command);
    if (fn) {
        fn(msgObj);
    } else if (this.fnAllPacket) {
        this.fnAllPacket(command, msgObj);
    }
};

PsmProtocol.prototype.sendPacket = function(packet) {
    return this.channel.sendData(packet);
};

PsmProtocol.PsmDefine = PsmDefine;
PsmProtocol.PsmRealtimeDataStruct = PsmRealtimeDataStruct;

// Init User Packet
{
    let yxStruct = new PsmRealtimeDataStruct();
    yxStruct.add('address');
    yxStruct.add('value');
    yxStruct.add('quality');
    yxStruct.add('datetime', 8, BaseAttr.CI_Type_long);
    yxStruct.setParamType(0x01010203);
    PsmRealtimeDataStruct.yxStruct = yxStruct;

    let ycStruct = new PsmRealtimeDataStruct();
    ycStruct.add('address');
    ycStruct.add('value', 8, BaseAttr.CI_Type_double);
    ycStruct.add('quality');
    ycStruct.add('datetime', 8, BaseAttr.CI_Type_long);
    ycStruct.setParamType(0x0101021C);
    PsmRealtimeDataStruct.ycStruct = ycStruct;

    let ywStruct = new PsmRealtimeDataStruct();
    ywStruct.add('address');
    ywStruct.add('value', 128, BaseAttr.CI_Type_string);
    ywStruct.add('quality');
    ywStruct.add('datetime', 8, BaseAttr.CI_Type_long);
    ywStruct.setParamType(0x0101022F);
    PsmRealtimeDataStruct.ycStruct = ywStruct;

    if (false) {
        let psm = new PsmProtocol();
        psm.start({
            LocalIpAddress: '127.0.0.1',
            LocalPort: 5555,
            RemoteIpAddress: '127.0.0,.1',
            RemotePort: 5556,
            FileSavePath: 'f:/temp',
        });

        let yxes = [
            {address: 0x01000001, value: 1, quality: 1, datetime: Date.now()},
            {address: 0x01000002, value: 2, quality: 1, datetime: Date.now()},
        ];
        let iResult = psm.postRealtimeDataStructsPost(PsmRealtimeDataStruct.yxStruct.paramType, yxes);
        console.log('psm.postRealtimeDataStructsPost iResult=', iResult);
    }
}

PsmProtocol.test1 = function() {
    let psmProtocol = new PsmProtocol();

    psmProtocol.start({
        LocalIpAddress: '127.0.0.1',
        LocalPort: 9005,
        RemoteIpAddress: '127.0.0.1',
        RemotePort: 9105,
        FileSavePath: 'f:/temp',
    });

    // all in
    psmProtocol.onReceivedMessage = function(sCommand, sParam, attach) {
        console.log(sCommand, sParam);
    };

    let iTimes = 0;
    setInterval(function() {
        let yxes = [
            {address: 0x01000001 + iTimes, value: iTimes++, quality: 1, datetime: Date.now()},
            {address: 0x01000001 + iTimes, value: iTimes++, quality: 1, datetime: Date.now()},
        ];
        let iResult = psmProtocol.postRealtimeDataStructsPost(PsmRealtimeDataStruct.yxStruct.paramType, yxes);
        let sLog = 'psmProtocol.postRealtimeDataStructsPost iResult=' + iResult.toString();
        console.log(sLog);
        fs.writeFile('f:/001.txt', sLog, function(err) {
            if (err) {
                console.log(err);
            }
        });
        iResult = psmProtocol.postMessageCommand('post.tts.1', 'txt=你好才是大家好');
        sLog = 'psmProtocol.postMessageCommand iResult=' + iResult.toString();
        console.log(sLog);
        fs.writeFile('f:/001.txt', sLog, function(err) {
            if (err) {
                console.log(err);
            }
        });
    }, 3000);
};
