export default {
  methods: {
    getSelectedParentKeys() {
      const parentKeys = []
      const getParent = elem => {
        if (this.selectedRowKeys.indexOf(elem.id) !== -1) {
          parentKeys.push(elem.id)
        } else {
          if (elem.children && elem.children.length > 0) {
            elem.children.forEach(getParent)
          }
        }
      }
      this.tableData.forEach(getParent)
      return parentKeys
    }
  }
}
