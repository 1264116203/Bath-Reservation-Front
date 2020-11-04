<template>
  <div class="logo">
    <span v-if="!isCollapse" class="title">{{ application.title }}</span>
    <span v-else class="subtitle">{{ application.subtitle }}</span>
  </div>
</template>

<script>
import application from '@/config/application'
import { mapState } from 'vuex'

export default {
  name: 'TopLogo',
  data() {
    return {
      application
    }
  },
  computed: {
    ...mapState('common', ['isCollapse'])
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
