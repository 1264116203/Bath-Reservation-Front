export default [
  {
    path: '/reservation/brInfo',
    name: '浴间信息',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-info-index')
  }, {
    path: '/reservation/brMessageBoard',
    name: '留言板',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-message-board-index')
  }, {
    path: '/reservation/brOrderCancel',
    name: '订单取消',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-order-cancel-index')
  },
  {
    path: '/reservation/brOrderDetail',
    name: '订单详情',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-order-detail-index')
  }, {
    path: '/reservation/brOrderSubmit',
    name: '订单提交',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-order-submit-index')
  }, {
    path: '/reservation/brParameter',
    name: '浴池统一参数',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-parameter-index')
  }, {
    path: '/reservation/brInfo',
    name: '浴间预订时段详情信息',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-reservation-info-index')
  }
]
