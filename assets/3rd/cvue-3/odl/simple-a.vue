<template>
    <section>
        <!-- operate toolbar on top -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item label="属性名">
                    <el-select v-model="filterFieldValue" clearable placeholder="查询的属性" style="width: 130px">
                        <el-option
                                v-for="(field, index) in filterFields"
                                :key="field.value"
                                :label="field.label"
                                :value="field.value"
                                :disabled="field.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filterOperationValue" clearable placeholder="OP" style="width: 80px">
                        <el-option
                                v-for="(operation, index) in filterOperations"
                                :key="operation.value"
                                :label="operation.label"
                                :value="operation.value"
                                :disabled="operation.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="查询值">
                    <el-input v-model="filterValue" placeholder=""></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getObjs">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getAllObjs">全部</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleEdit" :disabled="this.sels.length===0"
                               @keyup.ctrl.101="handleEdit">编辑
                    </el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!-- table -->
        <el-table :data="objs" highlight-current-row v-loading="listLoading" @selection-change="handleSelsChange"
                  style="width: 100%;" height="450">
            <!-- fixed -->
            <el-table-column type="selection" width="55" fixed>
            </el-table-column>
            <el-table-column type="index" width="60" fixed>
            </el-table-column>
            <!-- detail -->
            <el-table-column type="expand">
                <template v-slot="props">
                    <el-form label-position="left" class="demo-table-expand">
                        <el-form-item v-for="(attr, index) in attrs" :key="index">
                            <span><b>{{attr.label}}：</b>{{ props.row[attr.name] }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <!-- other -->
            <el-table-column v-for="(attr, index) in attrs" :key="index" :prop="attr.name" :label="attr.label"
                             :width="attr.width"
                             :min-width="attr.minWidth" :formatter="attr.format" :sortable="attr.sortable"
                             :show-overflow-tooltip="attr.showOverflowTooltip">
            </el-table-column>
        </el-table>

        <!-- operate toolbar on bottom -->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="handleBatchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <TableView :odcName="tableViewOdc" :visible.sync="tableViewVisible" :sels-key-values="[tableViewSelsKeyValue]"
                   :return-attach="tableViewReturnAttach" @submit="handleTableViewSubmit"></TableView>

        <!-- add -->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" top="1vh">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">

                <el-form-item v-for="(attr, index) in attrs" :key="index" :label="attr.label" :prop="attr.name">
                    <section v-if="attr.from">
                        <el-input v-model="addForm[attr.name]" :disabled="true">
                            <el-button slot="append" icon="el-icon-search"
                                       @click.native="tableViewInvoke('add', attr.name, attr.from, addForm[attr.from.prevAttr])"></el-button>
                        </el-input>
                    </section>
                    <el-input v-else-if="attr.type === 'string' && attr.maxLength < 256" v-model="addForm[attr.name]"
                              auto-complete="off"></el-input>
                    <el-input v-else-if="attr.type === 'string'" type="textarea"
                              v-model="addForm[attr.name]"></el-input>
                    <el-input-number
                            v-else-if="attr.type === 'int' || attr.type === 'int32' || attr.type === 'int64' || attr.type === 'double'"
                            v-model="addForm[attr.name]" :min="attr.minvalue" :max="attr.maxvalue" :precision="2"
                            :step="0.01"></el-input-number>
                    <el-radio-group v-else-if="attr.type === 'bool'" v-model="addForm[attr.name]">
                        <el-radio class="radio" :label="true">YES</el-radio>
                        <el-radio class="radio" :label="false">NO</el-radio>
                    </el-radio-group>
                    <el-radio-group v-else-if="attr.type === 'enum' && attr.select" v-model="addForm[attr.name]">
                        <el-radio v-for="(option, index) in attr.select.options" :key="index" class="radio"
                                  :label="option.value">
                            {{option.label}}
                        </el-radio>
                    </el-radio-group>
                    <el-date-picker v-else-if="attr.type === 'date'" type="date" placeholder="选择日期"
                                    v-model="addForm[attr.name]"></el-date-picker>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!-- edit -->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" top="1vh">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">

                <el-form-item v-for="(attr, index) in attrs" :key="index" :label="attr.label" :prop="attr.name">
                    <section v-if="attr.from">
                        <el-input v-model="editForm[attr.name]" :disabled="true">
                            <el-button slot="append" icon="el-icon-search"
                                       @click.native="tableViewInvoke('edit', attr.name, attr.from, editForm[attr.from.prevAttr])"></el-button>
                        </el-input>
                    </section>
                    <el-input v-else-if="attr.type === 'string' && attr.maxLength < 256" v-model="editForm[attr.name]"
                              auto-complete="off"></el-input>
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

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    /*
    format string : formatSex formatDouble formatDate formatTime formatDateTime
    handle : ui event
    remote request [ajax] : getXXX
     */

    import Util from './../js/util'
    import {getOdoQuery} from './../api/api';
    import TableView from './table-view.vue'

    export default {
        components: {
            TableView,
        },

        props: {
            odcName: String,
        },

        data() {
            return {
                attrs: [],

                filterFields: [],
                filterFieldValue: '',
                filterOperations: [],
                filterOperationValue: '',
                filterValue: '',

                objs: [],

                pageSize: 20,
                total: 0,
                page: 1,

                listLoading: false,

                sels: [],

                tableViewOdc: '',
                tableViewVisible: false,
                tableViewSelsKeyValue: null,
                tableViewReturnAttach: {},

                addFormVisible: false,
                addToken: {},
                addForm: {},
                addFormRules: {},
                addLoading: false,

                editFormVisible: false,
                editToken: {},
                editForm: {},
                editFormRules: {},
                editLoading: false,

            }
        },

        methods: {
            init: function() {
                // odc
                this.odc = odl.findOdc(this.odcName);
                console.assert(this.odc);
                // nObj
                this.nObj = odl.findNObj(this.odc, odl.UiVueTable.kind);
                console.assert(this.nObj);
                console.assert(this.nObj.spec.key);
                // filter
                this.attrs = odl.UiVueTable.getTableFields(this.nObj);
                this.filterFields = odl.UiVueTable.getFilterFields(this.nObj);
            },

            getAllObjs() {
                this.filterFieldValue = '';
                this.filterOperationValue = '';
                this.filterValue = '';
                this.page = 1;
                this.getObjs();
            },

            // query data
            getObjs() {
                let params = {
                    session: Date.now(),
                    odc: this.odcName,
                    action: 'ls',
                    queryCounter: true,
                    conditions: {
                        index: ((this.page - 1) * this.pageSize),
                        count: this.pageSize,
                        attrs: [
                            {
                                name: this.filterFieldValue,
                                operation: this.filterOperationValue,
                                value: this.filterValue,
                                isAnd: false
                            }
                        ]
                    }
                };
                this.listLoading = true;
                getOdoQuery(params).then((rs) => {
                    if (rs && rs.state.err) {
                        this.$message({
                            message: '数据请求失败：' + rs.state.err,
                            type: 'error'
                        });
                    }
                    else {
                        this.total = rs.counter;
                        this.objs = rs.data;
                    }
                    this.listLoading = false;
                });
            },

            handleCurrentChange(val) {
                this.page = val;
                this.getObjs();
            },

            // table select change
            handleSelsChange: function(sels) {
                this.sels = sels;
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

            // handle add operate
            handleAdd: function() {
                let params = {
                    session: Date.now(),
                    odc: this.odcName,
                    action: 'add',
                    token: {
                        state: 'req',
                    },
                };
                getOdoQuery(params).then((rs) => {
                    if (rs && rs.state.err) {
                        this.$message({
                            message: '操作权请求失败：' + rs.state.err,
                            type: 'error'
                        });
                    }
                    else {
                        // debugger;
                        this.addFormVisible = true;
                        this.addToken = rs.token;
                        this.addForm = odl.UiVueTable.getFormDefault(this.nObj);
                        if (rs.data && rs.data.length > 0) {
                            Object.assign(this.addForm, rs.data[0]);
                        }
                        this.addFormRules = odl.UiVueTable.getFormRules(this.nObj);
                        // this.$set(this.addFormRules, 'name', [{required: false, message: '请输入姓名', trigger: 'blur'}]);
                        // this.addFormRules.name[0].required = true;
                    }
                });
            },

            // submit add
            addSubmit: function() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let obj = Object.assign({}, this.addForm);
                            debugger;
                            let params = {
                                session: Date.now(),
                                odc: this.odcName,
                                action: 'add',
                                token: this.addToken,
                                data: [obj],
                            };
                            getOdoQuery(params).then((rs) => {
                                this.addLoading = false;
                                if (rs.state && rs.state.affectedRows) {
                                    this.$message({
                                        message: '成功新增' + rs.state.affectedRows + '条数据',
                                        type: 'success'
                                    });
                                }
                                else {
                                    let err = rs.state && rs.state.err ? rs.state.err : '';
                                    this.$message({
                                        message: '新增失败：' + err,
                                        type: 'error'
                                    });
                                }
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getObjs();
                            });
                        });
                    }
                });
            },

            // handle edit operate
            handleEdit: function() {
                if (this.sels.length < 1) return;
                let obj = this.sels[0];

                let params = {
                    session: Date.now(),
                    odc: this.odcName,
                    action: 'edit',
                    token: {
                        state: 'req',
                    },
                };
                getOdoQuery(params).then((rs) => {
                    if (rs && rs.state.err) {
                        this.$message({
                            message: '操作权请求失败：' + rs.state.err,
                            type: 'error'
                        });
                    }
                    else {
                        // debugger;
                        this.editFormVisible = true;
                        this.editToken = rs.token;
                        this.editForm = Object.assign({}, obj);
                        this.editOld = Object.assign({}, obj);
                        if (rs.data && rs.data.length > 0) {
                            Object.assign(this.editForm, rs.data[0]);
                        }
                        this.editFormRules = odl.UiVueTable.getFormRules(this.nObj);
                        // this.$set(this.editFormRules, 'name', [{required: false, message: '请输入姓名', trigger: 'blur'}]);
                        // this.editFormRules.name[0].required = true;
                    }
                });
            },

            // submit edit
            editSubmit: function() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let obj = odl.UiVueTable.getEditSubmitObj(this.nObj, this.editForm, this.editOld);
                            if (! obj) {
                                this.$message({
                                    message: '没有要更新的数据！',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                return;
                            }
                            this.editLoading = true;
                            let params = {
                                session: Date.now(),
                                odc: this.odcName,
                                action: 'edit',
                                token: this.editToken,
                                data: [obj],
                                conditions: [{
                                    attrs: [
                                        {
                                            name: this.nObj.spec.key.name,
                                            operation: '=',
                                            value: this.editOld[this.nObj.spec.key.name]
                                        }
                                    ]
                                }],
                                old: [this.editOld],
                            };
                            getOdoQuery(params).then((rs) => {
                                this.editLoading = false;
                                if (rs.state && rs.state.affectedRows) {
                                    this.$message({
                                        message: '成功编辑' + rs.state.affectedRows + '条数据',
                                        type: 'success'
                                    });
                                }
                                else {
                                    let err = rs.state && rs.state.err ? rs.state.err : '';
                                    this.$message({
                                        message: '编辑失败：' + err,
                                        type: 'error'
                                    });
                                }
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getObjs();
                            });
                        });
                    }
                });
            },

            // delete batch
            handleBatchRemove: function() {
                if (this.sels.length < 1) return;
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let conditions = [];
                    this.sels.forEach(ele => conditions.push({
                        attrs: [
                            {
                                name: this.nObj.spec.key.name,
                                operation: '=',
                                value: ele[this.nObj.spec.key.name]
                            }
                        ]
                    }));
                    let params = {
                        session: Date.now(),
                        odc: this.odcName,
                        action: 'del',
                        conditions: conditions,
                    };
                    getOdoQuery(params).then((rs) => {
                        this.listLoading = false;
                        if (rs.state && rs.state.affectedRows) {
                            this.$message({
                                message: '成功删除' + rs.state.affectedRows + '条数据',
                                type: 'success'
                            });
                            this.getObjs();
                        }
                        else {
                            let err = rs.state && rs.state.err ? rs.state.err : '';
                            this.$message({
                                message: '删除失败：' + err,
                                type: 'error'
                            });
                        }
                    });
                }).catch(() => {

                });
            },
        },

        created() {
            this.init();
        },

        mounted() {
            this.getObjs();
        },

        watch: {
            filterFieldValue(nv, ov) {
                this.filterOperations = odl.UiVueTable.getFilterOperations(this.nObj, nv);
                this.filterOperationValue = '';
                this.filterValue = '';
            }
        }

    }

</script>

<style scoped>

</style>
