<template>
  <a-modal
    v-model="isModalVisible"
    :title="title"
    :mask-closable="false"
    :after-close="reset"
    @cancel="onCancel"
    @ok="onOk"
  >
    <a-form-model ref="form" :model="formData" layout="vertical">
      <a-form-model-item
        label="参数名称" prop="paramName"
        :rules="[{ required: true, message: '请输入参数名称' }]"
      >
        <a-input
          v-model="formData.paramName"
          :disabled="isDisable"
          placeholder="请输入参数名称"
        />
      </a-form-model-item>

      <a-form-model-item
        label="参数键名" prop="paramKey"
        :rules="[{ required: true, message: '请输入参数键名' }]"
      >
        <a-input
          v-model="formData.paramKey"
          :disabled="isDisable"
          placeholder="请输入参数键名"
        />
      </a-form-model-item>

      <a-form-model-item
        label="参数键值" prop="paramValue"
        :rules="[{ required: true, message: '请输入参数键值' }]"
      >
        <a-input
          v-model="formData.paramValue"
          :disabled="isDisable"
          placeholder="请输入参数键值"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import {
  add,
  update,
  getById
} from '@/api/system/param'
import { ModalMixin } from '@/mixins/common-crud-mixin'

/** 表单数据的模板，预定义后将更加一目了然 */
class FormData {
  constructor() {
    /** 参数名称 */
    this.paramName = ''
    /** 参数键 */
    this.paramKey = ''
    /** 参数值 */
    this.paramValue = ''
  }
}

export default {
  name: 'ParamEdit',
  mixins: [ModalMixin],
  created() {
    this.setup({
      FormDataClass: FormData,
      axiosGetById: getById,
      axiosAdd: add,
      axiosUpdate: update
    })
  }
}
</script>
