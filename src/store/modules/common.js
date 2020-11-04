import {
  setStore,
  getStore
} from '@/util/browser-storage-util'

export default {
  namespaced: true,
  state: {
    // 系统语言
    language: getStore('language') || 'zh',
    // 左侧菜单是否折叠
    isCollapse: getStore('collapse') || false,
    // 是否为全屏模式
    isFullScreen: false,
    // 屏幕大小，0超小屏幕，1小屏幕，2中屏幕，3大屏幕
    screen: -1,
    // 是否显示标签栏
    showTab: true,
    // 是否显示菜单折叠按钮
    showCollapse: true,
    // 是否显示全屏切换按钮
    showFullScreen: true,
    // 是否显示菜单
    showMenu: true,
    // 是否显示页脚
    showFooter: true
  },
  mutations: {
    setLanguage: (state, language) => {
      state.language = language
      setStore('language', state.language, 'local')
    },
    toggleCollapse: (state) => {
      state.isCollapse = !state.isCollapse
      setStore('collapse', state.isCollapse, 'local')
    },
    toggleFullScreen: (state) => {
      state.isFullScreen = !state.isFullScreen
    },
    setScreen: (state, screen) => {
      state.screen = screen
    }
  }
}
