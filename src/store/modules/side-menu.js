import { deepClone } from '@/util/utils'
import { validateNull } from '@/util/validate-util'
import application from '@/config/application'
import { deepSearch } from '@/util/tree-util'
import { listCurrentUserMenuByTopMenuIdWithTree } from '@/api/common/side-menu'

export default {
  namespaced: true,
  state: {
    /** 左侧菜单的加载状态 */
    loading: false,
    /** 左侧菜单选中的key */
    selectedKeys: [application.homepageTab.path],
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
    /**
     * 以树形结构拉取左侧菜单数据
     *
     * @param {string} topMenuId 顶部菜单的ID，为空则全量拉取
     */
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
    },
    /**
     * 根据路由路径拉取菜单项
     * @param path 传入的路由路径
     */
    async getMenuItemByPath({ commit, state }, path) {
      return deepSearch(state.menuList, path, 'path')
    }
  }
}
