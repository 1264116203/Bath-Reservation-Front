<template>
  <span>
    <a-tag v-for="name in limited" :key="name" class="with-margin-bottom" color="blue">
      {{ name }}
    </a-tag>
  </span>
</template>

<script>
export default {
  name: 'LimitedTags',
  props: {
    rawName: {
      type: String,
      required: true
    },
    limit: {
      type: Number,
      default: 20
    }
  },
  computed: {
    limited() {
      if (this.rawName.length < this.limit) {
        return this.rawName.split(',')
      } else {
        const result = this.rawName.substr(0, 20).split(',')
        result.splice(-1, 1)
        result.push('...')
        return result
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .with-margin-bottom {
    margin-bottom: 0.5rem;
  }
</style>
