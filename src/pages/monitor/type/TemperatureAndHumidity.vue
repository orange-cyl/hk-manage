<template>
  <div class="TemperatureAndHumidity">
    <!-- 温湿度 -->
    <!-- 温湿度图片 -->
    <div class="th_img">
      <img :src="room.room_plane_imgpath" alt="图片加载中..." style="height:100%;width:100%">
      <canvas id="thCanvas" :width="canvasWidth" height="250px" />
    </div>
    <!-- 温湿度数据 -->
    <div class="th_data">
      <el-table
        v-loading="loading"
        :data="currentDeviceData"
        border
        size="mini"
        height="250"
        style="width: 84%">
        <el-table-column
          prop="device_name"
          label="设备名称"
          align="center" />
        <el-table-column
          prop="data[0].value"
          label="湿度"
          align="center" />
        <el-table-column
          prop="data[1].value"
          label="温度"
          align="center" />
      </el-table>
    </div>
    <!-- 查询历史数据 -->
    <div class="th_history">
      <div class="th_history_form">
        <!-- <el-select v-model="thQuery.device_id" clearable placeholder="请选择设备" size="mini">
          <el-option
            v-for="name in deviceNames"
            :key="name.device_id"
            :label="name.device_name"
            :value="name.device_id" />
        </el-select> -->
        <el-date-picker
          v-model="pickTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          size="mini"
          clearable
          @change="thQueryChange" />
        <span @click="changeTimeByOption(1)" class="dataOptions optionDay">本天</span>
        <span @click="changeTimeByOption(2)" class="dataOptions optionWeek">本周</span>
        <span @click="changeTimeByOption(3)" class="dataOptions optionMonth">本月</span>
        <span @click="changeTimeByOption(4)" class="dataOptions optionQuarter">本季度</span>
      </div>
      <div class="th_history_data">
        <div id="th" :style="he" />
      </div>
    </div>
  </div>
</template>

