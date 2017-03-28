import Vue from 'vue'

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)

// 配置vue-router
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import routes from './config/routes'
const router = new VueRouter({
    routes
})

var App = require('./App')

new Vue({
    router
}).$mount('#app')
