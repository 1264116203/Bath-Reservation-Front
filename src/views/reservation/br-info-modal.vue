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
      <a-form-model ref="form" :model="formData" layout="vertical">
        <a-form-model-item
          label="浴间号" prop="roomNumber"
          :rules="[{ required: true, message: '请输入浴间号' }]"
        >
          <a-input-number
            v-model="formData.roomNumber"
            :setp="1"
            :min="0"
            :max="100"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请输入浴间号"
          />
        </a-form-model-item>
        <a-form-model-item
          label="浴间当前状态（0：可预定，1：清洁中，2：已预订，3：使用中，4：故障）" prop="roomState"
          :rules="[{ required: true, message: '请输入浴间当前状态（0：可预定，1：清洁中，2：已预订，3：使用中，4：故障）' }]"
        >
          <a-input-number
            v-model="formData.roomState"
            :setp="1"
            :min="0"
            :max="100"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请输入浴间当前状态（0：可预定，1：清洁中，2：已预订，3：使用中，4：故障）"
          />
        </a-form-model-item>
        <a-form-model-item
          label="浴间图片" prop="photo"
          :rules="[{ required: true, message: '请输入浴间图片' }]"
        >
          <a-input
            v-model="formData.photo"
            :disabled="isDisable"
            placeholder="请输入浴间图片"
          />
        </a-form-model-item>
        <a-form-model-item
          label="备注" prop="remark"
          :rules="[{ required: true, message: '请输入备注' }]"
        >
          <a-input
            v-model="formData.remark"
            :disabled="isDisable"
            placeholder="请输入备注"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import {
  add,
  update,
  getById
} from '@/api/reservation/br-info'
import { ModalMixin } from '@/mixins/common-crud-mixin'

/** 表单数据的模板，预定义后将更加一目了然 */
class FormData {
  constructor() {
    /** 浴间号 */
    this.roomNumber = null
    /** 浴间当前状态（0：可预定，1：清洁中，2：已预订，3：使用中，4：故障） */
    this.roomState = null
    /** 浴间图片 */
    this.photo = ''
    /** 备注 */
    this.remark = ''
  }
}

export default {
  name: 'BrInfoEdit',
  mixins: [ModalMixin],
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
        const data = (await this.axiosGetById(this.id)).data
        for (const key of Object.keys(data)) {
          if (key.endsWith('Time') && data[key]) {
            data[key] = moment(data[key])
          }
        }
        this.formData = data
      } catch (error) {
        console.error(error)
      }
      this.spinning = false
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
      for (const key of Object.keys(formData)) {
        if (key.endsWith('Time') && formData[key] && formData[key].valueOf) {
          formData[key] = formData[key].valueOf()
        }
      }
      return formData
    },
    /**
     * 生成更新数据时要使用的数据
     *
     * 默认直接传入this.formData + this.id
     * 如果不符合需求可以重写
     *
     * @return {*} 要推送给服务器的数据
     */
    getFormDataForUpdate() {
      const formData = {
        id: this.id,
        ...this.formData
      }
      for (const key of Object.keys(formData)) {
        if (key.endsWith('Time') && formData[key] && formData[key].valueOf) {
          formData[key] = formData[key].valueOf()
        }
      }
      return formData
    }
  }
}
</script>

<style lang="less" scoped>

</style>
