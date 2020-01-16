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
				<el-form-item label="开始">
					<el-date-picker type="date" placeholder="选择日期" v-model="dt_start" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<el-form-item label="结束">
					<el-date-picker type="date" placeholder="选择日期" v-model="dt_end" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRecs">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAllObjs">全部</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!-- table -->
		<el-table :data="objs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<!--<el-table-column type="selection" width="55">-->
			<!--</el-table-column>-->
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="op_t" label="时间" width="180" show-overflow-tooltip sortable>
			</el-table-column>
			<el-table-column prop="op_user" label="用户" width="120" sortable>
			</el-table-column>
			<el-table-column prop="code" label="动作" width="120" :formatter="formatCode" sortable>
			</el-table-column>
			<!--<el-table-column prop="name_3rd" label="名称" width="120" sortable>-->
			<!--</el-table-column>-->
			<el-table-column prop="v" label="描述" fix-width="240" >
			</el-table-column>
		</el-table>

		<!-- operate toolbar on bottom -->
		<el-col :span="24" class="toolbar">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
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

	import util from './../../../../3rd/cvue-3/js/util'
	//import NProgress from 'nprogress'
	import { getSqlQuery } from './../../../../3rd/cvue-3/api/api';
	import { getSqlQueries } from './../../../../3rd/cvue-3/api/api';
	import { getSqlTrans } from './../../../../3rd/cvue-3/api/api';
	import dbCommon from './../../../../3rd/cvue-3/js/dbCommon'


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
                dt_start:'',
				dt_end:'',

                cfg_const:{
                    obj:'ti_obj_sys',
                    log:'ti_log_sys',
                    class:'SYSLOG',
                    user:'SYS',
                    sql_sel:'select a.id as `id`,a.f_id as `uuid`,a.f_pid as `pid`,a.f_uri as `uri`,a.f_class as `class`,a.f_code as `code`,' +
					'a.f_user as `op_user`,from_unixtime(a.f_t/1000,\'%Y-%m-%d %H:%i:%s\') as `op_t`,a.f_src as `src`,a.f_dest as `dst`,' +
					'a.f_obj as `obj`,a.f_v as `v` from ti_log_sys a ',
                    sql_max_id:'SELECT MAX(a.id) as max_id FROM ti_log_sys a',
                    sql_del:'update ti_log_sys a set a.f_dt_flag = -1 WHERE a.id = ',
                    sql_rec_cnt:'SELECT COUNT(a.id) as count_rec FROM ti_log_sys a',
                    sql_where_0:' WHERE a.{0}  LIKE \'%{0}%\' and a.f_dt_flag=0 and a.f_t>={0} and a.f_t<{0}',
                    sql_where_1:" WHERE a.f_dt_flag=0 and a.f_t>={0} and a.f_t<{0}",
                    sql_order:' order by a.f_t desc ',
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
            formatCode: function (row, column) {
                if(row[column.property] ==1) return '登录';
                else if(row[column.property] ==2) return '退出';
                else return '未知';
            },
			// double
			formatDouble: function (row, column) {
				return row[column.property].toFixed(2);
			},
			// date
			formatDate: function (row, column) {
				let dt = new Date(row[column.property]);
				return String(dt.getFullYear()) + '-' + dt.getMonth() + '-' + dt.getDay();
			},
            formatDateTime: function (row, column) {
                let dt = new Date(row[column.property]);
                return String(dt.getFullYear()) + '-' + dt.getMonth() + '-' + dt.getDay()+' '+dt.getHour() ;
            },

			handleCurrentChange: function(val) {
				this.page = val;
				this.getRecs();
			},

            getAllObjs: function() {
                this.filter.attr = '';
                this.filter.value = '';
                this.page = 1;
                this.dt_start='';
                this.dt_end='';
                this.getRecs();
            },
			// query data
			getRecs: function() {
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
                    let dt1 = 0;
                    let dt2 = Date.now();

                    if(this.dt_start instanceof Date)
					{
					    dt1 = Date.parse(this.dt_start);
					}
                    debugger;
					if(this.dt_end instanceof Date)
					{
					    dt2 = Date.parse(this.dt_end);
					}

                    if (this.filter.attr && this.filter.value) {
                        r =  util.formatString.format(this.cfg_const.sql_where_0,this.filter.attr,this.filter.value,dt1,dt2);
                    }
                    else{
                        r = util.formatString.format(this.cfg_const.sql_where_1,dt1,dt2);
                    }
                    debugger;
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
                    debugger;
					recvQuery();
				});
				let para2 = {
					session: Date.now(),
					sql: this.cfg_const.sql_sel + getSqlWhere() + this.cfg_const.sql_order + " LIMIT " + ((this.page - 1) * this.pageSize) + "," + this.pageSize
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
			// table select change
			selsChange: function (sels) {
				this.sels = sels;
			},
		},

		mounted() {
            this.filter.options = [
                {
                    value: 'f_code',
                    label: '动作',
                },
                {
                    value: 'f_user',
                    label: '用户',
                },
            ];
			this.getRecs();
		}
	}

</script>

<style scoped>

</style>
