(function() {
    'use strict';

    let odl = (typeof exports === 'object' && typeof global === 'object') ? global.odl : window.odl;

    odl.UiVueBase = {
        kind: 'ui.vue.base',

        _defaultWidth: {
            int: 80,
            int32: 60,
            int64: 80,
            double: 80,
            bool: 60,
            string: 120,
            date: 100,
            enum: 80
        },

        getSimilar: function(odc) {
            return odl.findNObj(odc, this.kind);
        },

        getSimilarByName: function(name) {
            let odc = odl.findOdc(name);
            return odc ? this.getSimilar(odc) : null;
        },

        completionAttr: function(attr) {
            // visible
            if (!attr.hasOwnProperty('visible')) {
                attr.visible = true;
            }
            if (!attr.hasOwnProperty('readonly')) {
                attr.readonly = false;
            }
        },

        /**
         *
         * @param odc
         * @param nObj
         * @returns {Error|null}
         */
        normalize: function(odc, nObj) {
            // extend base
            let base = odl.findNObj(odc, odl.UiVueBase.kind);
            if (base) {
                odl.mergeExcepts(nObj, base);
                if (base.spec && base.spec.attrs) {
                    if (nObj.spec && nObj.spec.attrs) {
                        nObj.spec.attrs = odl.Attr.mergeAttrs(base.spec.attrs, nObj.spec.attrs);
                    }
                    else {
                        if (!nObj.spec) nObj.spec = {};
                        nObj.spec.attrs = odl.clone(base.spec.attrs);
                    }
                }
            }
            if (!nObj.spec) nObj.spec = {};
            let spec = nObj.spec;
            // title
            if (!spec.title) {
                spec.title = {
                    title: odc.metadata.name
                };
            }
            // attrs
            let supperAttrs = odc.spec.attrs;
            if (!spec.attrs) spec.attrs = [];
            let attrs = spec.attrs;
            let newAttrs = odl.Attr.mergeAttrs(supperAttrs, attrs);
            for (let i = 0; i < newAttrs.length; i++) {
                let newAttr = newAttrs[i];
                this.completionAttr(newAttr);
            }
            spec.attrs = newAttrs;
            // spec.keys & spec.key
            if (Array.isArray(odc.spec.container.keys) && !spec.keys) {
                spec.keys = odl.clone(odc.spec.container.keys);
            }
            if (Array.isArray(odc.spec.container.sorts) && !spec.sorts) {
                spec.sorts = odl.clone(odc.spec.container.sorts);
            }
            if (Array.isArray(spec.keys) && spec.keys.length > 0) {
                let sKey = spec.keys.find(ele => typeof ele === 'string' && ele.length > 0);
                spec.key = spec.attrs.find(ele => ele.name === sKey);
            }
            return null;
        },

        /**
         *
         * @param odc
         * @param nObj
         * @returns {Error}
         */
        normalizeAfer: function(odc, nObj) {
            if (nObj.kind !== this.kind) {
                return new Error('nObj kind invalid!!');
            }
            let attrs = nObj.spec.attrs;
        },

        getFormats: function(name, type) {
            let formats = {
                formatSex: function(row, column) {
                    return row[column.property] == 1 ? '男' : row[column.property] == 0 ? '女' : '未知';
                },

                // double
                formatBool: function(row, column) {
                    return row[column.property] ? 'Y' : 'N';
                },

                // double
                formatDouble: function(row, column) {
                    let v = row[column.property];
                    if (typeof v === 'number') {
                        return row[column.property].toFixed(2);
                    }
                    return v;
                },

                // date
                formatDate: function(row, column) {
                    let dt = row[column.property];
                    if (dt) {
                        return String(dt.getFullYear()) + '-' + dt.getMonth() + '-' + dt.getDay();
                    }
                    return dt;
                },

                // time
                formatTime: function(row, column) {
                    let dt = row[column.property];
                    if (dt) {
                        return String(dt.getHours()) + ':' + dt.getMinutes() + ':' + dt.getSeconds();
                    }
                    return dt;
                },
            };

            let formatDefault = {
                int: null,
                int32: null,
                int64: null,
                double: formats.formatDouble,
                bool: formats.formatBool,
                string: null,
                date: formats.formatDate,
                enum: null,
            };

            return name && formats[name] ? formats[name] : formatDefault[type];
        },

        getSelects: function(scopes, values) {
            let r = {options: []};
            if (Array.isArray(scopes)) {
                if (Array.isArray(values) && values.length >= scopes.length) {
                    scopes.forEach((s, i) => {
                        r.options.push({label: s, value: values[i]})
                    });
                }
                else {
                    scopes.forEach((s, i) => {
                        r.options.push({label: s, value: i})
                    });
                }
            }
            else {
                return null;
            }
            return r;
        },

        /**
         * attrs
         <el-table-column v-for="attr in attrs" :prop="attr.name" :label="attr.label" :width="attr.width" :formatter="attr.format" :sortable="attr.sortable" show-overflow-tooltip="attr.showOverflowTooltip">

         * @param nObj
         * @returns {[]}
         */
        getFields: function(nObj) {
            let r = [];
            let push = (name, a) => {
                let atr = {
                    name: name,
                    type: a.type,
                    maxLength: a.maxLength,
                    label: a.title,
                    width: this._defaultWidth[a.type],
                    format: this.getFormats(a.format, a.type),
                    sortable: true,
                    showOverflowTooltip: a.type === 'string' && a.maxLength > this._defaultWidth[a.type],
                    readonly: a.readonly,
                };
                if (a.type !== 'string' || a.type !== 'bool') {
                    atr.minvalue = a.minvalue;
                    atr.maxvalue = a.maxvalue;
                }
                if (a.type === 'enum') {
                    atr.select = this.getSelects(a.scopes, a.values);
                }
                r.push(atr);
                return atr;
            };
            nObj.spec.attrs.forEach(a => {
                if (a.visible) {
                    push(a.name, a);
                }
                if (a.refer) {
                    let ar = odl.findReferTitleAttr(a.refer, this.kind);
                    if (ar) {
                        let atr = push(a.refer.titleName, ar);
                        atr.from = {};
                        atr.from.refer = odl.clone(a.refer);
                        atr.from.prevAttr = a.name;
                        atr.readonly = a.readonly;
                    }
                }
            });
            if (r.length > 0) {
                r[r.length - 1].width = undefined;
                r[r.length - 1]['minWidth'] = 180
            }
            return r;
        },

        /**
         * attrs
         this.filter.options = [
         {
                    value: 'name',
                    label: '姓名',
                },
         {
                    value: 'addr',
                    label: '地址',
                },
         ]
         * @param nObj
         * @returns {[]}
         */
        getFilterFields: function(nObj) {
            let attrs = nObj.spec.attrs;
            let filters = nObj.spec.filter && Array.isArray(nObj.spec.filter.filters) ? odl.clone(nObj.spec.filter.filters) : null;
            if (Array.isArray(filters)) {
                let b = true;
                for (let i = 0; i < filters.length; i++) {
                    let filter = filters[i];
                    if (filter.type === 'refer') {
                        if (filter.fields.length === 1 && filter.operations.length > 1) {
                            if (! filter.hasOwnProperty('fieldValue')) filter.fieldValue = null;
                            if (! filter.hasOwnProperty('operationValue')) filter.operationValue = null;
                            if (! filter.hasOwnProperty('value')) filter.value = null;
                            if (! filter.hasOwnProperty('type')) filter.type = null;
                            if (! filter.hasOwnProperty('isAnd')) filter.isAnd = true;
                            if (! Array.isArray(filter.values)) filter.values = [];
                        }
                        else {
                            b = false;
                            break;
                        }
                    }
                }
                if (b) {
                    return filters;
                }
            }
            {
                let filter = {
                    fields: [],
                    fieldValue: null,
                    operations: [],
                    operationValue: null,
                    values: [],
                    value: null,
                    type: null,
                    isAnd: true
                };
                for (let i = 0; i < attrs.length; i++) {
                    let attr = attrs[i];
                    if (attr.visible) {
                        filter.fields.push({
                            value: attr.name,
                            label: attr.title,
                        });
                    }
                }
                return [filter];
            }
        },

        /**
         * attrs
         this.filter.options = [
         {
                    value: '%',
                    label: 'LIKE',
                },
         {
                    value: '>',
                    label: '>',
                },
         ]
         * @param nObj
         * @param attrName
         * @returns {[]}
         */
        getFilterOperations: function(nObj, attrName) {
            let r = [
                {
                    value: '=',
                    label: '=',
                }
            ];
            let attr = nObj.spec.attrs.find(a => a.name === attrName);
            if (attr) {
                let type = attr.type;
                if (attr.refer) {
                    let attr2 = odl.findReferTitleAttr(attr.refer, this.kind);
                    if (attr2) {
                        type = attr2.type;
                    }
                }
                if (type === 'string') {
                    r.push({
                        value: '%',
                        label: '%',
                    });
                }
                else if (type === 'bool' || type === 'enum') {

                }
                else {
                    r.push({
                        value: '>',
                        label: '>',
                    });
                    r.push({
                        value: '<',
                        label: '<',
                    });
                }
            }
            return r;
        },

        /**
         * attrs
         * @param nObj
         */
        getFormDefault: function(nObj) {
            let r = {};
            nObj.spec.attrs.forEach(a => {
                if (typeof a.default === 'function') {
                    r[a.name] = a.default();
                }
                else {
                    r[a.name] = a.default;
                }
            });
            return r;
        },

        /**
         * attrs
         * @param nObj
         */
        getFormRules: function(nObj) {
            let r = {};
            if (Array.isArray(nObj.spec.keys)) {
                nObj.spec.keys.forEach(k => {
                    let attr = nObj.spec.attrs.find(a => a.name === k);
                    if (attr !== undefined) {
                        r[k] = [{required: true, message: '请输入' + attr.title, trigger: 'blur'}];
                    }
                });
            }
            nObj.spec.attrs.forEach(a => {
                if (a.required) {
                    r[a.name] = [{required: true, message: '请输入' + a.title, trigger: 'blur'}];
                }
            });
            return r;
        },

        getEditSubmitObj: function(nObj, formObj, oldObj) {
            let iCount = 0;
            let r = {};
            let key = nObj.spec.key ? nObj.spec.key.name : '';
            for (let prop in oldObj) {
                if (prop === key) {
                    continue;
                }
                let nv = formObj[prop];
                let ov = oldObj[prop];
                if (nv != ov) {
                    r[prop] = nv;
                    iCount++;
                }
            }
            if (iCount > 0) {
                return r;
            }
            else {
                return null;
            }
        }
    };

    odl.UiVueForm = {
        kind: 'ui.vue.form',

        _defaultWidth: odl.UiVueBase._defaultWidth,

        getSimilar: odl.UiVueBase.getSimilar,

        getSimilarByName: odl.UiVueBase.getSimilarByName,

        completionAttr: odl.UiVueBase.completionAttr,

        normalize: function(odc, nObj) {
            if (nObj.kind !== this.kind) {
                return new Error('nObj kind invalid!!');
            }
            return odl.UiVueBase.normalize(odc, nObj);
        },

        normalizeAfer: odl.UiVueBase.normalizeAfer,

        getFormats: odl.UiVueBase.getFormats,

        getSelects: odl.UiVueBase.getSelects,

        getFields: odl.UiVueBase.getFields,

        getFilterFields: odl.UiVueBase.getFilterFields,

        getFilterOperations: odl.UiVueBase.getFilterOperations,

        getFormDefault: odl.UiVueBase.getFormDefault,

        getFormRules: odl.UiVueBase.getFormRules,

        getEditSubmitObj: odl.UiVueBase.getEditSubmitObj

    };

    odl.UiVueTable = {
        kind: 'ui.vue.table',

        _defaultWidth: odl.UiVueBase._defaultWidth,

        getSimilar: odl.UiVueBase.getSimilar,

        getSimilarByName: odl.UiVueBase.getSimilarByName,

        completionAttr: odl.UiVueBase.completionAttr,

        normalize: function(odc, nObj) {
            if (nObj.kind !== this.kind) {
                return new Error('nObj kind invalid!!');
            }
            return odl.UiVueBase.normalize(odc, nObj);
        },

        normalizeAfer: odl.UiVueBase.normalizeAfer,

        getFormats: odl.UiVueBase.getFormats,

        getSelects: odl.UiVueBase.getSelects,

        getFields: odl.UiVueBase.getFields,

        getTableFields: odl.UiVueBase.getFields,

        getFilterFields: odl.UiVueBase.getFilterFields,

        getFilterOperations: odl.UiVueBase.getFilterOperations,

        getFormDefault: odl.UiVueBase.getFormDefault,

        getFormRules: odl.UiVueBase.getFormRules,

        getEditSubmitObj: odl.UiVueBase.getEditSubmitObj

    };

    odl.UiVueValidator = {
        kind: 'ui.vue.validator',

        _defaultWidth: odl.UiVueBase._defaultWidth,

        getSimilar: odl.UiVueBase.getSimilar,

        getSimilarByName: odl.UiVueBase.getSimilarByName,

        completionAttr: odl.UiVueBase.completionAttr,

        normalize: function(odc, nObj) {
            if (nObj.kind !== this.kind) {
                return new Error('nObj kind invalid!!');
            }
            return odl.UiVueBase.normalize(odc, nObj);
        },

        normalizeAfer: odl.UiVueBase.normalizeAfer,

        getFormats: odl.UiVueBase.getFormats,

        getSelects: odl.UiVueBase.getSelects,

        getFields: odl.UiVueBase.getFields,

        getFilterFields: odl.UiVueBase.getFilterFields,

        getFilterOperations: odl.UiVueBase.getFilterOperations,

        getFormDefault: odl.UiVueBase.getFormDefault,

        getFormRules: odl.UiVueBase.getFormRules,

        getEditSubmitObj: odl.UiVueBase.getEditSubmitObj

    };

    odl.registerNPlugin(odl.UiVueForm);
    odl.registerNPlugin(odl.UiVueTable);
    odl.registerNPlugin(odl.UiVueValidator);
})();
