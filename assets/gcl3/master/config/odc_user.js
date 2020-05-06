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
                    name: 'password',
                    title: '密码',
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
                    kind: odl.UiVueBase ? odl.UiVueBase.kind : '',
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
                                name: 'password',
                                required: true,
                            },
                            {
                                name: 'departmentId',
                                visible: false,
                            },
                            {
                                name: 'sex',
                                format: 'formatSex',
                            },
                            {
                                name: 'roleGroupId',
                                visible: false,
                            }
                        ],
                    }
                },
                { kind: odl.UiVueForm ? odl.UiVueForm.kind : '' },
                { kind: odl.UiVueTable ? odl.UiVueTable.kind : '' },
                {
                    kind: odl.UiVueValidator ? odl.UiVueValidator.kind : '',
                    metadata:
                        {
                            name: '',
                        },
                    spec: {
                        title: {
                            text: 'USER VALIDATOR',
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
                                default: 'admin',
                            },
                            {
                                name: 'password',
                                required: true,
                                default: 'admin',
                            },
                            {
                                name: 'sex',
                                visible: false,
                            },
                            {
                                name: 'height',
                                visible: false,
                            },
                            {
                                name: 'birth',
                                visible: false,
                            },
                            {
                                name: 'departmentId',
                                visible: false,
                            },
                            {
                                name: 'department_name',
                                visible: false,
                            },
                            {
                                name: 'roleGroupId',
                                visible: false,
                            },
                            {
                                name: 'role_group_name',
                                visible: false,
                            },
                            {
                                name: 'addr',
                                visible: false,
                            },
                            {
                                name: 'remark',
                                visible: false,
                            },
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
                            name: 'user'
                        },
                        attrs: [
                            {
                                name: 'remark',
                                fieldType: {
                                    fieldType: 'text'
                                }
                            }
                        ],
                        log: {
                            attrs: [
                                {
                                    name: 'id',
                                },
                                {
                                    name: 'name',
                                }
                            ],
                        },
                    }
                }
            ]
        }
    };
    odl.register(User);
    return User;
})();
