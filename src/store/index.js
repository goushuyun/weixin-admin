import Vuex from "vuex"
import Vue from 'Vue'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        adminInfo: ''
    },
    mutations: {
        setAdminInfo(state, adminInfo){
            state.adminInfo = adminInfo
        }
    }
})

export default store
