<template>
  <div>
    <a-modal
      v-model="isModalVisible"
      width="1000px"
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
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-model-item
            label="字典名称"
            style="width: 100%"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
            prop="name"
          >
            <a-input
              v-model="formData.name"
              placeholder="请输入字典名称"
              :disabled="isDisable"
            />
          </a-form-model-item>

          <a-form-model-item label="字典编码" prop="code">
            <a-input
              v-model="formData.code"
              placeholder="请输入字典编码"
              :disabled="isDisable"
            />
          </a-form-model-item>

          <a-form-model-item label="字典排序" prop="sort">
            <a-input-number
              v-model="formData.sort"
              placeholder="请输入字典排序"
              :disabled="isDisable"
              style="width: 100%"
            />
          </a-form-model-item>

          <a-form-model-item
            label="字典备注"
            style="width: 100%"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 21 }"
            prop="remark"
          >
            <a-textarea
              v-model="formData.remark"
              :placeholder="isDisable ? '' : '请输入字典备注'"
              :auto-size="{ minRows: 2, maxRows: 6 }"
              :disabled="isDisable"
            />
          </a-form-model-item>
        </a-form-model>

        <a-divider />

        <sub-table
          ref="subTable"
          :table-data="formData.itemList"
          :is-disable="isDisable"
        />
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { add, getById, update } from '@/api/system/dict'
import { ModalMixin } from '@/mixins/common-crud-mixin'
import SubTable from './dict-management-sub-table'

class FormData {
  constructor () {
    this.code = ''
    this.name = ''
    this.sort = 100
    this.remark = ''
    this.itemList = []
  }
}

export default {
  name: 'DictManagementModal',
  components: { SubTable },
  mixins: [ModalMixin],
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入字典名称' }],
        code: [{ required: true, message: '请输入字典编码' }],
        sort: [{ required: true, message: '请输入字典排序' }]
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
    async getRecordById () {
      this.spinning = true
      try {
        const formData = (await this.axiosGetById(this.id)).data
        if (!formData.itemList) {
          formData.itemList = []
        }
        this.formData = formData
      } catch (error) {
        console.error(error)
      }
      this.spinning = false
    },
    /** 点击对话框确认按钮后的回调 */
    async onOk() {
      const subTableValid = await this.$refs.subTable.validate()
      if (!subTableValid) {
        return false
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.onSubmit()
        } else {
          this.$message.error('校验未通过！')
          return false
        }
      })
    },
    /**
     * 生成添加数据时要使用的数据
     *
     * 默认直接传入this.formData
     * 如果不符合需求可以重写
     *
     * @return {*} 要推送给服务器的数据
     */
    getFormDataForCreation() {
      const formData = ({ ...this.formData })
      formData.itemList.forEach((item, index) => {
        if (item.dummyId) {
          delete item.dummyId
        }
        item.sort = index
      })
      return formData
    }
  }
}
</script>
