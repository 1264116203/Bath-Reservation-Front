/**
 * 来自 Ant Design Vue 的树形结构半选工具方法
 */
export function conductCheck(keyList, isCheck, treeDataList, checkStatus = {}) {
  const checkedKeys = new Map()
  const halfCheckedKeys = new Map(); // Record the key has some child checked (include child half checked)

  (checkStatus.checkedKeys || []).forEach(key => {
    checkedKeys.set(key, true)
  });

  (checkStatus.halfCheckedKeys || []).forEach(key => {
    halfCheckedKeys.set(key, true)
  })

  function _findNode(key, list) {
    if (!key || key === '0') {
      return null
    }
    for (const item of list) {
      if (item.id === key) {
        return item
      }
      if (item.children && item.children.length > 0) {
        const found = _findNode(key, item.children)
        if (found) {
          return found
        }
      }
    }
    return null
  }

  // Conduct up
  function conductUp(key) {
    if (checkedKeys.get(key) === isCheck) return

    const entity = _findNode(key, treeDataList)
    if (!entity) return

    const { children } = entity
    const parent = _findNode(entity.parentId, treeDataList)

    // Check child node checked status
    let everyChildChecked = true
    let someChildChecked = false; // Child checked or half checked

    (children || [])
      .forEach(({ key: childKey }) => {
        const childChecked = checkedKeys.get(childKey)
        const childHalfChecked = halfCheckedKeys.get(childKey)

        if (childChecked || childHalfChecked) someChildChecked = true
        if (!childChecked) everyChildChecked = false
      })

    // Update checked status
    if (isCheck) {
      checkedKeys.set(key, everyChildChecked)
    } else {
      checkedKeys.set(key, false)
    }
    halfCheckedKeys.set(key, someChildChecked)

    if (parent) {
      conductUp(parent.key)
    }
  }

  // Conduct down
  function conductDown(key) {
    if (checkedKeys.get(key) === isCheck) return

    const entity = _findNode(key, treeDataList)
    if (!entity) return

    const { children } = entity

    checkedKeys.set(key, isCheck);

    (children || []).forEach(child => {
      conductDown(child.key)
    })
  }

  function conduct(key) {
    const entity = _findNode(key, treeDataList)

    if (!entity) {
      return
    }
    const { children } = entity
    const parent = _findNode(entity.parentId, treeDataList)
    checkedKeys.set(key, isCheck);

    // Conduct down
    (children || [])
      .forEach(child => {
        conductDown(child.key)
      })

    // Conduct up
    if (parent) {
      conductUp(parent.key)
    }
  }

  (keyList || []).forEach(key => {
    conduct(key)
  })

  const checkedKeyList = []
  const halfCheckedKeyList = []

  // Fill checked list
  for (const [key, value] of checkedKeys) {
    if (value) {
      checkedKeyList.push(key)
    }
  }

  // Fill half checked list
  for (const [key, value] of halfCheckedKeys) {
    if (!checkedKeys.get(key) && value) {
      halfCheckedKeyList.push(key)
    }
  }

  return {
    checkedKeys: checkedKeyList,
    halfCheckedKeys: halfCheckedKeyList
  }
}
