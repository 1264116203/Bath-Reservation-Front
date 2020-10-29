<template>
  <span>我不可见！</span>
</template>

<script>
export default {
  name: 'RouterIframe',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.isIframeShow = true
    })
  },
  computed: {
    isIframeShow: {
      get () {
        return this.$store.state.tabs.isIframeShow
      },
      set (val) {
        this.$store.commit('tabs/UPDATE_IS_IFRAME_SHOW', val)
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
