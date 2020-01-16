(function() {
    'use strict';
    let Config = {
        apiVersion: 'v1',
        kind:
            'gcc',
        metadata:
            {
                name: 'gcl.gis.comp.config',
                namespace: 'gcl3'
            },
        spec: {
            comps: [
                {
                    name: 'comp_a_1',
                    title: '颜色变化',
                    measures: [
                        {
                            url: '',
                            id:'',
                            type: 0,
                            role: 'a',
                        }
                    ],
                    params:[
                        {
                            type: 'number',
                        },
                        {
                            type: 'string',
                        },
                        {
                            type: 'array',
                        }
                    ],
                    strategy: {
                        // condition: '>1',
                        // condition: '<1',
                        // condition: '1<<100',
                        // function
                        conditions: ['[1,]', 102, '>500', '<500', '1<<100'],
                        condition: 1,
                        // 旧值的 10% || nv - ov = 0.2;
                        // 精度
                        precision: 0.2,
                        action: {
                            attr: 'fill:red',
                        }
                    }
                }
            ],
        }
    };
    return Config;
})();
