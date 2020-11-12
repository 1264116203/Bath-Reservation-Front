<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <a-form-model ref="searchForm" layout="inline" :model="searchInfo">
      <a-form-model-item label="服务id" prop="serviceId">
        <a-input v-model="searchInfo.serviceId" placeholder="服务id" />
      </a-form-model-item>
      <a-form-model-item label="服务host" prop="serverHost">
        <a-input v-model="searchInfo.serverHost" placeholder="服务host" />
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

    <a-space class="operation-btn-container" />

    <a-table
      bordered
      row-key="id"
      :columns="columns"
      :pagination="pagination"
      :data-source="tableData"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      @change="onTableChange"
    >
      <template #momentTime="text">
        <span>{{ text | momentTime }}</span>
      </template>
      <template #operation="text, record">
        <a-space class="editable-row-operations">
          <a @click="openDetailModal(record.id)">
            <a-icon type="eye" />查看
          </a>
        </a-space>
      </template>
    </a-table>

    <edit-modal ref="modal" @ok="onModalOk" />
  </a-spin>
</template>

<script>
import { ListMixin } from '@/mixins/common-crud-mixin'
import { listApiLogWithPagination } from '@/api/system/logs'
import EditModal from './api-log-modal'

const columns = [{
  title: '服务id',
  dataIndex: 'serviceId'
}, {
  title: '服务host',
  dataIndex: 'serverHost'
}, {
  title: '服务ip',
  dataIndex: 'serverIp'
}, {
  title: '软件环境',
  dataIndex: 'env'
}, {
  title: '日志名',
  dataIndex: 'title'
}, {
  title: '请求方法',
  dataIndex: 'method'
}, {
  title: '请求接口',
  dataIndex: 'requestUri'
}, {
  title: '日志时间',
  dataIndex: 'createTime',
  scopedSlots: { customRender: 'momentTime' }
}, {
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: { customRender: 'operation' }
}]

export default {
  name: 'ApiLogIndex',
  components: { EditModal },
  mixins: [ListMixin],
  data() {
    return {
      searchInfo: {
        serviceId: '',
        serverHost: ''
      },
      columns
    }
  },
  created() {
    this.setup({
      axiosListWithPagination: listApiLogWithPagination
    })
    this.fetchTableData()
  }
}
</script>
