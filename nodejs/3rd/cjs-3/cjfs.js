(function() {
    'use strict';
    if (typeof exports === 'object' && typeof global === 'object') {
        global.cjs = global.cjs || {};
    } else {
        throw Error('cjs only run at node.js or web browser');
    }
    let CjFs = cjs.CjFs || {};
    cjs.CjFs = CjFs;
    if (typeof exports === 'object' && typeof global === 'object') {
        exports = module.exports = CjFs;
    }

    if (CjFs.hasOwnProperty('loadSync')) return;

    const fs = require('fs');
    const path = require('path');

    CjFs.loadSync = function(sFilePath) {
        if (!CjFs.isExistFileSync(sFilePath)) {
            return null;
        }
        return fs.readFileSync(sFilePath);
    };

    CjFs.load2ObjectSync = function(sFilePath) {
        let r = null;
        if (!CjFs.isExistFileSync(sFilePath)) {
            return r;
        }
        try {
            r = JSON.parse(fs.readFileSync(sFilePath));
        } catch (e) {
        }
        return r;
    };

    CjFs.baseName = function(str) {
        let base = String(str).substring(str.lastIndexOf(path.sep) + 1);
        if (base.lastIndexOf('.') !== -1) {
            base = base.substring(0, base.lastIndexOf('.'));
        }
        return base;
    };

    /**
     *
     * @param sDir
     * @returns {Array}
     */
    CjFs.scantDirSync = function(sDir) {
        let outList = [];
        try {
            let stat = fs.statSync(sDir);
            if (stat.isDirectory()) {
                CjFs._walkDirSync(CjFs.normalize(sDir), outList);
            }
        } catch (e) {
        }
        return outList;
    };

    CjFs.scantFileSync = function(sDir) {
        let outList = [];
        try {
            let stat = fs.statSync(sDir);
            if (stat.isDirectory()) {
                CjFs._walkFileSync(CjFs.normalize(sDir), outList);
            }
        } catch (e) {
        }
        return outList;
    };

    CjFs.scantSync = function(sDir) {
        let outPathList = [];
        let outStatList = [];
        try {
            let stat = fs.statSync(sDir);
            if (stat.isDirectory()) {
                CjFs._walkSync(CjFs.normalize(sDir), outPathList, outStatList);
            }
        } catch (e) {
        }
        return outPathList;
    };

    // return outPathList, outStatList
    CjFs.scant2Sync = function(sDir) {
        let outPathList = [];
        let outStatList = [];
        try {
            let stat = fs.statSync(sDir);
            if (stat.isDirectory()) {
                CjFs._walkSync(CjFs.normalize(sDir), outPathList, outStatList);
            }
        } catch (e) {
        }
        return [outPathList, outStatList];
    };

    /**
     * * sample : fileList = []; walk('/temp' , fileList, true);
     * @param sDir
     * @param outList
     */
    CjFs._walkDirSync = function(sDir, outList) {
        let dirList = fs.readdirSync(sDir);

        dirList.forEach(function(item) {
            let stat = fs.statSync(sDir + path.sep + item);
            if (stat.isDirectory()) {
                outList.push(sDir + path.sep + item);
            }
        });

        dirList.forEach(function(item) {
            if (fs.statSync(sDir + path.sep + item).isDirectory()) {
                CjFs._walkDirSync(sDir + path.sep + item, outList);
            }
        });
    };

    CjFs._walkFileSync = function(sDir, outList) {
        let dirList = fs.readdirSync(sDir);

        dirList.forEach(function(item) {
            let stat = fs.statSync(sDir + path.sep + item);
            if (stat.isFile()) {
                outList.push(sDir + path.sep + item);
            }
        });

        dirList.forEach(function(item) {
            if (fs.statSync(sDir + path.sep + item).isDirectory()) {
                CjFs._walkFileSync(sDir + path.sep + item, outList);
            }
        });
    };

    CjFs._walkSync = function(sDir, outPathList, outStatList) {
        let pathList = fs.readdirSync(sDir);
        let dirList = [];

        pathList.forEach(function(item) {
            let sPath = sDir + path.sep + item;
            outPathList.push(sPath);
            let stat = fs.statSync(sPath);
            outStatList.push(stat);
            if (stat.isDirectory()) {
                dirList.push(sPath);
            }
        });

        dirList.forEach(function(item) {
            CjFs._walkSync(item, outPathList, outStatList);
        });
    };

    CjFs.findPathSync = function(sDir, sSubPath) {
        let r = '';
        if (!sSubPath || path.isAbsolute(sSubPath)) {
            return r;
        }
        let sSubPath2 = path.normalize(sSubPath);
        if (sSubPath2.charAt(0) !== path.sep) {
            sSubPath2 = path.sep + sSubPath2;
        }
        let pathList = CjFs.scantSync(sDir);
        for (let i = 0; i < pathList.length; i++) {
            if (pathList[i].indexOf(sSubPath2) >= 0) {
                r = pathList[i];
                break;
            }
        }
        return r;
    };

    // fs.writeFileSync(sTargetFilePath, fs.readFileSync(sSourceFilePath));
    // fs.createReadStream(sSourceFilePath).pipe(fs.createWriteStream(sTargetFilePath));
    CjFs.copyFileSync = function(sSourceFilePath, sTargetFilePath) {
        let r = false;
        if (!path.isAbsolute(sTargetFilePath) || !path.isAbsolute(sSourceFilePath)) {
            return r;
        }
        try {
            let stat = fs.statSync(sSourceFilePath);
            if (stat.isFile()) {
                let readStream = fs.createReadStream(sSourceFilePath);
                let writeStream = fs.createWriteStream(sTargetFilePath);
                readStream.pipe(writeStream);
                r = true;
            }
        } catch (e) {
            r = false;
        }
        return r;
    };

    CjFs.copyDirSync = function(src, dist, callback) {
        fs.access(dist, function(err) {
            if (err) {
                fs.mkdirSync(dist);
            }
            _copy(null, src, dist);
        });

        function _copy(err, src, dist) {
            if (err) {
                callback(err);
            } else {
                fs.readdir(src, function(err, paths) {
                    if (err) {
                        callback(err);
                    } else {
                        paths.forEach(function(path) {
                            let _src = src + path.sep + path;
                            let _dist = dist + path.sep + path;
                            fs.stat(_src, function(err, stat) {
                                if (err) {
                                    callback(err);
                                } else {
                                    //  判断是文件还是目录
                                    if (stat.isFile()) {
                                        fs.writeFileSync(_dist, fs.readFileSync(_src));
                                    } else if (stat.isDirectory()) {
                                        //  当是目录是，递归复制
                                        CjFs.copyDirSync(_src, _dist, callback);
                                    }
                                }
                            });
                        });
                    }
                });
            }
        }
    };

    CjFs.mkdirMultiLevel = function(sDir, callback) {
        fs.access(sDir, fs.constants.F_OK, (err) => {
            // console.log(err ? 'no access!' : 'can read/write');
            if (err) {
                // console.log(path.dirname(dirname));
                CjFs.mkdirMultiLevel(path.dirname(sDir), function() {
                    fs.mkdir(sDir, callback);
                });
            } else {
                callback();
            }
        });
    };

    CjFs.mkdirMultiLevelSync = function (sDir) {
        //console.log(sDir);
        if (fs.existsSync(sDir)) {
            return true;
        } else {
            if (CjFs.mkdirMultiLevelSync(path.dirname(sDir))) {
                fs.mkdirSync(sDir);
                return true;
            }
        }
    };

    CjFs.isExistSync = function(sDir) {
        let bIsExist = false;
        try {
            fs.statSync(sDir);
            bIsExist = true;
        } catch (e) {
        }
        return bIsExist;
    };

    CjFs.isExistFileSync = function(sFilePath) {
        let bIsExist = false;
        try {
            let stat = fs.statSync(sFilePath);
            bIsExist = stat.isFile();
        } catch (e) {
        }
        return bIsExist;
    };

    CjFs.getParentPath = function(sPath) {
        return path.dirname(sPath);
    };

    CjFs.normalize = function(sPath) {
        if (typeof sPath === 'string' || sPath instanceof String) {
            let r = sPath.split(/[/|\\]+/).join(path.sep);
            r = r.endsWith(path.sep) ? r.substr(0, r.length - 1) : r;
            return r;
        }
    };
})();
