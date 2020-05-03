(function() {
    'use strict';
    let Customer = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'customer',
                namespace: 'gcl3'
            },
        spec: {
            attrs: [
                {
                    name: 'CustID',
                    model: 'int',
                    isNull: false
                },
                {
                    name: 'CustName',
                    title: '用户名',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'CustPy',
                    title: '用户名拼音',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'Tel',
                    title: '电话',
                    model: 'string',
                },
                {
                    name: 'Address',
                    title: '地址',
                    model: 'string',
                }
            ],
            container: {
                keys: ['CustID'],
                sorts: ['CustName']
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
                            text: '客户',
                        },
                        attrs: [
                            {
                                name: 'CustID',
                                readonly: true,
                                visible: false,
                            }
                        ],
                    }
                },
                { kind: odl.UiVueForm ? odl.UiVueForm.kind : '' },
                { kind: odl.UiVueTable ? odl.UiVueTable.kind : '' },
                {
                    kind: odl.DbMysql ? odl.DbMysql.kind : '',
                }
            ]
        }
    };
    odl.register(Customer);
    return Customer;
})();
