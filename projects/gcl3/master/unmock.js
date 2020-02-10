'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');

let FileServer = require('./../../../nodejs/3rd/cjs-3/cjhttp_file_server');
const fileServer = new FileServer();
fileServer.config.assetsPath = path.normalize(path.join(__dirname, './../../../../../'));

const UserData = require('./data/user');

const LoginUsers = UserData[0];
const Users = UserData[1];

let _Users = Users;

let parseBody = function(req, res, body) {
    if (body) {
        let r = undefined;
        try {
            r = JSON.parse(body);
        }
        catch (e) {
            let err = 'error: JSON.parse(body) by url :' + req.url;
            console.log(err);
            res.writeHead(500);
            res.end(JSON.stringify({code: 500, msg: err}));
        }
        return r;
    }
    return undefined;
};

let getRequestIp = function(req, res) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);

};
// {
//     id: 1,
//     username: 'admin',
//     password: '123456',
//     avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
//     name: '张某某'
// }
let dealUser = function(app, httpMysqlServer) {
    // mock success request
    app.route('/success')
        .get(function(req, res) {
            res.writeHead(200);
            res.end(JSON.stringify({
                msg: 'success'
            }));
        });

    // mock error request
    app.route('/error')
        .get(function(req, res) {
            res.writeHead(500);
            res.end(JSON.stringify({
                msg: 'failure'
            }));
        });
    //登录模拟
    app.route('/login-1')
        .post(function(req, res) {
            let body = '';
            req.on('data', function(chunk) {
                body += chunk;
            });
            req.on('end', function() {
                let reqBody = parseBody(req, res, body);
                if (!reqBody) return;
                let {username, password} = reqBody;

                let user = null;
                let hasUser = LoginUsers.some(u => {
                    if (u.username === username && u.password === password) {
                        user = JSON.parse(JSON.stringify(u));
                        user.password = undefined;
                        return true;
                    }
                });

                if (hasUser) {
                    res.writeHead(200);
                    res.end(JSON.stringify({code: 200, msg: '请求成功', user}));
                }
                else {
                    res.writeHead(200);
                    res.end(JSON.stringify({code: 500, msg: '账号或密码错误', user}));
                }
            });
        });
//登录
    app.route('/login')
        .post(function(req, res) {
            let body = '';
            req.on('data', function(chunk) {
                body += chunk;
            });
            req.on('end', function() {
                let reqBody = parseBody(req, res, body);
                if (!reqBody) return;
                let {username, password} = reqBody;

                let sql = 'select id as `id`,f_name as `name`,f_uri as `username`,f_pw as `password`, f_img as `avatar` from ti_obj_user where f_uri=\'' + username + '\' and f_pw = \'' + password + '\'';

                httpMysqlServer.query(sql, function(err, values, fields) {
                    let user = null;

                    if (err) {
                        res.writeHead(200);
                        res.end(JSON.stringify({code: 500, msg: '数据访问错误', user}));
                    }
                    else {
                        if (Array.isArray(values)) {
                            if (values.length == 0) {
                                res.writeHead(200);
                                res.end(JSON.stringify({code: 500, msg: '账号或密码错误', user}));
                            }
                            else {
                                user = values[0];
                                user.password = undefined;
                                res.writeHead(200);
                                res.end(JSON.stringify({code: 200, msg: '请求成功', user}));
                            }
                        }
                        else {
                            res.writeHead(200);
                            res.end(JSON.stringify({code: 500, msg: '数据返回错误', user}));
                        }
                    }
                });
            });
        });
    //获取用户列表
    app.route('/user/list')
        .get(function(req, res) {
            let paramsObj = url.parse(req.url, true).query;
            let {name} = paramsObj;
            let mockUsers = _Users.filter(user => {
                if (name && user.name.indexOf(name) == -1) return false;
                return true;
            });

            let sessionId = paramsObj.sessionId;
            let fncode = paramsObj.fncode;

            res.writeHead(200);
            res.end(JSON.stringify({
                users: mockUsers
            }));
        });

    //获取用户列表（分页）
    app.route('/user/listpage')
        .get(function(req, res) {
            let paramsObj = url.parse(req.url, true).query;
            let {page, name} = paramsObj;
            let mockUsers = _Users.filter(user => {
                if (name && user.name.indexOf(name) == -1) return false;
                return true;
            });
            let total = mockUsers.length;
            mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
            res.writeHead(200);
            res.end(JSON.stringify({
                total: total,
                users: mockUsers
            }));
        });

    //删除用户
    app.route('/user/remove')
        .get(function(req, res) {
            let paramsObj = url.parse(req.url, true).query;
            let {id} = paramsObj;
            _Users = _Users.filter(u => u.id !== id);
            res.writeHead(200);
            res.end(JSON.stringify({
                code: 200,
                msg: '删除成功'
            }));
        });

    //批量删除用户
    app.route('/user/batchremove')
        .get(function(req, res) {
            let paramsObj = url.parse(req.url, true).query;
            let {ids} = paramsObj;
            ids = ids.split(',');
            _Users = _Users.filter(u => !ids.includes(u.id));
            res.writeHead(200);
            res.end(JSON.stringify({
                code: 200,
                msg: '删除成功'
            }));
        });

    //编辑用户
    app.route('/user/edit')
        .get(function(req, res) {
            let paramsObj = url.parse(req.url, true).query;
            let {id, name, addr, birth, age, sex} = paramsObj;
            _Users.some(u => {
                if (u.id === id) {
                    u.name = name;
                    u.addr = addr;
                    u.age = age;
                    u.birth = birth;
                    u.sex = sex;
                    return true;
                }
            });
            res.writeHead(200);
            res.end(JSON.stringify({
                code: 200,
                msg: '编辑成功'
            }));
        });

    //新增用户
    app.route('/user/add')
        .get(function(req, res) {
            let paramsObj = url.parse(req.url, true).query;
            let {name, addr, age, birth, sex} = paramsObj;
            _Users.push({
                name: name,
                addr: addr,
                age: age,
                birth: birth,
                sex: sex
            });
            res.writeHead(200);
            res.end(JSON.stringify({
                code: 200,
                msg: '新增成功'
            }));
        });
};

