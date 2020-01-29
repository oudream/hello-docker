// gcl
import './../../3rd/gcl-3/rtdb'
import './../../3rd/gcl-3/rtdb_ajax'
import './../../3rd/gcl-3/gis_computer'
import './../../3rd/gcl-3/gis_ind'
import './../../3rd/gcl-3/gis_comp'
import './config/gis_ind_config'
gcl.rtdb.setRtServer(window.location.hostname+':8821');
// gcl.rtdb.setRtServer('10.32.50.49:8821');

// odl
import './../../3rd/odl-3/odl'
import './../../3rd/odl-3/odl_n_vue'
import './../../3rd/odl-3/odl_n_mysql'
import './config/odc_bureau'
import './config/odc_department'
import './config/odc_role_group'
import './config/odc_user'

// vue
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './store/store'
import Vuex from 'vuex'
// import routes from './route/routes'
import routes from './route/routes-example'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

// vue element ui plugins
import './../../3rd/cvue-3/plugins/directives';

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    //NProgress.start();
    // debugger;
    if (to.path === '/login') {
        sessionStorage.removeItem('user');
    }
    let user = sessionStorage.getItem('user');
    if (!user && to.path !== '/login') {
        next({path: '/login'})
    }
    else {
        next()
    }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')
