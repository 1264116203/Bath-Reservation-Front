<template>
  <div>
    <a-button v-if="!isDisable" type="primary" icon="plus" @click="onAdd">
      添加项
    </a-button>
    <a-form-model ref="form" :model="tableDataWrapper">
      <a-table
        class="inner-table"
        bordered
        size="small"
        :row-key="record => record.id || record.dummyId"
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
      >
        <template #dictKey="text, record, tableIndex">
          <a-form-model-item
            :prop="`tableData.${tableIndex}.dictKey`"
            :rules="[{ required: true, message: `字典项名为必填项` }]"
          >
            <a-input
              v-model="record.dictKey"
              style="margin: -5px 0"
              :disabled="isDisable"
            />
          </a-form-model-item>
        </template>
        <template #dictValue="text, record, tableIndex">
          <a-form-model-item
            :prop="`tableData.${tableIndex}.dictValue`"
            :rules="[{ required: true, message: `字典项名为必填项` }]"
          >
            <a-input
              v-model="record.dictValue"
              style="margin: -5px 0"
              :disabled="isDisable"
            />
          </a-form-model-item>
        </template>
        <template #remark="text, record, tableIndex">
          <a-form-model-item :prop="`tableData.${tableIndex}.remark`">
            <a-input
              v-model="record.remark"
              style="margin: -5px 0"
              :disabled="isDisable"
            />
          </a-form-model-item>
        </template>
        <template #operations="text, record, index">
          <a-space>
            <a-button type="primary" size="small" shape="circle" icon="arrow-up"
                      :disabled="isDisable || index === 0"
                      @click="onMoveUp(index)"
            />
            <a-button type="primary" size="small" shape="circle" icon="arrow-down"
                      :disabled="isDisable || index === (tableData.length - 1)"
                      @click="onMoveDown(index)"
            />
            <a-popconfirm title="确定要删除吗?" @confirm="onRemove(index)">
              <a-button type="danger" size="small" shape="circle" icon="delete" :disabled="isDisable" />
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-form-model>
  </div>
</template>

<script>

import { guid } from '@/util/utils'

const columns = [
  {
    title: '排序',
    align: 'center',
    customRender: (val, record, index) => {
      return index + 1 + ''
    }
  },
  {
    title: '字典项名*',
    dataIndex: 'dictKey',
    scopedSlots: { customRender: 'dictKey' }
  },
  {
    title: '字典项值*',
    dataIndex: 'dictValue',
    scopedSlots: { customRender: 'dictValue' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operations' },
    width: 100
  }
]

class FormData {
  constructor () {
    this.id = ''
    this.dictKey = ''
    this.dictValue = ''
    this.dictType = 'string'
    this.remark = ''
    this.dummyId = guid()
  }
}

export default {
  name: 'DictTable',
  props: {
    tableData: {
      type: Array,
      required: true
    },
    isDisable: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      columns
    }
  },
  computed: {
    tableDataWrapper() {
      return {
        tableData: this.tableData
      }
    },
    columnKeys() {
      return this.columns.map(column => column.dataIndex)
    }
  },
  methods: {
    onAdd() {
      this.tableData.push(new FormData())
    },
    onRemove(index) {
      this.tableData.splice(index, 1)
    },
    onMoveUp(index) {
      if (index <= 0) {
        return
      }
      const removed = this.tableData.splice(index, 1)
      this.tableData.splice(index - 1, 0, removed[0])
    },
    onMoveDown(index) {
      if (index >= (this.tableData.length - 1)) {
        return
      }
      const removed = this.tableData.splice(index, 1)
      this.tableData.splice(index + 1, 0, removed[0])
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            return resolve(true)
          } else {
            return resolve(false)
          }
        })
      })
    }
  }
}
</script>
