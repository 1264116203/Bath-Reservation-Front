<template>
  <a-tree
    v-model="innerCheckedKeys"
    :tree-data="treeData"
    checkable
    check-strictly
    default-expand-all
    @check="onCheck"
  />
</template>

<script>
import { conductCheck } from '@/util/tree-util'

/**
 * 无半选状态的树形选择组件
 */
export default {
  name: 'NoHalfTree',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    treeData: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      innerCheckedKeys: {
        checked: [],
        halfChecked: []
      }
    }
  },
  watch: {
    value: function(value) {
      this.innerCheckedKeys = {
        checked: value,
        halfChecked: []
      }
    },
    innerCheckedKeys: function (value) {
      this.$emit('input', value.checked)
    }
  },
  created() {
    this.innerCheckedKeys = {
      checked: this.value,
      halfChecked: []
    }
  },
  methods: {
    onCheck(_, event) {
      const checked = event.checked
      const key = event.node.value

      const result = conductCheck([key], checked, this.treeData, {
        checkedKeys: this.innerCheckedKeys.checked,
        halfCheckedKeys: this.innerCheckedKeys.halfChecked
      })

      this.innerCheckedKeys = {
        checked: [...result.checkedKeys, ...result.halfCheckedKeys],
        halfChecked: []
      }
      this.$emit('check', this.innerCheckedKeys.checked)
    }
  }

}
</script>
