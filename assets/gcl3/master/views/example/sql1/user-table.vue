<template>
    <section>
        <!-- operate toolbar on top -->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item label="属性名">
                    <el-select v-model="filter.attr" clearable placeholder="查询的属性">
                        <el-option
                                v-for="item in filter.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
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
        </el-col>

        <!-- table -->
        <el-table ref="multipleTable" :data="objs" highlight-current-row v-loading="listLoading" @selection-change="handleSelsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120" show-overflow-tooltip sortable>
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="80" :formatter="formatSex" sortable>
            </el-table-column>
            <el-table-column prop="height" label="身高" width="100" :formatter="formatDouble" sortable>
            </el-table-column>
            <el-table-column prop="birth" label="生日" width="120" :formatter="formatDate" sortable>
            </el-table-column>
            <el-table-column prop="addr" label="地址" width="120" show-overflow-tooltip sortable>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip sortable>
            </el-table-column>
        </el-table>

        <!-- operate toolbar on bottom -->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="handleSubmit" :disabled="this.sels.length===0">确认选择</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

    </section>
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
            selsIds: {
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
                        r = ' WHERE users.`' + this.filter.attr + "` LIKE '%" + this.filter.value + "%'";
                    }
                    return r;
                };
                let para1 = {
                    session: Date.now(),
                    sql: "SELECT COUNT(users.id) as `counter` FROM users"
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
                    sql: "SELECT users.`id`, users.`name`, users.`sex`, users.`height`, users.`birth`, users.`addr`, users.`remark`, users.`departmentId`, users.`roleGroupId` FROM users"
                        + getSqlWhere() + " LIMIT " + ((this.page - 1) * this.pageSize) + "," + this.pageSize
                };
                getSqlQuery(para2).then((res) => {
                    if (Array.isArray(res.data)) {
                        let objs = res.data;
                        for (let i = 0; i < objs.length; i++) {
                            let obj = objs[i];
                            obj.birth = new Date(obj.birth);
                        }
                        this.objs = objs;
                    }
                    recvQuery();
                });
            },

            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
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
            }
        },

        watch: {
            selsIds(nv, ov) {
                this.toggleSelection(this.objs.filter(ele => nv.indexOf(ele.id) > -1));
            }
        },

        created() {
        },

        mounted() {
            this.filter.options = [
                {
                    value: 'name',
                    label: '姓名',
                },
                {
                    value: 'addr',
                    label: '地址',
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
