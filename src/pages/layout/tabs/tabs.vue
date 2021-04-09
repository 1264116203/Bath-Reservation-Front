\<template>
  <div class="no-border-margin-tabs">
    <a-tabs v-model="activeTabKey"
            type="editable-card"
            :hide-add="true"
            @change="onTabClick"
            @edit="onEdit"
    >
      <a-tab-pane v-for="item in tabList"
                  :key="item.key"
                  :closable="item.closeable"
      >
        <span slot="tab" v-contextmenu:contextmenu
              class="tab-slot"
              :tab-key="item.key"
              @contextmenu="onRightClick"
        >
          {{ item.label }}
        </span>
      </a-tab-pane>
    </a-tabs>
    <v-contextmenu ref="contextmenu">
      <template v-if="contextMenuTabKey === activeTabKey">
        <v-contextmenu-item @click="reloadTab">
          刷新
        </v-contextmenu-item>
        <v-contextmenu-item divider />
      </template>
      <v-contextmenu-item :disabled="closeTabItemDisabled" @click="closeTabByContextMenu">
        关闭标签页
      </v-contextmenu-item>
      <v-contextmenu-item divider />
      <v-contextmenu-item @click="closeOtherTabs">
        关闭其他
      </v-contextmenu-item>
      <v-contextmenu-item @click="closeAllTabs">
        关闭所有
      </v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>

import { mapMutations, mapState } from 'vuex'
import { isUrl } from '@/util/validate-util'
import { destroyCurrentRouteComponent } from '@/util/router-util'
import router from '@/router'

export default {
  name: 'Tabs',
  computed: {
    ...mapState('tab', ['tabList']),
    closeTabItemDisabled () {
      const tab = this.tabList.find(elem => elem.key === this.contextMenuTabKey)
      if (!tab) {
        return true
      }
      return !tab.closeable
    },
    activeTabKey: {
      get () {
        return this.$store.state.tab.activeTabKey
      },
      set (val) {
        this.$store.commit('tab/setActiveTabKey', val)
      }
    },
    contextMenuTabKey: {
      get () {
        return this.$store.state.tab.contextMenuTabKey
      },
      set (val) {
        this.$store.commit('tab/setContextMenuTabKey', val)
      }
    }
  },
  methods: {
    ...mapMutations('tab', ['switchTab']),
    onTabClick(key) {
      const found = this.tabList.find((val) => val.key === key)
      if (found) {
        if (isUrl(found.path)) {
          this.$router.push({
            path: '/layout-iframe',
            query: found.query,
            params: found.params
          })
        } else {
          this.$router.push({
            path: found.path,
            params: found.params,
            query: found.query
          })
        }
      }
    },
    onRightClick (event) {
      this.contextMenuTabKey = event.target.getAttribute('tab-key')
    },
    onEdit(targetKey, action) {
      if (action === 'remove') {
        this.closeTab(targetKey)
      }
    },
    closeTabByContextMenu () {
      this.closeTab(this.contextMenuTabKey)
    },
    closeOtherTabs() {
      this.$store.commit('tab/closeOtherTabs', this.contextMenuTabKey)
      this.onTabClick(this.contextMenuTabKey)
    },
    closeAllTabs() {
      this.$store.commit('tab/closeAllTabs')
      this.onTabClick(this.tabList[0].key)
    },
    closeTab(key) {
      const index = this.tabList.findIndex((val) => val.key === key)
      if (index || index === 0) {
        this.$store.commit('tab/closeTab', key)
      }
      if (this.tabList.length === 0) {
        this.switchTab(this.tabList[0])
        return
      }
      if (key === this.activeTabKey) {
        if (index === 0) {
          this.onTabClick(this.tabList[0].key)
        } else {
          this.onTabClick(this.tabList[index - 1].key)
        }
      }
    },
    reloadTab() {
      // TODO 会直接销毁所有iframe页面
      destroyCurrentRouteComponent()
      router.replace('/hot-refresh')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
<style lang="less">
.no-border-margin-tabs {
  padding-top: 1px;
  background-color: @body-background;
  border-top: 1px solid #e8e8e8;

  .ant-tabs-bar {
    margin: 0;
    padding: 0 1rem;

    .ant-tabs-nav {
      .ant-tabs-tab {
        padding: 0 16px 0 0;

        .tab-slot {
          padding: 16px 0 16px 16px;
          user-select: none;
        }
      }
    }
  }
}
</style>
