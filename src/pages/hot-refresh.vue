<script>
export default {
  name: 'HotRefresh',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$router.replace({
        path: from.path,
        query: from.query,
        params: from.params
      })
    })
  },
  render() {
    return (<a-spin />)
  }
}
</script>

<style lang="less" scoped>

</style>
