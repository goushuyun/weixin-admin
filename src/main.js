import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './config/routes'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(VueRouter)
Vue.use(ElementUI)

var App = require('./App')

const router = new VueRouter({
    routes
})

//setting Vuex
var app = new Vue({
    el: '#app',
    router,
    name,
    render: h => h(App)
})
