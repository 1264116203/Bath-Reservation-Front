<template>
  <a-spin class="table-list-warp" :spinning="isLoading">
    <div>
      <div v-for="item in dataList" :key="item.id" style="width:90%;border:1px solid #dcdcdc;margin: 10px auto;border-bottom-left-radius: 10px;border-bottom-right-radius: 10px">
        <a-row type="flex" justify="space-around" style="padding: 10px 0; background-color: #e0e0e0">
          <a-col :span="6">
            {{ item.createTime | momentTime }}
          </a-col>
          <a-col :span="6">
            订单号：{{ item.id }}
          </a-col>
          <a-col :span="6">
            所属用户：{{ item.account }}
          </a-col>
        </a-row>
        <a-row type="flex" justify="space-around" style="padding: 20px 0">
          <a-col :span="9">
            <div style="margin-bottom: 5px">
              浴间名：<span style="font-size: 16px">{{ item.roomName }}</span>
            </div>
            <span>预约时段：</span><br>
            <div>{{ item.startTime | momentTime }} ~ {{ item.endTime | momentTime }}</div>
          </a-col>
          <a-col :span="3">
            订单状态：
            <a-tag v-if="item.orderState === 0" color="red">
              未完成
            </a-tag>
            <a-tag v-if="item.orderState === 1" color="green">
              已完成
            </a-tag>
            <a-tag v-if="item.orderState === 2" color="orange">
              已取消
            </a-tag>
          </a-col>
          <a-col :span="1" style="font-size: 16px;color: #4b4a4a">
            ￥{{ item.price }}
          </a-col>
          <a-col :span="5" style="display: flex;justify-content: space-between">
            <div style="width: 85px">
              预约码：{{ item.reservationCode }}
            </div>
            <div>
              <a-button @click="cancel(item)">
                取消
              </a-button><br>
              <a-button type="primary" style="margin-top: 10px" @click="evaluate(item)">
                评价
              </a-button>
            </div>
          </a-col>
        </a-row>
        <a-row type="flex" justify="space-around" style="padding: 10px 0;border-top: 1px solid #dcdcdc">
          <a-col :span="22" style="color: red">
            备注：{{ item.remark }}
          </a-col>
        </a-row>
      </div>
    </div>

    <a-pagination :current="current" :page-size="pageSize" :total="total" style="float: right;margin: 10px 0 10px 10%" @change="onChange" />

    <a-modal
      :visible="formVisible"
      width="680px"
      :title="title"
      @ok="onOk"
      @cancel="handleCancel"
    >
      <a-form-model
        :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }"
      >
        <a-form-model-item v-show="cancelVisible" label="原因">
          <a-textarea v-model="cancelReason" rows="7" placeholder="请输入取消原因" />
        </a-form-model-item>
        <a-form-model-item v-show="evaluateVisible" label="评价">
          <a-textarea v-model="message" rows="7" placeholder="请对本次服务进行评价" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-spin>
</template>
<script>
import {
  listWithPagination,
  batchRemove,
  removeById
} from '@/api/reservation/br-order-detail'
import { add } from '@/api/reservation/br-order-cancel'
import { addMessage } from '@/api/reservation/br-message-board'
import { ListMixin } from '@/mixins/common-crud-mixin'

export default {
  name: 'BrOrderDetailList',
  mixins: [ListMixin],
  data() {
    return {
      current: 1,
      total: 10,
      pageSize: 10,
      dataList: [],
      formVisible: false,
      reason: '',
      title: '',
      cancelVisible: false,
      evaluateVisible: false,
      brOrderCancel: {
        cancelReason: '',
        reservationOrderId: ''
      },
      brMessageBoard: {
        account: '',
        message: ''
      },
      cancelReason: '',
      message: ''
    }
  },
  created() {
    this.setup({
      axiosListWithPagination: listWithPagination,
      axiosDeleteRecord: removeById,
      axiosBatchDelete: batchRemove
    })
    this.init()
  },
  methods: {
    init() {
      listWithPagination({ page: this.current - 1, size: 2 }).then(res => {
        console.log(res)
        this.dataList = res.data.content
        this.total = res.data.totalElements
      })
    },
    onChange(current) {
      this.current = current
      this.init()
    },
    cancel(val) {
      console.log(val)
      this.brOrderCancel.reservationOrderId = val.id
      console.log(this.brOrderCancel.reservationOrderId)
      this.formVisible = true
      this.title = '取消'
      this.cancelVisible = true
      this.evaluateVisible = false
    },
    evaluate(val) {
      this.brMessageBoard.account = val.account
      this.formVisible = true
      this.title = '评价'
      this.cancelVisible = false
      this.evaluateVisible = true
    },
    onOk() {
      if (this.title === '取消') {
        this.brOrderCancel.cancelReason = this.cancelReason
        console.log(this.brOrderCancel)
        add({ brOrderCancel: this.brOrderCancel }).then(res => {
          console.log(res)
          this.$message.success('操作成功！')
          this.init()
          this.empty()
        })
      }
      if (this.title === '评价') {
        this.brMessageBoard.message = this.message
        addMessage({ brMessageBoard: this.brMessageBoard }).then(res => {
          console.log(res)
          this.$message.success('操作成功！')
          this.init()
          this.empty()
        })
      }
      this.formVisible = false
    },
    handleCancel() {
      this.formVisible = false
      this.empty()
    },
    empty() {
      this.brOrderCancel.cancelReason = ''
      this.brOrderCancel.reservationOrderId = ''
      this.brMessageBoard.account = ''
      this.brMessageBoard.message = ''
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
</style>
