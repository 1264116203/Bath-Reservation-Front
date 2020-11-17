<template>
  <div>
    <a-modal
      v-model="isModalVisible"
      width="750px"
      :title="title"
      :mask-closable="false"
      :after-close="reset"
      @cancel="onCancel"
      @ok="onOk"
    >
      <a-spin :spinning="spinning">
        <a-form-model
          ref="form" class="d2-col-form"
          :model="formData"
          :rules="rules"
          :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
        >
          <a-form-model-item
            label="组织机构名称"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            style="width: 100%"
            prop="deptName"
          >
            <a-input
              v-model="formData.deptName"
              :disabled="isDisable"
              placeholder="请输入组织机构名称"
            />
          </a-form-model-item>

          <a-form-model-item
            label="组织机构全称"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            style="width: 100%"
            prop="fullName"
          >
            <a-input
              v-model="formData.fullName"
              :disabled="isDisable"
              placeholder="请输入组织机构全称"
            />
          </a-form-model-item>

          <a-form-model-item label="组织机构类别" prop="deptCategory">
            <a-input
              v-model="formData.deptCategory"
              placeholder="请输入组织机构类别"
              :disabled="isDisable"
            />
          </a-form-model-item>

          <a-form-model-item prop="alias">
            <template slot="label">
              <a-tooltip>
                <template slot="title">
                  编码应为英文且唯一值。
                </template>
                <label>组织机构编码</label>
              </a-tooltip>
            </template>
            <a-input
              v-model="formData.alias"
              :disabled="isDisable"
              placeholder="请输入组织机构编码"
            />
          </a-form-model-item>

          <a-form-model-item label="上级组织机构" prop="parentId">
            <a-tree-select
              v-model="formData.parentId"
              :tree-data="clonedDeptTreeData"
              :get-popup-container="getPopupContainer"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :disabled="isDisable"
              placeholder="请选择上级组织机构"
              tree-default-expand-all
            />
          </a-form-model-item>

          <a-form-model-item label="排序" prop="sort">
            <a-input-number
              v-model="formData.sort"
              :disabled="isDisable"
              placeholder="请输入数字"
              style="width: 100%"
            />
          </a-form-model-item>

          <a-form-model-item
            label="备注"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            prop="remark"
            style="width: 100%"
          >
            <a-textarea
              v-model="formData.remark"
              :auto-size="{ minRows: 2, maxRows: 6 }"
              :disabled="isDisable"
              placeholder="请输入备注"
            />
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { add, getById, update } from '@/api/system/dept'
import { ModalMixin } from '@/mixins/common-crud-mixin'
import { deepClone } from '@/util/utils'
import { disableNode } from '@/util/tree-util'
import { ACTION_TYPE } from '@/config/constants'

class FormData {
  constructor () {
    this.deptName = ''
    this.deptCategory = ''
    this.fullName = ''
    this.sort = '100'
    this.alias = ''
    this.remark = ''
    this.parentId = '0'
  }
}

export default {
  name: 'DeptManagementModal',
  mixins: [ModalMixin],
  props: {
    deptList: { type: Array, default: () => [] }
  },
  data() {
    return {
      rules: {
        deptName: [{ required: true, message: '请输入组织机构名称' }],
        fullName: [
          { required: true, message: '请输入组织机构全称' },
          { whitespace: true, message: '组织机构全称不能为空' }
        ],
        deptCategory: [
          { required: true, message: '请输入组织机构类别' },
          { whitespace: true, message: '组织机构类别不能为空' }
        ],
        alias: [
          { required: true, message: '请输入组织机构编码' },
          { whitespace: true, message: '组织机构编码不能为空' },
          { pattern: /^[a-zA-Z0-9-]{3,64}$/, message: '只能是3-64个英文字符、数字或连字符' }
        ],
        parentId: [{ required: true, message: '请选择上级节点' }],
        sort: [
          { required: true, message: '请输入排序' },
          { pattern: /\d/, message: '请输入数字' }
        ]
      },
      /** 原始数据的深拷贝，上级部门选择时设置当前节点的disable状态 */
      clonedDeptTreeData: []
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
      const clonedDeptTreeData = [{
        value: '0',
        key: '0',
        title: '顶级组织机构',
        children: deepClone(this.deptList)
      }]
      if (type !== ACTION_TYPE.CREATION && id) {
        this.id = id
        this.actionType = type
        await this.getRecordById()
        // 上级部门选择时设置当前节点是不可选
        disableNode(this.id, clonedDeptTreeData)
      } else {
        this.id = null
        this.actionType = ACTION_TYPE.CREATION
        this.formData = new this.FormDataClass()
      }
      this.clonedDeptTreeData = clonedDeptTreeData
    }
  }
}
</script>
