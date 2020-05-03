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

import ElementSelect1 from './../views/example/element1/select1'

import HelloHighChartsLineBoost from './../views/example/highcharts1/line-boost.vue'

import SampleShopGoods from './../views/example/vuex1/goods.vue'
import SampleShopCart from './../views/example/vuex1/cart.vue'
import SampleShopPayment from './../views/example/vuex1/payment.vue'

import sqlUser from './../views/example/sql1/user.vue'

import Customer from './../views/customer'
import Users from './../views/users'
import Man from './../views/man'
import Vehicle from './../views/vehicle'

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
        name: '客户与用户管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/customer', component: Customer, name: '客户管理' },
            { path: '/users', component: Users, name: '用户管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '汽车信息管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/man', component: Man, name: '品牌管理' },
            { path: '/vehicle', component: Vehicle, name: '型号管理' },
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
        path: '/',
        component: Home,
        name: 'Element',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/select1', component: ElementSelect1, name: 'Hello Select1' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'HIGHCHARTS',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/HelloHighChartsLineBoost', component: HelloHighChartsLineBoost, name: 'Line Boost' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'CROSS ',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/cross1', component: HelloCross1, name: 'Hello Cross 1' },
            { path: '/svg1', component: HelloSvg1, name: 'HelloSvg1' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'SampleShop',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/SampleShopGoods', component: SampleShopGoods, name: 'SampleShopGoods' },
            { path: '/SampleShopCart', component: SampleShopCart, name: 'SampleShopCart' },
            { path: '/SampleShopPayment', component: SampleShopPayment, name: 'SampleShopPayment' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'SQL-View',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/sqlUser', component: sqlUser, name: 'sql-user' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
