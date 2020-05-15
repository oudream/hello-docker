(function() {
    'use strict';
    let Locket = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'lock',
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
                    title: '锁名',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'code',
                    title: '编号',
                    model: 'string',
                },
                {
                    name: 'madeTime',
                    title: '生产时间',
                    model: 'date'
                },
                {
                    name: 'madeAddr',
                    title: '生产地址',
                    model: 'string',
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
            ns: [
                {
                    kind: odl.UiVueBase ? odl.UiVueBase.kind : '',
                    spec: {
                        title: {
                            text: 'LOCKET',
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
                        ],
                    }
                },
                { kind: odl.UiVueForm ? odl.UiVueForm.kind : '' },
                { kind: odl.UiVueTable ? odl.UiVueTable.kind : '' },
                {
                    kind: odl.DbMysql ? odl.DbMysql.kind : '',
                    metadata:
                        {
                            name: '',
                        },
                    spec: {
                        table: {
                            name: 't_obj_lock'
                        },
                        attrs: [
                            {
                                name: 'remark',
                                field: {
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
    odl.register(Locket);
    return Locket;
})();
