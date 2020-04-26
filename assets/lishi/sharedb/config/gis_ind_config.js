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
                    name: 'arch_status',
                    desc: '档案状态',
                    strategies: [
                        {
                            condition: 0,
                            action: {
                                style: {
                                    "fill-opacity": "1",
                                    "fill": "#00ff00",
                                }
                            }
                        },
                        {
                            condition: 1,
                            action: {
                                style: {
                                    "fill-opacity": "1",
                                    "fill": "#ffff00",
                                }
                            }
                        },
                        {
                            conditions: [10,11],
                            action: {
                                style: {
                                    "fill-opacity": "1",
                                    "fill": "#0000ff",
                                }
                            }
                        },
                        {
                            condition: -1,
                            action: {
                                style: {
                                    "fill-opacity": "1",
                                    "fill": "#cccccc",
                                }
                            }
                        },
                    ]
                },
                {
                    name: 'led_status',
                    desc: '灯状态',
                    strategies: [
                        {
                            condition: 1,
                            action: {
                                style: {
                                    "fill-opacity": "1",
                                    "fill": "#ffffff",
                                }
                            }
                        },
                        {
                            condition: 2,
                            action: {
                                style: {
                                    "fill-opacity": "1",
                                    "fill": "#00ff00",
                                }
                            }
                        },
                        {
                            condition: -1,
                            action: {
                                style: {
                                    "fill-opacity": "1",
                                    "fill": "#cccccc",
                                }
                            }
                        },
                    ]
                },
                {
                    name: 'quzheng',
                    desc: '取整',
                    strategies: [
                        {
                            action: {
                                text: (ele, mid, nVqt)=>{
                                    if(mid<0x03000000 && mid>=0x01000000){
                                        ele.textContent = nVqt.v.toFixed(0);
                                    }
                                },
                            }
                        },
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
                    strategy: 'arch_status',
                    mids: ['0x01000000~0x010005FF'],
                    // midf: (mid) => {mid % 3 <2},
                },
                {
                    strategy: 'led_status',
                    mids: ['0x01001000~0x010015FF'],

                },
                {
                    strategy: 'quzheng',
                    mids: ['0x02000000~0x02001000'],
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
