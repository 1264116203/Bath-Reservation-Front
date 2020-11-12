import axios from 'axios'

const contextPath = '/api/system/role'

export function add(row) {
  return axios.post(contextPath, row)
}

export function removeById(id) {
  return axios.delete(contextPath + '/' + id)
}

export function batchRemove(ids) {
  return axios.delete(contextPath + '/batch', {
    params: {
      ids
    }
  })
}

export function update(row) {
  return axios.put(contextPath, row)
}

export function getById(id) {
  return axios.get(contextPath + '/' + id)
}

export function queryWithTree(params) {
  return axios.get(contextPath + '/query', {
    params: {
      ...params
    }
  })
}

/** 拉取所有角色组成的角色树 */
export function listAllWithTree() {
  return axios.get(contextPath + '/tree')
}

/** 给角色授权权限资源 */
export function grant(authorityIdList, roleIdList) {
  return axios.put(contextPath + '/grant', {
    authorityIdList,
    roleIdList
  })
}

/** 设置角色对应的顶级菜单 */
export function grantTopMenu(roleIdList, topMenuIdList) {
  return axios.put(contextPath + '/top-menu', {
    roleIdList,
    topMenuIdList
  })
}
