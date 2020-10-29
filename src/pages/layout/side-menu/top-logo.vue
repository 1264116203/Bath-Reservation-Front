<template>
  <div class="logo">
    <span v-if="!isCollapse" class="title">{{ website.title }}</span>
    <span v-else class="subtitle">{{ website.subtitle }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TopLogo',
  computed: {
    ...mapGetters(['website', 'isCollapse'])
  }
}
</script>

<style lang="less" scoped>
  .logo {
    margin: 16px;
    text-align: center;
    color: #fff;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    .title {
      font-size: 20px;
    }
    .subtitle {
      font-size: 18px;
      font-weight: 700;
    }
  }
</style>