/**
 * @param app
 * @param httpMysqlServer
 */
let dealSql = function(app, httpMysqlServer) {
    /**
     // request url：
     http://localhost:xxxx/sql/query

     // data.json
     {
        session: Date.now(),
        sqls: [
            "inseart table xx",
            "update table xx",
            "select id=1 from t1",
            ]
     }

     // resp1.json
     // "data".item is object || array
     {
        session: ^,
        values:[
            {err:null, state: {affectedRows: 1}},
            {err:null, state: {affectedRows: 1}},
            {err:null, data: [ {f1: v11, f2: v12},{f1: v21, f2: v22}]}
            ],
        state: {err:null}
     }
     */
    app.route('/sql/query')
        .post(function(req, res) {
            let body = '';
            req.on('data', function(chunk) {
                body += chunk;
            });
            req.on('end', function() {
                let reqBody = parseBody(req, res, body);
                if (!reqBody) return;
                let {session, sql} = reqBody;
                httpMysqlServer.query(sql, function(err, values, fields) {
                    let r = {
                        session: session,
                        sql: sql,
                        state: {}
                    };
                    if (err) {
                        r.state.err = err;
                        res.writeHead(200);
                        res.end(JSON.stringify(r));
                    }
                    else {
                        if (Array.isArray(values)) {
                            r.state.affectedRows = values.length;
                            r.data = values;
                        }
                        else {
                            r.state.affectedRows = values.affectedRows;
                        }
                        res.writeHead(200);
                        res.end(JSON.stringify(r));
                    }
                });
            });
        });

    /**
     // request url：
     http://localhost:xxxx/sql/queries

     // data.json
     {
        session: Date.now(),
        sqls: [
            "select * from t1",
            "select * from t1",
            ]
     }

     // resp1.json
     // "data".item is object || array
     {
        session: ^,
        values:[
            {err:null, data: [ {f1: v11, f2: v12},{f1: v21, f2: v22}], state: {affectedRows: 1}},
            {err:null, data: [ {f1: v11, f2: v12},{f1: v21, f2: v22}], state: {affectedRows: 1}}
            ],
        state: {err:null}
     }
     */
    app.route('/sql/queries')
        .post(function(req, res) {
            let body = '';
            req.on('data', function(chunk) {
                body += chunk;
            });
            req.on('end', function() {
                let reqBody = parseBody(req, res, body);
                if (!reqBody) return;
                let {session, sqls} = reqBody;
                httpMysqlServer.querySqls(sqls, function(err, res) {
                    let r = {
                        session: session,
                        state: {}
                    };
                    if (err) {
                        r.state.err = err;
                        res.writeHead(200);
                        res.end(JSON.stringify(r));
                    }
                    else {
                        r.values = [];
                        res.forEach(rs => {
                            if (Array.isArray(rs.values)) {
                                r.values.push({err: rs.err, data: rs.values});
                            }
                            else {
                                r.values.push({err: rs.err, state: {affectedRows: rs.values.affectedRows}});
                            }
                        });
                        res.writeHead(200);
                        res.end(JSON.stringify(r));
                    }
                });
            });
        });

    /**
     // request url：
     http://localhost:xxxx/sql/trans

     // data.json
     {
        session: Date.now(),
        sqls: [
            "inseart table xx",
            "update table xx",
            "select id=1 from t1",
            ]
     }

     // resp1.json
     // "data".item is object || array
     {
        session: ^,
        values:[
            {err:null, state: {affectedRows: 1}},
            {err:null, state: {affectedRows: 1}},
            {err:null, data: [ {f1: v11, f2: v12},{f1: v21, f2: v22}]}
            ],
        state: {err:null}
     }
     */
    app.route('/sql/trans')
        .post(function(req, res) {
            let body = '';
            req.on('data', function(chunk) {
                body += chunk;
            });
            req.on('end', function() {
                let reqBody = parseBody(req, res, body);
                if (!reqBody) return;
                let {session, sqls} = reqBody;
                httpMysqlServer.queryTrans(sqls, null, function(err, rs) {
                    let r = {
                        session: session,
                        state: {}
                    };
                    if (err) {
                        r.state.err = err;
                        res.writeHead(200);
                        res.end(JSON.stringify(r));
                    }
                    else {
                        r.values = [];
                        rs.forEach(re => {
                            if (Array.isArray(re.values)) {
                                r.values.push({err: re.err, data: re.values});
                            }
                            else {
                                r.values.push({err: re.err, state: {affectedRows: re.values.affectedRows}});
                            }
                        });
                        res.writeHead(200);
                        res.end(JSON.stringify(r));
                    }
                });
            });
        });

};

