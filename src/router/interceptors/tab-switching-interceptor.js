/**
 * 专门处理路由-tab切换的拦截器
 */
import router from '@/router'
import NProgress from 'nprogress'
import store from '@/store'
import { validateNull } from '@/util/validate'

router.beforeEach(async (to, from, next) => {
  const meta = Object.assign({ isAuth: false, isTab: false }, (to.meta || {}))
  let path = ''

  // 针对iframe组件的特殊处理
  if (to.name === '嵌入视图') {
    path = to.query.src
  } else {
    path = to.path
  }

  if (validateNull(path)) {
    return next()
  }

  try {
    // 根据路径、参数，查找tabs列表，如果找到，直接切换过去
    await store.dispatch('tabs/getTabItem', {
      path,
      query: to.query,
      params: to.params
    })
    store.commit('tabs/switchTab', {
      path,
      params: to.params,
      query: to.query
    })
  } catch (e) {
    try {
      // 如果tab列表找不到，去左侧菜单列表查找
      const menuItem = await store.dispatch('user/getMenuItemByPath', path)
      store.commit('tabs/switchTab', {
        path,
        params: to.params,
        query: to.query,
        // 直接使用左侧菜单的标签名，而非路由表中的标签名
        label: menuItem.name,
        meta: {
          ...meta,
          isIframe: path.indexOf('http') === 0
        }
      })
    } catch (e) {
      // 如果左侧菜单也找不到，而且这个路由的确是Tab页形式的路由
      if (to.meta && to.meta.isTab) {
        store.commit('tabs/switchTab', {
          path,
          params: to.params,
          query: to.query,
          // 标签名直接使用路由表中的name
          label: to.query.tabName || to.name,
          meta: {
            ...meta,
            isIframe: path.indexOf('http') === 0
          }
        })
      }
    }
  }
  store.commit('side-menu/setSelectedMenuPath', path)
  next()
})

router.afterEach((to, from) => {
  NProgress.done()
  if (to.meta.isTab) {
    if (store.getters.nowTab) {
      const title = store.getters.nowTab.label
      // 根据当前的标签也获取label的值动态设置浏览器标题
      if (title) {
        document.title = store.getters.website.title + ' - ' + title
      } else {
        document.title = store.getters.website.title
      }
    }
  }
})
