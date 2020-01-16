(function() {
    'use strict';
    let Position = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'position',
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
                    title: '位置编号',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'code',
                    title: '柜号',
                    model: 'string',
                    isNull: false
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
                    kind: odl.UiVueTable ? odl.UiVueTable.kind : '',
                    spec: {
                        title: {
                            text: 'POSITION',
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
                {
                    kind: odl.DbMysql ? odl.DbMysql.kind : '',
                }
            ]
        }
    };
    odl.register(Position);
    return Position;
})();
