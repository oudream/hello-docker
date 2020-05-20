(function() {
    'use strict';
    let Locket = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'lock',
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
                    name: 'f_id',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'f_pid',
                    model: 'string'
                },
                {
                    name: 'f_nid',
                    model: 'int'
                },
                {
                    name: 'f_name',
                    title: '名称',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'f_class',
                    title: '类别',
                    model: 'string',
                },
                {
                    name: 'f_uri',
                    title: '编号',
                    model: 'string',
                    isNull: false
                },
                {
                    name: 'f_code',
                    title: '类型',
                    model: 'int',
                },
                {
                    name: 'f_desc',
                    title: '描述',
                    model: 'string'
                },
                {
                    name: 'f_t_crt',
                    title: '创建时间',
                    model: 'date'
                },
                {
                    name: 'f_user_crt',
                    title: '创建人',
                    model: 'string',
                },
                {
                    name: 'f_t_mod',
                    title: '修改时间',
                    model: 'date'
                },
                {
                    name: 'f_user_mod',
                    title: '修改人',
                    model: 'string',
                },
                {
                    name: 'f_res0',
                    model: 'int'
                },
                {
                    name: 'f_res1',
                    model: 'string'
                },
                {
                    name: 'f_dt_flag',
                    model: 'int'
                },
                {
                    name: 'f_st_flag',
                    model: 'int'
                },
                {
                    name: 'f_syn_flag',
                    model: 'int'
                }
            ],
            container: {
                keys: ['id'],
                sorts: ['name']
            },
            ns: [
                {
                    kind: odl.UiVueBase ? odl.UiVueBase.kind : '',
                    spec: {
                        title: {
                            text: 'LOCKET',
                        },
                        attrs: [
                            {
                                name: 'id',
                                readonly: true,
                                visible: false
                            },
                            {
                                name: 'f_id',
                                visible: false
                            },
                            {
                                name: 'f_pid',
                                visible: false
                            },
                            {
                                name: 'f_nid',
                                visible: false
                            },
                            {
                                name: 'f_name',
                                required: true
                            },
                            {
                                name: 'f_t_crt',
                                visible: false
                            },
                            {
                                name: 'f_user_crt',
                                visible: false
                            },
                            {
                                name: 'f_t_mod',
                                visible: false
                            },
                            {
                                name: 'f_user_mod',
                                visible: false
                            },

                            {
                                name: 'f_res0',
                                visible: false,
                                default:0
                            },
                            {
                                name: 'f_res1',
                                visible: false,
                                default:''
                            },
                            {
                                name: 'f_dt_flag',
                                visible: false,
                                default:0
                            },
                            {
                                name: 'f_st_flag',
                                visible: false,
                                default:0
                            },
                            {
                                name: 'f_syn_flag',
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
                            name: 't_obj_lock'
                        },
                        attrs: [
                            {
                                name: 'f_desc',
                                field: {
                                    fieldType: 'text'
                                }
                            }
                        ],
                        log: {
                            attrs: [
                                {
                                    name: 'id',
                                },
                                {
                                    name: 'f_name',
                                }
                            ],
                        },
                    }
                }
            ]
        }
    };
    odl.register(Locket);
    return Locket;
})();
