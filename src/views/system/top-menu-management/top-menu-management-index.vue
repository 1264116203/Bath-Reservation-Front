<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <a-form-model ref="searchForm" layout="inline" :model="searchInfo">
      <a-form-model-item label="菜单名称" prop="name">
        <a-input v-model="searchInfo.name" placeholder="菜单名称" />
      </a-form-model-item>
      <a-form-model-item label="菜单编码" prop="code">
        <a-input v-model="searchInfo.code" placeholder="菜单编码" />
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
      :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="onTableChange"
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
          <a @click="onGrant(record.id)">
            <a-icon type="setting" />指定菜单项
          </a>
        </a-space>
      </template>
      <template #icon="text">
        <a-icon :type="text" />
      </template>
    </a-table>

    <edit-modal ref="modal" @ok="onModalOk" />

    <a-modal
      v-model="isGrantModalVisible"
      title="下级菜单配置"
      :mask-closable="false"
      @ok="onGrantOk"
    >
      <a-spin :spinning="isGrantTreeSpinning">
        <div class="grant-tree-container">
          <rcd-no-half-tree
            v-model="menuSelected"
            :tree-data="menuTreeList"
          />
        </div>
      </a-spin>
    </a-modal>
  </a-spin>
</template>

<script>
import { ListMixin } from '@/mixins/common-crud-mixin'
import EditModal from './top-menu-management-modal'
import { listWithPagination, batchRemove, grant, removeById } from '@/api/system/top-menu'
import {
  listAllMenuWithTreeForTreeSelect as listAllMenuWithTree,
  listMenuByTopMenuIdWithTree
} from '@/api/common/authrority'
import { deepForEach } from '@/util/tree-util'

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name'
  },
  {
    title: '菜单编码',
    dataIndex: 'code'
  },
  {
    title: '菜单图标',
    dataIndex: 'icon',
    scopedSlots: { customRender: 'icon' }
  },
  {
    title: '菜单排序',
    dataIndex: 'sort'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '24em',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'TopMenuManagementIndex',
  components: { EditModal },
  mixins: [ListMixin],
  data () {
    return {
      /** 搜索的条件  菜单名称 菜单编码 */
      searchInfo: {
        name: '',
        code: ''
      },
      columns,
      /** 权限设置 */
      isGrantTreeSpinning: false,
      isGrantModalVisible: false,
      menuSelected: [],
      menuTreeList: [],
      grantingRecordId: ''
    }
  },
  created() {
    this.setup({
      axiosDeleteRecord: removeById,
      axiosBatchDelete: batchRemove,
      axiosListWithPagination: listWithPagination
    })
    this.fetchTableData()
  },
  beforeRouteEnter (to, from, next) {
    next(async vm => {
      vm.menuTreeList = await listAllMenuWithTree()
    })
  },
  methods: {
    /** 拉取表格数据的缺省函数，如果不符合预期，则由组件去实现 */
    async fetchTableData () {
      this.isLoading = true
      try {
        const data = (await this.axiosListWithPagination(this.pagination.current - 1, this.pagination.pageSize, this.searchInfo)).data
        this.tableData = data.content
        /** 数据从小到大排序 */
        this.tableData.sort(function(a, b) {
          return a.sort - b.sort
        })
        this.pagination.total = data.totalElements
      } catch (error) {
        console.error(error)
      }
      this.isLoading = false
    },
    /** 设置权限 */
    async onGrant(id) {
      this.isGrantTreeSpinning = true
      this.isGrantModalVisible = true
      this.grantingRecordId = id

      try {
        const tree = (await listMenuByTopMenuIdWithTree(id)).data
        const keyList = []
        deepForEach(tree, item => {
          keyList.push(item.id)
        })
        this.menuSelected = keyList
      } finally {
        this.isGrantTreeSpinning = false
      }
    },
    async onGrantOk() {
      try {
        await grant(this.menuSelected, [this.grantingRecordId])
      } finally {
        this.$message.success('操作成功')
        this.isGrantModalVisible = false
      }
    }
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
