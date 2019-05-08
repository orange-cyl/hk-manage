<template>
  <div class="distribution">
    <div class="left">
      <img :src="deviceImg1" alt="设备图片未找到...">
    </div>
    <div class="right">
      <div class="list">
        <el-card v-for="item in currentData" :key="item.name" :id="item.dataitem_code" class="box-card">
          <div class="text item" @click="toOpenDialog(item.dataitem_code,item.name)">
            <div class="card_top">
              <span>{{ item.value }}</span>
            </div>
            <div class="card_bottom">
              <span>{{ item.name }}</span>
            </div>
          </div>
        </el-card>
      </div>
      <div class="choiceTime">
        <el-date-picker v-model="searchTime" value-format="yyyy-MM-dd HH:mm:ss" size="mini" type="datetimerange" range-separator="至" align="right" @change="searchChange"/>
        <span class="dataOptions optionDay" @click="changeTimeByOption1(1)">本天</span>
        <span class="dataOptions optionWeek" @click="changeTimeByOption1(2)">本周</span>
        <span class="dataOptions optionMonth" @click="changeTimeByOption1(3)">本月</span>
        <span class="dataOptions optionQuarter " @click="changeTimeByOption1(4)">本季度</span>
      </div>
      <div id="container1" style="width:100%;height:210px;margin-bottom:30px;margin-top:20px"/>
      <div id="container2" style="width:100%;height:210px;margin-bottom:20px"/>
    </div>
    <!-- 图表模态框 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :before-close="handleClose"
      width="60%"
      center>
      <el-date-picker
        v-model="time1"
        value-format="yyyy-MM-dd HH:mm:ss"
        size="mini"
        type="datetimerange"
        range-separator="至"
        align="right"
        @change="findLineDataByTime"/>
      <span class="dataOptions optionDay" @click="changeTimeByOption(1)">本天</span>
      <span class="dataOptions optionWeek" @click="changeTimeByOption(2)">本周</span>
      <span class="dataOptions optionMonth" @click="changeTimeByOption(3)">本月</span>
      <span class="dataOptions optionQuarter " @click="changeTimeByOption(4)">本季度</span>
      <div id="container3" style="width:1080px;height:300px;"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="closeDialog()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import service from '@/http/service'
