const path = require('path');
const fs = require('fs');

// vue admin package filepath
process.env.CVUEADMIN_PROJECT_P = path.resolve(__dirname, './../../../assets/gcl3/master');
process.env.CVUEADMIN_PACKAGE_FP = path.resolve(__dirname, './package.json');
process.env.CVUEADMIN_CONFIG_P = path.resolve(__dirname, './cvue-admin');
process.env.CVUEADMIN_MYSQL_CONFIG_FP = path.resolve(__dirname, './master.json');
process.env.CVUEADMIN_INDEX_PAGE_FP = path.resolve(__dirname, './cvue-admin/index.html');

require('./../../../nodejs/3rd/cvue-3/admin/dev-server');
