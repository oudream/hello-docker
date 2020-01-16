(function() {
    'use strict';
    let Reader = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'recording',
                namespace: 'gcl3'
            },
        spec: {
            attrs: [
                {
                    name: 'id',
                    model: 'int',
                    isNull: false,
                },
                {
                    name: 'materialId',
                    desc: 'material id',
                    model: 'int',
                    isNull: false,
                    refer: {
                        odc: 'material',
                        key: 'id',
                        title: 'name'
                    }
                },
                {
                    name: 'action',
                    title: '动作',
                    model: 'string',
                    isNull: false,
                },
                {
                    name: 'positionId',
                    desc: 'position id',
                    model: 'int',
                    refer: {
                        odc: 'position',
                        key: 'id',
                        title: 'name'
                    }
                },
                {
                    name: 'readerId',
                    desc: 'reader id',
                    model: 'int',
                    refer: {
                        odc: 'reader',
                        key: 'id',
                        title: 'name'
                    }
                },
                {
                    name: 'dt',
                    title: '时间',
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
                            text: 'RECORDING',
                        },
                        attrs: [
                            {
                                name: 'id',
                                readonly: true,
                                visible: false,
                            },
                            {
                                name: 'materialId',
                                visible: false,
                            },
                            {
                                name: 'positionId',
                                visible: false,
                            },
                            {
                                name: 'readerId',
                                visible: false,
                            },
                            {
                                name: 'action',
                                required: true,
                            },
                        ]
                    }
                },
                {
                    kind: odl.DbMysql ? odl.DbMysql.kind : '',
                }
            ]
        }
    };
    odl.register(Reader);
    return Reader;
})();
