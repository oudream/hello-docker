(function() {
    'use strict';
    let Config = {
        apiVersion: 'v1',
        kind:
            'gcl.gis.ind',
        metadata:
            {
                name: 'gcl.gis.ind.config',
                namespace: 'gcl3'
            },
        spec: {
            strategies: [
                {
                    name: 'random_sample_1_a',
                    desc: '颜色变化',
                    strategies: [
                        {
                            // condition: '>1',
                            // condition: '<1',
                            // condition: '1<<100',
                            // function
                            conditions: ['=101', 102, '>500', '<500', '1<<100'],
                            condition: 1,
                            // 旧值的 10% || nv - ov = 0.2;
                            // 精度
                            precision: 0.2,
                            action: {
                                attr: 'fill:red',
                            }
                        },
                        {
                            condition: (nVqt, oVqt) => nVqt.v - oVqt.v > 2,
                            action: {
                                style: {
                                    "background-color": "#DDDD00",
                                    "color": "red",
                                }
                            }
                        },
                        {
                            condition: '=1',
                            action: {
                                // text: '开机',
                                // text: '停机',
                                // text===true: 输出 measure value
                                text: true,
                            }
                        }
                    ]
                },
                {
                    name: 'random_sample_2_a',
                    desc: '颜色变化',
                    strategies: [
                        {
                            condition: 0,
                            action: {
                                attr: {
                                    "fill-opacity": "1",
                                    "fill": "#ff0000",
                                }
                            }
                        },
                        {
                            condition: 1,
                            action: {
                                attr: {
                                    "fill-opacity": "1",
                                    "fill": "#00ff00",
                                }
                            }
                        }
                    ]
                },
                {
                    name: 'random_sample_3_a',
                    desc: '文本输出',
                    strategies: [
                        {
                            condition: '=1',
                            action: {
                                text: '开机',
                            }
                        },
                        {
                            condition: '!=1',
                            action: {
                                text: '停机',
                            }
                        }
                    ]
                },
                {
                    name: 'tip_info_1',
                    desc: '文本输出',
                    strategies: [
                        {
                            condition: '=1',
                            action: {
                                text: '借出',
                            }
                        },
                        {
                            condition: '=0',
                            action: {
                                text: '在库',
                            }
                        },
                        {
                            condition: '=10',
                            action: {
                                text: '借出中',
                            }
                        },
                        {
                            condition: '=11',
                            action: {
                                text: '归还中',
                            }
                        },
                        {
                            condition: '=-1',
                            action: {
                                text: '',
                            }
                        }
                    ]
                }
            ],
            inds: [
                {
                    strategy: 'random_sample_1_a',
                    // 如果 mid 与 url 都配了，以 mid 为主
                    // mid 可以是 十进制 或 十六进制
                    mid: 0x09000001,
                    mids: [0x09000001, '0x09000002', '0x09000009~0x0900FFFF'],
                    url: 'YG550H01_YX_0172',
                    urls: ['YG550H01_YX_0172', 'YG550H01_YX_0173'],
                },
                {
                    strategy: 'tip_info_1',
                    mids: ['0x02000000~0x02000600'],
                }
            ],
            computers: [
                {
                    computer: 'merge',
                    mids: [0x01000001, 0x01000002, '0x01000009~0x010000FF'],
                    urls: ['YG550H01_YX_0172', 'YG550H01_YX_0173'],
                    result: [0x0F000001, 0x0F000002]
                }
            ],
            // 以上是通用全局，以下是特殊性
            views: [
                {
                    name: 'view1',
                    // 以 measure 为导向，主动驱使
                    measures: [
                        {
                            mid: 0x01000001,
                            url: 'YG550H01_YX_0172',
                            strategy: 'color_1_a',
                        },
                        {
                            mid: 0x02000001,
                            url: 'YG550H01_YX_0272',
                            strategy: 'text_b',
                        },
                    ],
                },
                {
                    name: 'view2',
                    measures: [
                        {
                            mid: 0x01000001,
                            url: 'YG550H01_YX_0172',
                            strategy: 'color_1_a',
                        },
                    ],
                },
            ],
        }
    };
    gcl && gcl.gis && gcl.gis.ind && gcl.gis.ind.registerConfig(Config);
    return Config;
})();
