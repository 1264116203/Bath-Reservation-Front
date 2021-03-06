import Vue from 'vue'

import '@/plugins/ant-design-vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import VContextMenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

import '@/config/axios'

import router from './router'
import '@/config/router-config'
import store from './store'
import '@/filters/text-clip'
import '@/filters/moment-time'
import GlobalComponentsPlugin from '@/components/global'

import App from './app.vue'

import '@/assets/styles/rcdcore-styles.less'
import moment from 'moment'
// 配置 NProgress
NProgress.configure({
  showSpinner: false
})

Vue.config.productionTip = false

Vue.use(VContextMenu)
Vue.use(GlobalComponentsPlugin)
Vue.filter('momentTime', function (value, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (!value) return ''
  return moment(value).format(pattern)
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
