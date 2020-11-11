import application from '@/config/application'
import { getStore, setStore } from '@/util/browser-storage-util'
import { handleTabCloseable, tabDiff } from '@/util/tab-util'
import { guid } from '@/util/utils'

const { homepageTab, firstPageCloseable } = application

export default {
  namespaced: true,
  state: {
    /** 标签列表 */
    tabList: getStore('tabList') || [homepageTab],
    /** 当前标签key */
    activeTabKey: homepageTab.key,
    /** 当前右击激活的标签 */
    contextMenuTabKey: null,
    /** 当前显示的是否为iframe */
    isIframeShow: false,
    /** 供layout-index使用的，路由页面keep-alive的include列表 */
    keepAliveComponentNames: []
  },
  mutations: {
    /**
     * 标签页的切换
     *
     * 如果列表中存在则直接切换
     * 如果列表中不存在则创建新的标签页并加入
     */
    switchTab: (state, tab) => {
      // 如果已存在该Tab，则直接修改当前活动的tab页的key
      const found = state.tabList.find(val => tabDiff(tab, val))
      if (found) {
        state.activeTabKey = found.key
        return
      }
      // 如果tab没有key，且不在列表内，则给它分配一个新的guid作为key
      if (!tab.key) {
        tab.key = guid()
      }
      state.tabList.push(tab)
      handleTabCloseable(state.tabList)
      setStore('tabList', state.tabList)
      state.activeTabKey = tab.key
    },
    /**
     * 关闭标签页
     *
     * @param {string} key 待关闭标签页的key
     */
    closeTab: (state, key) => {
      const tabList = state.tabList.filter(item => {
        return item.key !== key
      })
      handleTabCloseable(tabList)
      state.tabList = tabList
      setStore('tabList', state.tabList)
    },
    closeAllTabs: (state) => {
      state.tabList = [homepageTab]
      setStore('tabList', state.tabList)
    },
    closeOtherTabs: (state, key) => {
      state.tabList = state.tabList.filter(item => {
        if (item.key === key) {
          return true
        } else if (!firstPageCloseable && item.path === homepageTab.path) {
          return true
        }
      })
      handleTabCloseable(state.tabList)
      setStore('tabList', state.tabList)
    },
    setIframeShow(state, payload) {
      state.isIframeShow = payload
    },
    setActiveTabKey: (state, key) => {
      state.activeTabKey = key
    },
    setContextMenuTabKey: (state, key) => {
      state.contextMenuTabKey = key
    },
    setKeepAliveComponentNames: (state, payload) => {
      state.keepAliveComponentNames = payload
    }
  },
  actions: {
    /** 根据传入的tab数据，查找其在标签列表中是否存在 */
    getTabItem({ state }, tabElem) {
      const found = state.tabList.find(val => tabDiff(tabElem, val))
      return Promise.resolve(found)
    }
  },
  getters: {
    iframeTabList: state => state.tabList.filter(elem => elem.meta && elem.meta.isIframe),
    activeTab: state => state.tabList.find(val => val.key === state.activeTabKey)
  }
}
