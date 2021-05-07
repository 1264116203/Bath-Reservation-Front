<template>
  <div></div>
</template>
<script>

import { ListMixin } from '@/mixins/common-crud-mixin'

const columns = [

  {
    title: '预订的浴池房间名',
    dataIndex: 'roomName'
  },
  {
    title: '预约开始时间',
    dataIndex: 'startTime',
    scopedSlots: { customRender: 'momentTime' }
  },
  {
    title: '预约结束时间',
    dataIndex: 'endTime',
    scopedSlots: { customRender: 'momentTime' }
  },
  {
    title: '订单价格',
    dataIndex: 'price'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  }
]

export default {
  name: 'BrReservation',
  components: { },
  mixins: [ListMixin],
  data() {
    return {
      /** 查询条件 */
      searchInfo: {},
      columns
    }
  },
  created() {
    this.setup({
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
</style>
