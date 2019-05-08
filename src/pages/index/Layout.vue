<template>
  <div class="index">
    <div class="carousel">
      <el-carousel height="300px" @change="changeRoom">
        <el-carousel-item v-for="(item,index) in roomBaseData" :key="item.room_id">
          <!-- 机房名称 -->
          <div class="room_name">{{ item.room_name }}</div>
          <!-- 环境数据 温湿度 -->
          <div class="room_hum">
            <el-row>
              <el-col :span="24">
                <div style="background:#409EFF;color:#fff;border-radius:5px;">环境数据</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <div>平均温度</div>
                <div style="border-top:2px solid #fff;">{{ currentRoomBaseData.temp }}</div>
              </el-col>
              <el-col :span="12">
                <div>平均湿度</div>
                <div style="border-top:2px solid #fff;">{{ currentRoomBaseData.hum }}</div>
              </el-col>
            </el-row>
          </div>
          <!-- 设备状态统计 -->
          <div class="room_device_state">
            <el-row>
              <el-col :span="24">
                <div style="background:#409EFF;color:#fff;border-radius:5px;">设备状态统计</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col v-for="data in currentRoomBaseData.other_data" :key="data.name" :span="8">
                <div>{{ data.name }}</div>
                <div style="border-top:2px solid #fff;">{{ data.data }}</div>
              </el-col>
            </el-row>
          </div>
          <!-- 温湿度图表 -->
          <div class="hum_chars">
            <div :id="'humiture'+index" style="height:300px;"/>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 统计 -->
    <div class="statistics">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="statistics_title">审批统计</div>
          <div id="check" :style="height" />
        </el-col>
        <el-col :span="8">
          <div class="statistics_title">数量统计</div>
          <div id="number" :style="height" />
        </el-col>
        <el-col :span="8">
          <div class="statistics_title">报警统计</div>
          <div id="alarm" :style="height" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
