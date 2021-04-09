import router from '@/router'
import store from '@/store'

router.beforeEach(async (to, from, next) => {
  // 判断当前路由是不是属于标签页路由
  const isInTabList = store.state.tab.tabList.find(tab => tab.path === to.path)
  if (!isInTabList) {
    return next()
  }

  // 只处理组件有名字的情况。没有名字的不管。
  try {
    const toName = await getComponentNameFromRoute(to)
    if (toName) {
      const keepAliveComponentNames = store.state.tab.keepAliveComponentNames
      if (keepAliveComponentNames.indexOf(toName) === -1) {
        store.commit('tab/setKeepAliveComponentNames', [...keepAliveComponentNames, toName])
      }
    }
  } catch (err) {
    console.error('获取异步组件名称失败。', err)
    return next(err)
  }
  next()
})

router.afterEach(async (to, from) => {
  // 当前离开的路由是否在标签列表中
  const isInTabList = store.state.tab.tabList.find(tab => tab.path === from.path)
  if (from.meta.isTab && !isInTabList) {
    try {
      const fromName = await getComponentNameFromRoute(from)
      if (fromName) {
        const keepAliveComponentNames = [...store.state.tab.keepAliveComponentNames]
        const index = keepAliveComponentNames.indexOf(fromName)
        // 如果列表里有该组件的名字，则将其删除
        if (index !== -1) {
          // console.log('组件关闭，删除组件！', fromName)
          keepAliveComponentNames.splice(index, 1)
          store.commit('tab/setKeepAliveComponentNames', keepAliveComponentNames)
        }
      }
    } catch (err) {
      console.error('获取异步组件名称失败。', err)
    }
  }
})

function getComponentNameFromRoute(route) {
  return new Promise((resolve, reject) => {
    if (route.matched && route.matched[route.matched.length - 1]) {
      const matched = route.matched[route.matched.length - 1]
      if (matched.components && matched.components.default) {
        // 只处理组件有名字的情况。没有名字的不管。
        const componentInstance = route.matched[route.matched.length - 1].components.default
        if (typeof componentInstance === 'function') {
          componentInstance()
            .then(component => {
              return resolve(component.default.name)
            })
            .catch(err => reject(err))
        } else {
          return resolve(componentInstance.name)
        }
      }
    }
  })
}
