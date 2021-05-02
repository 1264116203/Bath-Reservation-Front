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
          label="订单状态（0：未完成，1：已完成，2：已取消）" prop="orderState"
          :rules="[{ required: true, message: '请输入订单状态（0：未完成，1：已完成，2：已取消）' }]"
        >
          <a-input-number
            v-model="formData.orderState"
            :setp="1"
            :min="0"
            :max="100"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请输入订单状态（0：未完成，1：已完成，2：已取消）"
          />
        </a-form-model-item>
        <a-form-model-item
          label="预订的浴池房间号" prop="bathRoomNum"
          :rules="[{ required: true, message: '请输入预订的浴池房间号' }]"
        >
          <a-input-number
            v-model="formData.bathRoomNum"
            :setp="1"
            :min="0"
            :max="100"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请输入预订的浴池房间号"
          />
        </a-form-model-item>
        <a-form-model-item
          label="预约开始时间" prop="startTime"
          :rules="[{ required: true, message: '请输入预约开始时间' }]"
        >
          <a-date-picker
            v-model="formData.startTime"
            :show-time="{ format: 'HH:mm' }"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请选择预约开始时间"
          />
        </a-form-model-item>
        <a-form-model-item
          label="洗浴加量包数量" prop="extraPackageNumber"
          :rules="[{ required: true, message: '请输入洗浴加量包数量' }]"
        >
          <a-input-number
            v-model="formData.extraPackageNumber"
            :setp="1"
            :min="0"
            :max="100"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请输入洗浴加量包数量"
          />
        </a-form-model-item>
        <a-form-model-item
          label="预约结束时间" prop="endTime"
          :rules="[{ required: true, message: '请输入预约结束时间' }]"
        >
          <a-date-picker
            v-model="formData.endTime"
            :show-time="{ format: 'HH:mm' }"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请选择预约结束时间"
          />
        </a-form-model-item>
        <a-form-model-item
          label="订单价格" prop="price"
          :rules="[{ required: true, message: '请输入订单价格' }]"
        >
          <a-date-picker
            v-model="formData.price"
            :show-time="{ format: 'HH:mm' }"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请选择订单价格"
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
        <a-form-model-item
          label="预约码" prop="reservationCode"
          :rules="[{ required: true, message: '请输入预约码' }]"
        >
          <a-input-number
            v-model="formData.reservationCode"
            :setp="1"
            :min="0"
            :max="100"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请输入预约码"
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
} from '@/api/reservation/br-order-detail'
import { ModalMixin } from '@/mixins/common-crud-mixin'

/** 表单数据的模板，预定义后将更加一目了然 */
class FormData {
  constructor() {
    /** 订单状态（0：未完成，1：已完成，2：已取消） */
    this.orderState = null
    /** 预订的浴池房间号 */
    this.bathRoomNum = null
    /** 预约开始时间 */
    this.startTime = null
    /** 洗浴加量包数量 */
    this.extraPackageNumber = null
    /** 预约结束时间 */
    this.endTime = null
    /** 订单价格 */
    this.price = null
    /** 备注 */
    this.remark = ''
    /** 预约码 */
    this.reservationCode = null
  }
}

export default {
  name: 'BrOrderDetailEdit',
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
