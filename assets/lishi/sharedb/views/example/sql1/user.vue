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
                  style="width: 100%;" height="680px">
            <!-- fixed -->
            <el-table-column type="selection" width="55" fixed>
            </el-table-column>
            <el-table-column type="index" width="60" fixed>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120" show-overflow-tooltip fixed sortable>
            </el-table-column>
            <!-- detail -->
            <el-table-column type="expand">
                <template v-slot="props">
                    <el-form label-position="left" class="demo-table-expand">
                        <el-form-item>
                            <span><b>姓名：</b>{{ props.row.name }}</span>
                        </el-form-item>
                        <el-form-item>
                            <span><b>部门：</b>{{ props.row.department_name }}</span>
                        </el-form-item>
                        <el-form-item>
                            <span><b>性别：</b>{{ props.row.sex }}</span>
                        </el-form-item>
                        <el-form-item>
                            <span><b>身高：</b>{{ props.row.height }}</span>
                        </el-form-item>
                        <el-form-item>
                            <span><b>生日：</b>{{ props.row.birth }}</span>
                        </el-form-item>
                        <el-form-item>
                            <span><b>地址：</b>{{ props.row.addr }}</span>
                        </el-form-item>
                        <el-form-item>
                            <span><b>备注：</b>{{ props.row.remark }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <!-- other -->
            <el-table-column prop="department_name" label="部门" width="120" show-overflow-tooltip sortable>
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
            <el-button type="danger" @click="handleBatchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!-- add -->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="addForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="身高">
                    <el-input-number v-model="addForm.height" :min="0" :max="200" :precision="2"
                                     :step="0.1"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="addForm.addr"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="addForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

        <!-- edit -->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" v-dialog-drag top="1vh"
                   width="60%" modal="">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="姓名">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="身高">
                    <el-input-number v-model="editForm.height" :min="0" :max="300" :precision="2"
                                     :step="0.01"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="editForm.addr"></el-input>
                </el-form-item>
                <el-form-item label="所在部门">
                    <section>
                        <el-input v-model="editForm.department_name" :disabled="true">
                            <el-button slot="append" icon="el-icon-search"
                                       @click.native="editDepartmentFormVisible=true"></el-button>
                        </el-input>
                    </section>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="editForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <Department :visible.sync="editDepartmentFormVisible" :sels_ids="[editForm.departmentId]"
                    @submit="handleDepartmentSubmit"></Department>

    </section>
</template>

<script>
    /*
    format string : formatSex formatDouble formatDate formatTime formatDateTime
    handle : ui event
    remote request [ajax] : getXXX
     */

    import Util from './../../../../../3rd/cvue-3/js/util'
    import Department from './department-table.vue'
    import {getSqlQuery} from './../../../../../3rd/cvue-3/api/api';

    export default {
        components: {
            Department,
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

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    sex: -1,
                    height: 0,
                    birth: '',
                    addr: '',
                    remark: '',
                    departmentId: -1,
                    department_name: '',
                },
                editDepartmentFormVisible: false,

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    id: -1,
                    name: '',
                    sex: -1,
                    height: 0,
                    birth: '',
                    addr: '',
                    remark: ''
                }

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
                    sql: "SELECT users.`id`, users.`name`, users.`sex`, users.`height`, users.`birth`, users.`addr`, users.`remark`, users.`departmentId`, users.`roleGroupId`"
                        + " , department.`name` as department_name, role_group.`name` as role_group_name FROM users"
                        + " LEFT JOIN department ON users.`departmentId` = department.`id`"
                        + " LEFT JOIN role_group ON users.`roleGroupId` = role_group.`id`"
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

            handleCurrentChange(val) {
                this.page = val;
                this.getObjs();
            },

            // table select change
            handleSelsChange: function(sels) {
                this.sels = sels;
            },

            // handle add operate
            handleAdd: function() {
                let para1 = {
                    session: Date.now(),
                    sql: "SELECT MAX(users.id) as `maxer` FROM users;"
                };
                getSqlQuery(para1).then((res) => {
                    if (Array.isArray(res.data) && res.data.length > 0) {
                        this.addFormVisible = true;
                        this.addForm = {
                            id: res.data[0]["maxer"] + 1,
                            name: '',
                            sex: -1,
                            age: 0,
                            birth: '',
                            addr: '',
                            remark: ''
                        };
                    }
                });

            },

            // handle edit operate
            handleEdit: function() {
                if (this.sels.length < 1) return;
                let obj = this.sels[0];
                debugger;
                this.editFormVisible = true;
                this.editForm = Object.assign({}, obj);
            },

            handleDepartmentSubmit: function(departments) {
                if (Array.isArray(departments)) {
                    this.editForm.departmentId = departments[0].id;
                    this.editForm.department_name = departments[0].name;
                }
            },

            // handle delete operate
            handleDel: function(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {
                        session: Date.now(),
                        sql: "DELETE FROM users WHERE users.`id`=" + row.id
                    };
                    getSqlQuery(para).then((res) => {
                        this.listLoading = false;
                        if (res.state && res.state.err) {
                            this.$message({
                                message: '删除失败，请重试！' + res.state.err,
                                type: 'error'
                            });
                        }
                        else {
                            this.$message({
                                message: '运行成功，删除' + res.state.affectedRows + '条',
                                type: 'success'
                            });
                        }
                        this.getObjs();
                    });
                }).catch(() => {

                });
            },

            // delete batch
            handleBatchRemove: function() {
                if (this.sels.length < 1) return;
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let idWheres = this.sels.map(ele => 'users.`id`=' + ele.id);
                    let para = {
                        session: Date.now(),
                        sql: "DELETE FROM users WHERE " + idWheres.join(' or ')
                    };
                    getSqlQuery(para).then((res) => {
                        this.listLoading = false;
                        if (res.state && res.state.err) {
                            this.$message({
                                message: '删除失败，请重试！' + res.state.err,
                                type: 'error'
                            });
                        }
                        else {
                            this.$message({
                                message: '运行成功，删除' + res.state.affectedRows + '条',
                                type: 'success'
                            });
                        }
                        this.getObjs();
                    });
                }).catch(() => {

                });
            },

            // submit add
            addSubmit: function() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let obj = Object.assign({}, this.addForm);
                            obj.birth = obj.birth.valueOf();
                            let para1 = {
                                session: Date.now(),
                                sql: "INSERT INTO `users`(`id`, `name`, `sex`, `height`, `birth`, `addr`, `remark`) VALUES ({0}, '{0}', {0}, {0}, {0}, '{0}', '{0}');"
                            };
                            para1.sql = Util.formatString.format(para1.sql, obj.id, obj.name, obj.sex, obj.height, obj.birth, obj.addr, obj.remark);
                            getSqlQuery(para1).then((res) => {
                                this.addLoading = false;
                                if (res.state && res.state.affectedRows) {
                                    this.$message({
                                        message: '成功新增' + res.state.affectedRows + '条数据',
                                        type: 'success'
                                    });
                                }
                                else {
                                    let err = res.state && res.state.err ? res.state.err : '';
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

            // submit edit
            editSubmit: function() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            //
                            this.editLoading = true;
                            let obj = Object.assign({}, this.editForm);
                            obj.birth = obj.birth.valueOf();
                            let para1 = {
                                session: Date.now(),
                                sql: "UPDATE `users` SET `name` = '{0}', `sex` = {0}, `height` = {0}, `birth` = {0}, `addr` = '{0}', `remark` = '{0}' , `departmentId` = '{0}' WHERE `id` = {0};"
                            };
                            para1.sql = Util.formatString.format(para1.sql, obj.name, obj.sex, obj.height, obj.birth, obj.addr, obj.remark, obj.departmentId, obj.id);
                            getSqlQuery(para1).then((res) => {
                                this.editLoading = false;
                                if (res.state && res.state.affectedRows) {
                                    this.$message({
                                        message: '成功编辑' + res.state.affectedRows + '条数据',
                                        type: 'success'
                                    });
                                }
                                else {
                                    let err = res.state && res.state.err ? res.state.err : '';
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
        },

        beforeRouteEnter(to, from, next) {
            debugger;
            next();
        },

        beforeRouteLeave(to, from, next) {
            debugger;
            next();
        },

        beforeRouteUpdate(to, from, next) {
            debugger;
            next();
        },

    }

</script>

<style scoped>

</style>
