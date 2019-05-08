<template>
  <div class="upsBattery">
    <div v-for="(item,index) in allDeviceType" :key="index">
      <el-card class="box-card">
        <div class="text item">
          <div class="card_top" @click="addTime(item)">
            <span v-for="(items,indexs) in item.table" :key="indexs" :style="'color:'+items.dataitem_color">{{ items.dataitem_value }}{{ items.dataitem_unit }}&nbsp;&nbsp;</span>
          </div>
          <div class="card_bottom">
            <span>{{ item.groupname }}</span>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="60%" center>
      <div class="row">
        <div class="col-sm-12 searchDiv">
          <el-date-picker v-model="times" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" align="right" type="datetimerange" size="mini" @change="findLineDataByTime" />
          <span style="background:#b3d8ff;border-radius:5px;cursor:pointer;" class="dataOptions optionDay" @click="changeTimeByOption(1)">本天</span>
          <span style="background:#b3d8ff;border-radius:5px;cursor:pointer;" class="dataOptions optionWeek" @click="changeTimeByOption(2)">本周</span>
          <span style="background:#b3d8ff;border-radius:5px;cursor:pointer;" class="dataOptions optionMonth" @click="changeTimeByOption(3)">本月</span>
          <span style="background:#b3d8ff;border-radius:5px;cursor:pointer;" class="dataOptions optionQuarter" @click="changeTimeByOption(4)">本季度</span>
        </div>
      </div>
      <div class="row">
        <div id="chart" class="chart">
          <div id="v" class="col-sm-12" style="min-width:400px;height:140px;" />
          <div id="c" class="col-sm-12" style="min-width:400px;height:140px;" />
          <div id="o" class="col-sm-12" style="min-width:400px;height:140px;" />
        </div>
      </div>
    </el-dialog>
    <!-- 总值的dialog 只有两个折线图-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible_" width="60%" center>
      <div class="row">
        <div class="col-sm-12 searchDiv">
          <el-date-picker v-model="times" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" align="right" type="datetimerange" size="mini" @change="findLineDataByTime" />
          <span style="background:#b3d8ff;border-radius:5px;cursor:pointer;" class="dataOptions optionDay" @click="changeTimeByOption(1)">本天</span>
          <span style="background:#b3d8ff;border-radius:5px;cursor:pointer;" class="dataOptions optionWeek" @click="changeTimeByOption(2)">本周</span>
          <span style="background:#b3d8ff;border-radius:5px;cursor:pointer;" class="dataOptions optionMonth" @click="changeTimeByOption(3)">本月</span>
          <span style="background:#b3d8ff;border-radius:5px;cursor:pointer;" class="dataOptions optionQuarter" @click="changeTimeByOption(4)">本季度</span>
        </div>
      </div>
      <div class="row">
        <div id="chart" class="chart">
          <div id="vv" class="col-sm-12" style="min-width:400px;height:140px;" />
          <div id="cc" class="col-sm-12" style="min-width:400px;height:140px;" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style>
  .el-dialog__header{
	background-color: #ecf5ff;
}
  .text {
    font-size: 14px;
  }
  .item {
    padding: 18px 0;
  }
  .box-card {
    background: white;
    width: 12%;
    min-height: 200px;
    margin: 10px;
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
</style>
<script type="text/javascript">
// import $ from 'jquery'
// import service from '@/http/service'
import service from '@/utils/request'
import Highcharts from 'highcharts'
export default {
  data() {
    return {
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
      allDeviceType: [],
      dialogTitle: '',
      dialogFormVisible: false,
      dialogFormVisible_: false,
      times: '',
      lineDatav: [],
      lineDatac: [],
      lineDatao: [],
      lineDatavv: [],
      lineDatacc: [],
      item: '',
      interval: null
    }
  },
  created() {
    this.interval = setInterval(()=>{this.loadAllDevice()},60000)
  },
  beforeDestroy(){
    clearInterval(this.interval);
  },
  methods: {
    findLineDataByTime() {
      this.hisData(this.item)
    },
    setdraw() {
      // alert('1')
      setTimeout(() => {
        this.drawV()
        this.drawC()
        this.drawO()
      }, 2500)
    },
    setdraw2() {
      setTimeout(() => {
        this.drawVV()
        this.drawCC()
      }, 2500)
    },
    // 正则筛选数字
    findNum(str) {
      return str.match(/\d+/g)
    },
    addTime(item) {
      this.times = this.time()
      this.hisData(item)
    },
    hisData(item, index) {
      this.item = item
      const code = this.findNum(item.groupname)
      if (this.item.groupname === "总值") {
        this.dialogFormVisible = false
        this.dialogFormVisible_ = true
        const obj = {
          params: {
            start_time: this.times[0],
            end_time: this.times[1],
            device_id: this.device_id,
            dataitem_code: 'sum'
          }
        }
        service.get('/api_room_monitor/get_UPS_history_data/', obj).then(r => {
          r.data.forEach((items, indexs) => {
            items.data.forEach(it => {
              it[0] = new Date(it[0].replace(/-/g, '/')).getTime()
            })
            if (indexs === 0) {
              this.lineDatavv = [{ "name": "电压", "data": items.data, "_colorIndex": 0, "_symbolIndex": 0 }]
            } else if (indexs === 1) {
              this.lineDatacc = [{ "name": "电流", "data": items.data, "_colorIndex": 0, "_symbolIndex": 0 }]
            }
          })
          this.dialogTitle = item.groupname
          this.setdraw2()
        });
      } else {
        this.dialogFormVisible_ = false
        this.dialogFormVisible = true
        const obj = {
          params: {
            start_time: this.times[0],
            end_time: this.times[1],
            device_id: this.device_id,
            dataitem_code: code[0],
          }
        }
        service.get('/api_room_monitor/get_UPS_history_data/', obj).then(r => {
          r.data.forEach((items, indexs) => {
            items.data.forEach(it => {
              it[0] = new Date(it[0].replace(/-/g, '/')).getTime()
            })
            if (indexs === 0) {
              this.lineDatav = [{ "name": "电压", "data": items.data, "_colorIndex": 0, "_symbolIndex": 0 }]
            } else if (indexs === 1) {
              this.lineDatac = [{ "name": "温度", "data": items.data, "_colorIndex": 0, "_symbolIndex": 0 }]
            } else if (indexs === 2) {
              this.lineDatao = [{ "name": "内阻", "data": items.data, "_colorIndex": 0, "_symbolIndex": 0 }]
            }
          })
          this.dialogTitle = item.groupname
          this.setdraw()
        });
      }
    },
    month() {
      const month = new Date()
      var monthEnd
      const monthStart = month.getFullYear() + '-' + (month.getMonth() + 1) + '-' + 1 + ' ' + '0:0:0'

      if (month.getMonth() <= 10) {
        monthEnd = month.getFullYear() + '-' + (month.getMonth() + 2) + '-' + 1 + ' ' + '0:0:0'
      } else {
        monthEnd = (month.getFullYear() + 1) + '-' + 1 + '-' + 1 + ' ' + '0:0:0'
      }
      return [monthStart, monthEnd]
    },
    // 时间序列化
    timestampToTime(timestamp) {
      const date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      const D = date.getDate() + ' '
      const h = date.getHours() + ':'
      const m = date.getMinutes() + ':'
      const s = date.getSeconds()
      return Y + M + D + h + m + s
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
    // 点击本天 本周 本月 本季度
    changeTimeByOption(option) {
      if (option === 1) {
        this.times = this.time()
      } else if (option === 2) {
        this.times = this.week()
      } else if (option === 3) {
        this.times = this.month()
      } else if (option === 4) {
        this.times = this.quarter()
      }
      this.findLineDataByTime();
    },
    // 获取当天时间段
    time() {
      const time = new Date()
      const todayStart = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + 'T' + '0:0:0' + 'Z'
      const todayEnd = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + 'T' + '23:59:59' + 'Z'
      return ([todayStart, todayEnd])
    },
    loadAllDevice() {
      const num = Number(this.device_id)
      // console.log(num)
      service.get('/api_device/get_UPS_Battery_data/', { params: { device_id: num } }).then(({ data }) => {
        // console.log(data[0].dataitems)
        this.allDeviceType = data[0].dataitems
        // this.loadAllDeviceType()
      })
    },
    drawV() {
      var chart = Highcharts.chart('v', {
        colors: ['#7AB6EC'],
        chart: {
          zoomType: 'x',
          type: 'spline',
        },
        title: {
          text: null
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y'
          }
        },
        tooltip: {
          dateTimeLabelFormats: {
            millisecond: '%Y-%m-%d %H:%M:%S',
            second: '%Y-%m-%d %H:%M:%S',
            minute: '%Y-%m-%d %H:%M:%S',
            hour: '%Y-%m-%d %H:%M:%S',
            day: '%Y-%m-%d %H:%M:%S',
            week: '%Y-%m-%d %H:%M:%S',
            month: '%Y-%m-%d %H:%M:%S',
            year: '%Y-%m-%d %H:%M:%S'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          labels: {
            format: '{value}  V',
            reserveSpace: true,
            tickWidth: 10,
          },
          allowDecimals: false,
          // style:{
          //   "width":"300px"
          // },
        },
        legend: {
          enabled: false
        },
        series: this.lineDatav,
        credits: {
          enabled: false // 禁用版权信息
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            marker: {
              enabled: false
            },
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 400
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        },
      });
    },
    drawC() {
      var chart = Highcharts.chart('c', {
        colors: ['#F56C6C'],
        chart: {
          zoomType: 'x',
          type: 'spline',
        },
        title: {
          text: null
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y'
          }
        },
        tooltip: {
          dateTimeLabelFormats: {
            millisecond: '%Y-%m-%d %H:%M:%S',
            second: '%Y-%m-%d %H:%M:%S',
            minute: '%Y-%m-%d %H:%M:%S',
            hour: '%Y-%m-%d %H:%M:%S',
            day: '%Y-%m-%d %H:%M:%S',
            week: '%Y-%m-%d %H:%M:%S',
            month: '%Y-%m-%d %H:%M:%S',
            year: '%Y-%m-%d %H:%M:%S'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          labels: {
            format: '{value} ℃ ' + ' ' + ' ',
            reserveSpace: true,
            tickWidth: 10,
          },
          allowDecimals: false,
        },
        legend: {
          enabled: false
        },
        series: this.lineDatac,
        credits: {
          enabled: false // 禁用版权信息
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            marker: {
              enabled: false
            },
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 400
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        },
      });
    },
    drawO() {
      var chart = Highcharts.chart('o', {
        colors: ['#32CD32'],
        chart: {
          zoomType: 'x',
          type: 'spline',
        },
        title: {
          text: null
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y'
          }
        },
        tooltip: {
          dateTimeLabelFormats: {
            millisecond: '%Y-%m-%d %H:%M:%S',
            second: '%Y-%m-%d %H:%M:%S',
            minute: '%Y-%m-%d %H:%M:%S',
            hour: '%Y-%m-%d %H:%M:%S',
            day: '%Y-%m-%d %H:%M:%S',
            week: '%Y-%m-%d %H:%M:%S',
            month: '%Y-%m-%d %H:%M:%S',
            year: '%Y-%m-%d %H:%M:%S'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          labels: {
            format: '{value}μΩ',
            reserveSpace: true,
            tickWidth: 10,
          },
          allowDecimals: false,
        },
        legend: {
          enabled: false
        },
        series: this.lineDatao,
        credits: {
          enabled: false // 禁用版权信息
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            marker: {
              enabled: false
            },
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 400
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        },
      });
    },
    drawVV() {
      var chart = Highcharts.chart('vv', {
        colors: ['#7AB6EC'],
        chart: {
          zoomType: 'x',
          type: 'spline',
        },
        title: {
          text: null
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y'
          }
        },
        tooltip: {
          dateTimeLabelFormats: {
            millisecond: '%Y-%m-%d %H:%M:%S',
            second: '%Y-%m-%d %H:%M:%S',
            minute: '%Y-%m-%d %H:%M:%S',
            hour: '%Y-%m-%d %H:%M:%S',
            day: '%Y-%m-%d %H:%M:%S',
            week: '%Y-%m-%d %H:%M:%S',
            month: '%Y-%m-%d %H:%M:%S',
            year: '%Y-%m-%d %H:%M:%S'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          labels: {
            format: '{value}  V',
            reserveSpace: true,
            tickWidth: 10,
          },
          allowDecimals: false,
          // style:{
          //   "width":"300px"
          // },
        },
        legend: {
          enabled: false
        },
        series: this.lineDatavv,
        credits: {
          enabled: false // 禁用版权信息
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            marker: {
              enabled: false
            },
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 400
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        },
      });
    },
    drawCC() {
      var chart = Highcharts.chart('cc', {
        colors: ['#F56C6C'],
        chart: {
          zoomType: 'x',
          type: 'spline',
        },
        title: {
          text: null
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y'
          }
        },
        tooltip: {
          dateTimeLabelFormats: {
            millisecond: '%Y-%m-%d %H:%M:%S',
            second: '%Y-%m-%d %H:%M:%S',
            minute: '%Y-%m-%d %H:%M:%S',
            hour: '%Y-%m-%d %H:%M:%S',
            day: '%Y-%m-%d %H:%M:%S',
            week: '%Y-%m-%d %H:%M:%S',
            month: '%Y-%m-%d %H:%M:%S',
            year: '%Y-%m-%d %H:%M:%S'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          labels: {
            format: '{value} A ' + ' ' + ' ',
            reserveSpace: true,
            tickWidth: 10,
          },
          allowDecimals: false,
        },
        legend: {
          enabled: false
        },
        series: this.lineDatacc,
        credits: {
          enabled: false // 禁用版权信息
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            marker: {
              enabled: false
            },
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 400
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        },
      });
    }
  }
}

</script>
