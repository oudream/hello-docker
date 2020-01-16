<template>
    <el-dialog
            :title="odcName"
            :visible.sync="dgVisible"
            top="1vh"
            width="60%"
            v-dialog-drag
            append-to-body>
        <!-- operate toolbar on top -->
        <el-row :span="24" class="toolbar" style="padding-bottom: 0px;">
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
            </el-form>
        </el-row>

        <el-row>
            <!-- table -->
            <el-table ref="multipleTable" :data="objs" highlight-current-row v-loading="listLoading"
                      @selection-change="handleSelsChange"
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
                <el-table-column v-for="(attr, index) in attrs" :key="index" :prop="attr.name" :label="attr.label" :width="attr.width"
                                 :min-width="attr.minWidth" :formatter="attr.format" :sortable="attr.sortable"
                                 :show-overflow-tooltip="attr.showOverflowTooltip">
                </el-table-column>
            </el-table>
        </el-row>

        <!-- operate toolbar on bottom -->
        <el-row :span="24" class="toolbar">
            <el-button type="danger" @click="handleSubmit" :disabled="this.sels.length===0">确认选择</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-row>
    </el-dialog>
</template>

<script>
    /*
    format string : formatSex formatDouble formatDate formatTime formatDateTime
    handle : ui event
    remote request [ajax] : getXXX
     */

    import Util from './../js/util'
    import {getOdoQuery} from './../api/api';


    export default {
        components: {},

        props: {
            odcName: {
                type: String,
                required: true,
            },
            visible: {
                type: Boolean,
                default: false
            },
            selsKeyValues: {
                type: Array,
                default: []
            },
            returnAttach: {
                type: Object,
            }
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

                dgVisible: false,
            }
        },

        methods: {
            clear() {
                this.odc = undefined;
                this.nObj = undefined;
                this.attrs = [];
                this.filterFields = [];
                this.objs = [];
            },

            init() {
                // odc nObj
                this.odc = odl.findOdc(this.odcName);
                if (!this.odc) {
                    this.clear();
                    return;
                }
                // nObj
                this.nObj = odl.findNObj(this.odc, odl.UiVueTable.kind);
                if (!this.nObj || !this.nObj.spec.key) {
                    this.clear();
                    return;
                }
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

            toggleSelection() {
                let rows = this.objs.filter(o => this.selsKeyValues.indexOf(o[this.nObj.spec.key.name]) > -1);
                if (Array.isArray(rows) && rows.length>0) {
                    rows.forEach(row => {
                        if (this.$refs.multipleTable) {
                            this.$refs.multipleTable.toggleRowSelection(row, true);
                        }
                    });
                }
            },

            handleCurrentChange(val) {
                this.page = val;
                this.getObjs();
            },

            // table select change
            handleSelsChange(sels) {
                this.sels = sels;
            },

            handleSubmit() {
                this.$emit('submit', this.sels, this.returnAttach);
                this.dgVisible = false;
            }
        },

        created() {
            this.odc = undefined;
            this.nObj = undefined;
            this.goingToggleSelection = false;
        },

        mounted() {
            // console.log('mounted')
        },

        updated: function () {
            // console.log('updated');
            if (this.goingToggleSelection) {
                this.goingToggleSelection = false;
                this.toggleSelection();
            }
        },

        watch: {
            odcName(nv, ov) {
                // this.clear();
                this.init();
                this.getObjs();
            },

            visible(nv, ov) {
                this.dgVisible = nv;
            },

            dgVisible(nv, ov) {
                this.$emit("update:visible", nv);
                // console.log('dgVisible:', nv);
            },

            filterFieldValue(nv, ov) {
                this.filterOperations = odl.UiVueTable.getFilterOperations(this.nObj, nv);
                this.filterOperationValue = '';
                this.filterValue = '';
            },

            selsKeyValues(nv, ov) {
                if (this.nObj && this.objs.length>0) {
                    this.toggleSelection();
                }
            },

            objs(nv, ov) {
                if (nv.length > 0) {
                    this.goingToggleSelection = true;
                }
            },

        }
    }

</script>

<style scoped>

</style>
