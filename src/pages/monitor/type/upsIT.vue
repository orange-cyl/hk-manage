<template>
  <div class="upsIT">
    <div v-for="(obj,index) in allDeviceType.dataitems" :key="index">
      <el-card v-for="(item,index) in obj.table" :key="index" class="box-card">
        <div class="text item">
          <div class="card_top" @click="showDialog(item)">
            <span>{{ item.dataitem_value }}{{ item.dataitem_unit }}</span>
          </div>
          <div class="card_bottom">
            <span>{{ item.dataitem_name }}</span>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="60%" center>
      <div class="row">
        <div class="col-sm-12 searchDiv">
          <el-date-picker v-model="times" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" align="right" type="datetimerange" size="mini" @change="findLineDataByTime" />
          <span class="dataOptions optionDay" style="background:#b3d8ff;border-radius:5px;cursor:pointer;" @click="changeTimeByOption(1)">本天</span>
          <span class="dataOptions optionWeek" style="background:#b3d8ff;border-radius:5px;cursor:pointer;" @click="changeTimeByOption(2)">本周</span>
          <span class="dataOptions optionMonth" style="background:#b3d8ff;border-radius:5px;cursor: pointer;" @click="changeTimeByOption(3)">本月</span>
          <span class="dataOptions optionQuarter " style="background:#b3d8ff;border-radius:5px;cursor: pointer;" @click="changeTimeByOption(4)">本季度</span>
        </div>
      </div>
      <div class="row">
        <div id="upsItContainer" class="col-sm-12" style="min-width:400px;height:300px;" />
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
// import service from '@/http/service'
import service from '@/utils/request'
import Highcharts from 'highcharts'
export default {
  data() {
    return {
      devicetype_id: '',
      upsItAllDeviceOfOne: [],
      dataitem_code: '',
      times: '',
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
      allLineData: [],
      dialogFormVisible: false,
      dialogTitle: '',
      // 所有设备类型下的数据
      allDeviceType: [],
      device_id: '',
      upsItOneHistoryValueOfOne: [],
      interval:null
    }
  },
  computed: {
    // 折线图x轴
    lineXDateData() {
      if (this.upsItOneHistoryValueOfOne && this.upsItOneHistoryValueOfOne.times) {
        const tempArr = this.upsItOneHistoryValueOfOne.times
        const arr = []
        tempArr.forEach((item) => {
          // IE
          if (!new Date(item).getTime()) {
            item = item.replace(/-/g, '/')
          }
          arr.push(new Date(item).getTime())
        })
        return arr
      } else {
        return []
      }
    },
    allData() {
      if (this.upsItOneHistoryValueOfOne && this.upsItOneHistoryValueOfOne.values) {
        return this.upsItOneHistoryValueOfOne.values
      } else {
        return []
      }
    }
  },
  created() {
    this.interval = setInterval(()=>{this.loadAllDevice()},60000)
  },
  beforeDestroy(){
    clearInterval(this.interval);
  },
  methods: {
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
      } else {
        this.times = this.quarter()
      }
      this.findLineDataByTime()
    },
    // 绘制
    drawFirst() {
      this.allLineData = []
      // 封装数据
      if (this.allData && this.allData.length > 0) {
        this.allData.forEach((item) => {
          const tempObj = {
            name: item.name
          }
          if (item.data && item.data.length > 0) {
            const tempArr = []
            item.data.forEach((num, index) => {
              tempArr.push([this.lineXDateData[index], +num])
            })
            tempArr.sort(function(x, y) {
              return x[0] - y[0]
            })
            tempObj.data = tempArr
          }
          this.allLineData.push(tempObj)
        })
      }
      var chart = Highcharts.chart('upsItContainer', {
        colors: ['#7AB6EC', '#F56C6C'],
        chart: {
          zoomType: 'x',
          type: 'spline'
          // type: 'area'
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
          }
        },
        legend: {
          enabled: false
        },
        series: this.allLineData,
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
            }
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      })
    },
    // 绘制电池维护状态
    drawFirst1() {
      this.allLineData = []
      // 封装数据
      if (this.allData && this.allData.length > 0) {
        this.allData.forEach((item) => {
          const tempObj = {
            name: item.name,
            step: 'right'
          }
          if (item.data && item.data.length > 0) {
            const tempArr = []
            item.data.forEach((num, index) => {
              tempArr.push([this.lineXDateData[index], +num])
            })
            tempArr.sort(function(x, y) {
              return x[0] - y[0]
            })
            tempObj.data = tempArr
          }
          this.allLineData.push(tempObj)
        })
      }
      var chart = Highcharts.chart('upsItContainer', {
        colors: ['#7AB6EC', '#F56C6C'],
        chart: {
          zoomType: 'x'
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
          },
          pointFormatter: function() {
            let tempY
            if (this.y === 0) {
              tempY = '未维护测试'
            } else if (this.y === 1) {
              tempY = '成功'
            } else if (this.y === 2) {
              tempY = '失败'
            } else if (this.y === 3) {
              tempY = '维护测试中'
            } else {
              tempY = ''
            }
            return this.series.name + ': <b>' + tempY + '</b>'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          categories: ['未维护测试', '成功', '失败', '维护测试中']
        },
        legend: {
          enabled: false
        },
        series: this.allLineData,
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
            }
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      })
    },
    // 绘制整流器状态
    drawFirst2() {
      this.allLineData = []
      // 封装数据
      if (this.allData && this.allData.length > 0) {
        this.allData.forEach((item) => {
          const tempObj = {
            name: item.name,
            step: 'right'
          }
          if (item.data && item.data.length > 0) {
            const tempArr = []
            item.data.forEach((num, index) => {
              tempArr.push([this.lineXDateData[index], +num])
            })
            tempArr.sort(function(x, y) {
              return x[0] - y[0]
            })
            tempObj.data = tempArr
          }
          this.allLineData.push(tempObj)
        })
      }
      var chart = Highcharts.chart('upsItContainer', {
        colors: ['#7AB6EC', '#F56C6C'],
        chart: {
          zoomType: 'x'
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
          },
          pointFormatter: function() {
            let tempY
            if (this.y === 0) {
              // tempY="OFF";
              tempY = '关闭'
            } else if (this.y === 1) {
              // tempY="SoftStart";
              tempY = '软启动'
            } else if (this.y === 2) {
              // tempY="NormalWork";
              tempY = '正常工作'
            } else {
              tempY = ''
            }
            return this.series.name + ': <b>' + tempY + '</b>'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          // categories:['OFF','SoftStart','NormalWork'],
          categories: ['关闭', '软启动', '正常工作']
        },
        legend: {
          enabled: false
        },
        series: this.allLineData,
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
            }
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      })
    },
    // EOD 系统禁止
    drawFirst3() {
      this.allLineData = []
      // 封装数据
      if (this.allData && this.allData.length > 0) {
        this.allData.forEach((item) => {
          const tempObj = {
            name: item.name,
            step: 'right'
          }
          if (item.data && item.data.length > 0) {
            const tempArr = []
            item.data.forEach((num, index) => {
              tempArr.push([this.lineXDateData[index], +num])
            })
            tempArr.sort(function(x, y) {
              return x[0] - y[0]
            })
            tempObj.data = tempArr
          }
          this.allLineData.push(tempObj)
        })
      }
      var chart = Highcharts.chart('upsItContainer', {
        colors: ['#7AB6EC', '#F56C6C'],
        chart: {
          zoomType: 'x'
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
          },
          pointFormatter: function() {
            const tempY = this.y === 0 ? '未禁止' : '禁止'
            return this.series.name + ': <b>' + tempY + '</b>'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          categories: ['未禁止', '禁止']
        },
        legend: {
          enabled: false
        },
        series: this.allLineData,
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
            }
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      })
    },
    // 绘制拔出 接入
    drawFirst4() {
      this.allLineData = []
      // 封装数据
      if (this.allData && this.allData.length > 0) {
        this.allData.forEach((item) => {
          const tempObj = {
            name: item.name,
            step: 'right'
          }
          if (item.data && item.data.length > 0) {
            const tempArr = []
            item.data.forEach((num, index) => {
              tempArr.push([this.lineXDateData[index], +num])
            })
            tempArr.sort(function(x, y) {
              return x[0] - y[0]
            })
            tempObj.data = tempArr
          }
          this.allLineData.push(tempObj)
        })
      }
      var chart = Highcharts.chart('upsItContainer', {
        colors: ['#7AB6EC', '#F56C6C'],
        chart: {
          zoomType: 'x'
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
          },
          pointFormatter: function() {
            const tempY = this.y === 0 ? '拔出' : '接入'
            return this.series.name + ': <b>' + tempY + '</b>'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          categories: ['拔出', '接入']
        },
        legend: {
          enabled: false
        },
        series: this.allLineData,
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
            }
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      })
    },
    // 绘制电池自检状态
    drawFirst5() {
      this.allLineData = []
      // 封装数据
      if (this.allData && this.allData.length > 0) {
        this.allData.forEach((item) => {
          const tempObj = {
            name: item.name,
            step: 'right'
          }
          if (item.data && item.data.length > 0) {
            const tempArr = []
            item.data.forEach((num, index) => {
              tempArr.push([this.lineXDateData[index], +num])
            })
            tempArr.sort(function(x, y) {
              return x[0] - y[0]
            })
            tempObj.data = tempArr
          }
          this.allLineData.push(tempObj)
        })
      }
      var chart = Highcharts.chart('upsItContainer', {
        colors: ['#7AB6EC', '#F56C6C'],
        chart: {
          zoomType: 'x'
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
          },
          pointFormatter: function() {
            let tempY
            if (this.y === 0) {
              tempY = '未自检'
            } else if (this.y === 1) {
              tempY = '成功'
            } else if (this.y === 2) {
              tempY = '失败'
            } else if (this.y === 3) {
              tempY = '自检中'
            } else {
              tempY = ''
            }
            return this.series.name + ': <b>' + tempY + '</b>'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          categories: ['未自检', '成功', '失败', '自检中']
        },
        legend: {
          enabled: false
        },
        series: this.allLineData,
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
            }
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      })
    },
    // 绘制EPO
    drawFirst6() {
      this.allLineData = []
      // 封装数据
      if (this.allData && this.allData.length > 0) {
        this.allData.forEach((item) => {
          const tempObj = {
            name: item.name,
            step: 'right'
          }
          if (item.data && item.data.length > 0) {
            const tempArr = []
            item.data.forEach((num, index) => {
              tempArr.push([this.lineXDateData[index], +num])
            })
            tempArr.sort(function(x, y) {
              return x[0] - y[0]
            })
            tempObj.data = tempArr
          }
          this.allLineData.push(tempObj)
        })
      }
      var chart = Highcharts.chart('upsItContainer', {
        colors: ['#7AB6EC', '#F56C6C'],
        chart: {
          zoomType: 'x'
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
          },
          pointFormatter: function() {
            const tempY = this.y === 0 ? '无紧急关机' : '紧急关机'
            return this.series.name + ': <b>' + tempY + '</b>'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          categories: ['无紧急关机', '紧急关机']
        },
        legend: {
          enabled: false
        },
        series: this.allLineData,
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
            }
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      })
    },
    // 绘制维修旁路空开状态
    drawFirst7() {
      this.allLineData = []
      // 封装数据
      if (this.allData && this.allData.length > 0) {
        this.allData.forEach((item) => {
          const tempObj = {
            name: item.name,
            step: 'right'
          }
          if (item.data && item.data.length > 0) {
            const tempArr = []
            item.data.forEach((num, index) => {
              tempArr.push([this.lineXDateData[index], +num])
            })
            tempArr.sort(function(x, y) {
              return x[0] - y[0]
            })
            tempObj.data = tempArr
          }
          this.allLineData.push(tempObj)
        })
      }
      var chart = Highcharts.chart('upsItContainer', {
        colors: ['#7AB6EC', '#F56C6C'],
        chart: {
          zoomType: 'x'
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
          },
          pointFormatter: function() {
            const tempY = this.y === 0 ? '断开' : '闭合'
            return this.series.name + ': <b>' + tempY + '</b>'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          categories: ['断开', '闭合']
        },
        legend: {
          enabled: false
        },
        series: this.allLineData,
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
            }
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      })
    },
    // 绘制电池连接状态
    drawFirst8() {
      this.allLineData = []
      // 封装数据
      if (this.allData && this.allData.length > 0) {
        this.allData.forEach((item) => {
          const tempObj = {
            name: item.name,
            step: 'right'
          }
          if (item.data && item.data.length > 0) {
            const tempArr = []
            item.data.forEach((num, index) => {
              tempArr.push([this.lineXDateData[index], +num])
            })
            tempArr.sort(function(x, y) {
              return x[0] - y[0]
            })
            tempObj.data = tempArr
          }
          this.allLineData.push(tempObj)
        })
      }
      var chart = Highcharts.chart('upsItContainer', {
        colors: ['#7AB6EC', '#F56C6C'],
        chart: {
          zoomType: 'x'
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
          },
          pointFormatter: function() {
            const tempY = this.y === 0 ? '未连接' : '已连接'
            return this.series.name + ': <b>' + tempY + '</b>'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          categories: ['未连接', '已连接']
        },
        legend: {
          enabled: false
        },
        series: this.allLineData,
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
            }
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      })
    },
    // 绘制电池状态
    drawFirst9() {
      this.allLineData = []
      // 封装数据
      if (this.allData && this.allData.length > 0) {
        this.allData.forEach((item) => {
          const tempObj = {
            name: item.name,
            step: 'right'
          }
          if (item.data && item.data.length > 0) {
            const tempArr = []
            item.data.forEach((num, index) => {
              tempArr.push([this.lineXDateData[index], +num])
            })
            tempArr.sort(function(x, y) {
              return x[0] - y[0]
            })
            tempObj.data = tempArr
          }
          this.allLineData.push(tempObj)
        })
      }
      var chart = Highcharts.chart('upsItContainer', {
        colors: ['#7AB6EC', '#F56C6C'],
        chart: {
          zoomType: 'x'
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
          },
          pointFormatter: function() {
            let tempY
            if (this.y === 0) {
              tempY = '电池未工作'
            } else if (this.y === 1) {
              tempY = '电池浮充'
            } else if (this.y === 2) {
              tempY = '电池均充'
            } else if (this.y === 3) {
              tempY = '电池放电'
            } else {
              tempY = ''
            }
            return this.series.name + ': <b>' + tempY + '</b>'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          categories: ['电池未工作', '电池浮充', '电池均充', '电池放电']
        },
        legend: {
          enabled: false
        },
        series: this.allLineData,
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
            }
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      })
    },
    // 绘制供电方式
    drawFirst10() {
      this.allLineData = []
      // 封装数据
      if (this.allData && this.allData.length > 0) {
        this.allData.forEach((item) => {
          const tempObj = {
            name: item.name,
            step: 'right'
          }
          if (item.data && item.data.length > 0) {
            const tempArr = []
            item.data.forEach((num, index) => {
              tempArr.push([this.lineXDateData[index], +num])
            })
            tempArr.sort(function(x, y) {
              return x[0] - y[0]
            })
            tempObj.data = tempArr
          }
          this.allLineData.push(tempObj)
        })
      }
      var chart = Highcharts.chart('upsItContainer', {
        colors: ['#7AB6EC', '#F56C6C'],
        chart: {
          zoomType: 'x'
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
          },
          pointFormatter: function() {
            let tempY
            if (this.y === 0) {
              tempY = '均不供电'
            } else if (this.y === 1) {
              tempY = 'UPS 供电'
            } else if (this.y === 2) {
              tempY = '旁路供电'
            } else {
              tempY = ''
            }
            return this.series.name + ': <b>' + tempY + '</b>'
          }
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ''
          },
          categories: ['均不供电', 'UPS 供电', '旁路供电']
        },
        legend: {
          enabled: false
        },
        series: this.allLineData,
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
            }
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
        }
      })
    },
    // 获取当天时间段
    time() {
      const time = new Date()
      const todayStart = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + 'T' + '0:0:0' + 'Z'
      const todayEnd = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + 'T' + '23:59:59' + 'Z'
      return ([todayStart, todayEnd])
    },
    // 点击显示模态框
    showDialog(obj) {
      this.times = this.time()
      this.dialogFormVisible = true
      this.dialogTitle = obj.dataitem_name + '统计图' + (obj.dataitem_unit ? '(单位:' + obj.dataitem_unit + ')' : '')
      if (this.upsItAllDeviceOfOne && this.upsItAllDeviceOfOne.length > 0) {
        this.dataitem_code = this.upsItAllDeviceOfOne.filter((item) => {
          return item.dataitem_name === obj.dataitem_name
        })[0].dataitem_code
      }
      this.currentDataitemName = obj.dataitem_name
      this.findLineDataByTime()
    },
    // 通过确定的时间选择该时间点对应的数据
    findLineDataByTime() {
      if (this.times !== null) {
        // 获取选择的时间
        const obj = {
          params: {
            start_time: this.times[0],
            end_time: this.times[1],
            device_ids: '[' + this.device_id + ']',
            dataitem_code: this.dataitem_code
          }
        }
        service.get('/api_room_monitor/get_history_data/', obj).then(({ data }) => {
          this.upsItOneHistoryValueOfOne = data
          setTimeout(() => {
            const tempArr = ['模块1插入', '模块2插入', '模块3插入', '模块4插入', '模块5插入', '模块6插入']
            const result = tempArr.some((item) => {
              return item === this.currentDataitemName
            })
            if (result) {
              this.drawFirst4()
            } else if (this.currentDataitemName === '电池维护状态') {
              this.drawFirst1()
            } else if (this.currentDataitemName === '整流器状态') {
              this.drawFirst2()
            } else if (this.currentDataitemName === 'EOD 系统禁止') {
              this.drawFirst3()
            } else if (this.currentDataitemName === '电池自检状态') {
              this.drawFirst5()
            } else if (this.currentDataitemName === 'EPO') {
              this.drawFirst6()
            } else if (this.currentDataitemName === '维修旁路空开状态') {
              this.drawFirst7()
            } else if (this.currentDataitemName === '电池连接状态') {
              this.drawFirst8()
            } else if (this.currentDataitemName === '电池状态') {
              this.drawFirst9()
            } else if (this.currentDataitemName === '供电方式') {
              this.drawFirst10()
            } else {
              this.drawFirst()
            }
          }, 300)
        })
      }
    },
    loadAllDeviceType() {
      service.get('/api_room_monitor/get_configitem_info/', { params: { devicetype_id: 16 } }).then(({ data }) => {
        // console.log(data)
        this.upsItAllDeviceOfOne = data
      })
    },
    loadAllDevice() {
      const num = Number(this.device_id)
      service.get('/api_device/list_device_detail/', { params: { device_id: num } }).then(({ data }) => {
        // 将空值设置为‘--’
        if (data[0]) {
          data[0].dataitems.forEach((obj) => {
            if (obj.table && obj.table.length > 0) {
              obj.table.forEach((item) => {
                if (!item.dataitem_value) {
                  item.dataitem_value = '--'
                }
              })
            }
          })
        }
        this.allDeviceType = data[0]
        this.loadAllDeviceType()
      })
    }
  }
}

</script>
