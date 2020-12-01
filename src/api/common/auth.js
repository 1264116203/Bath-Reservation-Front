import axios from 'axios'

/**
 * 登录接口，用于换取用户令牌和刷新令牌
 *
 * @param username 用户名
 * @param password 密码
 * @param pwdEncoded 是否转码
 * @param refreshTokenValidHours 刷新令牌的有效时长（小时）
 */
export function loginByPassword(username, password, pwdEncoded = false, refreshTokenValidHours = 24) {
  return axios.post('/api/authenticate', {
    username,
    password,
    pwdEncoded
    // TODO 暂未加入
    // refreshTokenValidHours
  })
}

/** 使用刷新令牌重新获取token */
export function requestRefreshToken(refreshToken) {
  return axios.post('/api/authenticate/refresh-token', {
    refreshToken
  })
}

/** 检查当前用户的登录状态 */
export function checkAuthenticate() {
  return axios.get('/api/auth/login-status/check', {
    validateStatus (status) {
      return (status >= 200 && status < 300) || status === 401
    }
  })
}
