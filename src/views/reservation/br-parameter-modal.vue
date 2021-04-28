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
          label="营业状态(0:已休息，1:正在营业)" prop="openingState"
          :rules="[{ required: true, message: '请输入营业状态(0:已休息，1:正在营业)' }]"
        >
          <a-input-number
            v-model="formData.openingState"
            :setp="1"
            :min="0"
            :max="100"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请输入营业状态(0:已休息，1:正在营业)"
          />
        </a-form-model-item>
        <a-form-model-item
          label="预订起步时长" prop="timeInterval"
          :rules="[{ required: true, message: '请输入预订起步时长' }]"
        >
          <a-date-picker
            v-model="formData.timeInterval"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请选择预订起步时长"
          />
        </a-form-model-item>
        <a-form-model-item
          label="预订起步价格" prop="startPrice"
          :rules="[{ required: true, message: '请输入预订起步价格' }]"
        >
          <a-input-number
            v-model="formData.startPrice"
            :setp="1"
            :min="0"
            :max="100"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请输入预订起步价格"
          />
        </a-form-model-item>
        <a-form-model-item
          label="洗浴时间加量包单价" prop="extraPackagePrice"
          :rules="[{ required: true, message: '请输入洗浴时间加量包单价' }]"
        >
          <a-input-number
            v-model="formData.extraPackagePrice"
            :setp="1"
            :min="0"
            :max="100"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请输入洗浴时间加量包单价"
          />
        </a-form-model-item>
        <a-form-model-item
          label="洗浴时间加量包时长" prop="extraPackageTime"
          :rules="[{ required: true, message: '请输入洗浴时间加量包时长' }]"
        >
          <a-date-picker
            v-model="formData.extraPackageTime"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请选择洗浴时间加量包时长"
          />
        </a-form-model-item>
        <a-form-model-item
          label="营业时间(最早可预定时间)" prop="openingTime"
          :rules="[{ required: true, message: '请输入营业时间(最早可预定时间)' }]"
        >
          <a-date-picker
            v-model="formData.openingTime"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请选择营业时间(最早可预定时间)"
          />
        </a-form-model-item>
        <a-form-model-item
          label="打烊时间（理想状况下，订单完成时间不可超过打烊时间）" prop="closingTime"
          :rules="[{ required: true, message: '请输入打烊时间（理想状况下，订单完成时间不可超过打烊时间）' }]"
        >
          <a-date-picker
            v-model="formData.closingTime"
            :disabled="isDisable"
            style="width: 100%;"
            allow-clear
            placeholder="请选择打烊时间（理想状况下，订单完成时间不可超过打烊时间）"
          />
        </a-form-model-item>
        <a-form-model-item
          label="订单最下方顾客须知" prop="userNotice"
          :rules="[{ required: true, message: '请输入订单最下方顾客须知' }]"
        >
          <a-input
            v-model="formData.userNotice"
            :disabled="isDisable"
            placeholder="请输入订单最下方顾客须知"
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
} from '@/api/reservation/br-parameter'
import { ModalMixin } from '@/mixins/common-crud-mixin'

/** 表单数据的模板，预定义后将更加一目了然 */
class FormData {
  constructor() {
    /** 营业状态(0:已休息，1:正在营业) */
    this.openingState = null
    /** 预订起步时长 */
    this.timeInterval = null
    /** 预订起步价格 */
    this.startPrice = null
    /** 洗浴时间加量包单价 */
    this.extraPackagePrice = null
    /** 洗浴时间加量包时长 */
    this.extraPackageTime = null
    /** 营业时间(最早可预定时间) */
    this.openingTime = null
    /** 打烊时间（理想状况下，订单完成时间不可超过打烊时间） */
    this.closingTime = null
    /** 订单最下方顾客须知 */
    this.userNotice = ''
  }
}

export default {
  name: 'BrParameterEdit',
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
