import Login from '../views/home/Login.vue'
// import Login from './../views/example/odl1/validator/validator-a1'
import NotFound from '../views/home/404.vue'
import Home from '../views/home/Home.vue'
import Main from '../views/main/Main.vue'

import HelloOdlSimpleA1 from './../views/example/odl1/other/sample-a1.vue'
import HelloOdlSimpleB1 from './../views/example/odl1/other/sample-b1.vue'

import HelloSvg1 from './../views/example/svg1/svg1.vue'
import HelloCross1 from './../views/example/cross1/hello1.vue'

import HelloLayout1 from './../views/example/css1/layout1'

import HelloHighChartsLineBoost from './../views/example/highcharts1/line-boost.vue'

import SampleShopGoods from './../views/example/vuex1/goods.vue'
import SampleShopCart from './../views/example/vuex1/cart.vue'
import SampleShopPayment from './../views/example/vuex1/payment.vue'

import sqlUser from './../views/example/sql1/user.vue'

// user
import Users from './../views/users.vue'

// Bureau
import BureauManager from './../views/bureau/bureau-manager.vue'
import LsContainers from './../views/bureau/ls-containers.vue'
import ContainerCpuHistory from './../views/bureau/container-cpu-history.vue'
import ContainerMemory1History from './../views/bureau/container-memory1-history.vue'
import ContainerMemory2History from './../views/bureau/container-memory2-history.vue'
import RealtimeContainers from './../views/bureau/realtime-containers.vue'

// Locket
import LocketManager from './../views/locket/locket-manager.vue'

// System
import ClientUpload from './../views/client-upload.vue'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        leaf: true,//只有一个节点
        iconCls: 'el-icon-message',
        children: [
            { path: '/main', component: HelloSvg1, name: '主页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '用户',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/users', component: Users, name: '用户管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '客户(电力局)',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/bureau-manager', component: BureauManager, name: '局管理' },
            { path: '/ls-container', component: LsContainers, name: '局的服务实例' },
            { path: '/container-cpu-history', component: ContainerCpuHistory, name: '服务实例CPU历史线' },
            { path: '/container-memory1-history', component: ContainerMemory1History, name: '服务实例内存常规值历史' },
            { path: '/container-memory2-history', component: ContainerMemory2History, name: '服务实例内存峰值历史' },
            { path: '/realtime-containers', component: RealtimeContainers, name: '服务实例实时监测' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '智能锁具',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/locket-manager', component: LocketManager, name: '锁具管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统相关',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/client-upload', component: ClientUpload, name: '客户端上传的信息' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
