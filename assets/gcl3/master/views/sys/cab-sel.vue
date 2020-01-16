<template>
    <el-dialog
            title="档案柜选择"
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
        </el-row>

        <el-row>
            <!-- table -->
            <el-table ref="multipleTable" :data="objs" highlight-current-row v-loading="listLoading"
                      @selection-change="handleSelsChange"
                      style="width: 100%;" height="450">
                <el-table-column type="selection" width="55"></el-table-column>
                <!--<el-table-column  label="操作" width="55">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-checkbox v-model="scope.row.checked"></el-checkbox>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip sortable>
                </el-table-column>
                <el-table-column prop="uri" label="编号" width="120" sortable>
                </el-table-column>
            </el-table>
        </el-row>

        <!-- operate toolbar on bottom -->
        <el-row :span="24" class="toolbar">
            <el-button @click="handleSubmit" :disabled="this.sels.length===0">选择确认</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
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

    import util from './../../../../3rd/cvue-3/js/util'
    import {getSqlQuery} from '../../../../3rd/cvue-3/api/api';

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
                //常量配置
                cfg_const:{
                    obj:'ti_obj_cab',
                    log:'ti_log_cab',
                    class:'CAB',
                    user:'SYS',
                    sql_sel:'SELECT id as `id`,f_id as `uuid`,f_name as `name`,f_uri as `uri` FROM ti_obj_cab ',
                    sql_max_id:'SELECT MAX(id) as max_id FROM ti_obj_cab',
                    sql_del:'update ti_obj_cab set f_dt_flag = -1 WHERE id = ',
                    sql_rec_cnt:'SELECT COUNT(id) as count_rec FROM ti_obj_cab ',
                    sql_where_0:'WHERE {0}  LIKE \'%{0}%\' and f_dt_flag=0 ',
                    sql_where_1:" WHERE f_dt_flag=0 ",
                    sql_order:' order by name '
                },
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
            handleSelectionChange (row) {
                this.objs.forEach(item => {
                    if (item.id !== row.id) {
                        item.checked = false
                    }
                })
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
                        r = util.formatString.format(this.cfg_const.sql_where_0,this.filter.attr,this.filter.value);
                    }else{
                        r = this.cfg_const.sql_where_1;
                    }
                    return r;
                };

                let para1 = {
                    session: Date.now(),
                    sql: this.cfg_const.sql_rec_cnt + getSqlWhere()
                };
                getSqlQuery(para1).then((res) => {
                    if (Array.isArray(res.data) && res.data.length > 0) {
                        this.total = res.data[0]["count_rec"];
                    }
                    recvQuery();
                });
                let para2 = {
                    session: Date.now(),
                    sql: this.cfg_const.sql_sel + getSqlWhere() + this.cfg_const.sql_order +" LIMIT " + ((this.page - 1) * this.pageSize) + "," + this.pageSize
                };
                debugger
                getSqlQuery(para2).then((res) => {
                    debugger
                    if (Array.isArray(res.data)) {
                        let objs = res.data;
//                        for (let i = 0; i < objs.length; i++) {
//                            let obj = objs[i];
//                        }
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
                this.sels = sels;
                if (sels.length > 1) {
                    this.$refs.multipleTable.clearSelection();
                    this.$refs.multipleTable.toggleRowSelection(sels.pop());
                }
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
                    value: 'f_name',
                    label: '名称',
                },
                {
                    value: 'f_uri',
                    label: '编号',
                },
            ];
            this.getObjs();
        }
    }

</script>

<style scoped>

</style>
