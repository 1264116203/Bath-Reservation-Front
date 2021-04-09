import Vue from 'vue'
import VueRouter from 'vue-router'
import router from '@/router'

const { isNavigationFailure, NavigationFailureType } = VueRouter

router.onError(err => {
  const duplicated = isNavigationFailure(err, NavigationFailureType.duplicated)
  const redirected = isNavigationFailure(err, NavigationFailureType.redirected)
  const aborted = isNavigationFailure(err, NavigationFailureType.aborted)
  const cancelled = isNavigationFailure(err, NavigationFailureType.cancelled)
  // 默认的路由错误，则忽略之
  if (duplicated || redirected || aborted || cancelled) {
    return
  }
  Vue.prototype.$confirm({
    icon: 'warning',
    title: '捕获到路由跳转异常！',
    content: ('此异常极有可能是因为服务器已经更新了前端项目，导致您浏览器缓存的代码块和服务器不一致引起的。' +
      '建议您刷新浏览器（注意，刷新浏览器会导致当前的用户输入丢失，请您记录好未保存的数据）。如果刷新后依然看到本提示，请联系开发人员！'),
    okText: '刷新',
    okType: 'danger',
    cancelText: '忽略',
    onOk() {
      window.location.reload(true)
    }
  })
})
