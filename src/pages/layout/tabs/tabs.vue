<template>
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

import { mapActions, mapMutations, mapState } from 'vuex'
import { isUrl } from '@/util/validate-util'

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
        this.$store.commit('tabs/setActiveTabKey', val)
      }
    },
    contextMenuTabKey: {
      get () {
        return this.$store.state.tab.contextMenuTabKey
      },
      set (val) {
        this.$store.commit('tabs/setContextMenuTabKey', val)
      }
    }
  },
  methods: {
    ...mapMutations('tab', ['switchTab', 'closeOther', 'closeAll']),
    ...mapMutations('tab', { closeTabMutation: 'closeTab' }),
    ...mapActions('tab', ['openTab']),
    onTabClick(key) {
      const found = this.tabList.find((val) => val.key === key)
      if (found) {
        if (isUrl(found.path)) {
          this.openIframeTab(found)
        } else {
          this.openTab(found)
        }
      }
    },
    onRightClick (event) {
      this.contextMenuTabKey = event.target.getAttribute('tab-key')
    },
    openIframeTab(iframeElem) {
      this.openTab({
        ...iframeElem,
        path: '/layout-iframe'
      })
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
      this.closeOther(this.contextMenuTabKey)
      this.onTabClick(this.contextMenuTabKey)
    },
    closeAllTabs() {
      this.closeAll()
      this.openTab(null)
    },
    closeTab(key) {
      const index = this.tabList.findIndex((val) => val.key === key)
      if (index || index === 0) {
        this.closeTabMutation(key)
      }
      if (this.tabList.length === 0) {
        this.openTab(null)
        return
      }
      if (key === this.activeTabKey) {
        if (index === 0) {
          this.onTabClick(this.tabList[0].key)
        } else {
          this.onTabClick(this.tabList[index - 1].key)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
<style lang="less">
@import "../../../assets/styles/antd-custom-variables";
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
