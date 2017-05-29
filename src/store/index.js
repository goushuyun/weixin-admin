// genarate a obj for vuex

export default {
    state: {
        current_store: {},
        store_logo: '',     // 云店logo
        store_name: '',     // 云店name
        menu_active: '',    // 默认打开的菜单
        order_search: {},   //线上订单搜索条件
        account_search: {}, //线上资产页面搜索条件
        menu_active: ''     //菜单的默认选中项（页面未通过菜单跳转则，跳转后菜单项未“高亮”）
    },
    mutations: {
        setCurrentStore(state, store) {
            state.current_store = store
        },
        setStoreLogo(state, logo) {
            state.store_logo = logo
        },
        setStoreName(state, name) {
            state.store_name = name
        },
        setMenuActive(state, active) {
            state.menu_active = active
        },
        setOrderSearch(state, order_search) {
            state.order_search = order_search
        },
        setAccountSearch(state, account_search) {
            state.account_search = account_search
        },
        setMenuActice(state, menu_active) {
            state.menu_active = menu_active
        }
    }
}
