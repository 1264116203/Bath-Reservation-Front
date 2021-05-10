import axios from 'axios'

const contextPath = '/api/reservation/br-pre-query'

export function get() {
  return axios.get(contextPath)
}
