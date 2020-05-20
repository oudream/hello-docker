(function() {
    'use strict';
    let lock_rt = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'cmm_prop',
                namespace: 'gcl3'
            },
        spec: {
            attrs: [
                {
                    name: 'ID',
                    model: 'int',
                    isNull: false
                },
                {
                    name: 'F_ID',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'F_PID',
                    model: 'string'
                },
                {
                    name: 'F_NID',
                    model: 'int'
                },
                {
                    name: 'F_NAME',
                    title: '名称',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'F_CLASS',
                    title: '类别',
                    model: 'string',
                },
                {
                    name: 'F_URI',
                    title: '编号',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'F_CODE',
                    title: '类型',
                    model: 'int',
                },
                {
                    name: 'D_DESC',
                    title: '描述',
                    model: 'string'
                },
                {
                    name: 'F_T_CRT',
                    title: '创建时间',
                    model: 'date'
                },
                {
                    name: 'F_USER_CRT',
                    title: '创建人',
                    model: 'string',
                },
                {
                    name: 'F_T_MOD',
                    title: '修改时间',
                    model: 'date'
                },
                {
                    name: 'F_USER_MOD',
                    title: '修改人',
                    model: 'string',
                },
                {
                    name: 'F_RES0',
                    model: 'int'
                },
                {
                    name: 'F_RES1',
                    model: 'string'
                },
                {
                    name: 'F_DT_FLAG',
                    model: 'int'
                },
                {
                    name: 'F_ST_FLAG',
                    model: 'int'
                },
                {
                    name: 'F_SYN_FLAG',
                    model: 'int'
                }
            ],
            container: {
                keys: ['ID'],
                sorts: ['F_NAME']
            },
            ns: [
                {
                    kind: odl.UiVueBase ? odl.UiVueBase.kind : '',
                    spec: {
                        title: {
                            text: 'cmm_prop',
                        },
                        attrs: [
                            {
                                name: 'ID',
                                readonly: true,
                                visible: false
                            },
                            {
                                name: 'F_ID',
                                visible: false
                            },
                            {
                                name: 'F_PID',
                                visible: false
                            },
                            {
                                name: 'F_NID',
                                visible: false
                            },
                            {
                                name: 'F_NAME',
                                required: true
                            },
                            {
                                name: 'F_T_CRT',
                                visible: false
                            },
                            {
                                name: 'F_USER_CRT',
                                visible: false
                            },
                            {
                                name: 'F_T_MOD',
                                visible: false
                            },
                            {
                                name: 'F_USER_MOD',
                                visible: false
                            },

                            {
                                name: 'F_RES0',
                                visible: false,
                                default:0
                            },
                            {
                                name: 'F_RES1',
                                visible: false,
                                default:''
                            },
                            {
                                name: 'F_DT_FLAG',
                                visible: false,
                                default:0
                            },
                            {
                                name: 'F_ST_FLAG',
                                visible: false,
                                default:0
                            },
                            {
                                name: 'F_SYN_FLAG',
                                visible: false,
                                default:0
                            }
                        ],
                    }
                },
                { kind: odl.UiVueForm ? odl.UiVueForm.kind : '' },
                { kind: odl.UiVueTable ? odl.UiVueTable.kind : '' },
                {
                    kind: odl.DbMysql ? odl.DbMysql.kind : '',
                    metadata:
                        {
                            name: '',
                        },
                    spec: {
                        table: {
                            name: 'T_CMM_PROP'
                        },
                        attrs: [
                            {
                                name: 'F_DESC',
                                field: {
                                    fieldType: 'text'
                                }
                            }
                        ],
                        log: {
                            attrs: [
                                {
                                    name: 'ID',
                                },
                                {
                                    name: 'F_NAME',
                                }
                            ],
                        },
                    }
                }
            ]
        }
    };
    odl.register(cmm_prop);
    return cmm_prop;
})();
