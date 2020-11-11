<template>
  <a-menu v-model="selectedKeys" theme="dark" mode="inline"
          :default-selected-keys="selectedKeys"
          :open-keys="openKeys"
          @click="menuSelected"
          @openChange="onOpenChange"
  >
    <a-menu-item v-show="!isLoading" key="/main/home">
      <a-icon type="home" />
      <span>首页</span>
    </a-menu-item>
    <template v-for="item in menuList">
      <a-menu-item v-if="!item.children || item.children.length === 0" :key="item.path || item.code">
        <a-icon :type="item.icon ? item.icon : iconDefault" />
        <span>{{ item.name }}</span>
      </a-menu-item>
      <my-sub-menu v-else :key="item.path || item.code" :menu-info="item" :default-icon="iconDefault" />
    </template>
  </a-menu>
</template>

<script>
import { mapState } from 'vuex'
import application from '@/config/application'
import router from '@/router'
import { tabDiff } from '@/util/tab-util'
import { deepSearch } from '@/util/tree-util'
import { destroyCurrentRouteComponent } from '@/util/router-util'
import MySubMenu from './my-sub-menu'

const iconDefault = application.menu.iconDefault

export default {
  name: 'SideMenu',
  components: { MySubMenu },
  data() {
    return {
      iconDefault,
      openKeys: []
    }
  },
  computed: {
    ...mapState('common', ['isCollapse']),
    ...mapState('side-menu', ['menuList']),
    isLoading: {
      get() {
        return this.$store.state['side-menu'].loading
      },
      set(val) {
        this.$store.commit('side-menu/setLoading', val)
      }
    },
    selectedKeys: {
      get() {
        return this.$store.state['side-menu'].selectedKeys
      },
      set(val) {
        this.$store.commit('side-menu/setSelectedKeys', val)
      }
    }
  },
  watch: {
    menuList: function () {
      if (!this.isCollapse) {
        this.openKeys = this.menuList.filter(item => item.isDefaultExpanded).map(item => item.path || item.code)
      }
    },
    isCollapse: function (collapse) {
      if (collapse) {
        this.openKeys = []
      } else {
        this.openKeys = this.menuList.filter(item => item.isDefaultExpanded).map(item => item.path || item.code)
      }
    }
  },
  methods: {
    menuSelected(item) {
      // 首先根据菜单点击，深度优先找到菜单项
      const menuItem = deepSearch(this.menuList, item.key, 'path')
      // 如果菜单项上标记了isOpen，说明要在新窗口打开
      if (menuItem && menuItem.isOpen) {
        if (menuItem.path.indexOf('http') === 0) {
          window.open(menuItem.path)
        } else {
          // 如果要打开的不是一个http开头的页面，则说明是本系统内部的路由
          const path = window.location.href.substring(0, window.location.href.indexOf('#'))
          // 此处直接使用了锚点路由的相关判断。如果路由模式变为history，则失效
          window.open(path + '#' + menuItem.path)
        }
        return
      }
      let tabElem
      // 如果找不到菜单项，默认使用首页项（防弹）
      if (!menuItem) {
        tabElem = {
          path: '/main/home',
          name: '首页'
        }
      } else {
        if (menuItem.path.indexOf('http') === 0) {
          tabElem = {
            path: '/layout-iframe',
            name: menuItem.name,
            query: {
              tabName: menuItem.name,
              src: menuItem.path
            }
          }
        } else {
          tabElem = {
            path: menuItem.path,
            name: menuItem.name
          }
        }
      }
      // 如果待切换Tab和当前Tab是同一个，则刷新
      if (tabDiff(this.$store.getters['tab/activeTab'], tabElem)) {
        destroyCurrentRouteComponent()
        router.replace('/hot-refresh')
      } else {
        this.$router.push(tabElem.path)
      }
    },
    onOpenChange(val) {
      this.openKeys = val
    }
  }
}
</script>

<style lang="less" scoped>

</style>
