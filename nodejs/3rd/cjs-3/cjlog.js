(function() {
    'use strict';

    if (typeof exports === 'object' && typeof global === 'object') {
        global.cjs = global.cjs || {};
    } else {
        throw Error('cjs only run at node.js or web browser');
    }
    let CjLog = cjs.CjLog || {};
    cjs.CjLog = CjLog;
    if (typeof exports === 'object' && typeof global === 'object') {
        exports = module.exports = CjLog;
    }

    if (CjLog.hasOwnProperty('log')) return;

    let fs = require('fs');
    let path = require('path');
    let CjInterinfo = require('./cjinterinfo_lang.js');

    // CjLog._defaultLogPath = path.join(process.cwd(), 'log');
    CjLog._defaultLogPath = path.normalize(path.join(__dirname, '../../../log'));
    CjLog.setDefaultLogPath = function(sLogPath) {
        CjLog._defaultLogPath = sLogPath;
    };

    CjLog.defaultDateString = function(dt) {
        let dt2 = dt instanceof Date ? dt : new Date();
        let D = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
        return [dt2.getFullYear(), D[dt2.getMonth() + 1] || dt2.getMonth() + 1, D[dt2.getDate()] || dt2.getDate()].join('-');
    };

    CjLog.mkdirsSync = function(dirname) {
        if (fs.existsSync(dirname)) {
            return true;
        } else {
            if (CjLog.mkdirsSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname, 0o777);
                return true;
            }
        }
    };

    function CjModule(sModule) {
        this.module = sModule;

        this.logPath = path.join(CjLog._defaultLogPath, sModule);
        CjLog.mkdirsSync(this.logPath);

        this.logFileCreateTime = new Date();

        this.currentLogFilePath = '';
        this.currentWriteStream = null;
        this.updateLog = function() {
            let sLogFilePath = path.join(this.logPath, CjLog.defaultDateString() + '.json');
            if (this.currentLogFilePath === sLogFilePath) return;
            try {
                if (this.currentWriteStream) {
                    let writeStream = this.currentWriteStream;
                    this.currentWriteStream = null;
                    writeStream.end();
                }
                this.currentWriteStream = fs.createWriteStream(sLogFilePath, {
                    flags: 'a+',
                    defaultEncoding: 'utf8',
                    fd: null,
                    mode: 0o666,
                    autoClose: false,
                });
                this.currentWriteStream.write('\r\n\r\n\r\n' + JSON.stringify({
                    logStartTime: new Date(),
                }) + '\r\n');
                this.currentLogFilePath = sLogFilePath;
                this.logFileCreateTime = new Date();
            } catch (e) {
                console.error('CjLog Error!!!');
                console.error(e);
            }
        };
        this.updateLog();
    }

    CjModule.prototype.log = function(sInfo) {
        if (this.logFileCreateTime.getDate() !== (new Date()).getDate()) {
            this.updateLog();
        }
        this.currentWriteStream.write(sInfo);
    };

    CjLog._modules = [];
    CjLog.findModule = function(sModule) {
        for (let i = 0; i < CjLog._modules.length; i++) {
            let module = CjLog._modules[i];
            if (module.module === sModule) {
                return module;
            }
        }
        return null;
    };

    CjLog.registerModule = function(sModule) {
        if (typeof sModule !== 'string' && !(sModule instanceof String)) {
            return false;
        }
        if (CjLog.findModule(sModule) === null) {
            let module = new CjModule(sModule);
            CjLog._modules.push(module);
            CjLog[sModule] = module;
        }
    };

    CjLog.defaultModule = new CjModule('default');
    CjLog.registerModule(CjLog.defaultModule);

    // log out
    function CjOutputLog() {
        CjInterinfo.OutPutI.call(this);

        let self = this;

        this.output = function() {
            let module = CjLog.findModule(self.infoParam.module);
            if (module !== null) {
                module.log(self.getInfoParamString() + '\r\n');
                module.log(JSON.stringify(arguments) + '\r\n');
            } else {
                CjLog.defaultModule.log(self.getInfoParamString() + '\r\n');
                CjLog.defaultModule.log(JSON.stringify(arguments) + '\r\n');
            }
        };
    }

    CjInterinfo.registerRegisterModule(CjLog.registerModule);
    CjInterinfo.registerOutput(CjOutputLog);

    CjInterinfo.Module.prototype.log = function() {
        let output = new CjOutputLog();
        output.infoParam.module = this.module;
        output.infoParam.level = CjInterinfo.LevelInfo;
        output.output(...arguments);
    };

    CjInterinfo.Module.prototype.logDebug = function() {
        let output = new CjOutputLog();
        output.infoParam.module = this.module;
        output.infoParam.level = CjInterinfo.LevelDebug;
        output.output(...arguments);
    };

    CjInterinfo.Module.prototype.logInfo = function() {
        let output = new CjOutputLog();
        output.infoParam.module = this.module;
        output.infoParam.level = CjInterinfo.LevelInfo;
        output.output(...arguments);
    };

    CjInterinfo.Module.prototype.logWarn = function() {
        let output = new CjOutputLog();
        output.infoParam.module = this.module;
        output.infoParam.level = CjInterinfo.LevelWarn;
        output.output(...arguments);
    };

    CjInterinfo.Module.prototype.logError = function() {
        let output = new CjOutputLog();
        output.infoParam.module = this.module;
        output.infoParam.level = CjInterinfo.LevelError;
        output.output(...arguments);
    };

    cjs.log = CjLog.log = function() {
        let output = new CjOutputLog();
        output.infoParam.level = CjInterinfo.LevelInfo;
        output.output(...arguments);
    };

    cjs.logDebug = CjLog.logDebug = function() {
        let output = new CjOutputLog();
        output.infoParam.level = CjInterinfo.LevelDebug;
        output.output(...arguments);
    };

    cjs.logInfo = CjLog.logInfo = function() {
        let output = new CjOutputLog();
        output.infoParam.level = CjInterinfo.LevelInfo;
        output.output(...arguments);
    };

    cjs.logWarn = CjLog.logWarn = function() {
        let output = new CjOutputLog();
        output.infoParam.level = CjInterinfo.LevelWarn;
        output.output(...arguments);
    };

    cjs.logError = CjLog.logError = function() {
        let output = new CjOutputLog();
        output.infoParam.level = CjInterinfo.LevelError;
        output.output(...arguments);
    };
})();
