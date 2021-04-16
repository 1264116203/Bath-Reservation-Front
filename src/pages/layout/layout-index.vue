<template>
  <a-layout>
    <a-layout-sider
      v-show="showSideMenu"
      v-model="collapsed"
      width="260px"
      :style="{ overflow: 'auto', height: '100vh' }"
    >
      <top-logo />
      <side-menu />
    </a-layout-sider>

    <a-layout class="right-side-layout">
      <a-layout-header v-if="showTopBanner" class="header">
        <top-banner />
      </a-layout-header>

      <tabs v-show="showTab" />

      <a-layout-content style="min-height: auto; display: flex">
        <div id="main-content" class="main-content padding-content">
          <div v-show="!isIframeShow">
            <keep-alive :include="keepAliveComponentNames">
              <router-view class="router-view" />
            </keep-alive>
          </div>
          <iframe-component v-show="isIframeShow" ref="iframeComponentRef" />
        </div>
      </a-layout-content>
      <layout-footer v-if="showFooter" />
    </a-layout>
  </a-layout>
</template>

<script>
import { mapState } from 'vuex'
import TopLogo from './top-logo'
import SideMenu from './side-menu/side-menu'
import TopBanner from './top-banner/top-banner'
import Tabs from './tabs/tabs'
import IframeComponent from './iframe/iframe-component'
import LayoutFooter from './layout-footer'

export default {
  name: 'LayoutIndex',
  components: { TopLogo, TopBanner, SideMenu, LayoutFooter, Tabs, IframeComponent },
  computed: {
    ...mapState('common', ['showTopBanner', 'showTab', 'showSideMenu', 'showFooter']),
    isIframeShow: {
      get () {
        return this.$store.state.tab.isIframeShow
      },
      set (val) {
        this.$store.commit('tab/setIframeShow', val)
      }
    },
    collapsed: {
      get() {
        return this.$store.state.common.isCollapse
      },
      set(val) {
        if (val !== this.collapsed) {
          this.$store.commit('common/toggleCollapse')
        }
      }
    },
    keepAliveComponentNames() {
      return this.$store.state.tab.keepAliveComponentNames
    }
  }
}
</script>

<style lang="less" scoped>
  .header {
    background: #fff;
    padding: 0;
  }
  .right-side-layout {
    height: 100vh;
  }
  .padding-content {
    margin: 0;
    background-color: @body-background;
    overflow: auto
  }
  .main-content {
    flex-grow: 1;
  }
</style>
