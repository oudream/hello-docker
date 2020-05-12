(function() {
    'use strict';
    let ClientUpload = {
        apiVersion: 'v1',
        kind:
            'odc',
        metadata:
            {
                name: 'client_upload',
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
                    name: 'fileName',
                    desc: '文件名',
                    model: 'string',
                },
                {
                    name: 'fileContenType',
                    title: '文件类型',
                    model: 'string',
                },
                {
                    name: 'filePath',
                    title: '文件路径',
                    model: 'string',
                },
                {
                    name: 'md5',
                    title: 'MD5',
                    model: 'string',
                },
                {
                    name: 'size',
                    title: '文件大小',
                    model: 'double',
                },
                {
                    name: 'uploadTime',
                    title: '上传时间',
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
                            text: 'CLIENT-UPLOAD',
                        },
                        attrs: [
                            {
                                name: 'id',
                                readonly: true,
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
                            name: 'client_upload'
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
    odl.register(ClientUpload);
    return ClientUpload;
})();
