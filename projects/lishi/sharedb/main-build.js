const path = require('path');
const fs = require('fs');

process.env.CVUE3_WEB_P  = path.resolve(__dirname, './../../../assets/lishi/sharedb');
process.env.CVUE3_NODE_P  = __dirname;
process.env.CVUE3_ROOT_P  = path.resolve(__dirname, './../../..');

require('./../../../nodejs/3rd/cvue-3/admin/build');
