(function() {
    'use strict';
    let LogRecord = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'log_record',
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
                    name: 'action',
                    title: '动作',
                    model: 'string',
                    isNull: false,
                },
                {
                    name: 'time',
                    title: '时间',
                    model: 'date',
                    isNull: false,
                },
                {
                    name: 'odc',
                    title: 'odc',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'table',
                    title: '表',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'name',
                    title: 'Key名字',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'field',
                    title: 'Key字段',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'value',
                    title: 'Key值',
                    model: 'string',
                    isNull: false
                }
            ],
            container: {
                keys: ['id'],
                sorts: ['id']
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
                        attrs: []
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
                            name: 'LogRecord'
                        },
                        attrs: [
                            {
                                name: 'id',
                                autoIncrement: 1,
                            }
                        ]
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
                            name: 'LogRecord'
                        },
                        attrs: [
                            {
                                name: 'id',
                                autoIncrement: 1,
                            }
                        ]
                    }
                }
            ]
        }
    };
    odl.register(LogRecord);
    return LogRecord;
})();
