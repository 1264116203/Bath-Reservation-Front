<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" >
      <a-form-model-item label="门店图标">
<!--        <img :src="''+form.storeTelephone">-->
        <upload-avatar :action="action" :image-url.sync="form.storeTelephone" :default-image-url="form.storeTelephone" />
        <a-input v-model="form.storeTelephone" />
      </a-form-model-item>
      <a-form-model-item label="门店名称">
        <a-input v-model="form.storeName" />
      </a-form-model-item>
      <a-form-model-item label="门店地址">
        <a-input v-model="form.storeAddress" />
      </a-form-model-item>
      <a-form-model-item label="门店电话">
        <a-input v-model="form.storePhoto" />
      </a-form-model-item>
      <a-form-model-item label="营业状态">
        <a-select v-model="form.region">
          <a-select-option value="0">
            已休息
          </a-select-option>
          <a-select-option value="1">
            正在营业
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model :layout="vertical" style="height: 90px">
        <a-form-model-item label="预订起步时长" style="float: left; margin: 0 40px">
          <a-time-picker  v-model="form.timeInterval" format="HH:mm" />
        </a-form-model-item>
        <a-form-model-item label="预订起步价格" style="float: left; margin: 0 40px">
          <a-input-number v-model="form.startPrice" />
        </a-form-model-item>
        <a-form-model-item label="洗浴时间加量包单价" style="float: left; margin: 0 40px">
          <a-input-number v-model="form.extraPackagePrice" />
        </a-form-model-item>
        <a-form-model-item label="洗浴时间加量包时长" style="float: left; margin: 0 40px">
          <a-time-picker  v-model="form.extraPackageTime" format="HH:mm" />
        </a-form-model-item>
      </a-form-model>
      <a-form-model :layout="vertical" style="height: 90px">
        <a-form-model-item label="清洁时间" style="float: left; margin: 0 40px">
          <a-time-picker  v-model="form.cleanTime" />
        </a-form-model-item>
        <a-form-model-item label="营业时间(最早可预定时间)" style="float: left; margin: 0 40px">
          <a-input-number v-model="form.openingTime" />
        </a-form-model-item>
        <a-form-model-item label="打烊时间（理想状况下，订单完成时间不可超过打烊时间）" style="float: left; margin: 0 40px">
          <a-input-number v-model="form.closingTime" />
        </a-form-model-item>
      </a-form-model>
      <a-form-model-item label="订单最下方顾客须知">
        <a-input v-model="form.userNotice" type="textarea"/>
      </a-form-model-item>
    </a-form-model>

  </a-spin>
</template>
<script>
import {
  listWithPagination,
  batchRemove,
  removeById
} from '@/api/reservation/br-parameter'
// import EditModal from './br-parameter-modal'
import { ListMixin } from '@/mixins/common-crud-mixin'

export default {
  name: 'BrParameterList',
  // components: { EditModal },
  mixins: [ListMixin],
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      /** 查询条件 */
      searchInfo: {},
      // action: '/api/upload?subPath=avatar',
      form: {
        userNotice: '',
        closingTime: '',
        openingTime: '',
        cleanTime: '',
        extraPackageTime: '',
        extraPackagePrice: '',
        startPrice: '',
        timeInterval: '',
        region: '0',
        storePhoto: '',
        storeTelephone: '',
        storeAddress: '',
        storeName: ''
      }
    }
  },
  created() {
    this.setup({
      axiosListWithPagination: listWithPagination,
      axiosDeleteRecord: removeById,
      axiosBatchDelete: batchRemove
    })
    this.fetchTableData()
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
