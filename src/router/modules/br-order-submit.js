const brOrderSubmit = [
  {
    path: 'brOrderSubmit',
    name: '订单提交',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-order-submit-index')
  }
]
export default brOrderSubmit
