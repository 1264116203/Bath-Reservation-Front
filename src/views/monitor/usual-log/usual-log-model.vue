<template>
  <div>
    <a-modal
      v-model="formVisible"
      :title="title"
      :width="800"
      :mask-closable="true"
      :after-close="reset"
      :footer="null"
      @cancel="onCancel"
    >
      <a-form-model ref="form" :model="formData"
                    class="d2-col-form"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item label="服务id" prop="serviceId">
          <a-input v-model="formData.serviceId" :disabled="isDisable" />
        </a-form-model-item>

        <a-form-model-item label="服务host" prop="serverHost">
          <a-input v-model="formData.serverHost" :disabled="isDisable" />
        </a-form-model-item>

        <a-form-model-item label="服务ip" prop="serverIp">
          <a-input v-model="formData.serverIp" :disabled="isDisable" />
        </a-form-model-item>

        <a-form-model-item label="软件环境" prop="env">
          <a-input v-model="formData.env" :disabled="isDisable" />
        </a-form-model-item>

        <a-form-model-item label="日志名" prop="title">
          <a-input v-model="formData.title" :disabled="isDisable" />
        </a-form-model-item>

        <a-form-model-item label="请求方法" prop="method">
          <a-input v-model="formData.method" :disabled="isDisable" />
        </a-form-model-item>

        <a-form-model-item label="请求接口" prop="requestUri">
          <a-input v-model="formData.requestUri" :disabled="isDisable" />
        </a-form-model-item>

        <a-form-model-item label="日志时间" prop="createTime">
          <a-date-picker v-model="formData.createTime" style="width: 100%" :disabled="isDisable" />
        </a-form-model-item>

        <a-form-model-item
          label="用户代理" style="width: 100%"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          prop="userAgent"
        >
          <a-input v-model="formData.userAgent" :disabled="isDisable" />
        </a-form-model-item>

        <a-form-model-item
          label="请求数据" style="width: 100%"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          prop="params"
        >
          <a-textarea v-model="formData.params" :auto-size="{ minRows: 2, maxRows: 6 }" :disabled="isDisable" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { getUsualLogById } from '@/api/system/logs'
import { ModelMixin } from '@/mixins/common-crud-mixin'

class FormData {
  constructor() {
    this.serviceId = ''
    this.serverHost = ''
    this.serverIp = ''
    this.env = ''
    this.logLevel = ''
    this.logId = ''
    this.logData = ''
    this.requestUri = ''
    this.userAgent = ''
    this.textarea = ''
    this.createTime = null
  }
}

export default {
  name: 'UsualLogModel',
  mixins: [ModelMixin],
  created() {
    this.setup({
      FormDataClass: FormData,
      axiosGetById: getUsualLogById
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
        const formData = (await this.axiosGetById(this.id)).data
        formData.createTime = moment(formData.createTime)
        this.formData = formData
      } catch (error) {
        console.error(error)
      }
      this.spinning = false
    }
  }
}
</script>