/**
 * @param app
 * @param httpMysqlServer
 */
let dealOdl = function(app, httpMysqlServer) {

    /**
     // request url：
     http://localhost:xxxx/odo/query

     action: ['ls', 'add', 'edit', 'del']
     token.state: ['req', 'ing', 'ed', 'del']
     */

    /** ls.req.json
     {
         session: Date.now(),
         odc: 'odcName',
         action: 'ls',
         queryCounter: false,
         counter: 100,
         conditions = {
            index: 0,
            count: 20,
            attrs: [
                {
                    name: 'name',
                    operation: '%',
                    value: 'aa'
                }
            ]
         };
     }
     // ls.resp.json
     {
         session: ^,
         odc: 'odcName',
         action: ^,
         queryCounter: false,
         counter: ^ | resp,
         conditions = ^,
         data: [ {f1: v11, f2: v12},{f1: v21, f2: v22}],
         state: {err:null}
     }
     */

    /** add.req.token.json
     {
         session: Date.now(),
         odc: 'odcName',
         action: 'add',
         token: {
            state: 'req',
         },
     }
     // add.resp.token.json
     {
         session: ^,
         odc: 'odcName',
         action: 'add',
         token: {
            state: 'ing',
            id: 'xxx',
            duration: 'ms',
            deadline: 'datetime',
         },
         data: [ {key: v11},{key: v21}],
         state: {err:null}
   }

     // add.req.json
     {
         session: Date.now(),
         odc: 'odcName',
         action: 'add',
         token: {
            state: 'ing',
            id: 'xxx',
            duration: 'ms',
            deadline: 'datetime',
         },
         data: [{f1: v11, f2: v12}],
     }
     // add.resp.json
     {
         session: ^,
         odc: 'odcName',
         action: 'add',
         state: {err:null, affectedRows: 1}
     }
     */

    /** edit.req.token.json
     {
         session: Date.now(),
         odc: 'odcName',
         action: 'edit',
         token: {
            state: 'req',
         },
         data: [{id: v11}],
     }
     // edit.resp.token.json
     {
         session: ^,
         odc: 'odcName',
         action: 'edit',
         token: {
            state: 'ing',
            id: 'xxx',
            duration: 'ms',
            deadline: 'datetime',
         },
         state: {err:null}
     }

     // edit.req.json
     {
         session: Date.now(),
         odc: 'odcName',
         action: 'edit',
         token: {
            state: 'ing',
            id: 'xxx',
            duration: 'ms',
            deadline: 'datetime',
         },
         data: [{f1: v11, f2: v12}],
     }
     // edit.resp.json
     {
         session: ^,
         odc: 'odcName',
         action: 'edit',
         token: {
            state: 'ed',
            id: 'xxx',
            duration: 'ms',
            deadline: 'datetime',
         },
         state: {err:null, affectedRows: 1}
     }
     */

    /** del.req.json
     {
         session: Date.now(),
         odc: 'odcName',
         action: 'del',
         data: [{id: v11},{id: v21}],
     }
     // del.resp.json
     {
         session: ^,
         odc: 'odcName',
         action: 'del',
         state: {err:null, affectedRows: 1}
     }
     */

    /** validate.req.token.json
     {
         session: Date.now(),
         odc: 'odcName',
         action: 'validate',
         token: {
            state: 'req',
         },
         conditions = {
            index: 0,
            count: 20,
            attrs: [
                {
                    name: 'name',
                    operation: '%',
                    value: 'aa'
                }
            ]
         }
     }
     // validate.resp.token.json
     {
         session: ^,
         odc: 'odcName',
         action: 'validate',
         token: {
            state: 'ing',
            id: 'xxx',
            duration: 'ms',
            deadline: 'datetime',
         },
         data: [ {key: v11},{key: v21}],
         state: {err:null}
   }

     // validate.req.json
     {
         session: Date.now(),
         odc: 'odcName',
         action: 'validate',
         token: {
            state: 'ing',
            id: 'xxx',
            duration: 'ms',
            deadline: 'datetime',
         },
         data: [{f1: v11, f2: v12}],
     }
     // validate.resp.json
     {
         session: ^,
         odc: 'odcName',
         action: 'validate',
         state: {err:null, affectedRows: 1}
     }
     */
    app.route('/odo/query')
        .post(function(req, res) {
            let body = '';
            req.on('data', function(chunk) {
                body += chunk;
            });
            req.on('end', function() {
                let respError = (err, code) => {
                    let code2 = code ? code : 500;
                    let data = {err: 'error: ' + err, code: code2}
                    res.writeHead(code2);
                    res.end(JSON.stringify(data));
                    console.log(data);
                };

                let reqBody = parseBody(req, res, body);
                if (!reqBody) return;
                let {session, action, odc, token} = reqBody;
                let odcName = odc;
                odc = odl.findOdc(odcName);
                if (!odc) {
                    respError('can not findOdc: ' + reqBody.odc);
                    return;
                }

                let dispatchOdcEvent = (data, old) => {
                    if (!global.EventBus) return;
                    EventBus.dispatch(odcName, {action: action, data: data, old: old});
                };
                let hasEventBus = () => {
                    if (!global.EventBus) return false;
                    return EventBus.hasEventListener(odcName);
                };

                let nMysql = odl.DbMysql;
                if (action === 'ls') {
                    let {queryCounter, conditions} = reqBody;
                    let sqls = [];
                    if (queryCounter) {
                        sqls.push(nMysql.getSelectCountSql(odc, conditions));
                    }
                    sqls.push(nMysql.getSelectSql(odc, conditions));
                    let callback = (err, rs) => {
                        let counter = Array.isArray(rs) && rs.length > 1 && Array.isArray(rs[0].values) && rs[0].values.length > 0 ? rs[0].values[0]['counter'] : -1;
                        let data = Array.isArray(rs) && rs.length > 1 ? rs[1].values : null;
                        let r = {
                            session: session,
                            odc: reqBody.odc,
                            action: action,
                            queryCounter: queryCounter,
                            counter: queryCounter ? counter : reqBody.hasOwnProperty('counter') ? reqBody.counter : -1,
                            conditions: conditions,
                            data: data,
                            state: {err: err}
                        };
                        res.writeHead(200);
                        res.end(JSON.stringify(r));
                    };
                    httpMysqlServer.querySqls(sqls, null, callback);
                }
                else if (action === 'add') {
                    let {token} = reqBody;
                    if (token && token.state === 'req') {
                        let respToken = (err, data) => {
                            let r = {
                                session: session,
                                odc: reqBody.odc,
                                action: action,
                                data: data,
                                state: {err: err},
                            };
                            if (!err) {
                                let ip = getRequestIp(req, res);
                                let tk = odl.OpToken.reqToken({ip: ip}, odc, action);
                                if (typeof tk === 'string') {
                                    r.state.err = tk;
                                }
                                else {
                                    r.token = tk;
                                }
                            }
                            res.writeHead(200);
                            res.end(JSON.stringify(r));
                        };
                        let sql = nMysql.getSelectKeySql(odc);
                        // has key
                        if (sql) {
                            httpMysqlServer.query(sql, (err, values) => {
                                respToken(err, values);
                            });
                        }
                        else {
                            respToken(null, [{key: Date.now()}]);
                        }
                    }
                    else {
                        let {data} = reqBody;
                        let respState = (err, affectedRows) => {
                            let r = {
                                session: session,
                                odc: reqBody.odc,
                                action: action,
                                state: {err: null, affectedRows: affectedRows},
                            };
                            if (!err) {
                                odl.OpToken.releaseToken(odc, action);
                            }
                            res.writeHead(200);
                            res.end(JSON.stringify(r));
                            if (affectedRows > 0 && hasEventBus()) {
                                dispatchOdcEvent(data);
                            }
                        };
                        let sqlAry = nMysql.getInsertSqlAry(odc, data);
                        if (sqlAry) {
                            httpMysqlServer.queryTrans(sqlAry, null, (err, res) => {
                                respState(err, err ? 0 : 1);
                            });
                        }
                        else {
                            respState('getInsertSqlAry is empty!', 0);
                        }
                    }
                }
                else if (action === 'edit') {
                    let {token} = reqBody;
                    if (token && token.state === 'req') {
                        let r = {
                            session: session,
                            odc: reqBody.odc,
                            action: action,
                            state: {},
                        };
                        let ip = getRequestIp(req, res);
                        let tk = odl.OpToken.reqToken({ip: ip}, odc, action);
                        if (typeof tk === 'string') {
                            r.state.err = tk;
                        }
                        else {
                            r.token = tk;
                        }
                        res.writeHead(200);
                        res.end(JSON.stringify(r));
                    }
                    else {
                        let {data, conditions, old} = reqBody;
                        let respState = (err, affectedRows) => {
                            let r = {
                                session: session,
                                odc: reqBody.odc,
                                action: action,
                                state: {err: null, affectedRows: affectedRows},
                            };
                            if (!err) {
                                odl.OpToken.releaseToken(odc, action);
                            }
                            res.writeHead(200);
                            res.end(JSON.stringify(r));
                            if (affectedRows > 0 && hasEventBus()) {
                                dispatchOdcEvent(data, old);
                            }
                        };
                        let sqlAry = nMysql.getUpdateSqlAry(odc, data, conditions);
                        if (sqlAry) {
                            httpMysqlServer.queryTrans(sqlAry, null, (err, res) => {
                                respState(err, err ? 0 : 1);
                            });
                        }
                        else {
                            respState('getUpdateSqlAry is empty!', 0);
                        }
                    }
                }
                else if (action === 'del') {
                    let {conditions} = reqBody;
                    let respState = (err, affectedRows) => {
                        let r = {
                            session: session,
                            odc: reqBody.odc,
                            action: action,
                            state: {err: null, affectedRows: affectedRows},
                        };
                        if (!err) {
                            odl.OpToken.releaseToken(odc, action);
                        }
                        res.writeHead(200);
                        res.end(JSON.stringify(r));
                    };
                    let sqlAry = nMysql.getDeleteSqlAry(odc, conditions);
                    if (sqlAry) {
                        httpMysqlServer.queryTrans(sqlAry, null, (err, res) => {
                            respState(err, err ? 0 : 1);
                            if (!err && hasEventBus()) {
                                dispatchOdcEvent(conditions);
                            }
                        });
                    }
                    else {
                        respState('getDeleteSqlAry is empty!', 0);
                    }
                }
                else if (action === 'validate') {
                    let {token, conditions} = reqBody;
                    if (token && token.state === 'req') {
                        let respToken = (err, data) => {
                            let r = {
                                session: session,
                                odc: reqBody.odc,
                                action: action,
                                data: data,
                                state: {err: err},
                            };
                            if (!err) {
                                let ip = getRequestIp(req, res);
                                let tk = odl.OpToken.reqToken({ip: ip}, odc, action);
                                if (typeof tk === 'string') {
                                    r.state.err = tk;
                                }
                                else {
                                    r.token = tk;
                                }
                            }
                            res.writeHead(200);
                            res.end(JSON.stringify(r));
                        };
                        let sql = nMysql.getSelectSql(odc, conditions);
                        // has key
                        if (sql) {
                            httpMysqlServer.query(sql, (err, values) => {
                                respToken(err, values);
                            });
                        }
                        else {
                            respToken(null, [{key: Date.now()}]);
                        }
                    }
                    else {
                        let respState = (err, affectedRows) => {
                            let r = {
                                session: session,
                                odc: reqBody.odc,
                                action: action,
                                state: {err: null, affectedRows: affectedRows},
                            };
                            if (!err) {
                                odl.OpToken.releaseToken(odc, action);
                            }
                            res.writeHead(200);
                            res.end(JSON.stringify(r));
                        };
                        let {data} = reqBody;
                        let objs = data;
                        if (Array.isArray(objs)) {
                            for (let i = 0; i < objs.length; i++) {
                                let obj = objs[i];
                            }
                        }
                        // let obj = {};
                        // for (let i = 0; i < conditions.length; i++) {
                        //     let condition = conditions[i];
                        //     let attrs = condition.attrs;
                        //     if (!Array.isArray(attrs)) continue;
                        //     for (let j = 0; j < attrs.length; j++) {
                        //         let attr = attrs[j];
                        //         obj[attr.name] = attr.value;
                        //     }
                        // }
                        // objs.push(obj);
                        let ip = getRequestIp(req, res);
                        let logEnv = {
                            time: Date.now(),
                            operation: 'validate',
                            who: 'gcl3-master-node.js',
                            where: ip,
                            message: ''
                        };
                        let sqlAry = nMysql.log.getInsertSqlAry(odc, objs, logEnv);
                        if (Array.isArray(sqlAry) && sqlAry.length > 0) {
                            httpMysqlServer.queryTrans(sqlAry, null, (err, res) => {
                                respState(err, err ? 0 : 1);
                            });
                        }
                        else {
                            respState('getInsertLogSqlAry is empty!', 0);
                        }
                    }
                }
                else {
                    respError('action is invalid: ' + action);
                }
            });
        });

};

let dealAssets = function(app) {
    app.route(/\/assets\/.*/)
        .get(function(req, res) {
            fileServer.dispatch(req, res);
        })
};

exports = module.exports = {
    /**
     * mock bootstrap
     */
    init(app, httpMysqlServer) {
        dealUser(app, httpMysqlServer);
        dealOdl(app, httpMysqlServer);
        dealSql(app, httpMysqlServer);
        dealAssets(app);
    }
};
