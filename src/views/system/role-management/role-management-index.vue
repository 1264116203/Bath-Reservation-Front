<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <a-form-model ref="searchForm" layout="inline" :model="searchInfo">
      <a-form-model-item label="角色名称" prop="name">
        <a-input v-model.trim="searchInfo.name" placeholder="角色名称" />
      </a-form-model-item>
      <a-form-model-item label="角色编码" prop="code">
        <a-input v-model.trim="searchInfo.code" placeholder="角色编码" />
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
            <a-icon type="eye" />
            查看
          </a>
          <a @click="openUpdateModal(record.id)">
            <a-icon type="edit" />
            修改
          </a>
          <a-popconfirm title="是否删除?" @confirm="commonDeleteRecord(record.id)">
            <a><a-icon type="delete" />删除</a>
          </a-popconfirm>
          <a @click="onSetAuthority(record.id)">
            <a-icon type="setting" />
            授予权限
          </a>
          <a @click="onSetTopMenu(record.id)">
            <a-icon type="setting" />
            授予顶级菜单
          </a>
        </a-space>
      </template>
    </a-table>

    <edit-modal ref="modal" :role-list="roleListForModal" @ok="onModalOk" />

    <a-modal
      v-model="isAuthorityGrantModalVisible"
      title="授予权限"
      :mask-closable="false"
      @ok="onAuthorityGrantOk"
    >
      <a-spin :spinning="modalSpinning">
        <div style="min-height: 100px; max-height: 60vh; overflow-y: auto">
          <rcd-no-half-tree
            v-model="authoritySelected"
            :tree-data="authorityTreeData"
          />
        </div>
      </a-spin>
    </a-modal>

    <a-modal
      v-model="isTopMenuGrantModalVisible"
      title="授予顶级菜单"
      :mask-closable="false"
      @ok="onTopMenuGrantOk"
    >
      <a-spin :spinning="modalSpinning">
        <div style="min-height: 100px; max-height: 75vh; overflow-y: auto">
          <a-tree
            checkable
            default-expand-all
            :tree-data="topMenuList"
            :replace-fields="{ title:'name', key:'id' }"
            :checked-keys="topMenuChecked"
            @check="onTopMenuChecked"
          />
        </div>
      </a-spin>
    </a-modal>
  </a-spin>
</template>
<script>
import {
  batchRemove, listAllWithTree as listAllRoleWithTree, queryWithTree, removeById,
  grantAuthority, grantTopMenu
} from '@/api/system/role'
import {
  listAllWithTreeForTreeSelect as listAllAuthorityWithTree,
  listByRoleIdWithTree
} from '@/api/common/authrority'
import { listAll as listAllTopMenu, listByRoleId } from '@/api/common/top-menu'
import { deepForEach, deepSort } from '@/util/tree-util'
import { ListMixin } from '@/mixins/common-crud-mixin'
import TreeListMixin from '@/mixins/tree-list-mixin'
import EditModal from './role-management-modal'

const columns = [
  {
    title: '角色名称',
    dataIndex: 'name'
  },
  {
    title: '角色编码',
    dataIndex: 'code'
  },
  {
    title: '角色排序',
    dataIndex: 'sort'
  },
  {
    title: '操作',
    width: '25rem',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'RoleManagementIndex',
  components: { EditModal },
  mixins: [ListMixin, TreeListMixin],
  data() {
    return {
      /** 搜索的条件  角色名称 角色编码 */
      searchInfo: {
        name: '',
        code: ''
      },
      columns,

      /** 给对话框使用的角色列表 */
      roleListForModal: [],

      /** 授权对话框加载标记 */
      modalSpinning: false,
      /** 正在执行授权的角色记录的ID */
      grantingRoleId: '',

      /** 权限赋权树数据 */
      authorityTreeData: [],
      isAuthorityGrantModalVisible: false,
      authoritySelected: [],

      topMenuList: [],
      isTopMenuGrantModalVisible: false,
      topMenuChecked: []
    }
  },
  created() {
    this.setup({
      axiosDeleteRecord: removeById,
      axiosBatchDelete: batchRemove
    })
    this.fetchTableData()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 拉取角色数据
      listAllRoleWithTree()
        .then(res => { vm.roleListForModal = res.data })
      // 拉取赋权用权限数据
      listAllAuthorityWithTree().then(result => {
        vm.authorityTreeData = result
      })
      // 拉取赋权用顶部菜单数据
      listAllTopMenu()
        .then(res => {
          const dataList = res.data
          dataList.sort((a, b) => {
            const sa = a.sort ? a.sort : 100
            const sb = b.sort ? b.sort : 100
            return sa - sb
          })
          vm.topMenuList = dataList
        })
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
    /** 弹框确定按钮触发的回调（拉取分页数据，查看详情时除外） */
    async onModalOk(type, payload) {
      if (type !== 'detail') {
        await this.fetchTableData()
        // 因为角色列表变化了，所以要再次拉取角色数据
        this.roleListForModal = (await (listAllRoleWithTree())).data
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
            this.roleListForModal = await listAllRoleWithTree()
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
      this.roleListForModal = await listAllRoleWithTree()
      await this.fetchTableData()
    },
    /** 设置权限 */
    async onSetAuthority(id) {
      this.grantingRoleId = id
      this.isAuthorityGrantModalVisible = true
      this.modalSpinning = true

      const keyList = []

      try {
        const tree = (await listByRoleIdWithTree(id)).data
        deepForEach(tree, item => {
          keyList.push(item.id)
        })
        this.authoritySelected = keyList
      } finally {
        this.modalSpinning = false
      }
    },
    async onAuthorityGrantOk() {
      await grantAuthority([this.grantingRoleId], this.authoritySelected)
      this.$message.success('操作成功')
      this.isAuthorityGrantModalVisible = false
    },
    /** 顶部菜单设置 */
    async onSetTopMenu(id) {
      this.grantingRoleId = id
      this.isTopMenuGrantModalVisible = true
      this.modalSpinning = true

      try {
        this.topMenuChecked = (await listByRoleId(id)).data.map(item => item.id)
      } finally {
        this.modalSpinning = false
      }
    },
    onTopMenuChecked(checkedKeys) {
      this.topMenuChecked = checkedKeys
    },
    async onTopMenuGrantOk() {
      await grantTopMenu([this.grantingRoleId], this.topMenuChecked)
      this.$message.success('操作成功')
      this.isTopMenuGrantModalVisible = false
    }
  }
}
</script>
