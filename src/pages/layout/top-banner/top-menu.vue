<template>
  <div class="topMenuWarp">
    <a-menu v-show="isTopMenuShow" :selected-keys="selectedKeys" mode="horizontal" @click="onClick">
      <a-menu-item v-for="item in topMenuList" :key="item.id">
        <a-icon :type="item.icon" />{{ item.name }}
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'TopMenu',
  computed: {
    ...mapState('top-menu', ['topMenuList', 'isTopMenuShow']),
    currentTopMenuKey: {
      get() {
        return this.$store.state['top-menu'].currentTopMenuKey
      },
      set(val) {
        this.$store.commit('top-menu/setCurrentTopMenuKey', val)
      }
    },
    selectedKeys: function() {
      return [this.currentTopMenuKey]
    }
  },
  async created() {
    await this.listTopMenu()

    // 如果浏览器中保存的当前顶部菜单记录已经不存在了，则使用第一个顶部菜单
    if (!this.topMenuList.some(topMenu => topMenu.id === this.currentTopMenuKey)) {
      if (this.topMenuList.length > 0) {
        this.currentTopMenuKey = this.topMenuList[0].id
      } else {
        this.currentTopMenuKey = ''
      }
    }

    await this.listSideMenuWithTree(this.currentTopMenuKey)
  },
  methods: {
    ...mapActions('top-menu', ['listTopMenu']),
    ...mapActions('side-menu', ['listSideMenuWithTree']),
    onClick(item) {
      this.currentTopMenuKey = item.key
      this.listSideMenuWithTree(this.currentTopMenuKey)
    }
  }
}
</script>
<style lang="less" scoped>
.topMenuWarp{
  padding: 6px 0;
  flex: 1 1;
  overflow-x: hidden;
}
</style>
