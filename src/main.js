import Vue from 'vue'

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)

// 配置vue-router
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import routes from './config/routes'
const router = new VueRouter({routes})

router.afterEach(function(to) {
	if (mixpanel) {
        let store_name = localStorage.getItem('store_name')
        if(store_name){
            mixpanel.track(store_name + ': ' + to.fullPath)
        }
	}
})

// import vue-map
import AMap from 'vue-amap';
Vue.use(AMap);
AMap.initAMapApiLoader({
	key: 'f7cf095e05b9202ad3fa5fe877efda31',
	plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'Geolocation']
});

var App = require('./App')

// import vuex for state manage
import Vuex from "vuex"
import vuexObj from './store/index'
Vue.use(Vuex)

let store = new Vuex.Store(vuexObj)

const app = new Vue({store, router}).$mount('#app')
