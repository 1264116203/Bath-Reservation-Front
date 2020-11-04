import { mapActions, mapMutations, mapState } from 'vuex'
import { isUrl } from '@/util/validate'

/**
 * 标签页混入模块
 */
export const TabPanelMixin = {
  computed: {
    ...mapState('tab', ['tabList'])
  },
  methods: {
    ...mapMutations('tab', ['switchTab', 'closeTab', 'closeOther', 'closeAll']),
    ...mapActions('tab', ['navTo']),


  }
}
