import Login from '../views/home/Login.vue'
// import Login from './../views/example/odl1/validator/validator-a1'
import NotFound from '../views/home/404.vue'
import Home from '../views/home/Home.vue'
import Main from '../views/main/Main.vue'

import Customer from './../views/customer'
import RoleGroup from './../views/role-group'
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
            { path: '/main', component: Main, name: '主页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '客户与用户管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/customer', component: Customer, name: '客户管理' },
            { path: '/role-group', component: RoleGroup, name: '角色分组管理' },
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
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
