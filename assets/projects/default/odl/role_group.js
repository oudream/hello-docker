(function() {
    'use strict';
    let RoleGroup = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'role_group',
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
                    title: '职能',
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
                    metadata:
                        {
                            name: '',
                        },
                    spec: {
                        title: {
                            text: 'RoleGroup',
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
    odl.register(RoleGroup);
    return RoleGroup;
})();
