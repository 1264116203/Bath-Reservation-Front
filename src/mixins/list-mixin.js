import { deepClone } from '@/util/utils'
import {
  _getArrDifference, _findChildren, _findParent, _includes, _deleteSame, _parentsChecked
} from '@/util/tree-util'
import { ACTION_TYPE } from '@/config/constants'
import moment from 'moment'
export default {
  data() {
    return {
      /** 分页列表数据 */
      tableData: [],
      /** 页面是否加载 */
      isLoading: false,
      /** 列表中选中的记录的主键集合 */
      selectedRowKeys: [],
      pagination: {
        total: 200,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true
      },

      axiosListWithPagination: function (page, size, queryParam) {},
      axiosDeleteRecord: function (id) {},
      axiosBatchDelete: function (ids) {}
    }
  },
  methods: {
    setup(options) {
      Object.assign(this, options)
    },
    /** 拉取表格数据的缺省函数，如果不符合预期，则由组件去实现 */
    async fetchTableData () {
      this.isLoading = true
      try {
        const data = (await this.axiosListWithPagination(this.pagination.current - 1, this.pagination.pageSize, this.searchInfo)).data
        this.form = data.content[0]
        this.cleanTime = moment(this.form.cleanTime, 'HH:mm:ss')
        this.openingTime = moment(this.form.openingTime, 'HH:mm:ss')
        this.closingTime = moment(this.form.closingTime, 'HH:mm:ss')
        this.timeInterval = moment(this.form.timeInterval, 'HH:mm:ss')
        this.extraPackageTime = moment(this.form.extraPackageTime, 'HH:mm:ss')
        this.storePhoto = this.form.storePhoto || ''
        this.pagination.total = data.totalElements
      } catch (error) {
        console.error(error)
      }
      this.isLoading = false
    },
    openCreateModal() {
      this.$refs.modal.open(ACTION_TYPE.CREATION)
    },
    openUpdateModal(id) {
      this.$refs.modal.open(ACTION_TYPE.UPDATE, id)
    },
    openDetailModal(id) {
      this.$refs.modal.open(ACTION_TYPE.DETAIL, id)
    },
    /**
     * 响应 AntD 的 Table 组件自身的数据变化（分页页码等）
     * @param pagination 新的分页数据
     */
    onTableChange(pagination) {
      this.pagination = deepClone(pagination)
      this.fetchTableData()
    },
    /** 弹框确定按钮触发的回调（拉取分页数据，查看详情时除外） */
    onModalOk(type, payload) {
      if (type !== 'detail') {
        this.fetchTableData()
      }
    },
    /**
     * 列表的选择项变化触发的回调
     * 默认的 AntD 的 Table 不会对树形列表的选择做级联选择，该方法便是相关操作的实现
     */
    onSelectChange (selectedRowKeys, selectedRows) {
      /** 全部取消选中 */
      if (selectedRowKeys && selectedRowKeys.length === 0) {
        this.selectedRowKeys = []
        return
      }
      /** 当前点击的ID */
      const id = _getArrDifference(selectedRowKeys, this.selectedRowKeys)[0]
      /** 所有子集包括自己的ID */
      const childrenId = _findChildren(id, this.tableData).map(item => item.id)
      /** 所有父级的ID */
      const parentIds = _findParent(id, this.tableData).map(item => item.parentId)
      /** 判断当前点击的是否在以选中的数组 */
      if (_includes(this.selectedRowKeys, childrenId)) {
        /** 取消选中，自己，子集，父级 */
        this.selectedRowKeys = _deleteSame(this.selectedRowKeys, parentIds.concat(childrenId))
      } else {
        /** 选中，自己，子集，父级 */
        /** 保存已选中的 */
        const allSelectedIds = [...selectedRowKeys]
        /** 选中自己的子集 */
        if (childrenId && childrenId.length > 0) {
          allSelectedIds.push(...childrenId)
        }
        /** 当前节点 */
        const currentNode = selectedRows[0]
        /** 选中自己的父级 */
        _parentsChecked(currentNode, allSelectedIds, this.tableData)
        this.selectedRowKeys = [...new Set(allSelectedIds)]
      }
    },
    /**
     * 默认的批量删除方法
     */
    commonBatchDelete() {
      return new Promise((resolve, reject) => {
        if (this.selectedRowKeys.length === 0) {
          this.$message.warning('请选择至少一条数据')
          reject(new Error('请选择至少一条数据'))
          return
        }

        this.$confirm({
          title: '系统提示',
          content: '确定将选择数据删除?',
          okText: '是',
          okType: 'danger',
          cancelText: '否',
          onOk: async () => {
            await this.axiosBatchDelete(this.selectedRowKeys.join(','))
            this.$message.success('操作成功!')
            this.selectedRowKeys = []
            resolve()
            await this.fetchTableData()
          }
        })
      })
    },
    /**
     * 默认的单个删除方法
     *
     * @param id 要删除的记录的ID
     */
    async commonDeleteRecord (id) {
      await this.axiosDeleteRecord(id)
      this.$message.success('操作成功!')
      await this.fetchTableData()
    },
    async onSearch() {
      this.pagination.current = 1
      await this.fetchTableData()
    },
    /** 清空按钮事件 */
    async clearSearch() {
      this.$refs.searchForm.resetFields()
      this.pagination.current = 1
      await this.fetchTableData()
    }
  }
}
