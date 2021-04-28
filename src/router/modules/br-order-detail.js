const brOrderDetail = [
  {
    path: 'brOrderDetail',
    name: '订单详情',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-order-detail-index')
  }
]
export default brOrderDetail
