<template>
  <div class="topMenuWarp">
    <a-menu v-if="showTopMenu" v-model="current" mode="horizontal" @click="onClick">
      <a-menu-item v-for="item in topMenuList" :key="item.id">
        <a-icon :type="item.source" />{{ item.name }}
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
import { listCurrentUserMenuWithTree } from '@/api/system/authority'
import { listForCurrent } from '@/api/system/top-menu'

export default {
  name: 'TopMenu',
  data() {
    return {
      current: [],
      topMenuList: [],
      showTopMenu: true
    }
  },
  computed: {
    currentMenuId: {
      get() {
        return this.$store.state.user.currentMenuId
      }
    }
  },
  created() {
    listForCurrent().then(res => {
      this.topMenuList = res.data
      /** 数据从小到大排序 */
      this.topMenuList.sort(function(a, b) {
        return a.sort - b.sort
      })
      this.current.length = 0
      if (this.topMenuList.length <= 1) {
        this.showTopMenu = false
      } else {
        this.showTopMenu = true
        let firstId = ''
        if (this.currentMenuId) {
          firstId = this.currentMenuId
        } else {
          firstId = this.topMenuList[0].id
        }
        this.current.push(firstId)
        listCurrentUserMenuWithTree(firstId).then(res => {
          this.$store.commit('user/SET_MENU_LIST', res.data)
        })
      }
    })
  },
  methods: {
    onClick(item) {
      this.$store.commit('user/SET_CURRENT_MENU_ID', item.key)
      listCurrentUserMenuWithTree(item.key).then(res => {
        this.$store.commit('user/SET_MENU_LIST', res.data)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.topMenuWarp{
  padding: 6px 0;
}
</style>
