(function() {
    'use strict';
    let Vehicle = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'vehicle',
                namespace: 'gcl3'
            },
        spec: {
            attrs: [
                {
                    name: 'VehID',
                    title: '⻋辆ID',
                    model: 'int',
                    isNull: false
                },
                {
                    name: 'ManID',
                    desc: '品牌',
                    model: 'int',
                    refer: {
                        odc: 'man',
                        key: 'ManID',
                        title: 'ManName'
                    }
                },
                {
                    name: 'ModelName',
                    title: '⻋型名称',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'ModelPy',
                    title: '⻋型拼音',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'VehDT',
                    title: '创建日期',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'LanID',
                    title: '语言ID',
                    model: 'enum',
                    scopes: ['1033,英语（美国）', '2052,简体中文', '1028,繁体中文(台湾)'],
                    values: [1033, 2052, 1028],
                    default: 0,
                },
                {
                    name: 'BeginDT',
                    title: '生产日期',
                    model: 'string'
                },
                {
                    name: 'EndDT',
                    title: '结束日期',
                    model: 'string'
                },
                {
                    name: 'Wheelbase',
                    title: '轴距',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'TrackDia',
                    title: '轮毂直径',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'FTreadWidth',
                    title: '前轮距',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'RTreadWidth',
                    title: '后轮距',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'FToeMin',
                    title: '前轮前束最小',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'FToe',
                    title: '前轮前束标准',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'FToeMax',
                    title: '前轮前束最大',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'FCamberMin',
                    title: '前轮外倾最小',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'FCamber',
                    title: '前轮外倾典型',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'FCamberMax',
                    title: '前轮外倾最大',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'KpiCasterMin',
                    title: '主销后倾最小',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'KpiCaster',
                    title: '主销后倾标准',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'KpiCasterMax',
                    title: '主销后倾最大',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'KpiCamberMin',
                    title: '主销内倾最小值',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'KpiCamber',
                    title: '主销内倾标准值',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'KpiCamberMax',
                    title: '主销内倾最大值',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'RToeMin',
                    title: '后轮前束最小值',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'RToe',
                    title: '后轮前束标准值',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'RToeMax',
                    title: '后轮前束最大值',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'RCamberMin',
                    title: '后轮外倾最小值',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'RCamber',
                    title: '后轮外倾典型值',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'RCamberMax',
                    title: '后轮外倾最大值',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'RThrustMin',
                    title: '推进⻆最小值',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'RThrust',
                    title: '推进⻆标准值',
                    model: 'double',
                    scopes: [0, 9999]
                },
                {
                    name: 'RThrustMax',
                    title: '推进⻆最大值',
                    model: 'double',
                    scopes: [0, 9999]
                }
            ],
            container: {
                keys: ['VehID'],
                sorts: ['ModelName']
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
                            text: '⻋辆信息管理',
                        },
                        attrs: [
                            {
                                name: 'VehID',
                                readonly: true,
                                visible: false,
                            },
                            {
                                name: 'ManID',
                                visible: false,
                                required: true,
                            },
                            {
                                name: 'ModelPy',
                                required: true,
                            },
                            {
                                name: 'VehDT',
                                visible: false,
                                readonly: true,
                                required: true,
                                default: () => {
                                    return Date.now()
                                },
                            },
                            {
                                name: 'ManID',
                                visible: false,
                            }
                        ],
                        filter: {
                            filters: [
                                {
                                    fields: [
                                        {value: 'ManID', label: '品牌名称'}
                                    ],
                                    operations: [
                                        {value: '=', label: '='}
                                    ],
                                    type: 'refer',
                                },
                                {
                                    fields: [
                                        {value: 'ModelName', label: '车型名称'},
                                        {value: 'ModelPy', label: '车型拼音'},
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
                    spec: {
                        table: {
                            name: 'Vehicle'
                        },
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
    odl.register(Vehicle);
    return Vehicle;
})();

/**
 *
 ⻋辆信息表
 (Vehicle)
 属性名/列名
 类型
 ⻓度
 是否主外键
 是否为 空
 默认 值
 备注

 ManID
 varchar
 20
 不为主外键
 可为空
 品牌ID

 ManName
 varchar
 20
 为主外键
 不为空
 品牌名称

 ManPy
 varchar
 20
 不为主外键
 不为空
 品牌拼音



 VehID
 varchar
 20
 为主键
 可为空
 ⻋辆ID

 ModelName
 varchar
 20
 为主外键
 不为空
 ⻋型名称

 ModelPy
 varchar
 20
 不为主外键
 不为空
 ⻋型拼音

 VehDT
 varchar
 20
 不为主外键
 不为空
 创建日期

 LanID
 varchar
 10
 不为主外键
 不为空
 语言ID

 ModelID
 varchar
 20
 不为主外键
 可为空
 ⻋型ID

 ModelName
 varchar
 20
 为主外键
 不为空
 ⻋型名称

 ModelPy
 varchar
 20
 不为主外键
 不为空
 ⻋型拼音

 BeginDT
 Date
 不为主外键
 不为空
 生产日期

 EndDT
 Date
 不为主外键
 不为空
 结束日期

 Wheelbase
 decimal
 (7,5 )
 不为主外键
 可为空
 轴距

 TrackDia
 decimal
 (7,5 )
 不为主外键
 可为空
 轮毂直径

 FTreadWidth
 decimal
 (7,5 )
 不为主外键
 可为空
 前轮距

 RTreadWidth
 decimal
 (7,5 )
 不为主外键
 可为空
 后轮距

 FToeMin
 decimal
 (7,5 )
 不为主外键
 可为空
 前轮前束最小值(左右轮一 样)

 FToe
 decimal
 (7,5 )
 不为主外键
 可为空
 前轮前束标准 值

 FToeMax
 decimal
 (7,5 )
 不为主外键
 可为空
 前轮前束最大 值 (左右轮一 样)

 FCamberMin
 decimal
 (7,5 )
 不为主外键
 可为空
 前轮外倾最小 值

 FCamber
 decimal
 (7,5 )
 不为主外键
 可为空
 前轮外倾典型 值

 FCamberMax
 decimal
 (7,5 )
 不为主外键
 可为空
 前轮外倾最大 值

 KpiCasterMin
 decimal
 (7,5 )
 不为主外键
 可为空
 主销后倾最小 值 (左右轮一 样)

 KpiCaster
 decimal
 (7,5 )
 不为主外键
 可为空
 主销后倾标准 值

 KpiCasterMax
 decimal
 (7,5 )
 不为主外键
 可为空
 主销后倾最大 值 (左右轮一 样)

 KpiCamberMin
 decimal
 (7,5 )
 不为主外键
 可为空
 主销内倾最小值

 KpiCamber
 decimal
 (7,5 )
 不为主外键
 可为空
 主销内倾标准值

 KpiCamberMax
 decimal
 (7,5 )
 不为主外键
 可为空
 主销内倾最大值

 RToeMin
 decimal
 (7,5 )
 不为主外键
 可为空
 后轮前束最小值

 RToe
 decimal
 (7,5 )
 不为主外键
 可为空
 后轮前束标准值

 RToeMax
 decimal
 (7,5 )
 不为主外键
 可为空
 后轮前束最大值

 RCamberMin
 decimal
 (7,5 )
 不为主外键
 可为空
 后轮外倾最小值

 RCamber
 decimal
 (7,5 )
 不为主外键
 可为空
 后轮外倾典型值

 RCamberMax
 decimal
 (7,5 )
 不为主外键
 可为空
 后轮外倾最大值

 RThrustMin
 decimal
 (7,5 )
 不为主外键
 可为空
 推进⻆最小值

 RThrust
 decimal
 (7,5 )
 不为主外键
 可为空
 推进⻆标准值

 RThrustMax
 decimal
 (7,5 )
 不为主外键
 可为空
 推进⻆最大值
 */
