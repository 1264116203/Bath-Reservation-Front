export default [
  {
    path: '/system/user',
    name: '用户管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/user-management/user-management-index')
  }, {
    path: '/system/dept',
    name: '组织机构管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/dept-management/dept-management-index')
  }, {
    path: '/system/dict',
    name: '字典管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/dict-management/dict-management-index')
  }, {
    path: '/system/authority',
    name: '权限与菜单管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/authority-management/authority-management-index')
  }, {
    path: '/system/topmenu',
    name: '顶部菜单',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/top-menu-management/top-menu-management-index')
  }, {
    path: '/system/param',
    name: '参数管理',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/param-management/param-management-index')
  }, {
    path: '/authority/role',
    name: '角色与授权',
    meta: {
      isTab: true,
      isAuth: true
    },
    component: () => import(/* webpackChunkName: "system" */ '@/views/system/role-management/role-management-index')
  }
]
