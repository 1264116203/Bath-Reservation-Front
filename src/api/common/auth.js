import axios from 'axios'
import application from '@/config/application'

/**
 * 登录接口，用于换取用户令牌和刷新令牌
 *
 * @param username 用户名
 * @param password 密码
 * @param pwdEncoded 是否转码
 * @param refreshTokenValidHours 刷新令牌的有效时长（小时）
 */
export function loginByPassword(username, password, pwdEncoded = false, refreshTokenValidHours = 24) {
  const config = {}
  let basicAuthVal = ''
  if (application.clientId && application.clientSecret) {
    basicAuthVal = 'Basic ' + btoa(application.clientId + ':' + application.clientSecret)
  }
  if (basicAuthVal) {
    config.headers = {
      Authorization: basicAuthVal
    }
  }
  return axios.post('/api/auth/oauth/token', {
    grantType: 'password',
    username,
    password,
    pwdEncoded
    // TODO 暂未加入
    // refreshTokenValidHours
  }, config)
}
