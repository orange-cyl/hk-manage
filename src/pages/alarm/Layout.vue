<template>
  <div class="alarm">
    <el-row>
      <el-col :span="4">
        <el-input v-model="device_name" size="mini" placeholder="请输入设备名" clearable />
      </el-col>
      <el-col :span="4" :offset="1">
        <el-select v-model="alarm_level" clearable placeholder="报警级别" size="mini">
          <el-option v-for="item in alarm_levels" :key="item.level_id" :label="item.level_text" :value="item.level_id" />
        </el-select>
      </el-col>
      <el-col :span="10" :offset="1">
        <el-date-picker v-model="time" width="100%" value-format="timestamp" format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" />
      </el-col>
      <el-col :span="2" :offset="2">
        <iframe v-show="false" frameborder="0" width="100px" height="100px" />
        <el-button size="mini" type="primary" plain @click="exportLog()">导出</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top:12px;">
      <el-col :span="4">
        <el-input v-model="alarm_content" size="mini" placeholder="请输入报警内容" clearable />
      </el-col>
      <el-col :span="4" :offset="1">
        <el-select v-model="alarm_status" clearable placeholder="报警状态" size="mini">
          <el-option v-for="item in alarm_statuss" :key="item.status_id" :label="item.status_text" :value="item.status_id" />
        </el-select>
      </el-col>
      <el-col :span="4" :offset="1">
        <el-input v-model="room_name" size="mini" clearable placeholder="请输入机房名称" />
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button size="mini" type="primary" plain @click="filtrate()">查询</el-button>
      </el-col>
      <el-col :span="2" :offset="3">
        <el-button size="mini" type="primary" plain @click="batchModal = true, batchTextarea = '' ">批量处理</el-button>
      </el-col>
      <el-col :span="2">
        <el-button size="mini" type="primary" plain @click="checkChart">查看统计</el-button>
      </el-col>
    </el-row>
    <div id="both" />
    <!-- 表格 -->
    <el-table v-loading="loading" :data="alerm_Manager" :height="he" style="width: 100%" align="center" @row-click="rowClick" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column prop="row_no" label="序号" align="center" width="70">
        <template slot-scope="{row}">
          <span>{{ row.row_no }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="alarm_time" label="报警时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.alarm_time }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="room_name" label="报警机房" align="center">
        <template slot-scope="{row}">
          <span>{{ row.room_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="device_name" label="报警设备" align="center">
        <template slot-scope="{row}">
          <span>{{ row.device_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="alarm_status_text" label="报警状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.alarm_status_text }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="alarm_level_text" label="报警级别" align="center">
        <template slot-scope="{row}">
          <span>{{ row.alarm_level_text }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="alarm_text" label="报警内容" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.alarm_text }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="{row}">
          <i class="fa fa-eye" title="查看" style="color:#1e9d74;font-size:18px;" @click="viewModal = true" />
          <i v-if="row.alarm_status_text === '未处理'" class="fa fa-gavel" title="处理" style="color:#448db8;font-size:18px;" @click="dealModal = true,dealTextarea = ''" />
          <i v-if="row.alarm_status_text === '已处理'" class="fa fa-check" title="审核" style="color:#448db8;font-size:18px;" @click="checkModal = true,checkTextarea = ''" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看模态框 -->
    <el-dialog :visible.sync="viewModal" title="详细信息" width="60%" center>
      <el-table :data="row" style="width: 100%" border>
        <el-table-column prop="alarm_time" label="报警时间" width="180" align="center" />
        <el-table-column
          prop="room_name"
          label="报警机房"
          align="center" />
        <el-table-column
          prop="device_name"
          label="报警设备"
          align="center" />
        <el-table-column
          prop="alarm_level_text"
          label="报警级别"
          align="center" />
        <el-table-column
          prop="alarm_status_text"
          label="报警状态"
          width="180"
          align="center" />
        <el-table-column
          prop="alarm_text"
          label="报警内容"
          align="center" />
      </el-table>
      <div id="both" />
      <el-table
        :data="row"
        style="width: 100%"
        border>
        <el-table-column
          prop="process_history"
          label="处理记录"
          align="center" />
        <el-table-column
          prop="audit_history"
          label="审核记录"
          align="center" />
      </el-table>
    </el-dialog>
    <!-- 处理模态框 -->
    <el-dialog
      :visible.sync="dealModal"
      title="详细信息"
      width="60%"
      center>
      <el-table
        :data="row"
        style="width: 100%"
        border>
        <el-table-column
          prop="alarm_time"
          label="报警时间"
          width="180"
          align="center" />
        <el-table-column
          prop="room_name"
          label="报警机房"
          align="center" />
        <el-table-column
          prop="device_name"
          label="报警设备"
          align="center" />
        <el-table-column
          prop="alarm_level_text"
          label="报警级别"
          align="center" />
        <el-table-column
          prop="alarm_status_text"
          label="报警状态"
          width="180"
          align="center" />
        <el-table-column
          prop="alarm_text"
          label="报警内容"
          align="center" />
      </el-table>
      <div id="both" />
      <el-input
        :rows="4"
        v-model="dealTextarea"
        type="textarea"
        placeholder="请输入内容" />
      <div style="margin-top:15px;text-align:right">
        <el-button size="mini" plain @click="dealModal = false">取消</el-button>
        <el-button type="primary" size="mini" plain @click="submitDeal()">提交</el-button>
      </div>
    </el-dialog>
    <!-- 批量处理模态框 -->
    <el-dialog
      :visible.sync="batchModal"
      title="详细信息"
      width="60%"
      center>
      <el-table
        :data="multipleSelection"
        style="width: 100%"
        border>
        <el-table-column
          prop="alarm_time"
          label="报警时间"
          width="180"
          align="center" />
        <el-table-column
          prop="room_name"
          label="报警机房"
          align="center" />
        <el-table-column
          prop="device_name"
          label="报警设备"
          align="center" />
        <el-table-column
          prop="alarm_level_text"
          label="报警级别"
          align="center" />
        <el-table-column
          prop="alarm_status_text"
          label="报警状态"
          width="180"
          align="center" />
        <el-table-column
          prop="alarm_text"
          label="报警内容"
          align="center" />
      </el-table>
      <div id="both" />
      <el-input
        :rows="4"
        v-model="batchTextarea"
        type="textarea"
        placeholder="请输入内容" />
      <div style="margin-top:15px;text-align:right">
        <el-button size="mini" plain @click="batchModal = false">取消</el-button>
        <el-button type="primary" size="mini" plain @click="submitBatch()">提交</el-button>
      </div>
    </el-dialog>
    <!-- 审核模态框 -->
    <el-dialog
      :visible.sync="checkModal"
      title="详细信息"
      width="60%"
      center>
      <el-table
        :data="row"
        style="width: 100%"
        border>
        <el-table-column
          prop="alarm_text"
          label="报警内容"
          align="center" />
        <el-table-column
          prop="process_history"
          label="处理记录"
          align="center" />
      </el-table>
      <div id="both" />
      <el-input
        :rows="4"
        v-model="checkTextarea"
        type="textarea"
        placeholder="请输入内容" />
      <div style="margin-top:15px;text-align:right">
        <el-button size="mini" plain @click="checkModal = false">取消</el-button>
        <el-button type="primary" size="mini" plain @click="submitCheck()">提交</el-button>
      </div>
    </el-dialog>
    <!-- 图表 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="图表"
      width="60%"
      center>
      <el-row>
        <el-col :span="14" :offset="1">
          <el-date-picker v-model="value" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" size="mini" type="datetimerange" range-separator="至" align="right" @change="queryGraph" />
        </el-col>
      </el-row>
      <div id="charts" class="charts">
        <div v-if="flag == 1" id="container" style="width:450px;height:450px;margin:0 auto;"/>
      </div>
      <div>
        <div v-if="flag == 0" style="width:450px;height:450px;margin:0 auto;">
          <div style="font-size:18px;line-height:400px;">
            <span style="display:inline-block;width:100%;text-align:center">没有报警</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped>
  .alarm {
  margin: 1em;
  background: #ffffff;
  border-radius: 3px;
  padding: 1em;
}
#both {
  height: 20px;
  width: 100%;
}
</style>
<script type="text/javascript">
import $ from 'jquery'
// import axios from '@/http/axios'
import service from '@/utils/request'
import Highcharts from 'highcharts'
export default {
  data() {
    return {
      loading:false,
      chartData: [],
      // 图表划分部分
      pickerOptions: {
        shortcuts: [{
          text: '本天',
          onClick(picker) {
            picker.$emit('pick', this.times())
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
      // 设备名称
      device_name: '',
      // 报警级别
      alarm_level: '',
      alarm_levels: [],
      // 时间
      time: '',
      // 报警内容
      alarm_content: '',
      // 报警状态
      alarm_status: '',
      alarm_statuss: '',
      // 机房名称
      room_name: '',
      // 报警管理列表
      alerm_Manager: [],
      // 查看模态框
      viewModal: false,
      // 审核模态框
      checkModal: false,
      checkTextarea: '',
      // 处理模态框
      dealModal: false,
      dealTextarea: '',
      // 表格数据
      row: [],
      rows: {},
      // 批量处理模态框
      batchModal: false,
      batchTextarea: '',
      multipleSelection: '',
      // 被选中报警id所组成的数组
      oIds: '',
      // 查看图表
      flag: 1,
      value: this.times(),
      dialogVisible: false
    }
  },
  created() {
    this.loadAlarm_levels()
    this.loadAlarm_statuss()
    this.loadAlerm_Manager()
    this.he = $(window).height() - 240
  },
  methods: {
    month() {
      const month = new Date()
      var monthEnd
      const monthStart = month.getFullYear() + '-' + (month.getMonth() + 1) + '-' + 1 + ' ' + '0:0:0'
      // console.log(month.getMonth())
      if (month.getMonth() <= 10) {
        monthEnd = month.getFullYear() + '-' + (month.getMonth() + 2) + '-' + 1 + ' ' + '0:0:0'
      } else {
        monthEnd = (month.getFullYear() + 1) + '-' + 1 + '-' + 1 + ' ' + '0:0:0'
      }
      return [monthStart, monthEnd]
    },
    // 获取本周时间段
    week() {
      const now = new Date()// 当前日期
      const nowDayOfWeek = now.getDay()// 今天本周的第几天
      const nowDay = now.getDate()// 当前日
      const nowMonth = now.getMonth()// 当前月
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
      const nowYear = now.getYear() + 1900// 年
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
    // 渲染highcharts
    checkChart() {
      this.dialogVisible = true
      setTimeout(() => {
        this.queryGraph()
      }, 100)
    },
    // highcharts图表
    initChart() {
      var chart = Highcharts.chart('container', {
        colors: ['pink', '#FFF263', 'lightblue'],
        credits: {
          enabled: false
        },
        chart: {
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
          }
        },
        title: {
          text: '报警统计',
          style: { 'fontSize': '14px' }
        },
        tooltip: {
          pointFormat: '{series.name}:<b>{point.y}</b> 占比:<b>{point.percentage:.2f}%</b>'
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false
            },
            showInLegend: true,
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 25
          }
        },
        series: [{
          type: 'pie',
          name: '条数',
          data: this.chartData
        }]
      })
    },
    // charts中查询
    queryGraph() {
      const obj = {
        start_time: this.value[0],
        end_time: this.value[1]
      }
      service.get('/api_alarm/get_alarm_statistics/', { params: obj }).then(r => {
        if (r.data[0][1] === 0 && r.data[1][1] === 0 && r.data[2][1] === 0) {
          this.flag = 0
        } else if (r.data[0][1] !== 0 || r.data[1][1] !== 0 || r.data[2][1] !== 0) {
          this.flag = 1
          this.chartData = r.data
          setTimeout(() => {
            this.initChart()
          }, 100)
        }
      })
    },
    // 获取当天时间段
    times() {
      const times = new Date()
      const todayStart = times.getFullYear() + '-' + (times.getMonth() + 1) + '-' + times.getDate() + 'T' + '0:0:0' + 'Z'
      const todayEnd = times.getFullYear() + '-' + (times.getMonth() + 1) + '-' + times.getDate() + 'T' + '23:59:59' + 'Z'
      return ([todayStart, todayEnd])
    },
    // 导出
    exportLog() {
      this.$confirm('将导出搜索的结果,确认要导出么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        // let str = $.param(this.params);
        this.url = 'http://192.168.50.50:10000/api_alarm/export_alarm_list/?'
        // console.log('========',this.url)
        window.location.href = this.url
        this.$notify({
          title: '成功',
          message: '正在下载...',
          type: 'success'
        })
      }).catch(() => {
        this.$notify.info({
          title: '消息',
          message: '已取消'
        })
      })
    },
    // 查询
    filtrate() {
      var filtrate = {}
      if (this.device_name !== '') {
        filtrate.device_name = this.device_name
      }
      if (this.alarm_level !== '') {
        filtrate.alarm_level = this.alarm_level
      }
      if (this.alarm_status !== '') {
        filtrate.alarm_status = this.alarm_status
      }
      if (this.time !== '' && this.time !== null) {
        filtrate.start_time = this.timestampToTime(this.time[0])
        filtrate.end_time = this.timestampToTime(this.time[1] + 86399000)
      }
      if (this.alarm_content !== '') {
        filtrate.alarm_text = this.alarm_content
      }
      this.loadAlerm_Manager(filtrate)
    },
    // 时间序列化
    timestampToTime(timestamp) {
      const date = new Date(timestamp)// 时间戳为10位需*1000,时间戳为13位的话不需乘1000
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      const D = date.getDate() + ' '
      const h = date.getHours() + ':'
      const m = date.getMinutes() + ':'
      const s = date.getSeconds()
      return Y + M + D + h + m + s
    },
    // 批量处理
    submitBatch() {
      this.batchModal = false
      const arr = []
      this.multipleSelection.forEach(item => {
        arr.push(item.alarm_id)
      })
      const data = {
        alarm_id: arr,
        process_text: this.batchTextarea
      }
      service.post('/api_alarm/process_alarm/', data).then(() => {
        this.loadAlerm_Manager()
        this.loadAlarm_statuss()
        this.loadAlarm_levels()
        this.$notify({
          title: '处理成功',
          message: '这是一条成功的提示消息',
          type: 'success'
        })
      }).catch(() => {
        this.$notify.error({
          title: '网络超时',
          message: '这是一条错误的提示消息'
        })
      })
    },
    // 处理提交
    submitDeal() {
      this.dealModal = false
      const data = {
        alarm_id: [this.rows.alarm_id],
        process_text: this.dealTextarea
      }
      service.post('/api_alarm/process_alarm/', data).then(() => {
        this.loadAlerm_Manager()
        this.loadAlarm_statuss()
        this.loadAlarm_levels()
        this.$notify({
          title: '处理成功',
          message: '这是一条成功的提示消息',
          type: 'success'
        })
      }).catch(() => {
        this.$notify.error({
          title: '网络超时',
          message: '这是一条错误的提示消息'
        })
      })
    },
    // 提交审核
    submitCheck() {
      this.checkModal = false
      const obj = {
        alarm_id: this.rows.alarm_id,
        audit_text: this.checkTextarea
      }
      service.post('/api_alarm/audit_alarm/', obj).then(() => {
        this.loadAlerm_Manager()
        this.loadAlarm_statuss()
        this.loadAlarm_levels()
        this.$notify({
          title: '审核成功',
          message: '这是一条成功的提示消息',
          type: 'success'
        })
      }).catch(() => {
        this.$notify.error({
          title: '网络超时',
          message: '这是一条错误的提示消息'
        })
      })
    },
    // 拿到一行的数据
    rowClick(s) {
      this.rows = s
      this.row = Array.of(s)
    },
    // 当多选框改变时
    handleSelectionChange(val) {
      this.multipleSelection = val
      // console.log(this.multipleSelection)
    },
    // 获取报警级别
    loadAlarm_levels() {
      service.get('/api_alarm/get_alarm_level/')
        .then(({ data }) => {
          this.alarm_levels = data.result
        }).catch(() => {
          this.$notify.error({
            title: '网络超时',
            message: '这是一条错误的提示消息'
          })
        })
    },
    // 获取报警状态
    loadAlarm_statuss() {
      service.get('/api_alarm/get_alarm_status/')
        .then(({ data }) => {
          this.alarm_statuss = data.result
        }).catch(() => {
          this.$notify.error({
            title: '网络超时',
            message: '这是一条错误的提示消息'
          })
        })
    },
    // 获取报警列表
    loadAlerm_Manager(item) {
      this.loading = true
      service.get('/api_alarm/get_alarm_list/', { params: item })
        .then(({ data }) => {
          this.alerm_Manager = data.result
        }).catch(() => {
          this.$notify.error({
            title: '网络超时',
            message: '这是一条错误的提示消息'
          })
        }).finally(() => {
          this.loading = false
        })
    }
  }
}

</script>
