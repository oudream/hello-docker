(function() {
    'use strict';
    let User = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'user',
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
                    name: 'name',
                    title: '姓名',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'sex',
                    title: '性别',
                    model: 'enum',
                    scopes: ['女', '男'],
                    default: 0,
                },
                {
                    name: 'height',
                    title: '身高',
                    model: 'double',
                    scopes: [0, 300]
                },
                {
                    name: 'birth',
                    title: '生日',
                    model: 'date'
                },
                {
                    name: 'departmentId',
                    desc: 'department id',
                    model: 'int',
                    refer: {
                        odc: 'department',
                        key: 'id',
                        title: 'name'
                    }
                },
                {
                    name: 'roleGroupId',
                    desc: 'role group id',
                    model: 'int',
                    refer: {
                        odc: 'role_group',
                        key: 'id',
                        title: 'name'
                    }
                },
                {
                    name: 'addr',
                    title: '地址',
                    maxLength: 255,
                    minLength: 1,
                    model: 'string'
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
                            text: 'USER',
                        },
                        attrs: [
                            {
                                name: 'id',
                                readonly: true,
                                visible: false,
                            },
                            {
                                name: 'name',
                                required: true,
                            },
                            {
                                name: 'departmentId',
                                visible: false,
                            },
                            {
                                name: 'sex',
                                format: 'formatSex',
                                select: 'selectSex',
                            },
                            {
                                name: 'roleGroupId',
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
                            name: 'users'
                        },
                        attrs: [
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