import service from '@/utils/request'
import echarts from 'echarts'
export default {
  data() {
    return {
      // 机房ID
      room_id: 2,
      // 设备类型id
      devicetype_id: 3,
      // 设备图片
      deviceImg: [],
      // 当前展示图片
      deviceImg1: '',
      // 设备id
      deviceId: 18,
      // 该设备当前的数据信息
      currentData: [],
      // 选择查看数据的时间段
      pickerOptions: {
        shortcuts: [{
          text: '本天',
          onClick(picker) {
            picker.$emit('pick', this.time())
          }
        }, {
          text: '本周',
          onClick(picker) {
            picker.$emit('pick', this.week())
          }
        }, {
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', this.month())
          }
        }, {
          text: '本季度',
          onClick(picker) {
            picker.$emit('pick', this.quarter())
          }
        }]
      },
      searchTime: this.time(),
      time1: this.time(),
      // A相电流
      CT1: [],
      // B相电流
      CT2: [],
      // C相电流
      CT3: [],
      // A相电压
      DC1: [],
      // B相电压
      DC2: [],
      // C相电压
      DC3: [],
      // 电流电压时间
      ctTime: [],
      // 模态框
      dialog: {
        title: '',
        visible: false
      },
      // 数据项码
      dataitem_codes: [],
      // 模态框中的时间和数据
      counts: [],
      time9: [],
      name: [],
      // 当前的数据项码
      dataitem_code1: ''
    }
  },
  watch: {
    deviceId: function(now, old) {
      this.getDevice(this.room_id, this.devicetype_id)
      this.getCurrentData()
      this.searchChange()
      this.findAllData()
    }
  },
  created() {
    this.getDevice(this.room_id, this.devicetype_id)
    this.getCurrentData()
    this.searchChange()
    this.findAllData()
    this.timeToRefresh()
  },
   beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    // 每隔1分钟刷新一次数据
    timeToRefresh() {
      this.timer = setInterval(() => {
        // this.findLineDataByTime()
        this.searchChange()
      }, 60000)
    },
    // 通过设备类型获取所有的数据项信息
    findAllData() {
      service.get('/api_room_monitor/get_configitem_info/?devicetype_id=' + this.devicetype_id).then((data) => {
        // console.log('+++++', data)
        this.dataitem_codes = data.data.map((item) => {
          return item.dataitem_code
        })
        // console.log('this.dataitem_codes', this.dataitem_codes)
        // this.allData = data.data
        // this.code1 = this.dataitem_codes[0]
        // this.code2 = this.dataitem_codes[1]
        // this.code3 = this.dataitem_codes[2]
        // this.code4 = this.dataitem_codes[3]
        // this.code5 = this.dataitem_codes[4]
        // this.code6 = this.dataitem_codes[5]
        this.currentData[0].dataitem_code = this.dataitem_codes[0]
        this.currentData[1].dataitem_code = this.dataitem_codes[1]
        this.currentData[2].dataitem_code = this.dataitem_codes[2]
        this.currentData[3].dataitem_code = this.dataitem_codes[3]
        this.currentData[4].dataitem_code = this.dataitem_codes[4]
        this.currentData[5].dataitem_code = this.dataitem_codes[5]
      }).catch(() => {

      })
    },
    // 获取机房中某种设备类型的所有设备的列表
    getDevice(roomId, deviceTypeId) {
      service.get('/api_room_monitor/get_devices/', { params: { room_id: roomId, devicetype_id: deviceTypeId }}).then((data) => {
        // console.log(data)
        this.deviceImg = data.data.map((item) => {
          return item.device_imgpath
        })
        // console.log(this.deviceImg)
        if (this.deviceId === 18) {
          this.deviceImg1 = this.deviceImg[0]
          // console.log(this.deviceImg1)
        } else if (this.deviceId === 19) {
          this.deviceImg1 = this.deviceImg[1]
          // console.log(this.deviceImg1)
        }
      }).catch(() => {

      })
    },
    // 获取指定设备类型下所有的设备当前的数据
    getCurrentData() {
      service.get('/api_room_monitor/get_current_data/?device_ids=' + this.deviceId).then((data) => {
        this.currentData = data.data[0].data
        // console.log(this.currentData)
        this.findAllData()
      }).catch(() => {

      })
    },
    // 打开模态框
    toOpenDialog(dataitem_code, name) {
      // 更改当前的设备项码
      this.dataitem_code1 = dataitem_code
      this.findLineDataByTime()
      this.dialog.title = name
      this.dialog.visible = true
    },
    // 关闭模态框
    closeDialog() {
      this.dialog.visible = false
    },
    // 关闭模态框
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 通过确定的时间选择该时间点对应的数据
    // 获取某一设备的某一数据项的历史数据，给后台一个设备id和开始和结束时间和数据项码
    findLineDataByTime() {
      // alert(1)
      if (this.time1 != null) {
        // 获取选择的时间
        const obj = { params: {
          start_time: this.time1[0],
          end_time: this.time1[1],
          device_ids: this.deviceId,
          dataitem_code: this. dataitem_code1
        }}
        service.get('/api_room_monitor/get_history_data/', obj).then((data) => {
          // console.log('data', data)
          this.counts = data.data.values[0].data
          this.time9 = data.data.times
          // console.log('this.time9',this.time9)
          this.name = data.data.values[0].name
          setTimeout(() => {
            this.drawFirst3()
          }, 200)
        }).catch(() => {

        })
      }
    },
    // 查找数据,绘制曲线
    // 获取某一设备的所有数据项的历史数据，给后台一个设备id和开始和结束时间
    searchChange() {
      // console.log(1)
      const obj = { params: {
        start_time: this.searchTime[0],
        end_time: this.searchTime[1],
        device_id: this.deviceId
      }}
      // console.log(obj)
      service.get('/api_room_monitor/get_device_data/', obj).then((data) => {
        // console.log(data)
        this.CT1 = data.data.datas[0].data
        this.CT2 = data.data.datas[1].data
        this.CT3 = data.data.datas[2].data
        this.DC1 = data.data.datas[3].data
        this.DC2 = data.data.datas[4].data
        this.DC3 = data.data.datas[5].data
        this.ctTime = data.data.times
        setTimeout(() => {
          this.drawFirst1()
          this.drawFirst2()
        }, 200)
      }).catch(() => {

      })
    },
    // 绘制模态框
    drawFirst3() {
      // console.log(timeData)
      var myChart = echarts.init(document.getElementById('container3'))
      myChart.setOption({
        // textStyle: {
        //   color: 'rgba(255, 255, 255, 0.3)'
        // },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.name,
          textStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        grid: {
          left: '3%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.time9
        },
        yAxis: [{
          name: 'V',
          type: 'value'
        }],
        // color: ['#F56C6C', '#E6A23C', '#b03a5b'],
        series: [
          {
            name: this.name,
            type: 'line',
            smooth: true,
            data: this.counts
          }
        ]
      })
    },
    // 绘制电流
    drawFirst1() {
      // console.log(timeData)
      var myChart = echarts.init(document.getElementById('container1'))
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: 40,
          top: 20,
          data: ['A相电流', 'B相电流', 'C相电流']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.ctTime
          // data: data.times
        },
        yAxis: [{
          name: 'A',
          type: 'value'
        }],
        series: [
          {
            name: 'A相电流',
            type: 'line',
            smooth: true,
            data: this.CT1
          },
          {
            name: 'B相电流',
            type: 'line',
            smooth: true,
            data: this.CT2
          },
          {
            name: 'C相电流',
            type: 'line',
            smooth: true,
            data: this.CT3
          }
        ]
      })
    },
    // 绘制电压
    drawFirst2() {
      // console.log(timeData)
      var myChart = echarts.init(document.getElementById('container2'))
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: 40,
          top: 20,
          data: ['A相电压', 'B相电压', 'C相电压']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.ctTime
          // data: data.times
        },
        yAxis: [{
          name: 'V',
          type: 'value'
        }],
        series: [
          {
            name: 'A相电压',
            type: 'line',
            smooth: true,
            data: this.DC1
          },
          {
            name: 'B相电压',
            type: 'line',
            smooth: true,
            data: this.DC2
          },
          {
            name: 'C相电压',
            type: 'line',
            smooth: true,
            data: this.DC3
          }
        ]
      })
    },
    // 点击本月,本季度,本年触发事件
    changeTimeByOption1(option) {
      if (option === 1) {
        this.searchTime = this.time()
      } else if (option === 2) {
        this.searchTime = this.week()
      } else if (option === 3) {
        this.searchTime = this.month()
      } else {
        this.searchTime = this.quarter()
      }
      this.searchChange()
    },
    changeTimeByOption(option) {
      if (option === 1) {
        this.time1 = this.time()
      } else if (option === 2) {
        this.time1 = this.week()
      } else if (option === 3) {
        this.time1 = this.month()
      } else {
        this.time1 = this.quarter()
      }
      this.findLineDataByTime()
    },
    // 获取当天时间段
    time() {
      const time = new Date()
      // const now = time.getTime()
      const todayStart = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + 'T' + '0:0:0' + 'Z'
      const todayEnd = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + 'T' + '23:59:59' + 'Z'
      return ([todayStart, todayEnd])
    },
    // 获取本月时间段
    month() {
      const month = new Date()
      const monthStart = month.getFullYear() + '-' + (month.getMonth() + 1) + '-' + 1 + ' ' + '0:0:0'
      // console.log(month.getMonth())
      if (month.getMonth() <= 10) {
        var monthEnd = month.getFullYear() + '-' + (month.getMonth() + 2) + '-' + 1 + ' ' + '0:0:0'
      } else {
        monthEnd = (month.getFullYear() + 1) + '-' + 1 + '-' + 1 + ' ' + '0:0:0'
      }
      return [monthStart, monthEnd]
    },
    // 获取本周时间段
    week() {
      const now = new Date() // 当前日期
      const nowDayOfWeek = now.getDay() // 今天本周的第几天
      const nowDay = now.getDate() // 当前日
      const nowMonth = now.getMonth() // 当前月
      const nowYear = now.getYear() + 1900 // 当前年
      let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
      let weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek))
      weekStartDate = this.timestampToTime(Date.parse(weekStartDate))
      weekEndDate = this.timestampToTime(Date.parse(weekEndDate))
      return [weekStartDate, weekEndDate]
    },
    // 获取本季度时间段
    quarter() {
      const now = new Date()
      const nowYear = now.getYear() + 1900 // 年
      const nowMonth = now.getMonth() // 当前月
      let start = ''
      let end = ''
      if (nowMonth < 3) {
        start = nowYear + '-1-1 0:0:0'
        end = nowYear + '-4-1 0:0:0'
      } else if (nowMonth >= 3 && nowMonth < 6) {
        start = nowYear + '-4-1 0:0:0'
        end = nowYear + '-7-1 0:0:0'
      } else if (nowMonth >= 6 && nowMonth < 9) {
        start = nowYear + '-7-1 0:0:0'
        end = nowYear + '-10-1 0:0:0'
      } else if (nowMonth >= 9) {
        start = nowYear + '-10-1 0:0:0'
        end = (nowYear + 1) + '-1-1 0:0:0'
      }
      return [start, end]
    },
    // 时间系列化
    timestampToTime(timestamp) {
      const date = new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      const D = date.getDate() + ' '
      const h = date.getHours() + ':'
      const m = date.getMinutes() + ':'
      const s = date.getSeconds()
      return Y + M + D + h + m + s
    }
  }
}
</script>

