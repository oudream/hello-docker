<template>
	<section>
		<!-- operate toolbar on top -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
				<el-form-item label="属性">
					<el-select v-model="filter.attr" placeholder="属性">
						<el-option
								v-for="item in filter.options"
								:key="item.value"
								:label="item.label"
								:value="item.value"
								:disabled="item.disabled">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="值">
					<el-input v-model="filter.value" placeholder="值"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRecs">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAllObjs">全部</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  @click="handleEdit" :disabled="this.sels.length===0" >编辑</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="danger"  @click="handleDel" :disabled="this.sels.length===0" >删除</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAddBatch">批量增加</el-button>
				</el-form-item>

			</el-form>
		</el-col>

		<!-- table -->
		<el-table :data="objs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="120" show-overflow-tooltip sortable>
			</el-table-column>
			<el-table-column prop="uri" label="编号" width="120" sortable>
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="120" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="age" label="年龄" width="120" sortable>
			</el-table-column>
			<el-table-column prop="tel" label="电话" width="120" sortable>
			</el-table-column>
			<el-table-column prop="grade" label="级别" width="120" :formatter="formatGrade" sortable>
			</el-table-column>
			<el-table-column prop="status" label="状态" width="120" :formatter="formatStatus" sortable>
			</el-table-column>
			<el-table-column prop="remark" label="描述" width="240" >
			</el-table-column>
		</el-table>

		<!-- operate toolbar on bottom -->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!-- edit -->
		<el-dialog title="读者档案编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" v-dialog-drag top="1vh">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="编号">
					<el-input v-model="editForm.uri"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="2">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input v-model="editForm.age"></el-input>
				</el-form-item>
				<el-form-item label="电话">
					<el-input v-model="editForm.tel"></el-input>
				</el-form-item>
				<el-form-item label="级别">
					<el-radio-group v-model="editForm.grade">
						<el-radio class="radio" :label="1">一级</el-radio>
						<el-radio class="radio" :label="2">二级</el-radio>
						<el-radio class="radio" :label="3">三级</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="editForm.status" >
						<el-radio class="radio" :label="0">服役</el-radio>
						<el-radio class="radio" :label="1">退役</el-radio>
						<el-radio class="radio" :label="2">其他</el-radio>
					</el-radio-group>
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

		<!-- add -->
		<el-dialog title="读者档案新增" :visible.sync="addFormVisible" :close-on-click-modal="false" v-dialog-drag top="1vh">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="编号">
					<el-input v-model="addForm.uri"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="2">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input v-model="addForm.age"></el-input>
				</el-form-item>
				<el-form-item label="电话">
					<el-input v-model="addForm.tel"></el-input>
				</el-form-item>
				<el-form-item label="级别">
					<el-radio-group v-model="addForm.grade">
						<el-radio class="radio" :label="1">一级</el-radio>
						<el-radio class="radio" :label="2">二级</el-radio>
						<el-radio class="radio" :label="3">三级</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="addForm.status" >
						<el-radio class="radio" :label="0">服役</el-radio>
						<el-radio class="radio" :label="1">退役</el-radio>
						<el-radio class="radio" :label="2">其他</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="描述">
					<el-input type="textarea" v-model="addForm.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
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

	import util from './../../../../3rd/cvue-3/js/util'
	//import NProgress from 'nprogress'
	import { getSqlQuery } from './../../../../3rd/cvue-3/api/api';
	import { getSqlQueries } from './../../../../3rd/cvue-3/api/api';
    import { getSqlTrans } from './../../../../3rd/cvue-3/api/api';
    import dbCommon from './../../../../3rd/cvue-3/js/dbCommon'
    import Mock from 'mockjs';
	export default {
	    props:{

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
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
                    uuid:'',
					name: '',
					uri: '',
					grade:1,
                    sex:1,
                    age:18,
                    tel:'',
                    status:0,
                    remark: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					id: -1,
                    uuid:'',
                    name: '',
                    uri: '',
                    grade:1,
                    sex:1,
					age:18,
					tel:'',
                    status:0,
                    remark: ''
				},
                //数据库配置
                cfg_ti_obj:{
                    id:{name:'id',type:'number'},
                    uuid:{name:'f_id'},
                    name:{name:'f_name',desc:'姓名'},
                    uri:{name:'f_uri',desc:'编号'},
                    grade:{name:'f_grade',desc:'级别',type:'number'},
                    sex:{name:'f_sex',desc:'性别',type:'number',def:0},
                    age:{name:'f_age',desc:'年龄',type:'number',def:18},
                    tel:{name:'f_tel',desc:'电话'},
                    status:{name:'f_st_flag',desc:'状态',type:'number',def:0},
                    remark:{name:'f_desc',desc:'描述'},
                    res0:{name:'f_res0',desc:'保留0',type:'number',def:0},
                    res1:{name:'f_res1',desc:'保留1'},
                    user_crt:{name:'f_user_crt',def:'sys'},
                    t_crt:{name:'f_t_crt',type:'now_ms'},
                    user_mod:{name:'f_user_mod',def:'sys'},
                    t_mod:{name:'f_t_mod',type:'now_ms'},
                    syn_flag:{name:'f_syn_flag',type:'number',def:0},
                    dt_flag:{name:'f_dt_flag',type:'number',def:0},
//                    st_flag:{name:'f_st_flag',type:'number',def:0},
                },
                cfg_ti_log:{
                    uuid:{name:'f_id'},
                    pid:{name:'f_pid',desc:'父ID'},
                    uri:{name:'f_uri'},
                    class:{name:'f_class',def:'USER'},
                    code:{name:'f_code',type:'number',def:0},
                    user:{name:'f_user',def:'sys'},
                    act:{name:'f_act',type:'number',def:0},
                    t:{name:'f_t',type:'number',def:0},
                    src:{name:'f_src'},
                    dst:{name:'f_dest'},
                    obj:{name:'f_obj'},
                    type:{name:'f_type',type:'number',def:0},
                    len:{name:'f_len',type:'number',def:0},
                    v:{name:'f_v'},
                    res0:{name:'f_res0',type:'number',def:0},
                    res1:{name:'f_res1'},
                    user_crt:{name:'f_user_crt',def:'sys'},
                    t_crt:{name:'f_t_crt',type:'now_ms'},
                    user_mod:{name:'f_user_mod',def:'sys'},
                    t_mod:{name:'f_t_mod',type:'now_ms'},
                    syn_flag:{name:'f_syn_flag',type:'number',def:0},
                    dt_flag:{name:'f_dt_flag',type:'number',def:0},
                    st_flag:{name:'f_st_flag',type:'number',def:0},
                },
                cfg_const:{
                    obj:'ti_obj_reader',
                    log:'ti_log_reader',
                    class:'READER',
                    user:'SYS',
                    sql_sel:'SELECT id as `id`,f_id as `uuid`, f_name as `name`,f_uri as `uri`,f_grade as `grade`,f_sex as `sex`,f_age as `age`,f_tel as `tel`,f_desc as `remark`, f_st_flag as `status` FROM ti_obj_reader ',
                    sql_max_id:'SELECT MAX(id) as max_id FROM ti_obj_reader',
                    sql_del:'update ti_obj_reader set f_dt_flag = -1 WHERE id = ',
                    sql_rec_cnt:'SELECT COUNT(id) as count_rec FROM ti_obj_reader ',
                    sql_where_0:' WHERE {0}  LIKE \'%{0}%\' and f_dt_flag=0 ',
                    sql_where_1:" WHERE f_dt_flag=0 ",
					sql_order:' order by f_name ',
                },
            }
		},
		methods: {
	        //grade
			formatGrade: function (row, column) {
			    if (row[column.property] ==1) return '一级';
			    else if(row[column.property] ==2) return '二级';
                else if(row[column.property] ==3) return '三级';
                else return '未知';
			},
			//sex
            formatSex: function (row, column) {
                return row[column.property] == 1 ? '男' : row[column.property] == 2 ? '女' : '未知';
            },
            formatStatus: function (row, column) {
                if (row[column.property] ==0) return '服役';
                else if(row[column.property] ==1) return '退役';
                else return '未知';
            },
			// double
			formatDouble: function (row, column) {
				return row[column.property].toFixed(2);
			},
			// date
			formatDate: function (row, column) {
				let dt = row[column.property];
				return String(dt.getFullYear()) + '-' + dt.getMonth() + '-' + dt.getDay();
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getRecs();
			},

            getAllObjs() {
                this.filter.attr = '';
                this.filter.value = '';
                this.page = 1;
                this.getRecs();
            },
			// query data
			getRecs() {
			    debugger;
				this.listLoading = true;
				let queryCount = 2;
				let queryIndex = 0;
				let recvQuery= () => {
					queryIndex++;
					if (queryIndex === queryCount) {
						this.listLoading = false;
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
					sql: this.cfg_const.sql_sel + getSqlWhere()+ this.cfg_const.sql_order +" LIMIT " + ((this.page - 1) * this.pageSize) + "," + this.pageSize
				};
				getSqlQuery(para2).then((res) => {
					let objs = res.data;
					for (let i = 0; i < objs.length; i++) {
						let obj = objs[i];
//						obj.version = new Date(obj.version);
					}
					debugger;
					this.objs = objs;
					recvQuery();
				});
			},

			// handle delete operate
			handleDel: function () {
                if (this.sels.length < 1) return;
                let obj = this.sels[0];
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
                    let para = {
                        session: Date.now(),
                        sqls:[]
                    };
                    let sql_0 = this.cfg_const.sql_del + obj.id;
                    para.sqls.push(sql_0);
                    debugger
                    let v_log = {
                        uuid:util.uuid.create(0),
                        pid:obj.uuid,
                        uri:'del',
                        class:this.cfg_const.class,
                        code:2,
                        user:localStorage.getItem('user-login'),
                        act:0,
                        t:Date.now(),
                        v:'删除',
                    };
                    let r = dbCommon.sql.getInsert(this.cfg_const.log,this.cfg_ti_log,v_log);
                    para.sqls.push(r.sql);

                    debugger
                    getSqlTrans(para).then((res) => {
                        debugger;
                        this.listLoading = false;
                        if (res.state.err) {
                            this.$message({
                                message: '删除失败：' + res.state.err,
                                type: 'error'
                            });
                        } else {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }
                        this.getRecs();
                    });
				}).catch(() => {

				});
			},

			// handle edit operate
			handleEdit: function () {
                if (this.sels.length < 1) return;
                let obj = this.sels[0];

				this.editFormVisible = true;
				this.editFormOld = Object.assign({}, obj);
				this.editForm = Object.assign({}, obj);
			},

			// handle add operate
			handleAdd: function () {
				let para1 = {
					session: Date.now(),
					sql: this.cfg_const.sql_max_id,
				};
				getSqlQuery(para1).then((res) => {
					if (Array.isArray(res.data) && res.data.length > 0) {
						this.addFormVisible = true;
						this.addForm = {
							id: res.data[0]["max_id"] + 1,
							uuid:'',
                            name: '',
                            uri: '',
                            grade:1,
                            sex:1,
                            age:18,
                            tel:'',
							status:0,
                            remark: ''
						};
					}
				});

			},

			// submit edit
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let obj = Object.assign({}, this.editForm);
                            let para = {
                                session: Date.now(),
                                sqls:[]
                            };
                            let conds = 'id = '+obj.id;
                            let r = dbCommon.sql.getUpdate(this.cfg_const.obj,this.cfg_ti_obj,this.editForm,this.editFormOld,conds);
                            if(r.err == false)
                            {
                                para.sqls.push(r.sql);
                                //写日志
                                let v_log = {
                                    uuid:util.uuid.create(0),
                                    pid:this.editForm.uuid,
                                    uri:'upd',
                                    class:this.cfg_const.class,
                                    code:1,
                                    user:localStorage.getItem('user-login'),
                                    act:0,
                                    t:Date.now(),
                                    v:r.desc,
                                };
                                r = dbCommon.sql.getInsert(this.cfg_const.log,this.cfg_ti_log,v_log);
                                para.sqls.push(r.sql);
                            }
                            if(para.sqls.length>0)
                            {  //事物处理
                                getSqlTrans(para).then((res) => {
                                    debugger;
                                    this.editLoading = false;
                                    if (res.state.err) {
                                        this.$message({
                                            message: '编辑失败：' + res.state.err,
                                            type: 'error'
                                        });
                                    } else {
                                        this.$message({
                                            message: '编辑成功',
                                            type: 'success'
                                        });
                                    }
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getRecs();
                                });
                            }else{
                                this.editLoading = false;
                                this.$message({
                                    message: '数据无变化',
                                    type: 'error'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                            }
						});
					}
				});
			},

			// submit add
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let obj = Object.assign({}, this.addForm);
                            let para = {
                                session: Date.now(),
                                sqls:[],
                            };

                            this.addForm.uuid = util.uuid.create(0);
                            let r = dbCommon.sql.getInsert(this.cfg_const.obj,this.cfg_ti_obj,this.addForm);
                            para.sqls.push(r.sql);

                            let v_log = {
                                uuid:util.uuid.create(0),
                                pid:this.addForm.uuid,
                                uri:'add',
                                class:this.cfg_const.class,
                                code:0,
                                user:localStorage.getItem('user-login'),
                                act:0,
                                t:Date.now(),
                                v:r.desc,
                            };
                            r = dbCommon.sql.getInsert(this.cfg_const.log,this.cfg_ti_log,v_log);
                            para.sqls.push(r.sql);

                            debugger;

                            getSqlTrans(para).then((res) => {
                                debugger;
                                this.addLoading = false;
                                if (res.state.err) {
                                    this.$message({
                                        message: '新增失败：' + res.state.err,
                                        type: 'error'
                                    });
                                } else {
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                }
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getRecs();
                            });
						});
					}
				});
			},

			// table select change
			selsChange: function (sels) {
				this.sels = sels;
			},

			// delete batch
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
                    this.listLoading = true;
                    let para = {
                        session: Date.now(),
                        sqls:[]
                    };
                    this.sels.map(ele=>{
                        //删除标志
                        let sql="";
                        sql = this.cfg_const.sql_del + ele.id;
                        para.sqls.push(sql);
                        //写日志
                        let v_log = {
                            uuid:util.uuid.create(0),
                            pid:ele.uuid,
                            uri:'del',
                            class:this.cfg_const.class,
                            code:3,
                            user:localStorage.getItem('user-login'),
                            act:0,
                            t:Date.now(),
                            v:'批量删除',
                        };
                        let r  = dbCommon.sql.getInsert(this.cfg_const.log,this.cfg_ti_log,v_log);
                        para.sqls.push(r.sql);
                    })
                    //事务处理
                    getSqlTrans(para).then((res) => {
                        debugger;
                        this.listLoading = false;
                        if (res.state.err) {
                            this.$message({
                                message: '批量删除失败：' + res.state.err,
                                type: 'error'
                            });
                        } else {
                            this.$message({
                                message: '批量删除成功',
                                type: 'success'
                            });
                        }
                        this.getRecs();
                    });
				}).catch(() => {

				});
			},
            //批量增加
            handleAddBatch: function (){
                this.$confirm('确认批量新增吗？', '提示', {}).then(() => {

                    let para = {
                        session: Date.now(),
                        sqls:[],
                    };

                    let sql = 'delete from '+this.cfg_const.obj +';';
                    para.sqls.push(sql);

                    for(let i=1;i<=10;i++){
                              let e = {
                                  uuid:util.uuid.create(0),
								  name:Mock.Random.cname(),
								  uri: 'user_'+i.toString(),
								  grade:1,
								  sex:Mock.Random.integer(1, 2),
								  age:Mock.Random.integer(18, 60),
								  tel:'',
								  status:0,
								  remark: ''
                                };
                                let r = dbCommon.sql.getInsert(this.cfg_const.obj,this.cfg_ti_obj,e);
                                para.sqls.push(r.sql);
                                debugger
                    }
                    debugger
                    getSqlTrans(para).then((res) => {
                        debugger;
                        this.addLoading = false;
                        if (res.state.err) {
                            this.$message({
                                message: '批量新增失败：' + res.state.err,
                                type: 'error'
                            });
                        } else {
                            this.$message({
                                message: '批量新增成功',
                                type: 'success'
                            });
                        }
                        this.getRecs();
                    });
                });
            },
		},

		mounted() {
            this.filter.options = [
                {
                    value: 'f_name',
                    label: '姓名',
                },
                {
                    value: 'f_uri',
                    label: '编号',
                },
                {
                    value: 'f_st_flag',
                    label: '服役',
                },
            ];
			this.getRecs();
		}
	}

</script>

<style scoped>

</style>
