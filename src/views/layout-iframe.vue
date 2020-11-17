<template>
  <span>我不可见！</span>
</template>

<script>
export default {
  name: 'LayoutIframe',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.isIframeShow = true
    })
  },
  beforeRouteLeave(to, from, next) {
    this.isIframeShow = false
    next()
  },
  computed: {
    isIframeShow: {
      get () {
        return this.$store.state.tab.isIframeShow
      },
      set (val) {
        this.$store.commit('tab/setIframeShow', val)
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
