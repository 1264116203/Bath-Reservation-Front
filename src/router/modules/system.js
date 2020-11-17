export default [
  {
    path: '/system/user',
    name: '用户管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/user-management/user-management-index')
  // }, {
  //   path: '/system/dept',
  //   name: '部门管理',
  //   meta: {
  //     isTab: true,
  //     isAuth: true
  //   },
  //   component: () => import(/* webpackChunkName: "system" */ '@/views/system/dept-list')
  // }, {
  //   path: '/system/dict',
  //   name: '字典管理',
  //   meta: {
  //     isTab: true,
  //     isAuth: true
  //   },
  //   component: () => import(/* webpackChunkName: "system" */ '@/views/system/dict/dict-list.vue')
  }, {
    path: '/system/authority',
    name: '权限项管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/authority-management/authority-management-index')
  // }, {
  //   path: '/system/topmenu',
  //   name: '顶部菜单',
  //   meta: {
  //     isTab: true,
  //     isAuth: true
  //   },
  //   component: () => import(/* webpackChunkName: "system" */ '@/views/system/top-menu-list')
  // }, {
  //   path: '/system/param',
  //   name: '参数管理',
  //   meta: {
  //     isTab: true,
  //     isAuth: true
  //   },
  //   component: () => import(/* webpackChunkName: "system" */ '@/views/system/param-list')
  }, {
    path: '/authority/role',
    name: '角色及权限管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/role-management/role-management-index')
  }
]
