import application from '@/config/application'

const { homepageTab } = application

export default {
  namespaced: true,
  state: {
    /** 标签列表 */
    tabList: [homepageTab],
    /** 当前标签key */
    activeTabKey: '1',
    /** 当前右击激活的标签 */
    contextMenuTabKey: null,
    /** 当前显示的是否为iframe */
    isIframeShow: false,
    /** 供layout-index使用的，路由页面keep-alive的include列表 */
    keepAliveComponentNames: [],
    /** 首页标签 */
    homepageTab: homepageTab
  },
  mutations: {
    setIframeShow(state, payload) {
      state.isIframeShow = payload
    }
  },
  getters: {
    iframeTabList: state => state.tabList.filter(elem => elem.meta && elem.meta.isIframe),
    activeTab: state => state.tabList.find(val => val.key === state.activeTabKey)
  }
}
