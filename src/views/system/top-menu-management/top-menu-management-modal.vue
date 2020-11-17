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
        <a-form-model ref="form" layout="vertical" :model="formData" :rules="rules">
          <a-form-model-item label="菜单名称" prop="name">
            <a-input
              v-model="formData.name"
              :disabled="isDisable"
              placeholder="请输入菜单名称"
            />
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
            <a-input
              v-model="formData.code"
              :disabled="isDisable"
              placeholder="请输入菜单编码"
            />
          </a-form-model-item>

          <a-form-model-item label="菜单图标" prop="icon">
            <a-input
              v-model="formData.icon"
              :disabled="isDisable"
              placeholder="请输入菜单图标"
              @click="openIconSelectionModal"
            />
          </a-form-model-item>

          <a-form-model-item label="菜单排序" prop="sort">
            <a-input-number
              v-model="formData.sort"
              :disabled="isDisable"
              placeholder="请输入菜单排序"
              style="width: 100%"
            />
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>

    <menu-icon-selection-modal ref="menuIconSelectionModal" @selected="onIconSelected" />
  </div>
</template>

<script>
import { add, getById, update } from '@/api/system/top-menu'
import { ModalMixin } from '@/mixins/common-crud-mixin'
import MenuIconSelectionModal from '../menu-icon-selection-modal'

class FormData {
  constructor () {
    this.name = ''
    this.code = ''
    this.icon = 'check-circle'
    this.sort = '100'
  }
}

export default {
  name: 'TopMenuEdit',
  components: { MenuIconSelectionModal },
  mixins: [ModalMixin],
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入菜单名称' }],
        code: [
          { required: true, message: '请输入菜单编码' },
          { pattern: /^[a-zA-Z0-9-]{3,64}$/, message: '只能是3-64个英文字符、数字或连字符' }
        ],
        icon: [{ required: true, message: '请输入菜单图标' }],
        sort: [{ required: true, message: '请输入菜单排序' }]
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
