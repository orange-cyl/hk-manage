<template>
  <div class="CoolMaster">
    <div class="list">
      <img :src="deviceImg" alt="图片正在加载...">
      <el-card v-for="item in allData" :key="item.name" :id="item.dataitem_code" class="box-card">
        <div class="text item" @click="toOpenDialog(item.dataitem_code,item.dataitem_name)">
          <div class="card_top">
            <span>{{ item.dataitem_value }}{{item.dataitem_unit}}</span>
          </div>
          <div class="card_bottom">
            <span>{{ item.dataitem_name }}</span>
          </div>
        </div>
      </el-card>
    </div>
    <div class="left">
      <span>回风温度设定(℃)：</span>
      <el-input-number v-model="value1" controls-position="right" size="small" @change="handleChange" />&nbsp;&nbsp;&nbsp;&nbsp;<el-button type="primary" plain @click="save1(code1)">保存</el-button><br><br>
      <span>温度精度设定(℃)：</span>
      <el-input-number v-model="value2" controls-position="right" size="small" @change="handleChange" />&nbsp;&nbsp;&nbsp;&nbsp;<el-button type="primary" plain @click="save2(code2)">保存</el-button><br><br>
      <span>回风湿度(%RH)：</span>
      &nbsp;&nbsp;<el-input-number v-model="value3" controls-position="right" size="small" @change="handleChange" />&nbsp;&nbsp;&nbsp;&nbsp;<el-button type="primary" plain @click="save3(code3)">保存</el-button><br><br>
      <span>湿度精度(%RH)：</span>
      &nbsp;&nbsp;<el-input-number v-model="value4" controls-position="right" size="small" @change="handleChange" />&nbsp;&nbsp;&nbsp;&nbsp;<el-button type="primary" plain @click="save4(code4)">保存</el-button>
    </div>
    <div class="right">
      <div class="choiceTime">
        <el-date-picker v-model="searchTime" value-format="yyyy-MM-dd HH:mm:ss" size="mini" type="datetimerange" range-separator="至" align="right" @change="searchChange"/>
        <span class="dataOptions optionDay" @click="changeTimeByOption1(1)">本天</span>
        <span class="dataOptions optionWeek" @click="changeTimeByOption1(2)">本周</span>
        <span class="dataOptions optionMonth" @click="changeTimeByOption1(3)">本月</span>
        <span class="dataOptions optionQuarter " @click="changeTimeByOption1(4)">本季度</span>
      </div>
      <div id="charts" class="charts">
        <div id="airCoolContainer1" style="width:1000px;height:410px;"/>
      </div>
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
      <div id="airCoolContainer2" style="width:1130px;height:300px;"/>
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
      // 设备id
      device_id: 3,
      // 当期机房id
      room_id: 2,
      // 设备类型id
      deviceType_id: 17,
      // 所有的数据项的信息
      allData: [],
      // 设备的图片
      deviceImg: '',
      code1: 1,
      code2: 2,
      code3: 3,
      code4: 4,
      // 所有的设备码及当前的设备码
      allCodes: [],
      currentCodes: '2_3_Air_ITEAQ3',
      // 设备码
      // codes1: '',
      // codes2: '',
      // codes3: '',
      // codes4: '',
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      value7: '',
      value8: '',
      searchTime: this.time(),
      time1: this.time(),
      // timestampToTime: this.timestampToTime,
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
      // 温湿度及时间
      temperature: [],
      humidity: [],
      times: [],
      // 模态框
      dialog: {
        title: '',
        visible: false
      },
      // 数据项码
      dataitem_codes: [],
      // 模态框数据及时间
      counts: [],
      time9: [],
      name: '',
      // 当前操作码
      dataitem_code1: 0,
      // 设备码
      device_codes: []
    }
  },
  watch: {
    value1: function(now, old) {
      this.value5 = now
      // console.log('value值的改变',now,old)
    },
    value2: function(now, old) {
      this.value6 = now
    },
    value3: function(now, old) {
      this.value7 = now
    },
    value4: function(now, old) {
      this.value8 = now
    },
    device_id: function(now, old) {
      // alert(now)
      this.findAllData1(now)
      this.findAcCoolDeviceDetails(now)
      this.searchChange()
      this.findAllData(this.deviceType_id)
      this.findLineDataByTime(this.dataitem_code1)
      this.findAllDevice(this.room_id,this.deviceType_id)
      this.changeCodes()
      this.timeToRefresh()
    }
  },
  created() {
    this.findAllDevice(this.room_id, this.deviceType_id)
    this.findAllData1(this.device_id)
    this.findAcCoolDeviceDetails(this.device_id)
    this.searchChange()
    this.findAllData(this.deviceType_id)
    // this.findAllData(this.deviceType_id)
    this.timeToRefresh()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    // 每隔1分钟刷新所有的数据
    timeToRefresh() {
      this.timer = setInterval(() => {
        // this.findLineDataByTime()
        this.searchChange()
      }, 60000)
    },
    // 获取机房中某种设备类型的所有设备的列表
    findAllDevice(room_id, deviceType_id) {
      service.get('/api_room_monitor/get_devices/', { params: { room_id: room_id, devicetype_id: deviceType_id }}).then((data) => {
        // console.log('所有的设备码=======', data.data)
        this.allCodes = data.data
        this.changeCodes()
        data.data.map((item) => {
          if (item.device_id === this.device_id) {
            // alert(1)
            this.deviceImg = item.device_imgpath
            // console.log(this.deviceImg)
          }
          // this.device_codes.push(item.device_code)
        })
        // console.log('所有的设备码this.device_codes',this.device_codes)
        // this.codes1 = this.device_codes[0]
        // this.codes2 = this.device_codes[1]
        // this.codes3 = this.device_codes[2]
        // this.codes4 = this.device_codes[3]
      }).catch(() => {

      })
    },
    // 通过设备类型获取所有的数据项信息
    findAllData(id) {
      service.get('/api_room_monitor/get_configitem_info/?devicetype_id=' + id).then((data) => {
        // console.log('+++++', data)
        this.dataitem_codes = data.data.map((item) => {
          return item.dataitem_code
        })
        // console.log('this.dataitem_codes', this.dataitem_codes)
        // this.allData = data.data
        this.code1 = this.dataitem_codes[0]
        this.code2 = this.dataitem_codes[1]
        this.code3 = this.dataitem_codes[2]
        this.code4 = this.dataitem_codes[3]
      }).catch(() => {

      })
    },
    // 获取指定设备类型下所有的设备当前的数据
    findAllData1(id) {
      // console.log(id)
      service.get('/api_room_monitor/get_current_data/?device_ids=' + id).then((data) => {
        // console.log('+++++', data)
        // this.allData = data.data[0].data
        // // console.log(this.allData)
        // if (this.allData[2].value === '1') {
        //   this.allData[2].value = '运行'
        // }
        // if (this.allData[3].value === '0') {
        //   this.allData[3].value = '混合模式'
        // }
        // this.allData[0].dataitem_code = this.dataitem_codes[0]
        // this.allData[1].dataitem_code = this.dataitem_codes[1]
        // this.allData[2].dataitem_code = this.dataitem_codes[2]
        // this.allData[3].dataitem_code = this.dataitem_codes[3]
        // console.log(this.allData)
        // console.log(this.allData)
      }).catch(() => {

      })
    },
    // 通过设备id查找设备详细信息，包括设备码，操作码
    findAcCoolDeviceDetails(id) {
      service.get('/api_device/list_device_detail/?device_id=' + id).then((data) => {
        // console.log('通过设备id查找设备详细信息，包括设备码，操作码',data.data[0].dataitems[0].table)
        this.allData = data.data[0].dataitems[0].table
        this.allData[0].dataitem_code = this.dataitem_codes[0]
        this.allData[1].dataitem_code = this.dataitem_codes[1]
        this.allData[2].dataitem_code = this.dataitem_codes[2]
        this.allData[3].dataitem_code = this.dataitem_codes[3]
        // console.log(this.allData)
      }).catch(() => {

      })
    },
    handleChange(value) {
      // console.log(value)
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
      this.findLineDataByTime(this.dataitem_code1)
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
    },
    // 查找数据,绘制曲线
    // 获取某一设备的所有数据项的历史数据，给后台一个设备id和开始和结束时间
    searchChange() {
      // console.log(1)
      const obj = { params: {
        start_time: this.searchTime[0],
        end_time: this.searchTime[1],
        device_id: this.device_id
      }}
      // console.log(obj)
      service.get('/api_room_monitor/get_device_data/', obj).then((data) => {
        // console.log(data)
        this.temperature = data.data.datas[0].data
        this.humidity = data.data.datas[1].data
        this.times = data.data.times
        // console.log('this.tioime',this.times)
        setTimeout(() => {
          this.drawFirst1()
        }, 200)
      }).catch(() => {

      })
    },
    // 获取某一设备的某一数据项的历史数据，给后台一个设备id和开始和结束时间和数据项码
    // findAcCoolOneHistoryValueOfOne(id) {
    //   let obj = {params:{
    //     start_time:this.searchTime[0],
    //     end_time:this.searchTime[1],
    //     device_ids:this.device_id,
    //     dataitem_code:id
    //   }}
    //   service.get('/api_room_monitor/get_history_data/',obj).then((data)=>{
    //     console.log('data',data)
    //     this.counts = data.data.values[0].data
    //     this.time9 = data.data.times
    //     this.name = data.data.values[0].name
    //     // this.drawFirst2()
    //   }).catch(()=>{

    //   })
    // },
    // 打开模态框
    toOpenDialog(id, title) {
      // alert(id)
      this.dataitem_code1 = id
      this.dialog.title = title
      this.dialog.visible = true
      // this.findLineDataByTime()
      // this.findAcCoolOneHistoryValueOfOne(id)
      this.findLineDataByTime(id)
    },
    // 关闭模态框
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    closeDialog() {
      this.dialog.visible = false
    },
    // 通过确定的时间选择该时间点对应的数据
    // 获取某一设备的某一数据项的历史数据，给后台一个设备id和开始和结束时间和数据项码
    findLineDataByTime(id) {
      // alert(1)
      if (this.time1 != null) {
        // 获取选择的时间
        const obj = { params: {
          start_time: this.time1[0],
          end_time: this.time1[1],
          device_ids: this.device_id,
          dataitem_code: id
        }}
        service.get('/api_room_monitor/get_history_data/', obj).then((data) => {
          // console.log('data', data)
          this.counts = data.data.values[0].data
          // console.log('this.counts', this.counts)
          this.time9 = data.data.times
          // console.log('this.time9', this.time9)
          this.name = data.data.values[0].name
          this.drawFirst2()
        }).catch(() => {

        })
      }
    },
    // 更改设备码
    changeCodes() {
      // this.currentCodes = this.codes1
      // if(this.device_id === this.allCodes)
      this.allCodes.map((item)=>{
        if(item.device_id === this.device_id) {
          this.currentCodes = item.device_code
        }
      })
    },
    // 保存按钮1
    save1(code1) {
      // alert(this.code1)
      // alert(this.code1)
      // alert(this.value5)
      this.value5.toString()
      const obj = {
        device_code: this.currentCodes,
        operate_code: this.code1,
        value: this.value5
      }
      // console.log(obj)
      service.post('/api_room_monitor/operate_device/', obj).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success'
        })
        this.value1 = 0
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '保存失败'
        })
      })
    },
    save2(code2) {
      this.value6.toString()
      const obj = {
        device_code: this.currentCodes,
        operate_code: this.code2,
        value: this.value6
      }
      // console.log(obj)
      service.post('/api_room_monitor/operate_device/', obj).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success'
        })
        this.value2 = 0
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '保存失败'
        })
      })
    },
    save3(code3) {
      this.value7.toString()
      const obj = {
        device_code: this.currentCodes,
        operate_code: this.code3,
        value: this.value7
      }
      // console.log(obj)
      service.post('/api_room_monitor/operate_device/', obj).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success'
        })
        this.value3 = 0

      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '保存失败'
        })
      })
    },
    save4(code4) {
      this.value8.toString()
      const obj = {
        device_code: this.currentCodes,
        operate_code: this.code4,
        value: this.value8
      }
      // console.log(obj)
      service.post('/api_room_monitor/operate_device/', obj).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success'
        })
        this.value4 = 0
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '保存失败'
        })
      })
    },
    drawFirst2() {
      var myChart = echarts.init(document.getElementById('airCoolContainer2'))
      myChart.setOption({
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
          left: '0%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.time9
        },
        yAxis: [{
          name: '',
          type: 'value'
        }],
        color: ['#F56C6C', '#E6A23C', '#b03a5b'],
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
    // 温湿度图
    drawFirst1() {
      var myChart = echarts.init(document.getElementById('airCoolContainer1'))
      myChart.setOption({
        // tooltip: {
        //   trigger: 'axis'
        // },
        // legend: {
        //   data: ['回风温度测量值℃', '回风湿度测量值%'],
        //   textStyle: {
        //     color: 'rgba(255, 255, 255, 0.3)'
        //   }
        // },
        // grid: {
        //   left: '0%',
        //   right: '4%',
        //   bottom: '3%',
        //   containLabel: true
        // },
        // xAxis: {
        //   type: 'category',
        //   boundaryGap: true,
        //   data: this.times
        // },
        // yAxis: [{
        //   name: '温湿度',
        //   type: 'value'
        // }],
        // color: ['#F56C6C', '#E6A23C', '#b03a5b'],
        // series: [
        //   {
        //     name: '回风温度测量值℃',
        //     type: 'line',
        //     smooth: true,
        //     data: this.temperature
        //   },
        //   {
        //     name: '回风湿度测量值%',
        //     type: 'line',
        //     smooth: true,
        //     data: this.humidity
        //   }
        // ]
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: 40,
          top: 20,
          data: ['回风温度测量值℃', '回风湿度测量值%']
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
          data: this.times
          // data: data.times
        },
        yAxis: [{
          name: '温湿度',
          type: 'value'
        }],
        series: [
          {
            name: '回风温度测量值℃',
            type: 'line',
            smooth: true,
            data: this.temperature
          },
          {
            name: '回风湿度测量值%',
            type: 'line',
            smooth: true,
            data: this.humidity
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
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
 }
 img {
   float: left;
   margin-right: 150px;
   width: 300px;
   height: 300px;
 }
 .left{
   margin-top: 4em;
   display: inline-block;
   width: 390px;
   float: left;
 }
 .right {
   margin-left: 50px;
   display: inline-block
 }
 .choiceTime {
   margin-left: 15px
 }
 .choiceTime span {
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
</style>
