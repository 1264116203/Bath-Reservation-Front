<template>
  <a-config-provider :locale="zhCN">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  name: 'App',
  components: {},
  data () {
    return {
      zhCN
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
