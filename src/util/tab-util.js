import { diff } from '@/util/utils'
import application from '@/config/application'
const { firstPageCloseable, homepageTab } = application

export function tabDiff(tab1, tab2) {
  // const name = tab1.label === tab2.label
  const path = tab1.path === tab2.path
  const params = diff(tab1.params || {}, tab2.params || {})
  const query = diff(tab1.query || {}, tab2.query || {})
  // const meta = diff(tab1.meta, tab2.meta)

  return path && params && query
}

/**
 * 处理首个标签
 * @param list {[Tab]}
 */
export function handleTabCloseable(list) {
  if (list.length === 1) {
    list[0].closeable = false
  } else {
    list.forEach(ele => {
      if (firstPageCloseable) {
        ele.closeable = true
      } else {
        ele.closeable = !(ele.path === homepageTab.path)
      }
    })
  }
}
