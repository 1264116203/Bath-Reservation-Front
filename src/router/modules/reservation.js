export default [
  {
    path: '/reservation/brReservation',
    name: '预定信息预查询',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-reservation')
  },
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
    isTab: true,
    meta: {
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
    path: '/reservation/brParameter',
    name: '浴池统一参数',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-parameter-index')
  }
]
