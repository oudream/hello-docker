const path = require('path');
const fs = require('fs');

let odcPathes = [
    './../../../assets/3rd/odl-3/odl',
    './../../../assets/3rd/odl-3/odl_n_mysql',
    './../../../assets/3rd/odl-3/odl_n_vue',
    './../../../assets/3rd/odl-3/odl_n_token',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_cmm_cst',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_cmm_obj',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_cmm_prop',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_lock_manu',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_lock_reg',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_lock_rt',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_lock_log',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_sys_user',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_sys_role',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_sys_auth',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_sys_dept',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_sys_log',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_tck_main',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_tck_detail',
    './../../../assets/pinfox/pl10_safe_lock/config/odc_tck_log',
];
// let odcPathes = [];

// let odcPath = "./../../../assets/pinfox/pl10_safe_lock/config";
// const odcFileNames = require('./../../../assets/pinfox/pl10_safe_lock/config/odc').odcFileNames;
//
// for (let i = 0; i < odcFileNames.length; i++) {
//     odcPathes.push(path.normalize(path.join(odcPath, odcFileNames[i])));
// }

for (let i = 0; i < odcPathes.length; i++) {
    require(odcPathes[i]);
}

exports = module.exports = {
    /**
     * mock bootstrap
     */
    init(httpServer, db) {

    }
};
