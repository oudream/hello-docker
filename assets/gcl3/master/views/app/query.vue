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
					<el-button type="primary"  @click="handleDetail" :disabled="this.sels.length===0" >详细</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  @click="handleSearch" :disabled="this.sels.length===0" >定位</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- table -->
		<el-table ref="mainTable" :data="objs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="图名" width="120" show-overflow-tooltip sortable>
			</el-table-column>
			<el-table-column prop="uri" label="编号" width="180" sortable>
			</el-table-column>
			<el-table-column prop="scale" label="比例尺" width="100" sortable>
			</el-table-column>
			<el-table-column prop="grade" label="密级" width="100" :formatter="formatGrade" sortable>
			</el-table-column>
			<el-table-column prop="pos" label="位置" width="100" sortable>
			</el-table-column>
			<el-table-column prop="count" label="总数" width="80" sortable>
			</el-table-column>
			<el-table-column prop="cntStd" label="库存" width="80" sortable>
			</el-table-column>
			<el-table-column prop="cntLend" label="借出" width="80" sortable>
			</el-table-column>
			<el-table-column prop="cntGood" label="完好" width="80" sortable>
			</el-table-column>
			<el-table-column prop="cntBad" label="破损" width="80" sortable>
			</el-table-column>
			<!--<el-table-column prop="cntLost" label="丢失" width="80" sortable>-->
			<!--</el-table-column>-->
			<el-table-column prop="status" label="状态" width="80" :formatter="formatStatus" sortable>
			</el-table-column>
		</el-table>

		<!-- operate toolbar on bottom -->
		<el-col :span="24" class="toolbar">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!-- detail -->
		<el-dialog title="地图档案详情"  :modalAppendToBody = "false" :visible.sync="detailFormVisible" :close-on-click-modal="false" v-dialog-drag top="1vh">
			<el-form :model="detailForm" label-width="80px" :rules="detailFormRules" ref="detailForm">
				<el-form-item label="图名" prop="name">
					<el-input v-model="detailForm.name" :disabled = "true"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="编号">
					<el-input v-model="detailForm.uri" :disabled = "true" ></el-input>
				</el-form-item>
				<el-form-item label="密级">
					<el-radio-group v-model="detailForm.grade" :disabled = "true" >
						<el-radio class="radio" :label="1">秘密</el-radio>
						<el-radio class="radio" :label="2">机密</el-radio>
						<el-radio class="radio" :label="3">绝密</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="比例尺">
					<el-input v-model="detailForm.scale" :disabled = "true" ></el-input>
				</el-form-item>
				<el-form-item label="版号">
					<el-input v-model="detailForm.version" :disabled = "true" ></el-input>
				</el-form-item>
				<el-form-item label="位置">
					<el-input v-model="detailForm.pos" :disabled = "true" ></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="detailForm.status " :disabled = "true" >
						<el-radio class="radio" :label="0">在库</el-radio>
						<el-radio class="radio" :label="1">借出</el-radio>
						<el-radio class="radio" :label="10">借出中</el-radio>
						<el-radio class="radio" :label="11">归还中</el-radio>
						<el-radio class="radio" :label="2">其他</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="总数">
					<el-input v-model="detailForm.count" :disabled="true"  ></el-input>
				</el-form-item>
				<el-form-item label="数量">
					<el-col :span="3" align="center">借出</el-col>
					<el-col :span="3" >
						<el-input v-model="detailForm.cntLend" :disabled = "true" ></el-input>
					</el-col>

					<el-col :span="3" align="center">完好</el-col>
					<el-col :span="3" >
						<el-input v-model="detailForm.cntGood" :disabled = "true" ></el-input>
					</el-col>

					<el-col :span="3" align="center">破损</el-col>
					<el-col :span="3">
						<el-input v-model="detailForm.cntBad" :disabled = "true" ></el-input>
					</el-col>

					<el-col :span="3" align="center">丢失</el-col>
					<el-col :span="3">
						<el-input v-model="detailForm.cntLost" :disabled = "true" ></el-input>
					</el-col>
				</el-form-item>
				<!--<el-form-item label="借阅人">-->
					<!--<el-input v-model="detailForm.userName" :disabled = "true"></el-input>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="借阅时间">-->
					<!--<el-input v-model="detailForm.userDT" :disabled = "true"></el-input>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="备注">-->
					<!--<el-input type="textarea" v-model="detailForm.remark" :disabled = "true" ></el-input>-->
				<!--</el-form-item>-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="detailFormVisible = false">关闭</el-button>
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
    import userSel from '../sys/user-sel.vue';
    import dbCommon from './../../../../3rd/cvue-3/js/dbCommon';

    import { getSqlQuery } from './../../../../3rd/cvue-3/api/api';
    import { getSqlQueries } from './../../../../3rd/cvue-3/api/api';
    import { getSqlTrans } from './../../../../3rd/cvue-3/api/api';

    export default {
        components: {
            userSel,
        },

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


                //动作界面是否显示
                actFormVisible: false,
                actLoading: false,
                actFormRules: {
                },
                //动作界面
                actForm: {
                    id: 0,
                    name: '',
                    uri: '',
                    grade:1,
                    scale:'1:1000',
                    version:'',
                    press:'',
                    pos: '',
                    remark: '',
                    status:0,
//                    userId:'',
//                    userName:'',
//                    userDT:'',
                    count:0,
                    cntGood:0,
                    cntBad:0,
                    cntLost:0,
                    cntLend:0,
                },
                actUserSelVisible: false,

                //详情界面
                detailFormVisible: false,
                detailLoading: false,
                detailFormRules: {
                },
                //详情界面数据
                detailForm: {
                    id: 0,
                    name: '',
                    uri: '',
                    grade:1,
                    scale:'1:1000',
                    version:'',
                    press:'',
                    pos: '',
                    remark: '',
                    status:0,
//                    userId:'',
//                    userName:'',
//                    userDT:'',
                    count:0,
                    cntGood:0,
                    cntBad:0,
                    cntLost:0,
                    cntLend:0,
                },
                //数据库配置
                cfg_ti_obj:{
                    id:{name:'id',type:'number'},
                    uuid:{name:'f_id'},
                    name:{name:'f_name',desc:'图名'},
                    uri:{name:'f_uri',desc:'编号'},
                    grade:{name:'f_grade',desc:'密级',type:'number'},
                    scale:{name:'f_scale',desc:'比例尺'},
                    version:{name:'f_ver',desc:'版号'},
                    remark:{name:'f_desc',desc:'备注'},
                    count:{name:'f_count',desc:'数量'},
                    res0:{name:'f_res0',desc:'保留0',type:'number',def:0},
                    res1:{name:'f_res1',desc:'保留1'},
                    user_crt:{name:'f_user_crt',def:'sys'},
                    t_crt:{name:'f_t_crt',type:'now_ms'},
                    user_mod:{name:'f_user_mod',def:'sys'},
                    t_mod:{name:'f_t_mod',type:'now_ms'},
                    syn_flag:{name:'f_syn_flag',type:'number',def:0},
                    dt_flag:{name:'f_dt_flag',type:'number',def:0},
                    st_flag:{name:'f_st_flag',type:'number',def:0},
                },
                cfg_ti_st:{
                    uuid:{name:'f_id'},
                    status:{name:'f_status',desc:'状态',type:'number',def:0},
                    stLend:{name:'f_st_lend',desc:'借出状态',type:'number',def:0},
                    stRevt:{name:'f_st_revt',desc:'归还状态',type:'number',def:0},
                    cntStd:{name:'f_cnt_std',desc:'数量',type:'number',def:0},
                    cntGood:{name:'f_cnt_good',desc:'完好数量',type:'number',def:0},
                    cntBad:{name:'f_cnt_bad',desc:'损坏数量',type:'number',def:0},
                    cntLost:{name:'f_cnt_lost',desc:'丢失数量',type:'number',def:0},
                    cntLend:{name:'f_cnt_lend',desc:'借出数量',type:'number',def:0},
                    res0:{name:'f_res0',desc:'保留0',type:'number',def:0},
                    res1:{name:'f_res1',desc:'保留1'},
                    user_crt:{name:'f_user_crt',def:'sys'},
                    t_crt:{name:'f_t_crt',type:'now_ms'},
                    user_mod:{name:'f_user_mod',def:'sys'},
                    t_mod:{name:'f_t_mod',type:'now_ms'},
                    syn_flag:{name:'f_syn_flag',type:'number',def:0},
                    dt_flag:{name:'f_dt_flag',type:'number',def:0},
                    st_flag:{name:'f_st_flag',type:'number',def:0},
                },
                cfg_ti_his:{
                    uuid:{name:'f_id'},
                    pid:{name:'f_pid',desc:'父ID'},
                    code:{name:'f_code',desc:'动作',type:'number',def:0},
                    cntStd:{name:'f_cnt_std',desc:'数量',type:'number',def:0},
                    cntGood:{name:'f_cnt_good',desc:'完好数量',type:'number',def:0},
                    cntBad:{name:'f_cnt_bad',desc:'损坏数量',type:'number',def:0},
                    cntLost:{name:'f_cnt_lost',desc:'丢失数量',type:'number',def:0},
                    monName:{name:'',desc:'监管用户'},
                    monId:{name:'f_id_mon',desc:'监管用户id'},
                    monDT:{name:'f_t_mon',desc:'监管时间',type:'now_ms'},
                    readerName:{name:'',desc:'借阅用户'},
                    readerId:{name:'f_id_reader',desc:'借阅用户id'},
                    readerDT:{name:'f_t_reader',desc:'借阅时间',type:'now_ms'},
                    remark:{name:'f_desc',desc:'借阅时间',type:'now_ms'},
                    res0:{name:'f_res0',desc:'备注'},
                    res1:{name:'f_res1',desc:'保留1'},
                    user_crt:{name:'f_user_crt',def:'sys'},
                    t_crt:{name:'f_t_crt',type:'now_ms'},
                    user_mod:{name:'f_user_mod',def:'sys'},
                    t_mod:{name:'f_t_mod',type:'now_ms'},
                    syn_flag:{name:'f_syn_flag',type:'number',def:0},
                    dt_flag:{name:'f_dt_flag',type:'number',def:0},
                    st_flag:{name:'f_st_flag',type:'number',def:0},
                },
                cfg_ti_log:{
                    uuid:{name:'f_id'},
                    pid:{name:'f_pid',desc:'父ID'},
                    uri:{name:'f_uri'},
                    class:{name:'f_class',def:'DA'},
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
                    syn_flag:{name:'f_syn_flag',type:'number',def:1},
                    dt_flag:{name:'f_dt_flag',type:'number',def:0},
                    st_flag:{name:'f_st_flag',type:'number',def:0},
                },
                cfg_const:{
                    obj:'ti_obj_da',
                    st:'ti_rt_da',
                    log:'ti_log_da',
                    class:'DA',
                    user:'SYS',
                    sql_sel:'SELECT a.id as `id`,a.f_id as `uuid`, a.f_name as `name`,a.f_uri as `uri`,a.f_grade as `grade`,a.f_ver as `version`,a.f_desc as `remark`, a.f_scale as `scale`,a.f_count as `count`, ' +
                    'b.f_status as `status`,b.f_cnt_std as `cntStd`,b.f_cnt_lost as `cntLost`,b.f_cnt_good as `cntGood`,b.f_cnt_bad as `cntBad`,b.f_cnt_lend as `cntLend`,' +
                    ' c.f_name as `pos`,c.f_id as `posId`  ' +
                    'FROM ti_obj_da a left join ti_rt_da b on a.f_id=b.f_id '+
                    'left join ti_obj_cab c on a.f_id_pos=c.f_id ',
                    sql_max_id:'SELECT MAX(a.id) as max_id FROM ti_obj_da a',
                    sql_del:'update ti_obj_da a set a.f_dt_flag = -1 WHERE id = ',
                    sql_rec_cnt:'SELECT COUNT(a.id) as count_rec FROM ti_obj_da a ',
                    sql_where_0:' WHERE a.{0}  LIKE \'%{0}%\' and a.f_dt_flag=0 ',
                    sql_where_1:' WHERE a.f_dt_flag=0 ',
                    sql_order:" order by c.f_name ",
                },
            }
        },
        methods: {
            //grade
            formatGrade: function (row, column) {
                if (row[column.property] ==1) return '秘密';
                else if(row[column.property] ==2) return '机密';
                else if(row[column.property] ==3) return '绝密';
                else return '未知';
            },
            formatStatus: function (row, column) {
                if (row[column.property] ==0) return '在库';
                else if(row[column.property] ==1) return '借出';
                else if (row[column.property] ==10) return '借出中';
                else if (row[column.property] ==11) return '归还中';
                else return '未知';
            },
            //sex
            formatSex: function (row, column) {
                return row[column.property] == 1 ? '男' : row[column.property] == 0 ? '女' : '未知';
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
                        r =  util.formatString.format(this.cfg_const.sql_where_0,this.filter.attr,this.filter.value);
                    }
                    else{
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
                    sql: this.cfg_const.sql_sel + getSqlWhere()  + this.cfg_const.sql_order + " LIMIT " + ((this.page - 1) * this.pageSize) + "," + this.pageSize
                };
                getSqlQuery(para2).then((res) => {
                    let objs = res.data;
//					for (let i = 0; i < objs.length; i++) {
//						let obj = objs[i];
//					}
                    debugger;
                    this.objs = objs;
                    recvQuery();
                });
            },
            // handle act operate
            handleAction: function () {
                if (this.sels.length < 1) return;
                let obj = this.sels[0];
                debugger;
                this.actFormVisible = true;
                this.actFormOld = Object.assign({}, obj);
                this.actForm = Object.assign({}, obj);
            },
            // handle Detail operate
            handleDetail: function () {
                if (this.sels.length < 1) return;
                let obj = this.sels[0];
                debugger;
                this.detailFormVisible = true;
                this.detailForm = Object.assign({}, obj);
            },
            handleSearch: function () {
                if (this.sels.length < 1) return;
                let obj = this.sels[0];
                debugger;
                this.$confirm('确认定位吗？', '提示', {}).then(() => {
                    //
                    let para = {
                        session: Date.now(),
                        sqls: []
                    };

                    let r2 = {
                        sql : '',
                        err : false,
                        desc:'',
                    };
                    let sv = util.formatString.format(' set f_status = {0},f_syn_flag = {1} ',100,1);
                    let cond = util.formatString.format(' where f_id = \'{0}\'', obj.uuid );
                    r2.sql = 'update '+ this.cfg_const.st + sv + cond;

                    let desc = "";
                    let ok = false;
                    debugger
                    if (r2.err == false) {
                        para.sqls.push(r2.sql);
                        desc += r2.desc;
                        ok = true;
                    }
                    if (ok == true) {
                        //写日志
                        let v_log = {
                            uuid: util.uuid.create(0),
                            pid: obj.uuid,
                            uri: 'upd',
                            class: this.cfg_const.class,
                            code: 100,
                            user: localStorage.getItem('user-login'),
                            act: 0,
                            t: Date.now(),
                            v: desc,
                        };
                        let r = dbCommon.sql.getInsert(this.cfg_const.log, this.cfg_ti_log, v_log);
                        para.sqls.push(r.sql);
                    }
                    debugger
                    if (para.sqls.length > 0) {  //事物处理
                        getSqlTrans(para).then((res) => {
                            debugger;
                            if (res.state.err) {
                                this.$message({
                                    message: '定位失败：' + res.state.err,
                                    type: 'error'
                                });
                            } else {
                                this.$message({
                                    message: '定位成功,请检查指示灯状态',
                                    type: 'success'
                                });
                            }
                        });
                    }
                });
            },
            // table select change
            selsChange: function (sels) {
                this.sels = sels;
                if (sels.length > 1) {
                    this.$refs.mainTable.clearSelection();
                    this.$refs.mainTable.toggleRowSelection(sels.pop());
                }
            },
        },

        mounted() {
            this.filter.options = [
                {
                    value: 'f_name',
                    label: '图名',
                },
                {
                    value: 'f_uri',
                    label: '编号',
                },
                {
                    value: 'f_id_pos',
                    label: '位置',
                },
            ];
            this.getRecs();
        }
    }

</script>

<style scoped>

</style>
