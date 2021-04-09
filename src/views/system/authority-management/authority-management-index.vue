<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <a-form-model ref="searchForm" layout="inline" :model="searchInfo">
      <a-form-model-item label="权限项名称" prop="name">
        <a-input v-model.trim="searchInfo.name" placeholder="权限项名称" />
      </a-form-model-item>
      <a-form-model-item label="权限项编码" prop="code">
        <a-input v-model.trim="searchInfo.code" placeholder="权限项编码" />
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
      <template #icon="text, record">
        <a-icon v-if="record.icon" :type="record.icon" />
      </template>
    </a-table>

    <edit-modal ref="modal" :authority-tree-list="authorityTreeData" @ok="onModalOk" />
  </a-spin>
</template>
<script>
import { queryWithTree, batchRemove, removeById } from '@/api/system/authority'
import EditModal from './authority-management-modal'
import { ListMixin } from '@/mixins/common-crud-mixin'
import TreeListMixin from '@/mixins/tree-list-mixin'
import { deepSort } from '@/util/tree-util'
import { listAllWithTreeForTreeSelect as listAllAuthorityWithTree } from '@/api/common/authrority'

const columns = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '编码',
    dataIndex: 'code'
  },
  {
    title: '图标',
    dataIndex: 'source',
    scopedSlots: { customRender: 'icon' }
  },
  {
    title: '类型',
    dataIndex: 'category',
    customRender: (val) => {
      if (val === 1) {
        return '菜单项'
      } else {
        return '权限项'
      }
    }
  },
  {
    title: '路由地址',
    dataIndex: 'path'
  },
  {
    title: '排序',
    dataIndex: 'sort'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '15em',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  name: 'AuthorityManagementIndex',
  components: { EditModal },
  mixins: [ListMixin, TreeListMixin],
  data () {
    return {
      searchInfo: {
        name: '',
        code: ''
      },
      columns,
      authorityTreeData: []
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
      vm.authorityTreeData = await listAllAuthorityWithTree()
    })
  },
  methods: {
    /** 拉取表格数据的缺省函数，如果不符合预期，则由组件去实现 */
    async fetchTableData() {
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
            await this.axiosBatchDelete(this.getSelectedParentKeys().join(','))
            this.$message.success('操作成功!')
            resolve()
            await this.fetchTableData()
            this.authorityTreeData = await listAllAuthorityWithTree()
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
      this.authorityTreeData = await listAllAuthorityWithTree()
    },
    /** 弹框确定按钮触发的回调（拉取分页数据，查看详情时除外） */
    async onModalOk(type, payload) {
      if (type !== 'detail') {
        await this.fetchTableData()
        this.authorityTreeData = await listAllAuthorityWithTree()
      }
    }
  }
}
</script>
