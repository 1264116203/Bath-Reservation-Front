import axios from 'axios'

const contextPath = '/api/system'

export const listUsualLogWithPagination = (current, size, params) => (
  axios.get(contextPath + '/log-usual/pagination', { params: { page: current, size, ...params } })
)

export const getUsualLogById = (id) => (
  axios.get(contextPath + '/log-usual/' + id)
)

export const listApiLogWithPagination = (current, size, params) => (
  axios.get(contextPath + '/log-api/pagination', { params: { page: current, size, ...params } })
)

export const getApiLogById = (id) => (
  axios.get(contextPath + '/log-api/' + id)
)

export const listErrorLogWithPagination = (current, size, params) => (
  axios.get(contextPath + '/log-error/pagination', { params: { page: current, size, ...params } })
)

export const getErrorLogById = (id) => (
  axios.get(contextPath + '/log-error/' + id)
)
