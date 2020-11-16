<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <a-form-model ref="searchForm" layout="inline" :model="searchInfo">
      <a-form-model-item label="登录账号" prop="account">
        <a-input v-model="searchInfo.account" placeholder="登录账号" />
      </a-form-model-item>
      <a-form-model-item label="用户昵称" prop="name">
        <a-input v-model="searchInfo.name" placeholder="用户昵称" />
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
      <a-button @click="onResetPassword">
        重置密码
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
        </a-space>
      </template>
      <template #roleId="text, record">
        <template v-if="record.roleName">
          <limited-tags :raw-name="record.roleName" />
        </template>
      </template>
      <template #deptId="text, record">
        <template v-if="record.deptName">
          <limited-tags :raw-name="record.deptName" />
        </template>
      </template>
    </a-table>

    <edit-modal ref="modal" :role-list="roleList" :dept-list="deptList" @ok="onModalOk" />

    <a-modal v-model="isPasswordResetModalVisible" title="请输入重置的密码" @ok="onResetPasswordModalOk">
      <a-form-model ref="passwordResetForm" :model="passwordResetFormData">
        <a-form-model-item
          prop="newPassword"
          :rules="[
            { required: true,message: '请输入密码'},
            { pattern:/^(?=.*[0-9a-zA-Z])\w{4,16}$/, message: '必须有数字或者字母并且长度在4~16之间' }
          ]"
        >
          <a-input-password
            v-model="passwordResetFormData.newPassword"
            placeholder="请输入重置的密码"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-spin>
</template>
<script>
import { ListMixin } from '@/mixins/common-crud-mixin'
import EditModal from './user-management-modal'
import LimitedTags from '@/components/scraps/limited-tags'
import { listWithPagination, batchRemove, removeById, resetPassword } from '@/api/system/user-management'
import { listAllWithTree as listDeptTree } from '@/api/system/dept'
import { listAllWithTree as listRoleTree } from '@/api/system/role'

const columns = [
  {
    title: '登录账号',
    dataIndex: 'account'
  },
  {
    title: '用户昵称',
    dataIndex: 'name'
  },
  {
    title: '用户姓名',
    dataIndex: 'realName'
  },
  {
    title: '所属角色',
    dataIndex: 'roleId',
    width: '15%',
    scopedSlots: { customRender: 'roleId' }
  },
  {
    title: '所属部门',
    dataIndex: 'deptId',
    width: '15%',
    scopedSlots: { customRender: 'deptId' }
  },
  {
    title: '手机号码',
    dataIndex: 'phone'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'UserManagementIndex',
  components: {
    EditModal,
    LimitedTags
  },
  mixins: [ListMixin],
  data () {
    return {
      /** 搜索的条件  登录账号 用户昵称 */
      searchInfo: {
        account: '',
        name: ''
      },
      columns,
      isPasswordResetModalVisible: false,
      passwordResetFormData: {
        newPassword: ''
      },
      roleList: [],
      deptList: []
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      Promise.all([listRoleTree(), listDeptTree()])
        .then(results => {
          vm.roleList = results[0].data
          vm.deptList = results[1].data
        })
    })
  },
  methods: {
    /** 重置密码 */
    onResetPassword () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择至少一条数据')
        return
      }
      this.isPasswordResetModalVisible = true
      this.passwordResetFormData.newPassword = ''
    },
    onResetPasswordModalOk() {
      this.$refs.passwordResetForm.validate(async valid => {
        if (valid) {
          const newPassword = this.passwordResetFormData.newPassword
          await resetPassword(newPassword, this.selectedRowKeys)
          this.$message.success('操作成功!')
          this.passwordResetFormData.newPassword = ''
          this.isPasswordResetModalVisible = false
          await this.fetchTableData()
        } else {
          this.$message.error('校验失败！')
        }
      })
    }
  }
}
</script>
