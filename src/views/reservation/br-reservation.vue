<template>
  <div>
    <div style="width: 500px;margin: 10px auto">
      <div>
        <img :src="dataList.storePhoto">
      </div>
      <div>{{ dataList.storeName }}</div>
      <div>{{ dataList.storeAddress }}</div>
      <div>
        请选择要预定的日期：
        <a-date-picker :default-value="moment(getLocalDateString())" @change=" reservationDateOnChange" />
      </div>
    </div>
    {{ price }}

    <div v-for="bathRoom in dataList.brInfoList" :key="bathRoom.id">
      <a-row type="flex" justify="space-around" style="margin: 20px 0">
        <a-col :span="16" style="border: 1px solid gray; padding:10px;border-radius: 10px">
          <div :style="{'float': 'left','border-radius': '10px', border: '3px solid ' +borderColorChange(bathRoom) }">
            <img :src="bathRoom.photo" width="100" style="padding: 10px">
          </div>
          <div style="height: 100px;float:left;margin-left: 10px">
            <div style="margin-top:5px;font-size: 18px;color:#ece815">
              {{ bathRoom.roomName }}
            </div>
            <div style="margin-top:40px">
              浴间当前状态:
              <a-tag :color="borderColorChange(bathRoom)">
                {{ roomStateMessage }}
              </a-tag>
            </div>
          </div>
          <div style="float:left;height: 100px;margin-left: 10px;">
            <div>
              请选择预定开始时间：
              <a-time-picker format="HH:mm" :minute-step="dataList.extraPackageTime[1]" @change="resrvationStartTimeOnChange" />
              请选择预定结束时间：
              <a-time-picker format="HH:mm" :minute-step="dataList.extraPackageTime[1]" @change="resrvationEndTimeOnChange" />
            </div>
            订单价格： {{ getPrice() }}

            <a-button style="position: absolute; bottom: 10px;right: 10px" @click="sublim">
              提交
            </a-button>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { get } from '@/api/reservation/br-reservation'
import moment from 'moment'

export default {
  name: 'BrReservation',
  data() {
    return {
      price: '',
      reservationDate: '',
      resrvationStartDateTime: '',
      resrvationStartTime: '',
      reservationEndDateTime: '',
      reservationEndTime: '',
      dataList: {},
      borderColor: '',
      roomStateMessage: '',
      form: {
        time: '',
        value: 1
      },
      value: 1
    }
  },
  created() {
    this.init()
  },
  methods: {
    moment,
    getLocalDateString() {
      const date = new Date()
      return date.toLocaleDateString()
    },
    getPrice(reservationDate, resrvationStartTime, reservationEndTime) {
      const reservationStartDateTime = reservationDate + ' ' + resrvationStartTime
      const reservationEndDateTime = reservationDate + ' ' + reservationEndTime
      const date = new Date(reservationStartDateTime)
      const date1 = new Date(reservationEndDateTime)
      const subMillisecond = date1.getTime() - date.getTime()
      const price = this.dataList.extraPackagePrice * (subMillisecond / (60000 * (this.dataList.extraPackageTime[1])))

      const price1 = this.dataList.startPrice + price
      return price1
    },
    init() {
      get().then(res => {
        this.dataList = res.data
      })
    },
    borderColorChange(bathRoom) {
      const roomState = bathRoom.roomState
      switch (roomState) {
        case 0:
          this.borderColor = '#42ea24'
          this.roomStateMessage = '可预订'
          break
        case 1:
          this.borderColor = '#ead61f'
          this.roomStateMessage = '清洁中'
          break
        case 2:
          this.borderColor = '#d51414'
          this.roomStateMessage = '已预订'
          break
        case 3:
          this.borderColor = '#d51414'
          this.roomStateMessage = '使用中'
          break
        case 4:
          this.borderColor = '#bfbfbf'
          this.roomStateMessage = '故障'
          break
      }
      return this.borderColor
    },
    onChangeNumber(value) {
      this.form.value = value
    },
    sublim() {
    },
    reservationDateOnChange(date, dateString) {
      this.reservationDate = dateString
    },
    resrvationStartTimeOnChange(date, dateString) {
      this.resrvationStartTime = dateString
    },
    resrvationEndTimeOnChange(date, dateString) {
      this.reservationEndTime = dateString
    }
  }
}
</script>

<style scoped>

</style>
