import 'babel-polyfill'
import Vue from 'vue'

import './config/import-ant-design'
import NProgress from 'nprogress'
import VContextMenu from 'v-contextmenu'
import 'nprogress/nprogress.css'

import '@/config/axios'

import router from './router'
import store from './store'
import '@/filters/text-clip'
import '@/filters/moment-time'
import GlobalComponentsPlugin from '@/components/global'

import App from './app.vue'

import '@/assets/styles/antd-custom-styles.less'
import '@/assets/styles/rcdcore-styles.less'

// 配置 NProgress
NProgress.configure({
  showSpinner: false
})

Vue.config.productionTip = false

Vue.use(VContextMenu)
Vue.use(GlobalComponentsPlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
