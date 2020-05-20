import Login from '../views/home/Login.vue'
import NotFound from '../views/home/404.vue'
import Home from '../views/home/Home.vue'
import Main from '../views/main/Main.vue'
// user
import Users from '../views/org/users.vue'
// Bureau
import BureauManager from '../views/org/bureau.vue'

import LsContainers from '../views/docker/ls-containers.vue'
import ContainerCpuHistory from '../views/docker/container-cpu-history.vue'
import ContainerMemory1History from '../views/docker/container-memory1-history.vue'
import ContainerMemory2History from '../views/docker/container-memory2-history.vue'
import RealtimeContainers from '../views/docker/realtime-containers.vue'

// Lock
import LocketManager from '../views/device/lock.vue'
// System
import ClientUpload from '../views/log/client-upload.vue'


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
        iconCls: 'fa fa-home',
        children: [
            { path: '/main', component:Main, name: '主页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '组织机构',
        iconCls: 'fa fa-user',
        children: [
            { path: '/users', component: Users, name: '用户管理' },
            { path: '/bureau-manager', component: BureauManager, name: '局管理' }
            // { path: '/station-manager', component: StationManager, name: '变电站' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '服务管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/ls-container', component: LsContainers, name: '实例信息' },
            { path: '/container-cpu-history', component: ContainerCpuHistory, name: 'CPU负载' },
            { path: '/container-memory1-history', component: ContainerMemory1History, name: '内存常规' },
            { path: '/container-memory2-history', component: ContainerMemory2History, name: '内存峰值' },
            { path: '/realtime-containers', component: RealtimeContainers, name: '实时监测' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '设备管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/locket-manager', component: LocketManager, name: '锁具管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统日志',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/client-upload', component: ClientUpload, name: '客户上传' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
