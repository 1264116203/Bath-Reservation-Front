import axios from 'axios'

const contextPath = '/api/system/dict'

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

export function listWithPagination(page, size, params) {
  return axios.get(contextPath + '/pagination', {
    params: {
      page,
      size,
      ...params
    }
  })
}
