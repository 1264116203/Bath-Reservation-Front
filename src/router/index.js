import Vue from 'vue'
import VueRouter from 'vue-router'

import pages from './modules/pages'

import base from './modules/base'
import monitor from './modules/monitor'

Vue.use(VueRouter)

/** 页面级总路由表 */
const routes = []
/** 框架内子路由表 */
const layoutChildrenRoutes = []

layoutChildrenRoutes.push(...base)
layoutChildrenRoutes.push(...monitor)

// 添加主框架页面到总路由表
routes.push({
  path: '/main',
  redirect: '/main/home',
  name: '主框架',
  meta: {
    isTab: false
  },
  component: () => import(/* webpackChunkName: "base" */ '@/pages/layout/layout-index'),
  children: layoutChildrenRoutes
})
// 添加其他页面到总路由表
routes.push(...pages)
// 将该匹配放到最后，使不存在路由导航至404
routes.push({
  path: '*',
  name: '404',
  component: () => import(/* webpackChunkName: "base" */ '@/pages/exception/404')
})

const router = new VueRouter({
  routes
})

export default router