// import axios from '@/http/axios'
import service from '@/utils/request'
import $ from 'jquery'
import echarts from 'echarts'
export default {
  data() {
    return {
      // 机房基本数据
      roomBaseData: [],
      // 温湿度详细数据
      humitureData: {},
      // 当前机房基本数据
      currentRoomBaseData: {},
      // 当前温湿度数据
      currentHumitureData: {},
      // 审批统计
      checkData: [],
      // 数量统计
      numberData: {},
      // 报警统计
      alarmData: []
    }
  },
  created() {
    // 图表高度
    this.height = 'height:' + ($(window).height() - 560) + 'px'
    // 加载所有机房基本数据
    this.findAllIndexData()
    // 加载审批统计
    this.findAllCheckData()
    // 加载数量统计
    this.findAllNumberData()
    // 加载报警统计
    this.findAllAlarmData()
  },
  mounted() {
    // this.drawHumiture()
    // this.drawCheck()
    // this.drawNumber()
    // this.drawAlarm()
  },
  methods: {
    // 幻灯片切换
    changeRoom(newIndex, oldIndex) {
      // console.log(this.roomBaseData)
      // console.log(newIndex, oldIndex)
      this.currentRoomBaseData = this.roomBaseData[newIndex]
      // console.log(this.currentRoomBaseData)
      setTimeout(() => {
        this.findAllHumitureDataById(this.currentRoomBaseData.room_id, newIndex)
      }, 100)
      // this.currentHumitureData = this.humitureData
      // console.log(this.currentHumitureData)
    },
    // 获取报警统计的数据
    findAllAlarmData() {
      service.get('/api_room_monitor/get_alarm_count/')
        .then(({ data }) => {
          // console.log(data)
          const result = data.map((item) => {
            return {
              value: item[1],
              name: item[0]
            }
          })
          // console.log(result)
          this.alarmData = result
          setTimeout(() => {
            this.drawAlarm()
          }, 50)
        })
        .catch(() => {
          this.$notify({
            title: '失败',
            message: '网络异常',
            type: 'error'
          })
        })
    },
    // 获取数量统计的数据
    findAllNumberData() {
      service.get('/api_room_monitor/get_number_count/')
        .then(({ data }) => {
          // console.log(data)
          this.numberData = data
          setTimeout(() => {
            this.drawNumber()
          }, 50)
        })
        .catch(() => {
          this.$notify({
            title: '失败',
            message: '网络异常',
            type: 'error'
          })
        })
    },
    // 获取审批统计的数据
    findAllCheckData() {
      service.get('/api_room_monitor/get_approval_count/')
        .then(({ data }) => {
          const result = data.map((item) => {
            return {
              value: item[1],
              name: item[0]
            }
          })
          // console.log(JSON.stringify(result))
          this.checkData = result
          setTimeout(() => {
            this.drawCheck()
          }, 50)
        })
        .catch(() => {
          this.$notify({
            title: '失败',
            message: '网络异常',
            type: 'error'
          })
        })
    },
    // 获取详细温湿度数据
    findAllHumitureDataById(id, index) {
      const vm = this
      // alert(room_id)
      service.get('/api_room_monitor/getSimpleIndexData/?room_id=' + id)
        .then(({ data }) => {
          // alert(room_id)
          // console.log(data,'----')
          this.currentHumitureData = data
          setTimeout(() => {
            vm.drawHumiture(index)
            // alert(1)
          }, 200)
        })
        .catch(() => {
          this.$notify({
            title: '失败',
            message: '网络异常',
            type: 'error'
          })
        })
    },
    // 获取每个机房基本数据
    findAllIndexData() {
      service.get('/api_room_monitor/get_index_base_data/')
        .then(({ data }) => {
          // console.log(data)
          this.roomBaseData = data
        })
        .catch(() => {
          this.$notify({
            title: '失败',
            message: '网络异常',
            type: 'error'
          })
        })
    },
    // 绘制报警统计
    drawAlarm() {
      const vm = this
      var myChart = echarts.init(document.getElementById('alarm'))
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#91c7ae', '#3398db', '#d48265'],
        legend: {
          orient: 'vertical',
          left: 'left',
          data: [vm.alarmData[0].name, vm.alarmData[1].name, vm.alarmData[2].name]
        },
        series: [{
          name: '报警数据',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: vm.alarmData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      })
    },
    // 绘制数量统计
    drawNumber() {
      const vm = this
      var myChart = echarts.init(document.getElementById('number'))
      myChart.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: vm.numberData.name,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '数量统计',
            type: 'bar',
            barWidth: '60%',
            // data: [10, 52, 200, 334, 390, 330, 220]
            data: vm.numberData.value
          }
        ]
      })
    },
    // 绘制审批统计
    drawCheck() {
      var vm = this
      // let checkdata = vm.checkData
      // console.log(checkdata,'---')
      var myChart = echarts.init(document.getElementById('check'))
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#91c7ae', '#3398db', '#d48265'],
        legend: {
          orient: 'vertical',
          left: 'left',
          data: [vm.checkData[0].name, vm.checkData[1].name, vm.checkData[2].name]
        },
        series: [{
          name: '审批统计',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          // data: [
          //   { value:335, name:'直接访问' },
          //   { value:234, name:'联盟广告' },
          //   { value:135, name:'视频广告' }
          // ],
          data: vm.checkData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      })
    },
    // 绘制温湿度图表
    drawHumiture(index) {
      const vm = this
      // 获取温湿度时间，并将时间转化为时分秒格式
      const timeData = vm.currentHumitureData.thData[0].data.map((item) => {
        return item[0].split('T')[1]
      })
      // console.log(timeData)
      var myChart = echarts.init(document.getElementById('humiture' + index))
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: 40,
          top: 20,
          data: [vm.currentHumitureData.thData[0].name, vm.currentHumitureData.thData[1].name]
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
          data: timeData.reverse()
        },
        yAxis: [{
          name: '℃ / %',
          type: 'value'
        }],
        series: [
          {
            name: vm.currentHumitureData.thData[0].name,
            type: 'line',
            smooth: true,
            data: vm.currentHumitureData.thData[0].data.map((item) => { return item[1] })
          },
          {
            name: vm.currentHumitureData.thData[1].name,
            type: 'line',
            smooth: true,
            data: vm.currentHumitureData.thData[1].data.map((item) => { return item[1] })
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
.index {
  margin: 1em;
  padding: 1em;
  background: #ffffff;
  border-radius: 3px;
  /* overflow: auto; */
  /* overflow: hidden; */
}
.carousel {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 2px 2px 2px 0 #ccc;
  position: relative;
}
.carousel .room_name {
  text-align: center;
  color: #409EFF;
}
.carousel .room_hum {
  width: 40%;
  text-align: center;
  line-height: 2.5em;
  border-radius: 5px;
  margin-bottom: 30px;
  background:#f0f2f5;
}
.carousel .room_device_state {
  width: 40%;
  text-align: center;
  line-height: 2.5em;
  border-radius: 5px;
  background:#f0f2f5;
}
.carousel .hum_chars {
  width: 60%;
  position: absolute;
  top: 0px;
  right: -20px;
}
.statistics {
  box-shadow: 2px 2px 2px 0 #ccc;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 20px;
  padding: 15px;
}
.statistics .statistics_title {
  text-align: center;
}
.statistics .el-col {
  border-right: 1px solid #ccc;
}
.statistics .el-col:last-child {
  border-right: none;
}
</style>

