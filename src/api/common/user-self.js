import axios from 'axios'

const contextPath = '/api/system/user/self'

export function getSelfInfo() {
  return axios.get(contextPath)
}

export function updateSelfInfo(requestData) {
  return axios.put(contextPath, requestData)
}

export function updatePassword(oldPassword, newPassword) {
  return axios.put(contextPath + '/password', {
    oldPassword,
    newPassword
  })
}
