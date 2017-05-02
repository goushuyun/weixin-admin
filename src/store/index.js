// genarate a obj for vuex

export default {
    state: {
        current_store: {},
        order_search: {},
    },
    mutations: {
        setCurrentStore(state, store) {
            state.current_store = store
        },
        setOrderSearch(state, order_search) {
            state.order_search = order_search
        }
    }
}
