(function() {
    'use strict';
    let ContainerStat = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'container_stat',
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
                    name: 'bureauId',
                    desc: 'bureau id',
                    model: 'int',
                    refer: {
                        odc: 'bureau',
                        key: 'id',
                        title: 'name'
                    }
                },
                {
                    name: 'containerId',
                    desc: '容器ID',
                    model: 'string',
                },
                {
                    name: 'cpuPercent',
                    title: 'CPU使用百分数',
                    model: 'double',
                },
                {
                    name: 'memUsage',
                    title: '内存占用',
                    model: 'double',
                },
                {
                    name: 'memMaxUsage',
                    title: '内存最高占用',
                    model: 'double',
                },
                {
                    name: 'memLimit',
                    title: '内存极限',
                    model: 'double',
                },
                {
                    name: 'statTime',
                    title: '统计',
                    model: 'date'
                }
            ],
            container: {
                keys: ['id'],
                sorts: ['statTime']
            },
            ns: [
                {
                    kind: odl.UiVueBase ? odl.UiVueBase.kind : '',
                    spec: {
                        title: {
                            text: 'CONTAINER-STAT',
                        },
                        attrs: [
                            {
                                name: 'id',
                                readonly: true,
                                visible: false,
                            },
                            {
                                name: 'bureauId',
                                visible: false,
                            }
                        ],
                    }
                },
                {kind: odl.UiVueForm ? odl.UiVueForm.kind : ''},
                {kind: odl.UiVueTable ? odl.UiVueTable.kind : ''},
                {
                    kind: odl.DbMysql ? odl.DbMysql.kind : '',
                    metadata:
                        {
                            name: '',
                        },
                    spec: {
                        table: {
                            name: 'container_stat'
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
    odl.register(ContainerStat);
    return ContainerStat;
})();
