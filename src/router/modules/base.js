const base = [
  {
    path: 'home',
    name: '欢迎页',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/home')
  }, {
    path: '/layout-iframe',
    name: '嵌入视图',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "base" */ '@/views/layout-iframe')
  // }, {
  //   path: '/user/info',
  //   name: '个人信息',
  //   meta: {
  //     isTab: true,
  //     isAuth: true
  //   },
  //   component: () => import(/* webpackChunkName: "base" */ '@/views/user-info/user-info.vue')
  }
]
export default base
