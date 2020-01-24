(function() {
    'use strict';
    let User = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'log_login',
                namespace: 'gcl3'
            },
        spec: {
            attrs: [
                {
                    name: 'id',
                    model: 'int',
                    isNull: false
                },
                {
                    name: 'userId',
                    desc: 'user id',
                    model: 'int',
                    refer: {
                        odc: 'user',
                        key: 'id',
                        title: 'name'
                    }
                },
                {
                    name: 'password',
                    title: '密码',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'loginTime',
                    title: '登录时间',
                    model: 'date'
                },
                {
                    name: 'remark',
                    title: '备注',
                    maxLength: 64*1024,
                    minLength: 1,
                    model: 'string'
                }
            ],
            container: {
                keys: ['id'],
                sorts: ['name']
            },
            table: {},
            tree: {},
            ns: [
                {
                    kind: odl.UiVueTable ? odl.UiVueTable.kind : '',
                    metadata:
                        {
                            name: '',
                        },
                    spec: {
                        title: {
                            text: 'LOGIN',
                        },
                        attrs: [
                            {
                                name: 'id',
                                readonly: true,
                                visible: false,
                            },
                            {
                                name: 'userId',
                                visible: false,
                            }
                        ]
                    }
                },
                {
                    kind: odl.DbMysql ? odl.DbMysql.kind : '',
                    metadata:
                        {
                            name: '',
                        },
                    spec: {
                        table: {
                            name: 'log_login'
                        },
                        attrs: [
                            {
                                name: 'password',
                                model: 'string',
                                notPersistence: true
                            },
                            {
                                name: 'remark',
                                fieldType: {
                                    fieldType: 'text'
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
    odl.register(User);
    return User;
})();
