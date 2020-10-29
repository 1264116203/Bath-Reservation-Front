import Vue from 'vue'
import * as moment from 'moment'

Vue.filter('momentTime', function (value, pattern = 'YYYY-MM-DD') {
  if (!value) return ''

  return moment(value).format(pattern)
})
