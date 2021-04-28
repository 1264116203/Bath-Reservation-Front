const brParameter = [
  {
    path: 'brParameter',
    name: '浴池统一参数',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/reservation/br-parameter-index')
  }
]
export default brParameter
