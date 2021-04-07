<template>
  <div>
    <a-modal
      v-model="isModalVisible"
      width="700px"
      :title="title"
      :mask-closable="false"
      :after-close="reset"
      @cancel="onCancel"
      @ok="onOk"
    >
      <a-spin :spinning="spinning">
        <a-form-model
          ref="form"
          class="d2-col-form"
          :model="formData"
          :rules="rules"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-model-item label="登录账号" prop="account">
            <a-input
              v-model="formData.account"
              placeholder="登录账号"
              :disabled="actionType !== 'creation'"
            />
          </a-form-model-item>
          <a-form-model-item label="用户姓名" prop="realName">
            <a-input
              v-model="formData.realName"
              placeholder="请输入用户姓名"
              :disabled="isDisable"
            />
          </a-form-model-item>

          <template v-if="actionType === 'creation'">
            <a-form-model-item label="密码" prop="password">
              <a-input-password
                v-model="formData.password"
                placeholder="请输入密码"
              />
            </a-form-model-item>
            <a-form-model-item v-if="actionType === 'creation'" label="确认密码" prop="passwordAgain">
              <a-input-password
                v-model="formData.passwordAgain"
                placeholder="请再次输入密码"
              />
            </a-form-model-item>
          </template>

          <a-form-model-item label="用户昵称" prop="name">
            <a-input
              v-model="formData.name"
              placeholder="请输入用户昵称"
              :disabled="isDisable"
            />
          </a-form-model-item>

          <a-form-model-item label="手机号" prop="phone">
            <a-input
              v-model="formData.phone"
              :placeholder="isDisable ? '' : '请输入手机号'"
              type="phone"
              :disabled="isDisable"
            />
          </a-form-model-item>

          <a-form-model-item ref="role" label="所属角色" prop="currentRoles">
            <a-tree-select
              v-model="formData.currentRoles"
              placeholder="请选择所属角色"
              tree-default-expand-all
              tree-checkable
              tree-check-strictly
              :tree-data="roleList"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :get-popup-container="getPopupContainer"
              :disabled="isDisable"
            />
          </a-form-model-item>

          <a-form-model-item ref="dept" label="所属部门" prop="currentDepts">
            <a-tree-select
              v-model="formData.currentDepts"
              placeholder="请选择所属部门"
              tree-default-expand-all
              tree-checkable
              tree-check-strictly
              :tree-data="deptList"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :get-popup-container="getPopupContainer"
              :disabled="isDisable"
            />
          </a-form-model-item>

          <a-form-model-item
            label="电子邮箱"
            style="width: 100%;"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
            prop="email"
          >
            <a-input
              v-model="formData.email"
              :placeholder="isDisable ? '' : '请输入电子邮箱'"
              type="email"
              :disabled="isDisable"
            />
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { add, getById, update } from '@/api/system/user-management'
import { ModalMixin } from '@/mixins/common-crud-mixin'

class FormData {
  constructor () {
    this.account = ''
    this.name = ''
    this.realName = ''
    this.phone = ''
    this.currentRoles = []
    this.currentDepts = []
    this.email = ''
  }
}

export default {
  name: 'UserManagementModal',
  mixins: [ModalMixin],
  props: {
    roleList: { type: Array, default: () => [] },
    deptList: { type: Array, default: () => [] }
  },
  data() {
    return {
      /** 验证密码 */
      validatePass: (rule, value, callback) => {
        const password = this.formData.password
        if (!value) {
          callback(new Error('请再次输入密码'))
        } else if (value !== password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      rules: {
        account: [
          { required: true, message: '请输入登录账号' },
          { whitespace: true, message: '登录账号不能包含空格' }
        ],
        realName: [
          { required: true, message: '请输入用户姓名' },
          { min: 2, max: 5, message: '姓名长度在2到5个字符' }
        ],
        password: [
          { required: true, message: '请输入密码' },
          { pattern: /^[a-zA-Z].{5,17}$/, message: '以字母开头，长度在6~18之间' }
        ],
        passwordAgain: [{ required: true, validator: this.validatePass }],
        name: [{ required: true, message: '请输入用户昵称' }],
        phone: [
          { pattern: /^1[0-9]{10}$/, message: '请输入以1开头的11位手机号码' }
        ],
        currentRoles: [{ required: true, message: '请选择所属角色' }],
        currentDepts: [{ required: true, message: '请选择所属部门' }],
        email: [
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱' }
        ]
      }
    }
  },
  created() {
    this.setup({
      FormDataClass: FormData,
      axiosGetById: getById,
      axiosAdd: add,
      axiosUpdate: update
    })
  },
  methods: {
    /**
     * 根据id拉取服务器数据
     *
     * 如果不符合需求可以重写本方法
     * @return {Promise<void>}
     */
    async getRecordById() {
      this.spinning = true
      try {
        const requestData = (await this.axiosGetById(this.id)).data

        if (requestData.deptList && requestData.deptList.length > 0) {
          requestData.currentDepts = requestData.deptList.map(dept => ({
            label: dept.name,
            value: dept.id
          }))
        }
        if (requestData.roleList && requestData.roleList.length > 0) {
          requestData.currentRoles = requestData.roleList.map(role => ({
            label: role.name,
            value: role.id
          }))
        }

        const formData = new FormData()

        Object.keys(formData).forEach(key => {
          formData[key] = requestData[key]
        })

        this.formData = formData
      } catch (error) {
        console.error(error)
      }
      this.spinning = false
    },
    getFormDataForCreation() {
      const formData = { ...this.formData }

      formData.deptIdList = formData.currentDepts.map(item => item.value)
      formData.roleIdList = formData.currentRoles.map(item => item.value)
      delete formData.currentDepts
      delete formData.currentRoles

      return formData
    },
    getFormDataForUpdate() {
      const formData = { ...this.formData }
      formData.id = this.id

      formData.deptIdList = formData.currentDepts.map(item => item.value)
      formData.roleIdList = formData.currentRoles.map(item => item.value)
      delete formData.currentDepts
      delete formData.currentRoles

      return formData
    }
  }
}
</script>
