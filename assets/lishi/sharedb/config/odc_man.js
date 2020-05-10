(function() {
    'use strict';
    let Man = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'man',
                namespace: 'gcl3'
            },
        spec: {
            attrs: [
                {
                    name: 'ManID',
                    model: 'int',
                    isNull: false
                },
                {
                    name: 'ManName',
                    title: '品牌名称',
                    model: 'string',
                    isNull: false,
                },
                {
                    name: 'ManPy',
                    title: '品牌拼音',
                    model: 'string',
                    isNull: false,
                },
                {
                    name: 'LanID',
                    title: '语言ID',
                    model: 'enum',
                    scopes: ['1033,英语（美国）', '2052,简体中文', '1028,繁体中文(台湾)'],
                    values: [1033, 2052, 1028],
                    default: 1033,
                    width: 100,
                },
                {
                    name: 'IsNative',
                    title: '国内Y/N',
                    model: 'enum',
                    scopes: ['N', 'Y'],
                    values: [0, 1],
                    default: 1,
                    width: 100,
                },
                {
                    name: 'ManlogoFileName',
                    title: '品牌logo',
                    model: 'string',
                }
            ],
            container: {
                keys: ['ManID'],
                sorts: ['ManName']
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
                            text: '汽车品牌',
                        },
                        attrs: [
                            {
                                name: 'ManID',
                                readonly: true,
                                visible: false,
                            },
                            {
                                name: 'IsNative',
                                format: 'formatBool',
                            },
                            {
                                name: 'ManlogoFileName',
                                contentType: "image"
                            }
                        ],
                        filter: {
                            filters: [
                                {
                                    fields: [
                                        {value: 'ManName'},
                                        {value: 'ManPy'},
                                        {value: 'LanID'},
                                    ],
                                }
                            ]
                        }
                    }
                },
                {kind: odl.UiVueForm ? odl.UiVueForm.kind : ''},
                {kind: odl.UiVueTable ? odl.UiVueTable.kind : ''},
                {
                    kind: odl.DbMysql ? odl.DbMysql.kind : '',
                    metadata: {
                        name: '',
                    },
                    spec: {
                        table: {
                            name: 'Man'
                        }
                    }
                },
                {
                    kind: odl.DbSqlite ? odl.DbSqlite.kind : '',
                    metadata:
                        {
                            name: '',
                        },
                    spec: {
                        table: {
                            name: 'Man',
                            sync: true
                        },
                        attrs: [
                            {
                                name: 'ManlogoFileName',
                                noPersistence: true,
                                mapField: {
                                    fieldName: "ManLogo",
                                    fieldType: "BLOB"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
    odl.register(Man);
    return Man;
})();