<style scoped>
  .distribution{
    overflow: hidden;
  }
  .distribution > div {
    float: left;
  }
  .distribution .left {
    width: 300px;
    height: 300px;
  }
  .distribution img {
    width: 300px;
    height: 300px;
  }
  .distribution .choiceTime {
    margin-top: 1em;
    margin-left: 1em
  }
  .distribution .choiceTime span {
   border: 1px solid #ccc;
   padding: .3em;
   border-radius: 5px;
   background-color: #ecf5ff;
   cursor: pointer;
 }
 .el-dialog span:not(:last-child) {
   border: 1px solid #ccc;
   padding: .3em;
   border-radius: 5px;
   background-color: #ecf5ff;
   cursor: pointer;
 }
  .text {
    font-size: 14px;
  }
  .item {
    padding: 10px 0;
    /* margin-left: 400px */
  }
  .box-card {
    background: white;
    width: 160px;
    min-height: 200px;
    cursor: pointer;
  }
  .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    box-shadow: 8px 8px 20px 0 #ccc;
  }
 .box-card {
    box-sizing: border-box;
    float: left;
    margin: 8px;
 }
 .card_top {
    width: 100%;
    height: 100px;
    background-color: #ecf5ff;
    float: left;
    text-align: center;
 }
 .card_top span{
    line-height: 100px;
    color: #969696;
    font-size: 15px;
    font-weight: bolder;
 }
 .card_bottom{
    width: 100%;
    height: 50px;
    float: left;
    opacity: 0.4;
    background-color: #b3d8ff;
    text-align: center;
 }
 .card_bottom span{
    line-height: 50px;
    font-size: 15px;
    color: black;
    font-weight: bolder;
 }
 .list {
   overflow: hidden;
   float: right;
   /* width: 700px */
 }
</style>
