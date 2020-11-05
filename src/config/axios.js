import Vue from 'vue'
import NProgress from 'nprogress'
import axios from 'axios'
import { baseUrl } from '@/config/base-url'
import store from '@/store'
import router from '@/router'
import { serialize } from '@/util/utils'
import { getCsrfToken } from '@/util/auth-util'
import { getMessageFromHttpStatusCode } from '@/util/http-status-message'
const env = process.env
if (env.NODE_ENV === 'development') {
  // 开发环境下，默认不设置超时时间
  axios.defaults.timeout = 0
} else {
  // 生产环境下，默认超时时间1分钟
  axios.defaults.timeout = 60000
}
// 返回其他状态码
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 400
}
// 跨域请求时是否需要使用凭证
axios.defaults.withCredentials = true
axios.defaults.baseURL = baseUrl

/**
 * 默认的请求拦截器
 */
axios.interceptors.request.use(config => {
  // start progress bar
  NProgress.start()
  /*
   * meta 包含的内容
   *
   * isSerialize - 是否使用序列化的form表单提交
   * doNotMessage - 是否不显示默认的浮动式notification
   */
  const meta = (config.meta || {})
  // 在发送增、删、改请求时，携带Csrf令牌，防止Csrf攻击
  if (config.method !== 'get' && config.method !== 'option' && getCsrfToken()) {
    config.headers['XSRF-TOKEN'] = getCsrfToken()
  }
  // 如果不想在请求失败时弹出notification，设置此属性为真
  if (meta.doNotMessage) {
    config.headers['X-DONT-MESSAGE'] = 'YES'
  }

  // TODO: 此处以后改为Cookie模式
  if (store.state.auth.accessToken) {
    if (!meta.basicAuth) {
      config.headers.Authorization = 'Bearer ' + store.state.auth.accessToken
    }
  }

  // 如果不想使用JSON作为body而是使用序列化表单，设置此值为真
  if (meta.isSerialize) {
    config.data = serialize(config.data)
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 默认的返回拦截器
 */
axios.interceptors.response.use(res => {
  // 请求成功时什么都不用做
  NProgress.done()
  return res
}, error => {
  NProgress.done()

  const res = error.response
  // 如果服务器没有返回，说明应该是网络错误
  if (!res) {
    const message = getMessageFromHttpStatusCode(null)
    Vue.prototype.$notification.error({ description: message, message: '请求失败', key: 'error_message' })
    return Promise.reject(error)
  }

  const { status } = res

  // 针对令牌是否合法的特殊处理
  if (status === 401) {
    // 如果返回内容为"invalid refresh token"，说明此时已经执行过刷新令牌重请求，但刷新令牌已失效，故跳回登录页
    if (res.data && res.data.refreshToken === 'invalid refresh token') {
      return store.dispatch('auth/logout')
        .then(() => router.push({ path: '/login' }))
    } else {
      // 其他情况下，说明还没开始换取refreshToken
      // 如果返回体内容为"invalid jwt token"，则说明服务器认定JWT令牌已失效，此时应发请求换取新的JWT令牌
      // 只有存在refreshToken时，再提交令牌重刷
      const refreshToken = store.state.auth.refreshToken
      if (res.data && res.data.error === 'invalid_token' && refreshToken) {
        return store.dispatch('auth/refreshToken').then(() => {
          return axios.request(res.config)
        })
      }
    }
  }

  // 如果服务器端有错误信息，则会将其URIEncode后放到X-ERROR-MESSAGE头信息里
  let message = res.headers['X-ERROR-MESSAGE']
  if (message) {
    message = decodeURIComponent(message)
  }
  if (!message) {
    message = getMessageFromHttpStatusCode(status)
  }
  // 如果服务器端没有告诉客户端不要显示notification（一般是通过请求拦截器告诉服务器的），则显示之
  if (error.config.headers['X-DONT-MESSAGE'] !== 'YES') {
    Vue.prototype.$notification.error({ description: message, message: '请求失败', key: 'error_message' })
  }
  error.parsedMessage = message
  return Promise.reject(error)
})
