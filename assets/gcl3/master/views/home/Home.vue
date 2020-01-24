<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':orgName}}
			</el-col>
			<el-col :span="4">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="6" class="sysName">
				{{sysName}}
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<!--<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>-->
					<span class="el-dropdown-link userinfo-inner">{{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<!--<el-dropdown-item>我的消息</el-dropdown-item>-->
						<!--<el-dropdown-item>设置</el-dropdown-item>-->
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed" flag-memu-expanded>
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
							</li>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
    import util from './../../../../3rd/cvue-3/js/util'
	// todo:20200122
    // import dbCommon from './../../../../3rd/cvue-3/js/dbCommon';

    import { getSqlQuery,getSqlTrans } from './../../../../3rd/cvue-3/api/api';

	export default {
		data() {
			return {
			    orgName:'',
				sysName:'BOOGOO客户管理系统',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
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
				log:'ti_log_sys',
				class:'SYSLOG',
				user:'SYS',
            },

			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
                    let para = {
                        session: Date.now(),
                        sqls:[]
                    };
                    let v_log = {
                        uuid:util.uuid.create(0),
                        pid:'',
                        uri:'logout',
                        class:this.cfg_const.class,
                        code:2,
                        user:localStorage.getItem('user-login'),
                        act:0,
                        t:Date.now(),
                        v:'退出',
                    };
                    // let r = dbCommon.sql.getInsert(this.cfg_const.log,this.cfg_ti_log,v_log);
                    para.sqls.push(r.sql);

                    getSqlTrans(para).then((res) => {
                        if (res.state.err) {
                            this.$message({
                                message: '写登录日志失败：' + res.state.err,
                                type: 'error'
                            });
                        } else {
                            sessionStorage.removeItem('user');
                            _this.$router.push('/login');
                            localStorage.removeItem('user-login');
                        }
                    });
				}).catch(() => {

				});


			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
				let matches = document.querySelectorAll("ul[flag-memu-expanded]");
				if (matches.length > 0) matches[0].style.width = this.collapsed ? '64px' : '230px';
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.name || '';
				this.sysUserAvatar = user.avatar || '';
				localStorage.setItem('user-login',user.name);
				//写登录日志
                let para = {
                    session: Date.now(),
                    sqls:[]
                };
                let v_log = {
                    uuid:util.uuid.create(0),
                    pid:'',
                    uri:'login',
                    class:this.cfg_const.class,
                    code:1,
                    user:localStorage.getItem('user-login'),
                    act:0,
                    t:Date.now(),
                    v:'登录',
                };
                // let r = dbCommon.sql.getInsert(this.cfg_const.log,this.cfg_ti_log,v_log);
                para.sqls.push(r.sql);

                getSqlTrans(para).then((res) => {
                    if (res.state.err) {
                        this.$message({
                            message: '写登录日志失败：' + res.state.err,
                            type: 'error'
                        });
                    }
                });
			}
		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				//background: url(../../img/flag.jpg);
				//background-size: auto,100%;
				//background-repeat:no-repeat;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
			.sysName{
				padding: 0px 23px;
				font-size: 28px;
				width:600px;
				height: 60px;
				line-height: 60px;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>
