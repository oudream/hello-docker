import Login from '../views/home/Login.vue'
import NotFound from '../views/home/404.vue'
import Home from '../views/home/Home.vue'

import recArch from '../views/rec/rec.vue'
import recCheck from '../views/rec/check.vue'

import archQuery from '../views/app/query.vue'
import archLendReq from '../views/app/lend-req.vue'
import archLendConfirm from '../views/app/lend-confirm.vue'
import archRevertReq from '../views/app/revert-req.vue'
import archRevertConfirm from '../views/app/revert-confirm.vue'

import archUser from '../views/sys/user.vue'
import archCabinet from '../views/sys/cabinet.vue'
import archReader from '../views/sys/reader.vue'

import logReader from '../views/log/reader.vue'

import logSys from '../views/log/sys.vue'
import logArch from '../views/log/arch.vue'
import logUser from '../views/log/user.vue'
import logCab from '../views/log/cabinet.vue'

import svgMain from '../views/main/main-svg.vue'

import testCabinet from '../views/test/cabinet.vue'
import testUser from '../views/test/user.vue'
import testArch from '../views/test/rec.vue'
import testReader from '../views/test/reader.vue'



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
            { path: '/Main', component: svgMain, name: '主页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '图档',
        iconCls: 'el-icon-message',
        // leaf: true,//只有一个节点
        children: [
            { path: '/rec-login', component: recArch, name: '编录' },
            { path: '/rec-chk', component: recCheck, name: '盘点' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '利用',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/app-query', component: archQuery, name: '检索' },
            { path: '/app-lend-req', component: archLendReq, name: '借阅申请' },
            { path: '/app-lend-confirm', component: archLendConfirm, name: '借阅确认' },
            { path: '/app-revert-req', component: archRevertReq, name: '归还申请' },
            { path: '/app-revert-confirm', component: archRevertConfirm, name: '归还确认' },
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '统计',
    //     iconCls: 'el-icon-message',//图标样式class
    //     children: [
    //         { path: '/table', component: Table, name: '年度' },
    //         { path: '/form', component: Form, name: '地图归还' },
    //     ]
    // },
    {
        path: '/',
        component: Home,
        name: '日志',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/log-sys', component: logSys, name: '系统' },
            { path: '/log-arch', component: logArch, name: '图档' },
            { path: '/log-user', component: logUser, name: '用户' },
            { path: '/log-reader', component: logReader, name: '读者' },
            { path: '/log-cab', component: logCab, name: '图柜' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/sys-user', component: archUser, name: '用户' },
            { path: '/sys-cab', component: archCabinet, name: '图柜' },
            { path: '/sys-reader', component: archReader, name: '读者' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '测试',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/test-arch', component: testArch, name: '档案' },
            { path: '/test-cab', component: testCabinet, name: '图柜' },
            { path: '/test-user', component: testUser, name: '用户' },
            { path: '/test-reader', component: testReader, name: '读者' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
