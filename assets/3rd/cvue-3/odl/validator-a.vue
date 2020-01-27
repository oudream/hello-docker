<template>
    <el-row class="login-bg">
        <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm"
                 class="demo-ruleForm login-container">

            <el-form-item v-for="(attr, index) in attrs" :key="index" :label="attr.label" :prop="attr.name">
                <section v-if="attr.from">
                    <el-input v-model="editForm[attr.name]" :disabled="true">
                        <el-button slot="append" icon="el-icon-search"
                                   @click.native="tableViewInvoke('edit', attr.name, attr.from, editForm[attr.from.prevAttr])"></el-button>
                    </el-input>
                </section>

                <el-input v-else-if="attr.type === 'string' && attr.name === 'password'" type="password"
                          v-model="editForm[attr.name]" auto-complete="off"></el-input>
                <el-input v-else-if="attr.type === 'string' && attr.maxLength < 256" type="text"
                          v-model="editForm[attr.name]" auto-complete="off"></el-input>
                <el-input v-else-if="attr.type === 'string'" type="textarea"
                          v-model="editForm[attr.name]"></el-input>

                <el-input-number
                        v-else-if="attr.type === 'int' || attr.type === 'int32' || attr.type === 'int64' || attr.type === 'double'"
                        v-model="editForm[attr.name]" :min="attr.minvalue" :max="attr.maxvalue" :precision="2"
                        :step="0.01"></el-input-number>

                <el-radio-group v-else-if="attr.type === 'bool'" v-model="editForm[attr.name]">
                    <el-radio class="radio" :label="true">YES</el-radio>
                    <el-radio class="radio" :label="false">NO</el-radio>
                </el-radio-group>

                <el-radio-group v-else-if="attr.type === 'enum' && attr.select" v-model="editForm[attr.name]">
                    <el-radio v-for="(option, index) in attr.select.options" :key="index" class="radio"
                              :label="option.value">
                        {{option.label}}
                    </el-radio>
                </el-radio-group>

                <el-date-picker v-else-if="attr.type === 'date'" type="date" placeholder="选择日期"
                                v-model="editForm[attr.name]"></el-date-picker>
            </el-form-item>

            <el-checkbox v-model="checked" checked class="remember">记住信息</el-checkbox>

            <el-form-item style="text-align: right">
                <el-button @click.native="cancelEdit" :disabled="cancelButton.visible">{{cancelButton.title}}
                </el-button>
                <el-button type="primary" @click.native="handleEdit" :loading="editLoading">{{submitButton.title}}
                </el-button>
            </el-form-item>

        </el-form>

        <TableView :odcName="tableViewOdc" :visible.sync="tableViewVisible" :sels-key-values="[tableViewSelsKeyValue]"
                   :return-attach="tableViewReturnAttach" @submit="handleTableViewSubmit"></TableView>


    </el-row>
</template>

<script>

    import Util from './../js/util'
    import {getOdoQuery} from './../api/api';
    import TableView from './table-view.vue'

    export default {
        components: {
            TableView,
        },

        props: {
            odcName: {
                type: String,
                required: true
            },
            backGroundImage: {
                type: String,
                required: false
            },
            submitButton: {
                type: Object,
                required: false,
                default: function _submitButton() {
                    return {title: '提交验证'}
                },
            },
            cancelButton: {
                type: Object,
                required: false,
                default: function _cancelButton() {
                    return {
                        title: '取消提交',
                        visible: true,
                    }
                },
            },
        },

        data() {
            return {
                attrs: [],

                editFormVisible: false,
                editToken: {},
                editForm: {},
                editFormRules: {},
                editLoading: false,

                checked: true,

                tableViewOdc: '',
                tableViewVisible: false,
                tableViewSelsKeyValue: null,
                tableViewReturnAttach: {},

            };
        },

        methods: {
            init: function() {
                // odc
                this.odc = odl.findOdc(this.odcName);
                console.assert(this.odc);
                // nObj
                this.nObj = odl.findNObj(this.odc, odl.UiVueValidator.kind);
                console.assert(this.nObj);
                console.assert(this.nObj.spec.key);
                // filter
                this.attrs = odl.UiVueValidator.getFields(this.nObj);
                this.editFormRules = odl.UiVueValidator.getFormRules(this.nObj);
                this.editForm = odl.UiVueTable.getFormDefault(this.nObj);
            },

            cancelEdit: function() {
                this.$emit('cancel');
            },

            // handle edit operate
            handleEdit: function() {
                let conditions = {};
                conditions.attrs = [];
                this.attrs.forEach(atr => conditions.attrs.push(
                    {
                        name: atr.name,
                        operation: '=',
                        value: this.editForm[atr.name],
                        isAnd: true
                    }
                ));
                let params = {
                    session: Date.now(),
                    odc: this.odcName,
                    action: 'validate',
                    token: {
                        state: 'req',
                    },
                    conditions: conditions,
                };
                getOdoQuery(params).then((rs) => {
                    if (rs && rs.state.err && Array.isArray(rs.data) && rs.data.length > 0) {
                        this.$emit('submit', rs.state.err, null);
                    }
                    else {
                        params.token.state = '';
                        params.data = rs.data;

                        getOdoQuery(params).then((rs) => {
                            if (rs && rs.state.err && Array.isArray(params.data) && params.data.length > 0) {
                                this.$emit('submit', rs.state.err, null);
                            }
                            else {
                                this.$emit('submit', null, params.data);
                            }
                        });
                    }
                });
            },

            tableViewInvoke: function(action, attr, from, fromPrevValue) {
                let {refer} = from;
                this.tableViewOdc = refer.odc;
                this.tableViewVisible = false;
                this.tableViewVisible = true;
                this.tableViewSelsKeyValue = fromPrevValue;
                this.tableViewReturnAttach = {
                    action: action,
                    attr: attr,
                    from: {refer: refer, prevAttr: from.prevAttr, prevValue: fromPrevValue}
                }
            },

            handleTableViewSubmit: function(sels, ra) {
                if (Array.isArray(sels) && sels.length > 0) {
                    let sel = sels[0];
                    let {action, attr, from} = ra;
                    let {refer} = from;
                    let newValue = sel[refer.key];
                    if (newValue !== from.prevValue) {
                        let form = action === 'add' ? this.addForm : this.editForm;
                        form[from.prevAttr] = sel[refer.key];
                        form[attr] = sel[refer.title];
                    }
                }
            },
        },


        created() {
            this.init();
        },

        mounted() {
        },
    }

</script>

<style lang="scss" scoped>
    .login-bg {
        /*background: url({{backGroundImage}});*/
        background: url(/static/jpg/login-bg.jpg);
        background-size: 100%, 100%;
        width: 100%;
        height: 100%;

        .login-container {
            /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
            -webkit-border-radius: 5px;
            border-radius: 5px;
            -moz-border-radius: 5px;
            background-clip: padding-box;
            margin: 12% 35%;
            width: 350px;
            padding: 35px 35px 15px 35px;
            background: #fff;
            border: 1px solid #eaeaea;
            box-shadow: 0 0 25px #cac6c6;

            .title {
                margin: 0px auto 40px auto;
                text-align: center;
                color: #505458;
            }

            .remember {
                margin: 0px 0px 35px 0px;
            }
        }
    }

</style>
