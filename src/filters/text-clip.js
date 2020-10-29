import Vue from 'vue'

Vue.filter('textClip', function (value, clipNum) {
  if (!value) return ''
  value = value.toString()
  if (value.length < clipNum) {
    return value
  }
  return value.substring(0, clipNum) + '...'
})
