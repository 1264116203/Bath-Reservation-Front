import LoginIndex from '@/pages/login/login-index'
import AuthenticatePage from '@/pages/authenticate'

const pages = [
  {
    path: '/',
    name: 'root',
    redirect: '/main'
  }, {
    path: '/login',
    name: '登录页',
    component: LoginIndex
  }, {
    path: '/hot-refresh',
    name: '热刷新',
    component: () => import(/* webpackChunkName: "base" */ '@/pages/hot-refresh')
  }, {
    path: '/authenticate',
    name: '权限鉴定页',
    component: AuthenticatePage
  }, {
    path: '/exception/403',
    name: '403',
    component: () => import(/* webpackChunkName: "base" */ '@/pages/exception/403')
  }, {
    path: '/exception/500',
    name: '500',
    component: () => import(/* webpackChunkName: "base" */ '@/pages/exception/500')
  }
]

export default pages
