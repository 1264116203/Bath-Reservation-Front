<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <a-form-model ref="searchForm" layout="inline" :model="searchInfo">
      <a-form-model-item label="组织机构名称" prop="deptName">
        <a-input v-model="searchInfo.deptName" placeholder="组织机构名称" />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="onSearch">
          搜索
        </a-button>
      </a-form-model-item>
      <a-form-model-item>
        <a-button @click="clearSearch">
          清空
        </a-button>
      </a-form-model-item>
    </a-form-model>

    <a-space class="operation-btn-container">
      <a-button type="primary" @click="openCreateModal">
        添加
      </a-button>
      <a-button type="danger" @click="commonBatchDelete">
        批量删除
      </a-button>
    </a-space>

    <a-table
      bordered
      row-key="id"
      :columns="columns"
      :pagination="false"
      :data-source="tableData"
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
    >
      <template #operation="text, record">
        <a-space class="editable-row-operations">
          <a @click="openDetailModal(record.id)">
            <a-icon type="eye" />查看
          </a>
          <a @click="openUpdateModal(record.id)">
            <a-icon type="edit" />修改
          </a>
          <a-popconfirm title="是否删除?" @confirm="commonDeleteRecord(record.id)">
            <a><a-icon type="delete" />删除</a>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>

    <edit-modal ref="modal" :dept-list="deptTreeData" @ok="onModalOk" />
  </a-spin>
</template>

<script>
import {
  listAllWithTree,
  queryWithTree,
  batchRemove,
  removeById
} from '@/api/system/dept'
import EditModal from './dept-management-modal'
import { ListMixin } from '@/mixins/common-crud-mixin'
import { deepSort } from '@/util/tree-util'

const columns = [
  {
    title: '组织机构名',
    dataIndex: 'title'
  },
  {
    title: '组织机构全称',
    dataIndex: 'fullName'
  },
  {
    title: '组织机构编码',
    dataIndex: 'alias'
  },
  {
    title: '组织机构类别',
    dataIndex: 'category'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'DeptList',
  components: { EditModal },
  mixins: [ListMixin],
  data () {
    return {
      searchInfo: {
        deptName: ''
      },
      columns,
      deptTreeData: []
    }
  },
  created() {
    this.setup({
      axiosDeleteRecord: removeById,
      axiosBatchDelete: batchRemove
    })
    this.fetchTableData()
  },
  beforeRouteEnter (to, from, next) {
    next(async vm => {
      await vm.getDeptTreeData()
    })
  },
  methods: {
    /** 表格数据 */
    async fetchTableData () {
      this.isLoading = true
      try {
        const data = (await queryWithTree(this.searchInfo)).data
        deepSort(data, (a, b) => {
          const sa = a.sort ? a.sort : 100
          const sb = b.sort ? b.sort : 100
          return sa - sb
        })
        this.tableData = data
      } finally {
        this.isLoading = false
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
            resolve()
            await this.fetchTableData()
            await this.getDeptTreeData()
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
      await this.getDeptTreeData()
    },
    async onModalOk(type, payload) {
      if (type !== 'detail') {
        await this.fetchTableData()
        await this.getDeptTreeData()
      }
    },
    async getDeptTreeData() {
      this.deptTreeData = (await listAllWithTree()).data
    }
  }
}
</script>

<style scoped>

</style>
