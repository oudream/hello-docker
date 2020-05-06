(function() {
    'use strict';
    let Reader = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'reader',
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
                    title: '阅览者',
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
                            text: 'BORROWER',
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
                                name: 'sex',
                                format: 'formatSex',
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
    odl.register(Reader);
    return Reader;
})();
