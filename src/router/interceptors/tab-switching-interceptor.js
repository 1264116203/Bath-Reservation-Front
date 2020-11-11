/**
 * 专门处理路由-tab切换的拦截器
 */
import router from '@/router'
import store from '@/store'
import { validateNull } from '@/util/validate-util'
import { tabDiff } from '@/util/tab-util'
import application from '@/config/application'

router.beforeEach(async (to, from, next) => {
  const meta = Object.assign({ isAuth: false, isTab: false }, (to.meta || {}))
  // 如果不是tab路由则直接放行
  if (!meta.isTab) {
    return next()
  }

  let path = ''

  // 针对iframe组件的特殊处理
  if (to.name === '嵌入视图') {
    path = to.query.src
  } else {
    path = to.path
  }

  // 如果不是基于path指定的路由跳转，则放行
  if (validateNull(path)) {
    return next()
  }

  const tabElem = {
    path,
    query: to.query,
    params: to.params
  }

  // 如果是主页，直接跳转
  if (tabDiff(tabElem, application.homepageTab)) {
    store.commit('tab/switchTab', tabElem)
  } else {
    // 根据路径、参数，查找tabs列表，如果找到，直接切换过去
    const tab = await store.dispatch('tab/getTabItem', tabElem)
    if (tab) {
      store.commit('tab/switchTab', tabElem)
    } else {
      // 如果tab列表找不到，去左侧菜单列表查找
      const menuItem = await store.dispatch('side-menu/getMenuItemByPath', path)
      if (menuItem) {
        store.commit('tab/switchTab', {
          ...tabElem,
          // 直接使用左侧菜单的标签名，而非路由表中的标签名
          label: menuItem.name,
          meta: {
            ...meta,
            isIframe: path.indexOf('http') === 0
          }
        })
      } else {
        // 如果左侧菜单也找不到，直接以路由表中的名字跳转
        if (to.meta) {
          store.commit('tab/switchTab', {
            ...tabElem,
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
  }
  store.commit('side-menu/setSelectedMenuPath', path)
  next()
})

router.afterEach((to, from) => {
  if (to.meta.isTab) {
    const activeTab = store.getters['tab/activeTab']
    if (activeTab) {
      const title = activeTab.label
      // 根据当前的标签也获取label的值动态设置浏览器标题
      if (title) {
        document.title = application.title + ' - ' + title
      } else {
        document.title = application.title
      }
    }
  }
})
