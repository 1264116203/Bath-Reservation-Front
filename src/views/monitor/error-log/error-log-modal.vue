<template>
  <div>
    <a-modal
      v-model="isModalVisible"
      :title="title"
      :width="1200"
      :mask-closable="true"
      :after-close="reset"
      :footer="null"
      @cancel="onCancel"
    >
      <a-spin :spinning="spinning">
        <a-form-model ref="form" :model="formData"
                      class="d2-col-form"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 20 }"
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
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 22 }"
            prop="userAgent"
          >
            <a-input v-model="formData.userAgent" :disabled="isDisable" />
          </a-form-model-item>

          <a-form-model-item
            label="请求数据" style="width: 100%"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 22 }"
            prop="params"
          >
            <a-textarea v-model="formData.params" :auto-size="{ minRows: 2, maxRows: 6 }" :disabled="isDisable" />
          </a-form-model-item>

          <a-form-model-item
            label="堆栈信息" style="width: 100%"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 22 }"
            prop="stackTrace"
          >
            <a-textarea v-model="formData.stackTrace" rows="15" :disabled="isDisable" />
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { getErrorLogById } from '@/api/system/logs'
import { ModalMixin } from '@/mixins/common-crud-mixin'

class FormData {
  constructor () {
    this.serviceId = ''
    this.serverHost = ''
    this.serverIp = ''
    this.env = ''
    this.method = ''
    this.requestUri = ''
    this.createTime = null
    this.userAgent = ''
    this.params = ''
    this.textarea = ''
    this.stackTrace = ''
  }
}

export default {
  name: 'ErrorLogModal',
  mixins: [ModalMixin],
  created() {
    this.setup({
      FormDataClass: FormData,
      axiosGetById: getErrorLogById
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
