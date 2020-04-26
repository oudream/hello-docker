import Login from '../views/home/Login.vue'
// import Login from './../views/example/odl1/validator/validator-a1'
import NotFound from '../views/home/404.vue'
import Home from '../views/home/Home.vue'
import Main from '../views/main/Main.vue'

import HelloOdlSimpleA1 from './../views/example/odl1/other/sample-a1.vue'
import HelloSvg1 from './../views/example/svg1/svg1.vue'

import sqlUser from './../views/example/sql1/user.vue'

import SampleDaMaterial from './../views/example/odl1/book/material.vue'
import SampleDaPosition from './../views/example/odl1/book/position.vue'
import SampleDaReader from './../views/example/odl1/book/reader.vue'
import SampleDaStatus from './../views/example/odl1/book/status.vue'

import SampleShopGoods from './../views/example/vuex1/goods.vue'
import SampleShopCart from './../views/example/vuex1/cart.vue'
import SampleShopPayment from './../views/example/vuex1/payment.vue'

import HelloCross1 from './../views/example/cross1/hello1.vue'


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
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: 'HELLO',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/sampleA1', component: HelloOdlSimpleA1, name: 'Sample A' },
            { path: '/svg1', component: HelloSvg1, name: 'HelloSvg1' },
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
        name: 'SampleDa',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/SampleDaMaterial', component: SampleDaMaterial, name: 'SampleDaMaterial' },
            { path: '/SampleDaPosition', component: SampleDaPosition, name: 'SampleDaPosition' },
            { path: '/SampleDaReader', component: SampleDaReader, name: 'SampleDaReader' },
            { path: '/SampleDaStatus', component: SampleDaStatus, name: 'SampleDaStatus' },
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
