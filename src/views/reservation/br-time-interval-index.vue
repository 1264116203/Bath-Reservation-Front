<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <a-form-model ref="searchForm" layout="inline" :model="searchInfo">
      <!-- 在此处添加查询条件 -->
      <!--<a-form-model-item label="参数名称" prop="paramName">
        <a-input v-model="searchInfo.paramName" placeholder="参数名称" />
      </a-form-model-item>-->

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
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="onTableChange"
    >
      <template #momentTime="text">
        <span>{{ text | momentTime }}</span>
      </template>
      <template #operation="text, record">
        <a-space class="editable-row-operations">
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
} from '@/api/reservation/br-time-interval'
import EditModal from './br-time-interval-modal'
import { ListMixin } from '@/mixins/common-crud-mixin'

const columns = [
  {
    title: '预约开始时间',
    dataIndex: 'startTime',
    scopedSlots: { customRender: 'momentTime' }
  },
  {
    title: '预约结束时间',
    dataIndex: 'endTime',
    scopedSlots: { customRender: 'momentTime' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '24em',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'BrTimeIntervalList',
  components: { EditModal },
  mixins: [ListMixin],
  data() {
    return {
      /** 查询条件 */
      searchInfo: {},
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

<style lang="less" scoped>
  .grant-tree-container {
    height: 50vh;
    min-height: 300px;
    overflow-y: auto
  }
</style>
