import axios from 'axios'

const contextPath = '/api/system/top-menu'

export function add(row) {
  return axios.post(contextPath, row)
}

export function batchRemove(ids) {
  return axios.delete(contextPath + '/batch', { params: { ids } })
}

export function removeById(id) {
  return axios.delete(contextPath + '/' + id)
}

export function update(row) {
  return axios.put(contextPath, row)
}

export function getById(id) {
  return axios.get(contextPath + '/' + id)
}

export function listWithPagination(page, size, params) {
  return axios.get(contextPath + '/pagination', {
    params: {
      page,
      size,
      ...params
    }
  })
}

/** 给顶部菜单授权权限资源 */
export function grant(authorityIdList, topMenuIdList) {
  return axios.put(contextPath + '/grant', {
    authorityIdList,
    topMenuIdList
  })
}
