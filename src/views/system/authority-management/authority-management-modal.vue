<template>
  <div>
    <a-modal
      v-model="isModalVisible"
      width="900px"
      :title="title"
      :mask-closable="false"
      :after-close="reset"
      @cancel="onCancel"
      @ok="onOk"
    >
      <a-spin :spinning="spinning">
        <a-form-model ref="form" class="d2-col-form"
                      :model="formData"
                      :rules="rules"
                      :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
                      @submit="onSubmit"
        >
          <a-form-model-item label="名称" prop="name">
            <a-input v-model="formData.name" placeholder="请输入权限项名称" :disabled="isDisable" />
          </a-form-model-item>

          <a-form-model-item prop="code">
            <template slot="label">
              <a-tooltip>
                <template slot="title">
                  权限项编码应为英文且唯一值。
                </template>
                <label>编码</label>
              </a-tooltip>
            </template>
            <a-input v-model="formData.code" placeholder="请输入权限项编码" :disabled="isDisable" />
          </a-form-model-item>

          <a-form-model-item label="上级项" prop="parentId">
            <a-tree-select
              v-model="formData.parentId"
              :tree-data="clonedAuthorityTreeList"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :get-popup-container="getPopupContainer"
              placeholder="请选择上级权限项"
              tree-default-expand-all
              :disabled="isDisable"
              :multiple="false"
            />
          </a-form-model-item>

          <a-form-model-item label="图标" prop="icon">
            <a-input
              v-model="formData.icon"
              placeholder="请选择图标"
              :disabled="isDisable"
              @click="openIconSelectionModal"
            />
          </a-form-model-item>

          <a-form-model-item label="排序" prop="sort">
            <a-input-number
              v-model="formData.sort"
              placeholder="请输入排序"
              :disabled="isDisable"
              style="width: 100%"
            />
          </a-form-model-item>

          <a-form-model-item prop="category">
            <template slot="label">
              <a-tooltip>
                <template slot="title">
                  菜单项会显示在左侧菜单中，权限用于关联具体业务使用。
                </template>
                <label>类型</label>
              </a-tooltip>
            </template>
            <a-radio-group v-model="formData.category" :disabled="isDisable">
              <a-radio :value="1">
                菜单
              </a-radio>
              <a-radio :value="2">
                权限
              </a-radio>
            </a-radio-group>
          </a-form-model-item>

          <template v-if="isMenuItem">
            <a-form-model-item label="默认展开" prop="isDefaultExpanded">
              <a-switch v-model="formData.isDefaultExpanded"
                        :disabled="!isDefaultExpandedEnabled || isDisable"
                        checked-children="是"
                        un-checked-children="否"
              />
            </a-form-model-item>

            <a-form-model-item label="新标签页打开">
              <a-switch v-model="formData.isOpen"
                        :disabled="isDisable"
                        checked-children="是"
                        un-checked-children="否"
              />
            </a-form-model-item>

            <a-form-model-item label="路由地址"
                               style="width: 100%"
                               :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
                               prop="path"
            >
              <a-input
                v-model="formData.path"
                :placeholder="isDisable ? '' : '请输入路由地址'"
                :disabled="isDisable"
              />
            </a-form-model-item>
          </template>

          <a-form-model-item label="备注信息"
                             style="width: 100%"
                             :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
                             prop="remark"
          >
            <a-textarea
              v-model="formData.remark"
              :placeholder="isDisable ? '' : '请输入备注信息'"
              :auto-size="{ minRows: 2, maxRows: 6 }"
              :disabled="isDisable"
            />
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>

    <menu-icon-selection-modal ref="menuIconSelectionModal" @selected="onIconSelected" />
  </div>
</template>

<script>
import { add, getById, update } from '@/api/system/authority'
import { deepClone } from '@/util/utils'
import { ACTION_TYPE } from '@/config/constants'
import { disableNode } from '@/util/tree-util'
import { ModalMixin } from '@/mixins/common-crud-mixin'
import MenuIconSelectionModal from '@/views/system/menu-icon-selection-modal'

class FormData {
  constructor() {
    this.path = ''
    this.name = ''
    this.icon = 'check-circle'
    this.category = 1
    this.isOpen = false
    this.code = ''
    this.sort = '100'
    this.remark = ''
    this.parentId = '0'
    this.isDefaultExpanded = false
  }
}

export default {
  name: 'AuthorityManagementModal',
  components: { MenuIconSelectionModal },
  mixins: [ModalMixin],
  props: {
    authorityTreeList: { type: Array, default: () => [] }
  },
  data() {
    return {
      /** 原始数据的深拷贝，上级选择时设置当前节点的disable状态 */
      clonedAuthorityTreeList: [],

      isDefaultExpandedEnabled: true,
      rules: {
        name: [{ required: true, message: '请输入名称' }],
        code: [
          { required: true, message: '请输入编码' },
          { pattern: /^[a-zA-Z0-9-]{3,64}$/, message: '只能是3-64个英文字符、数字或连字符' }
        ],
        icon: [{ required: true, message: '请选择图标' }],
        parentId: [{ required: true, message: '请选择上级' }],
        sort: [{ required: true, message: '请输入排序' }],
        category: [{ required: true, message: '请选择类型' }]
      }
    }
  },
  computed: {
    isMenuItem() {
      return this.formData.category === 1
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

      const clonedAuthorityTreeList = [{
        value: '0',
        key: '0',
        title: '顶级权限项',
        children: deepClone(this.authorityTreeList)
      }]

      if (type !== ACTION_TYPE.CREATION && id) {
        this.id = id
        this.actionType = type
        await this.getRecordById()
        disableNode(this.id, clonedAuthorityTreeList)
      } else {
        this.id = null
        this.actionType = ACTION_TYPE.CREATION
        this.formData = new this.FormDataClass()
      }

      this.clonedAuthorityTreeList = clonedAuthorityTreeList
    },
    openIconSelectionModal() {
      this.$refs.menuIconSelectionModal.open()
    },
    /** 菜单图标的点击事件 */
    onIconSelected(icon) {
      this.formData.icon = icon
    }
  }
}
</script>
