<template>
  <a-layout-footer class="view-layout-footer">
    <div>RCDCore-Front V2.0</div>
    <div>烟台东方瑞创达电子科技有限公司北京分公司 &copy;2021</div>
  </a-layout-footer>
</template>

<script>
export default {
  name: 'LayoutFooter'
}
</script>

<style lang="less" scoped>
.view-layout-footer {
  text-align: center;
  padding: 1em 0 !important;
  background-color: darken(@layout-body-background, 10%) !important;
}
</style>
