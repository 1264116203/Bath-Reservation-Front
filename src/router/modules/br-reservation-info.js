const brReservationInfo = [
  {
    path: 'brInfo',
    name: '浴间预订时段详情信息',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-reservation-info-index')
  }
]
export default brReservationInfo
