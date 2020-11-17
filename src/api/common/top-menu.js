import axios from 'axios'

const contextPath = '/api/system/top-menu'

/** 顶部菜单树形结构数据 */
export function listForCurrent() {
  return axios.get(contextPath + '/list/current-user')
}

/** 根据角色ID获取菜单列表 */
export function listByRoleId(roleId) {
  return axios.get(contextPath + '/list/by-role/' + roleId)
}

/** 获取所有顶部菜单记录 */
export function listAll() {
  return axios.get(contextPath + '/list')
}
