

(function() {
    'use strict';

    if (typeof exports === 'object' && typeof global === 'object') {
        global.cjs = global.cjs || {};
    } else {
        throw Error('cjs only run at node.js or web browser');
    }
    let CjAppEnv = cjs.CjAppEnv || {};
    cjs.CjAppEnv = CjAppEnv;
    if (typeof exports === 'object' && typeof global === 'object') {
        exports = module.exports = CjAppEnv;
    }

    if (CjAppEnv.hasOwnProperty('_configPath')) return;

    let fs = require('fs');
    let path = require('path');
    let os = require('os');

    require('./cjmeta_lang.js');
    require('./cjstring_lang.js');
    require('./cjnumber_lang.js');
    require('./cjdate_lang.js');
    require('./cjfunction_lang.js');
    require('./cjencoding_charset_lang.js');
    require('./cjjson_lang.js');
    require('./cjinterinfo_lang.js');
    require('./cjlog.js');
    require('./cjbuffer.js');
    require('./cjfs.js');

    CjAppEnv._deployPath = path.normalize(path.join(__dirname, '../../../'));

    // CjAppEnv._configPath = path.join(process.cwd(), 'config');
    CjAppEnv._configPath = path.join(CjAppEnv._deployPath, 'config');
    CjAppEnv.setDefaultConfigPath = function(sPath) {
        CjAppEnv._configPath = sPath;
    };

    cjs.CjLog.setDefaultLogPath(path.join(CjAppEnv._deployPath, 'log'));

    CjAppEnv._process = function() {
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
            if (argValue.length>0)
                argValue += ' ' + arg;
            else
                argValue = arg;
        });
        if (argKey) {
            argv[argKey] = argValue;
        }
        CjAppEnv._argv = argv;
    };

    CjAppEnv.getArgv = function() {
        return CjAppEnv._argv;
    };

    CjAppEnv.init = function () {


        if (!fs.existsSync(CjAppEnv._configPath)) {
            fs.mkdirSync(CjAppEnv._configPath, 0o777);
        }

        let configFilePath = path.normalize(path.join(CjAppEnv._configPath, '/config.json'));
        if (configFilePath && fs.existsSync(configFilePath) && configFilePath.indexOf('.json') !== -1) {
            try {
                CjAppEnv.config = JSON.parse(fs.readFileSync(configFilePath));
            }
            catch (e) {
                CjAppEnv.config = null;
                cjs.warn("JSON.parse(fs.readFileSync(configFilePath)) error!!!");
            }
        }

        CjAppEnv.networkIps = {};
        let ifaces = os.networkInterfaces();
        for (let dev in ifaces) {
            if (ifaces[dev].some(function(details) {
                    if ((details.family == 'IPv4') && (details.internal == false)) {
                        CjAppEnv.networkIps['localIP'] = details.address;
                        CjAppEnv.networkIp = details.address;
                        return true;
                    } else {
                        return false;
                    }
                })) break;
        }

    }

})();