<script>
// import service from '@/http/service'
import service from '@/utils/request'
import echarts from 'echarts'
import $ from 'jquery'
export default {
  data() {
    return {
      loading: false,
      th: [],
      deviceNames: [],
      thQuery: {
        device_id: undefined,
        start_time: undefined,
        end_time: undefined
      },
      pickTime: [],
      // 快捷选择时间
      // pickerTime: {
      //   shortcuts: [{
      //     text: '最近一天',
      //     onClick(picker) {
      //       const end = new Date()
      //       const start = new Date()
      //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
      //       picker.$emit('pick', [start, end])
      //     }
      //   }, {
      //     text: '最近一周',
      //     onClick(picker) {
      //       const end = new Date()
      //       const start = new Date()
      //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      //       picker.$emit('pick', [start, end])
      //     }
      //   }, {
      //     text: '最近一月',
      //     onClick(picker) {
      //       const end = new Date()
      //       const start = new Date()
      //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      //       picker.$emit('pick', [start, end])
      //     }
      //   }, {
      //     text: '最近三个月',
      //     onClick(picker) {
      //       const end = new Date()
      //       const start = new Date()
      //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      //       picker.$emit('pick', [start, end])
      //     }
      //   }]
      // },
      // device_ids:[],
      // 当前设备数据
      currentDeviceData: [],
      // 机房
      room: {},
      // 画布宽度
      canvasWidth: 590,
      // 定时器
      timer:null
    }
  },
  watch: {
    thQuery: {
      handler: function() {
        this.findAllHumitureData()
      },
      deep: true
    }
  },
  created() {
    this.he = 'width: 92%;height: ' + ($(window).height() - 560) + 'px;'
    this.pickTime = this.time()
    // this.th = this.$parent.device
    // console.log(this.th)
    this.findAllTHData()
    // this.findAllDeviceName()
    this.findAllHumitureData()
    this.thQueryChange()
    this.findAllRoom()
    // this.findCurrentDeviceData()
    // this.drawCanvas()
  },
  destroyed(){
    clearInterval(this.timer)
  },
  methods: {
    // 点击本天 本周 本月 本季度
    changeTimeByOption(option){
      if(option==1){
        this.pickTime = this.time();
      }else if(option==2){
        this.pickTime = this.week();
      }else if(option==3){
        this.pickTime = this.month();
      }else{
        this.pickTime = this.quarter();
      }
      this.thQueryChange()
      // this.findAllLeakData();
    },
    timestampToTime(timestamp){
      let date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
      let D = date.getDate() + ' '
      let h = date.getHours() + ':'
      let m = date.getMinutes() + ':'
      let s = date.getSeconds()
      return Y+M+D+h+m+s
    },
    // 获取当天时间段
    time(){
      let time = new Date();
      let now = time.getTime();
      let todayStart = time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()+'T'+'0:0:0'+'Z';
      let todayEnd = time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()+'T'+'23:59:59'+'Z';
      // if(!new Date(todayStart).getTime()){
      // 	todayStart = todayStart.replace(/-/g,'/');
      // 	todayEnd = todayEnd.replace(/-/g,'/');
      // }
      return([todayStart,todayEnd])
      // console.log(new Date(todayStart),new Date(todayEnd))
      // return [new Date(todayStart),new Date(todayEnd)];
    },
    // console.log(time())
    // 获取本月时间段
    month(){
      let month = new Date();
      let monthStart = month.getFullYear()+'-'+(month.getMonth()+1)+'-'+1+' '+'0:0:0';
      // console.log(month.getMonth())
      if (month.getMonth() <= 10){
        var monthEnd = month.getFullYear()+'-'+(month.getMonth()+2)+'-'+1+' '+'0:0:0';
      } else {
        var monthEnd = (month.getFullYear()+1)+'-'+1+'-'+1+' '+'0:0:0';
      }
      // if(!new Date(monthStart).getTime()){
      // 	monthStart = monthStart.replace(/-/g,'/');
      // 	monthEnd = monthEnd.replace(/-/g,'/');
      // }
      // return [new Date(monthStart),new Date(monthEnd)];
      return [monthStart,monthEnd];
    },
    // 获取本周时间段
    week(){
      let now = new Date(); //当前日期 
      let nowDayOfWeek = now.getDay(); //今天本周的第几天 
      let nowDay = now.getDate(); //当前日 
      let nowMonth = now.getMonth(); //当前月 
      let nowYear = now.getYear()+1900; //当前年 
      let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek); 
      let weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek)); 
      weekStartDate = this.timestampToTime(Date.parse(weekStartDate));
      weekEndDate = this.timestampToTime(Date.parse(weekEndDate));
      // if(!new Date(weekStartDate).getTime()){
      // 	weekStartDate = weekStartDate.replace(/-/g,'/');
      // 	weekEndDate = weekEndDate.replace(/-/g,'/');
      // }
      return [weekStartDate,weekEndDate];
    },
    // 获取本季度时间段
    quarter(){
      let now = new Date();
      let nowYear = now.getYear()+1900;//年
      let nowMonth = now.getMonth(); //当前月 
      let start = '';
      let end = '';
      if(nowMonth < 3){
        start = nowYear+'-1-1 0:0:0';
        end = nowYear+'-4-1 0:0:0';
      }else if (nowMonth >= 3 && nowMonth < 6){
        start = nowYear+'-4-1 0:0:0';
        end = nowYear+'-7-1 0:0:0';
      }else if(nowMonth >= 6 && nowMonth< 9){
        start = nowYear+'-7-1 0:0:0';
        end = nowYear+'-10-1 0:0:0';
      }else if (nowMonth >= 9){
        start = nowYear+'-10-1 0:0:0';
        end = (nowYear+1)+'-1-1 0:0:0';
      }
      // if(!new Date(nowYear+'-1-1 0:0:0').getTime()){
      // 	start = start.replace(/-/g,'/');
      // 	end = end.replace(/-/g,'/');
      // 	return [new Date(start),new Date(end)];
      // }
      // return [new Date(start),new Date(end)];
      return [start,end];
    },
    // 温湿度位置
    drawCanvas() {
      const vm = this
      const canvas = document.getElementById('thCanvas')
      const context = canvas.getContext('2d')
      context.fillStyle = 'block'
      context.lineWidth = 4
      const devicePosition = this.th.map((item) => {
        return item
      })
      // console.log(devicePosition)
      this.th.forEach((item) => {
        const slicePath = item.device_imgpath.split('/images/devices/')[1]
        if (slicePath !== 'default.png') {
          const image = new Image()
          image.src = item.device_imgpath
          image.onload = function() {
            // 绘制图像的函数
            // context.drawImage(image,item.x,item.y,20,20);
            context.drawImage(image, item.pos.pos_x / 100 * vm.canvasWidth, item.pos.pos_y / 100 * 216, 20, 20)
          }
          context.fillText(item.device_name, item.pos.pos_x / 100 * vm.canvasWidth - 10, item.pos.pos_y / 100 * 216 - 10, 100)
        } else {
          context.beginPath()
          // context.arc(item.x,item.y,10,0,2*Math.PI)
          context.arc(item.pos.pos_x / 100 * vm.canvasWidth, item.pos.pos_y / 100 * 216, 10, 0, 2 * Math.PI)
          context.fill()
          // context.fillText(item.text,item.x-15,item.y-15,100)
          context.fillText(item.device_name, item.pos.pos_x / 100 * vm.canvasWidth - 15, item.pos.pos_y / 100 * 216 - 15, 100)
        }
      })
    },
    // 日期时间选择器确定时触发
    thQueryChange() {
      // this.thQuery.device_id = this.$parent.device_id
      this.thQuery.start_time = this.pickTime[0]
      this.thQuery.end_time = this.pickTime[1]
    },
    // 获取所有机房信息
    findAllRoom() {
      service.get('/api_room/list_all_room/', {
        params: { room_id: this.$parent.roomId }
      })
        .then(({ data }) => {
          this.room = data[0]
          // console.log(data[0])
        })
    },
    // 获取设备当前数据
    findCurrentDeviceData(ids) {
      // this.loading = true
      service.get('/api_room_monitor/get_current_data/', {
        params: { device_ids: ids }
      })
        .then(({ data }) => {
          // console.log(data)
          this.currentDeviceData = data
        })
        .catch(() => {

        })
        .finally(() => {
          // this.loading = false
        })
    },
    // 获取所有的温湿度数据
    findAllTHData() {
      this.loading = true
      service.get('/api_room_monitor/get_devices/', {
        params: {
          room_id: this.$parent.roomId,
          devicetype_id: this.$parent.devicetype_id
        }
      })
        .then(({ data }) => {
          // console.log(JSON.stringify(data))
          this.th = data
          var idsArr = data.map((item) => {
            return item.device_id
          })
          var ids = idsArr.toString()
          this.findCurrentDeviceData(ids)
          this.timer = setInterval(()=>{
            this.findCurrentDeviceData(ids)
          },10000)
          setTimeout(() => {
            this.drawCanvas()
          }, 100)
          // console.log(this.device_ids)
        })
        .catch((error) => {
          // console.log(error, '温湿度数据')
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取详细温湿度历史数据
    findAllHumitureData() {
      // this.loading = true
      service.get('/api_room_monitor/get_device_data/', {
        params: this.thQuery
      })
        .then(({ data }) => {
          // console.log(JSON.stringify(data))
          setTimeout(() => {
            this.drawHumiture(data)
          }, 100)
        })
        .catch(() => {
          // console.log(JSON.stringify(this.thQuery))
          // this.$notify({
          //   title: '失败',
          //   message: '网络异常',
          //   type: 'error'
          // })
        })
        .finally(() => {
          // this.loading = false
        })
    },
    // 获取所有的设备名称
    findAllDeviceName() {
      service.get('/api_device/list_device_name/', {
        params: {
          devicetype_id: this.$parent.devicetype_id
        }
      })
        .then(({ data }) => {
          // console.log(data)
          this.deviceNames = data
          if (data.length) {
            this.thQuery.device_id = data[0].device_id
          } else {
            this.thQuery.device_id = ''
          }
        })
        .catch(() => {
          // 错误信息
        })
    },
    // 绘制温湿度图表
    drawHumiture(data) {
      // 得到温湿度数据
      // console.log(data)
      // 获取温湿度时间，并将时间转化为时分秒格式
      const timeData = data.times.map((item) => {
        return item.split(' ')[1]
      })
      // console.log(timeData)
      var myChart = echarts.init(document.getElementById('th'))
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: 40,
          top: 20,
          data: [data.datas[0].name, data.datas[1].name]
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
          // data: timeData
          data: data.times
        },
        yAxis: [{
          name: '℃ / %',
          type: 'value'
        }],
        series: [
          {
            name: data.datas[0].name,
            type: 'line',
            smooth: true,
            data: data.datas[0].data
          },
          {
            name: data.datas[1].name,
            type: 'line',
            smooth: true,
            data: data.datas[1].data
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
.th_img {
  /* background: #ccc; */
  width: 37%;
  height: 250px;
  float: left;
  position: relative;
}
.th_img #thCanvas {
  position: absolute;
  top: 0;
  left: 0;
}
.th_data {
  /* background: #223356; */
  margin-left: 38%;
  margin-bottom: 1em;
}
.th_history .th_history_form .dataOptions {
  cursor: pointer;
  margin-right: .5em;
  color: #fff;
  border-radius: 3px;
  padding: 3px;
  font-size: 14px;
}
.th_history .th_history_form .optionDay {
  background: #409eff;
}
.th_history .th_history_form .optionWeek {
  background: #409eff;
}
.th_history .th_history_form .optionMonth {
  background: #409eff;
}
.th_history .th_history_form .optionQuarter {
  background: #409eff;
}
</style>
</style>
