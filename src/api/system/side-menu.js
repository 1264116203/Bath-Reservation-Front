import axios from 'axios'

const contextPath = '/api/system/authority'

/** 全菜单树形结构数据 */
export function listAllWithTree() {
  return axios.get(contextPath + '/tree')
}

/** 根据角色ID对应的树形结构数据 */
export function listMenuByRoleIdWithTree(roleId) {
  return axios.get(contextPath + '/tree/by-role/' + roleId)
}

/** 顶部菜单设置权限的全部菜单树形结构数据 */
export function listAllMenuWithTree() {
  return axios.get(contextPath + '/menu-tree')
}

/** 根据顶级菜单ID对应的树形结构数据 */
export function listMenuByTopMenuIdWithTree(topMenuId) {
  return axios.get(contextPath + '/menu-tree/by-top-menu/' + topMenuId)
}

/** 当前登录用户的菜单列表数据 */
export function listCurrentUserMenuByTopMenuIdWithTree(topMenuId) {
  return axios.get(contextPath + '/current-user/menu-tree', {
  // TODO 此处改一下 return axios.get(contextPath + '/menu-tree/current-user', {
    params: {
      topMenuId
    }
  })
}
