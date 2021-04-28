import Vue from 'vue'
import VueRouter from 'vue-router'

import pages from './modules/pages'

import base from './modules/base'
import monitor from './modules/monitor'
import system from './modules/system'
import brInfo from './modules/br-info'
import brMessageBoard from './modules/br-message-board'
import brOrderCancel from './modules/br-order-cancel'
import brOrderDetail from './modules/br-order-detail'
import brOrderSubmit from './modules/br-order-submit'
import brParameter from './modules/br-parameter'
import brReservationInfo from './modules/br-reservation-info'

Vue.use(VueRouter)

/** 页面级总路由表 */
const routes = []
/** 框架内子路由表 */
const layoutChildrenRoutes = []

layoutChildrenRoutes.push(...base)
layoutChildrenRoutes.push(...monitor)
layoutChildrenRoutes.push(...system)
layoutChildrenRoutes.push(...brInfo)
layoutChildrenRoutes.push(...brMessageBoard)
layoutChildrenRoutes.push(...brOrderCancel)
layoutChildrenRoutes.push(...brOrderDetail)
layoutChildrenRoutes.push(...brOrderSubmit)
layoutChildrenRoutes.push(...brParameter)
layoutChildrenRoutes.push(...brReservationInfo)

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
