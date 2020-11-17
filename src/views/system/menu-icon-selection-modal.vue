<template>
  <a-modal v-model="isVisible" width="600px" title="请选择图标">
    <a-tabs type="card">
      <a-tab-pane v-for="(group, gIndex) in menuIconList"
                  :key="gIndex"
                  :tab="group.label"
      >
        <a-icon v-for="(item, index) in group.list"
                :key="index"
                :type="item"
                class="menu-icon"
                @click="onIconSelected(item)"
        />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import menuIconList from '@/config/menu-icon-list'

export default {
  name: 'MenuIconSelectionModal',
  data() {
    return {
      isVisible: false,
      menuIconList
    }
  },
  methods: {
    open() {
      this.isVisible = true
    },
    onIconSelected(item) {
      this.$emit('selected', item)
      this.isVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.menu-icon {
  width: 20px;
  height: 20px;
  margin: 10px;
  font-size: 14px;
  text-align: center;
  line-height: 25px;
}

.menu-icon:hover {
  background-color: @primary-color;
  border-radius: 2px;
  color: white;
}
</style>
