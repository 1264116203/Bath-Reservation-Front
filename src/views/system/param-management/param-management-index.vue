<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <a-form-model ref="searchForm" layout="inline" :model="searchInfo">
      <a-form-model-item label="参数名称" prop="name">
        <a-input v-model="searchInfo.name" placeholder="参数名称" />
      </a-form-model-item>

      <a-form-model-item label="参数键名" prop="paramKey">
        <a-input v-model="searchInfo.paramKey" placeholder="参数键名" />
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
      :pagination="pagination"
      :data-source="tableData"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      @change="onTableChange"
    >
      <template #operation="text, record">
        <a-space>
          <a @click="openDetailModal(record.id)">
            <a-icon type="eye" /> 查看
          </a>
          <a @click="openUpdateModal(record.id)">
            <a-icon type="edit" /> 修改
          </a>
          <a-popconfirm title="是否删除?" @confirm="commonDeleteRecord(record.id)">
            <a>
              <a-icon type="delete" /> 删除
            </a>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>

    <edit-modal ref="modal" @ok="onModalOk" />
  </a-spin>
</template>

<script>
import {
  listWithPagination,
  batchRemove,
  removeById
} from '@/api/system/param'
import EditModal from './param-management-modal'
import { ListMixin } from '@/mixins/common-crud-mixin'

const columns = [{
  title: '参数名称',
  dataIndex: 'name'
}, {
  title: '参数键名',
  dataIndex: 'paramKey'
}, {
  title: '参数键值',
  dataIndex: 'paramValue'
}, {
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: { customRender: 'operation' }
}]

export default {
  name: 'ParamList',
  components: { EditModal },
  mixins: [ListMixin],
  data() {
    return {
      /** 查询条件 */
      searchInfo: {
        name: '',
        paramKey: ''
      },
      columns
    }
  },
  created() {
    this.setup({
      axiosListWithPagination: listWithPagination,
      axiosDeleteRecord: removeById,
      axiosBatchDelete: batchRemove
    })
    this.fetchTableData()
  }
}
</script>
