const brOrderCancel = [
  {
    path: 'brOrderCancel',
    name: '订单取消',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-order-cancel-index')
  }
]
export default brOrderCancel
