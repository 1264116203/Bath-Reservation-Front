import Vue from 'vue'
import Vuex from 'vuex'

import CommonModule from './modules/common'
import AuthModule from './modules/auth'
import TopMenuModule from './modules/top-menu'
import TabModule from './modules/tab'
import SideMenuModule from './modules/side-menu'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    common: CommonModule,
    auth: AuthModule,
    'top-menu': TopMenuModule,
    tab: TabModule,
    'side-menu': SideMenuModule
  }
})
