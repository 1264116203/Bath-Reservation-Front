import { loginByPassword, requestRefreshToken } from '@/api/common/auth'
import { getStore, setStore } from '@/util/browser-storage-util'
import { getSelfInfo } from '@/api/common/user-self'

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
    /**
     * 根据用户名密码登录
     * @param userInfo
     * @param {string}  userInfo.username 用户名
     * @param {string}  userInfo.password 密码
     * @param {boolean} userInfo.pwdEncoded 密码是否转码
     * @param {number}  userInfo.refreshTokenValidHours 刷新令牌的有效时间
     */
    async loginByPassword({ commit, dispatch }, userInfo) {
      dispatch('clearAll')
      const data = (await loginByPassword(userInfo.username, userInfo.password, userInfo.pwdEncoded)).data
      // 如果返回值里有异常描述，说明登录失败
      if (data.error_description) {
        return Promise.reject(data.error_description)
      } else {
        commit('setAccessToken', data.access_token)
        commit('setRefreshToken', data.refresh_token)
        commit('setAuthenticated', 'yes')
        const userInfo = (await getSelfInfo()).data
        commit('setUserInfo', userInfo)
      }
    },
    /**
     * 清空所有用户鉴权信息及配套的
     * 页面信息
     */
    clearAll({ commit }) {
      commit('setAccessToken', '')
      commit('setRefreshToken', '')
      commit('setRoleList', [])
      commit('setAuthorityList', [])
      commit('setAuthenticated', 'no')
      // 清空顶部菜单数据、左侧菜单的选择数据和标签页开启数据
      commit('top-menu/setCurrentTopMenuKey', '', { root: true })
      commit('side-menu/setSelectedKeys', [], { root: true })
      commit('tab/closeAllTabs', null, { root: true })
    },
    refreshToken({ commit, state }) {
      return requestRefreshToken(state.refreshToken).then(res => {
        const data = res.data
        commit('setAccessToken', data.access_token)
        commit('setRefreshToken', data.refresh_token)
      })
    },
    // 登出
    logout({ commit, dispatch }) {
      // await logout()
      dispatch('clearAll')
    }
  },
  namespaced: true
}
