import { loginByPassword } from '@/api/common/auth'
import { getStore, setStore } from '@/util/browser-storage-util'

export default {
  state: {
    // 用户信息
    userInfo: {},
    // 角色列表
    roleList: [],
    // 权限项列表
    authorityList: [],
    // 令牌
    accessToken: getStore('accessToken') || '',
    // 刷新令牌
    refreshToken: getStore('refreshToken') || '',
    // 是否已鉴权
    authenticated: 'not-yet',
    // 登录前最后一页
    lastPageBeforeLogin: null
  },
  mutations: {
    setUserInfo(state, payload) {
      state.userInfo = payload
    },
    setRoleList(state, payload) {
      state.roleList = payload
    },
    setAuthorityList(state, payload) {
      state.menuList = payload
    },
    setAccessToken(state, payload) {
      state.accessToken = payload
      setStore('accessToken', payload, 'local')
    },
    setRefreshToken(state, payload) {
      state.refreshToken = payload
      setStore('refreshToken', payload, 'local')
    },
    setAuthenticated(state, payload) {
      state.authenticated = payload
    },
    setLastPageBeforeLogin(state, payload) {
      state.lastPageBeforeLogin = payload
    }
  },
  actions: {
    // 根据用户名登录
    loginByPassword({ commit, dispatch }, userInfo) {
      dispatch('clearAll')
      return loginByPassword(userInfo.username, userInfo.password, userInfo.pwdEncoded)
        .then(res => {
          const data = res.data
          if (data.error_description) {
            return Promise.reject(data.error_description)
          } else {
            commit('setAccessToken', data.access_token)
            commit('setRefreshToken', data.refresh_token)
            // commit('setUserInfo', data)
            commit('setAuthenticated', 'yes')
          }
        })
    },
    // 注销session
    clearAll({ commit }) {
      commit('setAccessToken', '')
      commit('setRefreshToken', '')
      commit('setRoleList', [])
      commit('setAuthorityList', [])
      commit('setAuthenticated', 'no')
      commit('top-menu/setCurrentTopMenuKey', '', { root: true })
      // commit('common/UNLOCK', null, { root: true })
      // commit('tabs/CLOSE_ALL', null, { root: true })
      // commit('sidemenu/UPDATE_SELECTED_KEYS', [], { root: true })
    },
    refreshToken() {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('not-yet')
    },
    // 登出
    logout({ commit, dispatch }) {
      // await logout()
      dispatch('clearAll')
    }
  },
  namespaced: true
}
