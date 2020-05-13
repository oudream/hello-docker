(function() {
    'use strict';
    let Bureau = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'bureau',
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
                    title: '名称',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'phone',
                    title: '电话',
                    model: 'string',
                },
                {
                    name: 'email',
                    title: '邮箱',
                    model: 'string',
                },
                {
                    name: 'addr',
                    title: '地址',
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
                            text: 'BUREAU',
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
                            name: 'bureau'
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
    odl.register(Bureau);
    return Bureau;
})();
