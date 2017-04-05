// genarate a obj for vuex

export default {
    state: {
        current_store: {}
    },
    mutations: {
        setCurrentStore(state, store) {
            state.current_store = store
        }
    }
}
