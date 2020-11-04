import application from '@/config/application'
import { validateNull } from '@/util/validate-util'

const keyName = application.key + '-'

/**
 * 存储localStorage
 *
 * @param name 要存入localStorage的对象键名
 * @param content 要存入localStorage的对象内容
 * @param storageType 可用值 session/local
 */
export const setStore = (name, content, storageType = 'session') => {
  name = keyName + name
  const obj = {
    dataType: typeof (content),
    content: content,
    type: storageType,
    datetime: new Date().getTime()
  }
  if (storageType === 'session') {
    window.sessionStorage.setItem(name, JSON.stringify(obj))
  } else {
    window.localStorage.setItem(name, JSON.stringify(obj))
  }
}

/**
 * 获取localStorage / sessionStorage值，优先读取sessionStorage
 *
 * @param name 属性名
 * @param raw 是否获取原始对象
 */
export const getStore = (name, raw = false) => {
  name = keyName + name
  let obj = window.sessionStorage.getItem(name)
  if (validateNull(obj)) obj = window.localStorage.getItem(name)
  if (validateNull(obj)) return

  try {
    obj = JSON.parse(obj)
  } catch {
    return obj
  }

  if (raw) {
    return obj
  }

  if (obj.dataType === 'string') {
    return obj.content
  } else if (obj.dataType === 'number') {
    return Number(obj.content)
  } else if (obj.dataType === 'boolean') {
    return obj.content
  } else if (obj.dataType === 'object') {
    return obj.content
  }
}

/**
 * 删除localStorage / sessionStorage值，优先读取sessionStorage
 *
 * @param name 属性名
 * @param storageType 可用值 session/local
 */
export const removeStore = (name, storageType = 'session') => {
  name = keyName + name
  if (storageType === 'session') {
    window.sessionStorage.removeItem(name)
  } else {
    window.localStorage.removeItem(name)
  }
}

/**
 * 获取全部
 *
 * @param storageType 可用值 session/local
 */
export const getAll = (storageType = 'session') => {
  const list = []
  if (storageType) {
    for (let i = 0; i <= window.sessionStorage.length; i++) {
      list.push({
        name: window.sessionStorage.key(i),
        content: getStore(window.sessionStorage.key(i), 'session')
      })
    }
  } else {
    for (let i = 0; i <= window.localStorage.length; i++) {
      list.push({
        name: window.localStorage.key(i),
        content: getStore(window.sessionStorage.key(i), 'local')
      })
    }
  }
  return list
}

/**
 * 清空全部
 *
 * @param storageType 可用值 session/local
 */
export const clearAll = (storageType) => {
  if (storageType === 'session') {
    window.sessionStorage.clear()
  } else {
    window.localStorage.clear()
  }
}
