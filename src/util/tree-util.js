/** 设置Tree当前节点和自己子节点不可选 */
export function disableNode(currentId, treeData) {
  for (let i = 0; i < treeData.length; i++) {
    const found = _findNode(currentId, treeData[i])
    if (found) {
      _disableNode(found)
      break
    }
  }
}

/** 找当前节点 */
function _findNode(id, node) {
  if (node.id === id) {
    return node
  }

  if (node.children) {
    let found
    for (let i = 0; i < node.children.length; i++) {
      found = _findNode(id, node.children[i])
      if (found) {
        return found
      }
    }
    return undefined
  }
}

/** 节点不可选 */
function _disableNode(node) {
  node.disabled = true
  if (node.children) {
    node.children.forEach(_disableNode)
  }
}

/** 找出两个数组不同元素 */
export function _getArrDifference(arr1, arr2) {
  return arr1.concat(arr2).filter((v, i, arr) => {
    return arr.indexOf(v) === arr.lastIndexOf(v)
  })
}

/** A数组中与B数组相同的项删除 */
export function _deleteSame (arr1, arr2) {
  return arr1.filter(item => !arr2.includes(item))
}

/** 判断一个数组是不是包含另一个数组 */
export function _includes(arr1, arr2) {
  if (arr2 && arr2.length === 0) {
    return true
  }
  return arr2.every(item => arr1.includes(item))
}

/** 找出所有后代 */
export function _findChildren(id, dataList) {
  for (let i = 0; i < dataList.length; i++) {
    const found = _findNode(id, dataList[i])
    if (found) {
      return _findNodeChildren(found)
    }
  }
  return []
}

/** 节点的子集 */
function _findNodeChildren(node, arr = []) {
  arr.push(node)
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      _findNodeChildren(node.children[i], arr)
    }
  }
  return arr
}

/** 找出所有父节点 */
export function _findParent(id, dataList, arr = []) {
  const node = _findNodeById(id, dataList)
  if (node) {
    arr.push(node)
    if (node.parentId) {
      _findParent(node.parentId, dataList, arr)
    }
  }
  return arr
}

/** 根据id找节点 */
export function _findNodeById (id, dataList) {
  for (let i = 0; i < dataList.length; i++) {
    const found = _findNode(id, dataList[i])
    if (found) {
      return found
    }
  }
  return undefined
}

/** 父节点选中 */
export function _parentsChecked(node, allSelectIds, tableDataList) {
  const parentId = node.parentId
  if (!parentId || parentId === '0') {
    return
  }

  const childrenIdlistTemp = _findChildren(parentId, tableDataList).map(item => item.id).filter(id => id !== parentId)
  if (!_includes(allSelectIds, childrenIdlistTemp)) {
    return
  }
  allSelectIds.push(parentId)
  const parentNode = _findNodeById(parentId, tableDataList)
  if (parentNode) {
    _parentsChecked(parentNode, allSelectIds, tableDataList)
  }
}

/**
 * 在树形结构中递归查找某个key对应的节点数据
 *
 * @param list 要查询的森林数组
 * @param value 作为查询的值
 * @param key 作为查询的属性名
 */
export function deepSearch(list, value, key = 'id') {
  const found = list.find(val => val[key] === value)
  if (!found) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].children) {
        const result = deepSearch(list[i].children, value, key)
        if (result) {
          return result
        }
      }
    }
  }
  return found
}

/**
 * 遍历树形节点的每个节点（包含子节点）
 * @param list { Array } 树形数组（森林）
 * @param fun { Function } 遍历方法
 */
export function deepForEach(list, fun) {
  function subFun(elem) {
    if (elem.children && elem.children.length) {
      elem.children.forEach(subFun)
    }
    fun(elem)
  }
  list.forEach(subFun)
}

/**
 * 遍历按等级实现树形排序
 * @param list { Array } 树形数组（森林）
 * @param sortFun { Function } 排序方法
 */
export function deepSort(list, sortFun) {
  deepForEach(list, (elem) => {
    if (elem.children && elem.children.length) {
      elem.children.sort(sortFun)
    }
  })
  list.sort(sortFun)
}
