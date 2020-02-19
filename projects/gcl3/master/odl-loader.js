const path = require('path');
const fs = require('fs');

let odcPathes = [
    './../../../assets/3rd/odl-3/odl',
    './../../../assets/3rd/odl-3/odl_n_mysql',
    './../../../assets/3rd/odl-3/odl_n_vue',
    './../../../assets/3rd/odl-3/odl_n_token',
    './../../../assets/gcl3/master/config/odc_department',
    './../../../assets/gcl3/master/config/odc_role_group',
    './../../../assets/gcl3/master/config/odc_user',
    './../../../assets/gcl3/master/config/odc_bureau',
    './../../../assets/gcl3/master/config/odc_container_stat',
    './../../../assets/gcl3/master/config/odc_locket',
    './../../../assets/gcl3/master/config/odc_client_upload',
];
// let odcPathes = [];

// let odcPath = "./../../../assets/gcl3/master/config";
// const odcFileNames = require('./../../../assets/gcl3/master/config/odc').odcFileNames;
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
