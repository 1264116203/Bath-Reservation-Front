const brInfo = [
  {
    path: 'brInfo',
    name: '浴间信息',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-info-index')
  }
]
export default brInfo
