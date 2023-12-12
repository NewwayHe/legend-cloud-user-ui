import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import actions from './actions'
import mutations from './mutations'
import eventBus from './eventBus.js'

Vue.use(Vuex)

// 对外输出vuex的store对象
export default new Vuex.Store({
    state,
    actions,
    mutations
})
