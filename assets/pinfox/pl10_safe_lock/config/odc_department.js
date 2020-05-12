(function() {
    'use strict';
    let Department = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'department',
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
                    title: '部门名称',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'setup',
                    title: '创建日',
                    model: 'date',
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
                            text: 'DEPARTMENT',
                        },
                        attrs: [
                            {
                                name: 'id',
                                readonly: true,
                                visible: false,
                            }
                        ],
                    }
                },
                {
                    kind: odl.DbMysql ? odl.DbMysql.kind : '',
                }
            ]
        }
    };
    odl.register(Department);
    return Department;
})();
