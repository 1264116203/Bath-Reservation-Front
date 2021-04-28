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
          label="预订订单ID" prop="reservationOrderId"
          :rules="[{ required: true, message: '请输入预订订单ID' }]"
        >
          <a-input
            v-model="formData.reservationOrderId"
            :disabled="isDisable"
            placeholder="请输入预订订单ID"
          />
        </a-form-model-item>
        <a-form-model-item
          label="订单取消原因" prop="cancelReason"
          :rules="[{ required: true, message: '请输入订单取消原因' }]"
        >
          <a-input
            v-model="formData.cancelReason"
            :disabled="isDisable"
            placeholder="请输入订单取消原因"
          />
        </a-form-model-item>
        <a-form-model-item
          label="取消订单时是否违规" prop="isOvertime"
          :rules="[{ required: true, message: '请输入取消订单时是否违规' }]"
        >
          <a-input-number
            v-model="formData.isOvertime"
            :setp="1"
            :min="0"
            :max="100"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请输入取消订单时是否违规"
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
} from '@/api/reservation/br-order-cancel'
import { ModalMixin } from '@/mixins/common-crud-mixin'

/** 表单数据的模板，预定义后将更加一目了然 */
class FormData {
  constructor() {
    /** 预订订单ID */
    this.reservationOrderId = ''
    /** 订单取消原因 */
    this.cancelReason = ''
    /** 取消订单时是否违规 */
    this.isOvertime = null
  }
}

export default {
  name: 'BrOrderCancelEdit',
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
