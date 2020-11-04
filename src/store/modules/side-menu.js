import { listCurrentUserMenuByTopMenuIdWithTree } from '@/api/system/side-menu'
import { deepClone } from '@/util/utils'
import { validateNull } from '@/util/validate-util'
import application from '@/config/application'

export default {
  namespaced: true,
  state: {
    loading: false,
    selectedKeys: ['/main/home'],
    menuList: []
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setSelectedKeys(state, keys) {
      state.selectedKeys = keys
    },
    setSelectedMenuPath(state, path) {
      state.selectedKeys = [path]
    },
    setMenuList (state, payload) {
      state.menuList = payload
    }
  },
  actions: {
    async listSideMenuWithTree({ commit, state, dispatch }, topMenuId = '') {
      const data = (await listCurrentUserMenuByTopMenuIdWithTree(topMenuId)).data

      const menu = deepClone(data)
      // 对获取到的权限数据进行后置处理
      menu.forEach(item => {
        processMenuItem(item, true)
      })

      commit('setMenuList', menu)

      return Promise.resolve(menu)

      function processMenuItem(ele, first = false) {
        // 设置图标，如果不存在则使用默认图标
        const icon = ele.icon
        ele.icon = validateNull(icon) ? application.menu.iconDefault : icon

        const hasChildren = ele.children && ele.children.length !== 0

        if (hasChildren) {
          ele.children.forEach(processMenuItem)
        } else {
          ele.children = []
        }
      }
    }
  }
}
