<template>
  <div>
    <a-modal
      v-model="isModalVisible"
      width="600px"
      :title="title"
      :mask-closable="false"
      :after-close="reset"
      @cancel="onCancel"
      @ok="onOk"
    >
      <a-spin :spinning="spinning">
        <a-form-model
          ref="form"
          layout="vertical"
          :model="formData"
          :rules="rules"
        >
          <a-form-model-item label="角色名称" prop="name">
            <a-input
              v-model="formData.name"
              placeholder="请输入角色名称"
              :disabled="isDisable"
            />
          </a-form-model-item>

          <a-form-model-item prop="code">
            <template #label>
              <a-tooltip>
                <template slot="title">
                  角色编码应为英文且唯一值。
                </template>
                <label>角色编码</label>
              </a-tooltip>
            </template>
            <a-input
              v-model="formData.code"
              placeholder="请输入角色编码"
              :disabled="isDisable"
            />
          </a-form-model-item>

          <a-form-model-item label="上级角色" prop="parentId">
            <a-tree-select
              v-model="formData.parentId"
              :tree-data="clonedRoleTreeData"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :get-popup-container="getPopupContainer"
              placeholder="请选择上级角色"
              tree-default-expand-all
              :disabled="isDisable"
              :multiple="false"
            />
          </a-form-model-item>

          <a-form-model-item label="角色排序" prop="sort">
            <a-input-number
              v-model="formData.sort"
              placeholder="请输入角色排序"
              style="width: 100%"
              :disabled="isDisable"
            />
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { add, update, getById } from '@/api/system/role'
import { ModalMixin } from '@/mixins/common-crud-mixin'
import { deepClone } from '@/util/utils'
import { ACTION_TYPE } from '@/config/constants'
import { disableNode } from '@/util/tree-util'

class FormData {
  constructor () {
    this.name = ''
    this.code = ''
    this.parentId = '0'
    this.sort = '100'
  }
}

export default {
  name: 'RoleManagementModal',
  mixins: [ModalMixin],
  props: {
    roleList: { type: Array, default: () => [] }
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入角色名称' }],
        code: [
          { required: true, message: '请输入角色编码' },
          { pattern: /^[a-zA-Z0-9-]{3,64}$/, message: '只能是3-64个英文字符、数字或连字符' }
        ],
        parentId: [{ required: true, message: '请选择上级角色' }],
        sort: [{ required: true, message: '请输入角色排序' }]
      },
      /** 原始数据的深拷贝，上级角色选择时设置当前节点的disable状态 */
      clonedRoleTreeData: []
    }
  },
  created () {
    this.setup({
      FormDataClass: FormData,
      axiosGetById: getById,
      axiosAdd: add,
      axiosUpdate: update
    })
  },
  methods: {
    async open(type, id) {
      this.setModelTitle(type)
      this.isModalVisible = true
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
      const clonedRoleTreeData = [{
        value: '0',
        key: '0',
        title: '顶级角色',
        children: deepClone(this.roleList)
      }]
      if (type !== ACTION_TYPE.CREATION && id) {
        this.id = id
        this.actionType = type
        await this.getRecordById()
        // 上级角色选择时设置当前节点是不可选
        disableNode(this.id, clonedRoleTreeData)
      } else {
        this.id = null
        this.actionType = ACTION_TYPE.CREATION
        this.formData = new this.FormDataClass()
      }
      this.clonedRoleTreeData = clonedRoleTreeData
    }
  }
}
</script>
