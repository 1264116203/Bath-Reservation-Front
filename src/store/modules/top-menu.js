import { listForCurrent } from '@/api/common/top-menu'
import { getStore, setStore } from '@/util/browser-storage-util'

export default {
  namespaced: true,
  state: {
    topMenuList: [],
    currentTopMenuKey: getStore('currentTopMenuKey') || '',
    isTopMenuShow: false
  },
  mutations: {
    setTopMenuList(state, payload) {
      state.topMenuList = payload
    },
    setCurrentTopMenuKey (state, payload) {
      setStore('currentTopMenuKey', payload, 'locale')
      state.currentTopMenuKey = payload
    },
    setTopMenuShow (state, payload) {
      state.isTopMenuShow = payload
    }
  },
  actions: {
    async listTopMenu({ commit }) {
      const result = (await listForCurrent()).data
      result.sort((a, b) => {
        const sa = a.sort ? a.sort : 100
        const sb = b.sort ? b.sort : 100
        return sa - sb
      })
      commit('setTopMenuList', result)
      commit('setTopMenuShow', result.length > 1)
    }
  }
}
