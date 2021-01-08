<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <a-form-model ref="searchForm" layout="inline" :model="searchInfo">
      <a-form-model-item label="字典名称" prop="name">
        <a-input v-model="searchInfo.name" placeholder="字典名称" />
      </a-form-model-item>
      <a-form-model-item label="字典编码" prop="code">
        <a-input v-model="searchInfo.code" placeholder="字典编码" />
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
      :loading="isTableLoading"
      :columns="columns"
      :pagination="pagination"
      :data-source="tableData"
      :expanded-row-keys="expandedRowKeys"
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="onTableChange"
      @expand="onExpand"
    >
      <template #operation="text, record">
        <a-space>
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

      <a-table
        slot="expandedRowRender"
        slot-scope="row"
        class="no-border-table"
        size="small"
        row-key="dictKey"
        :columns="innerColumns"
        :data-source="innerData[row.id]"
        :pagination="false"
      />
    </a-table>

    <edit-modal ref="modal" @ok="onModalOk" />
  </a-spin>
</template>

<script>
import { ListMixin } from '@/mixins/common-crud-mixin'
import EditModal from './dict-management-modal'
import { listWithPagination, removeById, batchRemove, getById } from '@/api/system/dict'

const columns = [
  {
    title: '字典名称',
    dataIndex: 'name'
  },
  {
    title: '字典编码',
    dataIndex: 'code'
  },
  {
    title: '字典备注',
    dataIndex: 'remark'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '20em',
    scopedSlots: { customRender: 'operation' }
  }
]

const innerColumns = [
  {
    title: '字典项的键',
    dataIndex: 'dictKey'
  },
  {
    title: '字典项的值',
    dataIndex: 'dictValue'
  },
  {
    title: '字典项的类型',
    dataIndex: 'dictType'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  }
]

export default {
  name: 'DictManagementIndex',
  components: { EditModal },
  mixins: [ListMixin],
  data () {
    return {
      /** 搜索的条件  字典编码 字典名称 字典备注 */
      searchInfo: {
        code: '',
        name: '',
        remark: ''
      },
      columns,
      isTableLoading: false,
      innerColumns,
      innerData: {},
      expandedRowKeys: []
    }
  },
  created() {
    this.setup({
      axiosListWithPagination: listWithPagination,
      axiosDeleteRecord: removeById,
      axiosBatchDelete: batchRemove
    })
    this.fetchTableData()
  },
  methods: {
    /** 拉取表格数据的缺省函数，如果不符合预期，则由组件去实现 */
    async fetchTableData () {
      this.isLoading = true
      try {
        const data = (await this.axiosListWithPagination(this.pagination.current - 1, this.pagination.pageSize, this.searchInfo)).data
        this.tableData = data.content
        this.pagination.total = data.totalElements
        this.expandedRowKeys = []
      } catch (error) {
        console.error(error)
      }
      this.isLoading = false
    },
    /** 点击展开图标事件 */
    async onExpand(expanded, record) {
      if (!expanded) {
        const index = this.expandedRowKeys.findIndex(item => item === record.id)
        this.expandedRowKeys.splice(index, 1)
        return
      }
      const id = record.id
      this.isTableLoading = true
      try {
        const res = await getById(id)
        if (res.data.itemList && res.data.itemList.length > 0) {
          const innerData = res.data.itemList
          /** 表格数据从小到大排序 */
          innerData.sort((a, b) => a.sort - b.sort)
          this.$set(this.innerData, id, innerData)
          this.expandedRowKeys.push(record.id)
        }
      } finally {
        this.isTableLoading = false
      }
    }
  }
}
</script>
