<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <a-form-model ref="form" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="门店图标">
        <upload-avatar :action="action" :image-url.sync="form.storePhoto" :default-image-url="form.storePhoto" style="width: 100%" />
      </a-form-model-item>
      <a-form-model-item label="门店名称">
        <a-input v-model="form.storeName" />
      </a-form-model-item>
      <a-form-model-item label="门店地址">
        <a-input v-model="form.storeAddress" />
      </a-form-model-item>
      <a-form-model-item label="门店电话">
        <a-input v-model="form.storeTelephone" />
      </a-form-model-item>
      <a-form-model-item label="营业状态">
        <a-select v-model="form.openingState">
          <a-select-option v-for="item in openingState" :key="item.key" :value="item.key">
            {{ item.value }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model layout="vertical" style="height: 92px">
        <a-form-model-item label="预订起步时长" style="float: left;margin-left:11%; margin-right:40px">
          <a-time-picker v-model="timeInterval" format="HH:mm" />
        </a-form-model-item>
        <a-form-model-item label="预订起步价格（¥）" style="float: left; margin: 0 40px">
          <a-input-number v-model="form.startPrice" />
        </a-form-model-item>
        <a-form-model-item label="洗浴时间加量包单价（¥）" style="float: left; margin: 0 40px">
          <a-input-number v-model="form.extraPackagePrice" />
        </a-form-model-item>
        <a-form-model-item label="洗浴时间加量包时长（分钟）" style="float: left; margin: 0 40px">
          <a-time-picker v-model="extraPackageTime" format="mm" />
        </a-form-model-item>
      </a-form-model>
      <a-form-model layout="vertical" style="height: 98px">
        <a-form-model-item label="清洁时间（分钟）" style="float: left;margin-left:11%; margin-right:40px">
          <a-time-picker v-model="cleanTime" format="mm" />
        </a-form-model-item>
        <a-form-model-item label="营业时间(最早可预定时间)" style="float: left; margin: 0 40px">
          <a-time-picker v-model="openingTime" format="HH:mm" />
        </a-form-model-item>
        <a-form-model-item label="打烊时间（理想状况下，订单完成时间不可超过打烊时间）" style="float: left; margin: 0 40px">
          <a-time-picker v-model="closingTime" format="HH:mm" />
        </a-form-model-item>
      </a-form-model>
      <a-form-model-item label="订单最下方顾客须知">
        <a-input v-model="form.userNotice" type="textarea" />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" style="width: 100%;margin-left: 29%" @click="onSubmit">
          提交
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </a-spin>
</template>
<script>
import {
  listWithPagination,
  batchRemove,
  removeById,
  update
} from '@/api/reservation/br-parameter'
// import EditModal from './br-parameter-modal'
import { ListMixin } from '@/mixins/common-crud-mixin'
import UploadAvatar from '@/components/scraps/upload-avatar'
import moment from 'moment'
export default {
  name: 'BrParameterList',
  components: { UploadAvatar },
  mixins: [ListMixin],
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      /** 查询条件 */
      searchInfo: {},
      openingState: [
        { key: 0, value: '已休息' },
        { key: 1, value: '正在营业' }
      ],
      action: '/api/upload?subPath=avatar',
      form: {
        userNotice: '',
        closingTime: '',
        openingTime: '',
        cleanTime: '',
        extraPackageTime: '',
        extraPackagePrice: '',
        startPrice: '',
        timeInterval: '',
        openingState: '0',
        storeTelephone: '',
        storeAddress: '',
        storeName: ''
      },
      storePhoto: '',
      timeInterval: '',
      extraPackageTime: '',
      closingTime: '',
      openingTime: '',
      cleanTime: ''
    }
  },
  created() {
    this.setup({
      axiosListWithPagination: listWithPagination,
      axiosDeleteRecord: removeById,
      axiosBatchDelete: batchRemove
    })
    this.fetchTableData()
  },
  methods: {
    onSubmit() {
      this.form.timeInterval = moment(this.timeInterval).format('HH:mm')
      this.form.extraPackageTime = moment(this.extraPackageTime).format('HH:mm')
      this.form.cleanTime = moment(this.cleanTime).format('HH:mm')
      this.form.openingTime = moment(this.openingTime).format('HH:mm')
      this.form.closingTime = moment(this.closingTime).format('HH:mm')
      this.$refs.form.validate(async valid => {
        if (valid) {
          const formData = {
            ...this.form,
            storePhoto: this.storePhoto
          }
          await update(formData)
          // this.$store.commit('auth/setUserInfo', (await getSelfInfo()).data)
          this.$message.success('修改信息成功!')
        } else {
          this.$message.error('校验未通过！')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.grant-tree-container {
  height: 50vh;
  min-height: 300px;
  overflow-y: auto
}

.ant-form-item {
  margin-bottom: 12px;
}
</style>
