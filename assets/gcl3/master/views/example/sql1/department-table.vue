<template>
    <el-dialog
            title="Department"
            :visible.sync="visible"
            top="1vh"
            width="60%"
            v-dialog-drag
            append-to-body>
        <!-- operate toolbar on top -->
        <el-row :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item label="属性名">
                    <el-select v-model="filter.attr" clearable placeholder="查询的属性">
                        <el-option
                                v-for="item in filter.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="查询值">
                    <el-input v-model="filter.value" placeholder=""></el-input>
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
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="120" show-overflow-tooltip sortable>
                </el-table-column>
                <el-table-column prop="setup" label="建立" width="120" :formatter="formatDate" sortable>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip sortable>
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

    import Util from './../../../../../3rd/cvue-3/js/util'
    import {getSqlQuery} from './../../../../../3rd/cvue-3/api/api';

    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            sels_ids: {
                type: Array,
                default: []
            }
        },

        data() {
            return {
                filter: {
                    options: [],
                    attr: '',
                    value: ''
                },
                objs: [],
                pageSize: 20,
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
            }
        },

        methods: {
            // enum - sex
            formatSex: function(row, column) {
                return row[column.property] == 1 ? '男' : row[column.property] == 0 ? '女' : '未知';
            },

            // double
            formatDouble: function(row, column) {
                return row[column.property].toFixed(2);
            },

            // date
            formatDate: function(row, column) {
                let dt = row[column.property];
                return String(dt.getFullYear()) + '-' + dt.getMonth() + '-' + dt.getDay();
            },

            getAllObjs() {
                this.filter.attr = '';
                this.filter.value = '';
                this.page = 1;
                this.getObjs();
            },

            // query data
            getObjs() {
                this.listLoading = true;
                let queryCount = 2;
                let queryIndex = 0;
                let recvQuery = () => {
                    queryIndex++;
                    if (queryIndex === queryCount) {
                        this.listLoading = false;
                        this.toggleSelection();
                    }
                };
                let getSqlWhere = () => {
                    let r = '';
                    if (this.filter.attr && this.filter.value) {
                        r = ' WHERE department.`' + this.filter.attr + "` LIKE '%" + this.filter.value + "%'";
                    }
                    return r;
                };
                let para1 = {
                    session: Date.now(),
                    sql: "SELECT COUNT(department.id) as `counter` FROM department"
                        + getSqlWhere()
                };
                getSqlQuery(para1).then((res) => {
                    if (Array.isArray(res.data) && res.data.length > 0) {
                        this.total = res.data[0]["counter"];
                    }
                    recvQuery();
                });
                let para2 = {
                    session: Date.now(),
                    sql: "SELECT department.`id`, department.`name`, department.`setup`, department.`remark` FROM department"
                        + getSqlWhere() + " LIMIT " + ((this.page - 1) * this.pageSize) + "," + this.pageSize
                };
                getSqlQuery(para2).then((res) => {
                    if (Array.isArray(res.data)) {
                        let objs = res.data;
                        for (let i = 0; i < objs.length; i++) {
                            let obj = objs[i];
                            obj.setup = new Date(obj.setup);
                        }
                        this.objs = objs;
                    }
                    recvQuery();
                });
            },

            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        if (this.$refs.multipleTable) {
                            this.$refs.multipleTable.toggleRowSelection(row);
                        }
                    });
                }
                else {
                    if (this.$refs.multipleTable) {
                        this.$refs.multipleTable.clearSelection();
                    }
                }
            },

            handleCurrentChange(val) {
                this.page = val;
                this.getObjs();
            },

            // table select change
            handleSelsChange: function(sels) {
            debugger;
                this.sels = sels;
            },

            handleSubmit() {
                this.$emit('submit', this.sels);
                this.$emit("update:visible", false);
            }
        },

        watch: {
            sels_ids(nv, ov) {
                this.toggleSelection(this.objs.filter(ele => nv.indexOf(ele.id) > -1));
            },
            visible(nv, ov) {
                this.$emit("update:visible", nv);
            }
        },

        created() {
        },

        mounted() {
            this.filter.options = [
                {
                    value: 'name',
                    label: '名称',
                },
                {
                    value: 'remark',
                    label: '备注',
                },
            ];
            this.getObjs();
        }
    }

</script>

<style scoped>

</style>
