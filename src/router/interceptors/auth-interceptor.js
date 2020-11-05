import router from '@/router'
import store from '@/store'

router.beforeEach((to, from, next) => {
  const authenticated = store.state.auth.authenticated

  // 如果要访问登录页，但用户已经得到鉴权，则将其转发至首页路由
  if (to.path === '/login') {
    if (authenticated === 'yes') {
      return next({ path: '/' })
    }
  }
  // 无需鉴权的页面直接放行
  if (!to.meta.isAuth) {
    return next()
  }

  // 如果尚未鉴定权限且目标路由需要权限，则跳转至鉴权页面
  if (authenticated === 'not-yet') {
    store.commit('auth/setLastPageBeforeLogin', to)
    return next({
      path: '/authenticate'
    })
  }

  // 如果权限鉴定失败，则跳转至登录页
  if (authenticated === 'no') {
    return next('/login')
  }

  next()
})
