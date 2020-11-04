<template>
  <div style="height: 100%">
    <iframe v-for="item in iframeTabList"
            v-show="item.key === activeTabKey"
            :key="item.key" :src="item.path" class="iframe"
    ></iframe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'RCoreIframe',
  computed: {
    activeTabKey: {
      get() {
        return this.$store.state.tabs.activeTabKey
      }
    },
    ...mapGetters('tab', ['iframeTabList'])
  }
}
</script>

<style lang="less">
  .iframe {
    width: 100%;
    height: 100%;
    border: 0;
    overflow: hidden;
    box-sizing: border-box;
  }
</style>
