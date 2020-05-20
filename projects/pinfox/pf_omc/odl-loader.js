const path = require('path');
const fs = require('fs');

let odcPathes = [
    './../../../assets/3rd/odl-3/odl',
    './../../../assets/3rd/odl-3/odl_n_mysql',
    './../../../assets/3rd/odl-3/odl_n_vue',
    './../../../assets/3rd/odl-3/odl_n_token',
    './../../../assets/pinfox/pf_omc/config/odc_department',
    './../../../assets/pinfox/pf_omc/config/odc_role_group',
    './../../../assets/pinfox/pf_omc/config/odc_user',
    './../../../assets/pinfox/pf_omc/config/odc_bureau',
    './../../../assets/pinfox/pf_omc/config/odc_container_stat',
    './../../../assets/pinfox/pf_omc/config/odc_lock',
    './../../../assets/pinfox/pf_omc/config/odc_client_upload',
];
// let odcPathes = [];

// let odcPath = "./../../../assets/pinfox/pf_omc/config";
// const odcFileNames = require('./../../../assets/pinfox/pf_omc/config/odc').odcFileNames;
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
