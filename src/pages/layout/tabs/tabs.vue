<template>
  <div class="no-border-margin-tabs">
    <a-tabs v-model="activeTabKey" type="editable-card" :hide-add="true"
            @change="onTabClick" @edit="onEdit"
    >
      <a-tab-pane v-for="tabElem in tabList"
                  :key="tabElem.key"
                  :closable="tabElem.closeable"
      >
        <span slot="tab" v-contextmenu:contextmenu class="tab-slot" :tab-key="tabElem.key"
              @contextmenu="onRightClick"
        >
          {{ tabElem.label }}
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
import { TabPanelMixin } from '@/components/mixins/tab-panel/tab-panel-mixin'

export default {
  name: 'Tabs',
  mixins: [TabPanelMixin],
  computed: {
    closeTabItemDisabled() {
      const tab = this.tabList.find(elem => elem.key === this.rightTabKey)
      if (!tab) {
        return true
      }
      return !tab.closeable
    },
    activeTabKey: {
      get () {
        return this.$store.state.tabs.activeTabKey
      },
      set(val) {
        this.$store.commit('tabs/UPDATE_ACTIVE_TAB_KEY', val)
      }
    },
    rightTabKey: {
      get () {
        return this.$store.state.tabs.rightTabKey
      },
      set(val) {
        this.$store.commit('tabs/UPDATE_RIGHT_TAB_KEY', val)
      }
    }
  },
  methods: {
    onRightClick(event) {
      this.rightTabKey = event.target.getAttribute('tab-key')
    },
    closeTabByContextMenu() {
      this.closeTab(this.rightTabKey)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
<style lang="less">
  @import "../../../custom-variables";

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
