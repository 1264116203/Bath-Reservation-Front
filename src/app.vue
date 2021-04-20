<template>
  <a-config-provider :locale="zhCN">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { getStore } from '@/util/browser-storage-util'
export default {
  name: 'App',
  components: {},
  data () {
    return {
      zhCN
    }
  },
  mounted() {
    window.addEventListener('focus', this.refreshWhenUserChanged)
  },
  methods: {
    refreshWhenUserChanged() {
      const userInfo = this.$store.state.auth.userInfo
      const realUser = getStore('userInfo')

      if (userInfo?.id !== realUser?.id) {
        document.location.reload(true)
      }
    }
  }
}
</script>

<style lang="less">
#app {
  font-family: 'PingFang SC', 'Microsoft YaHei', '微软雅黑', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
