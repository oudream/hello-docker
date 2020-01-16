(function() {
    'use strict';
    let Status = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'status',
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
                    model: 'enum',
                    scopes: ['归还', '借出'],
                    default: 0,
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
                                readonly: true,
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
                        ],
                        edition: {
                            filter: function(obj) {
                                switch (obj['action']) {
                                    case 0: return [1, -1];
                                    case 1: return [0, -1];
                                    default: return [0, 1, -1];
                                }
                            } ,
                            preset: function(action, obj) {
                                obj['action'] = action;
                            },
                            editions: [
                                {
                                    name: 0,
                                    title: '归还',
                                    attrs:[
                                        {
                                            name: 'action',
                                            readonly: true,
                                        },
                                    ],
                                },
                                {
                                    name: 1,
                                    title: '借出',
                                    attrs:[
                                        {
                                            name: 'action',
                                            readonly: true,
                                        },
                                    ],
                                },
                                {
                                    name: -1,
                                    title: '盘点',
                                    attrs:[
                                        {
                                            name: 'action',
                                            readonly: false,
                                        },
                                    ],
                                },
                            ]
                        },
                    }
                },
                {
                    kind: odl.DbMysql ? odl.DbMysql.kind : '',
                }
            ]
        }
    };
    odl.register(Status);
    return Status;
})();
