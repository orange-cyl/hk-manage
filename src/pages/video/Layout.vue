<template>
  <div class="video">
    <div class="top">
      <div class="left">
        <img src="@/assets/logo2.3e0946d.png" alt="">
        <span>涉密IDC动力环境监控系统</span>
      </div>
      <div class="rooms">
        <ul>
          <li v-for="item in allRooms" :key="item.room_id" :value="item.room_id" class="roomNameSpan" @click="findRoomAllMessage(item.room_id,)">{{ item.room_name }}</li>
        </ul>
      </div>
      <div class="right">
        <div class="badgeDiv">
          <span>报警</span>
          <router-link to="/alarm/index"><span style="color:red;padding:.3em">{{ alarmCount }}</span></router-link>
          &nbsp;&nbsp;|
        </div>
        <div class="badgeDiv">
          <span>待审批</span>
          <router-link to="/check/index"><span style="color:red;padding:.3em">{{ examineCount1 }}</span></router-link>
          &nbsp;&nbsp;|
        </div>
        <div class="badgeDiv">
          <span>{{ currentTime }}</span>
        </div>
        <!-- <div class="badgeDiv">
          <router-link to="/"><el-button type="primary" plain size="mini">返回</el-button></router-link>
        </div> -->
      </div>
    </div>
    <div class="middle">
      <div class="middle_top">
        <div class="one"><span>漏水检测</span></div>
        <!-- <div class="two"><span>进入系统&nbsp;&nbsp;>>&nbsp;&nbsp;>>&nbsp;&nbsp;>></span></div> -->
        <div class="two"><router-link to="/"><span>进入系统&nbsp;&nbsp;>>&nbsp;&nbsp;>>&nbsp;&nbsp;>></span></router-link></div>
      </div>
      <div class="middle_bottom">
        <div class="left">
          <ul>
            <li>
              <div v-if="videos[0]" style="float:left;">
                <object class="simpleVideo" width="100%" height="100%" events="True">
                  <param :value="videos[0]" name="mrl">
                  <param name="allowscriptaccess" value="always">
                  <param name="wmode" value="transparent">
                  <param name="volume" value="50">
                  <param name="autoplay" value="true">
                  <param name="fullscreen" value="false">
                  <param name="controls" value="true">
                  <param name="loop" value="false">
                  <embed :src="videos[0]" class="simpleVideo" width="360px" height="274px" type="application/x-vlc-plugin" version="VideoLAN.VLCPlugin.2" pluginspage="http://www.videolan.org" >
                </object>
              </div>
            </li>
            <li>
              <div v-if="videos[1]" style="float:left;">
                <object class="simpleVideo" width="100%" height="100%" events="True">
                  <param :value="videos[1]" name="mrl">
                  <param name="allowscriptaccess" value="always">
                  <param name="wmode" value="transparent">
                  <param name="volume" value="50">
                  <param name="autoplay" value="true">
                  <param name="fullscreen" value="false">
                  <param name="controls" value="true">
                  <param name="loop" value="false">
                  <embed :src="videos[1]" class="simpleVideo" width="360px" height="274px" type="application/x-vlc-plugin" version="VideoLAN.VLCPlugin.2" pluginspage="http://www.videolan.org" >
                </object>
              </div>
            </li>
            <li>
              <div v-if="videos[2]" style="float:left;">
                <object class="simpleVideo" width="360px" height="274px" events="True">
                  <param :value="videos[2]" name="mrl">
                  <param name="allowscriptaccess" value="always">
                  <param name="wmode" value="transparent">
                  <param name="volume" value="50">
                  <param name="autoplay" value="true">
                  <param name="fullscreen" value="false">
                  <param name="controls" value="true">
                  <param name="loop" value="false">
                  <embed :src="videos[2]" class="simpleVideo" width="360px" height="274px" type="application/x-vlc-plugin" version="VideoLAN.VLCPlugin.2" pluginspage="http://www.videolan.org" >
                </object>
              </div>
            </li>
            <li>
              <div v-if="videos[3]" style="float:left;">
                <object class="simpleVideo" width="100%" height="100%" events="True">
                  <param :value="videos[3]" name="mrl">
                  <param name="allowscriptaccess" value="always">
                  <param name="wmode" value="transparent">
                  <param name="volume" value="50">
                  <param name="autoplay" value="true">
                  <param name="fullscreen" value="false">
                  <param name="controls" value="true">
                  <param name="loop" value="false">
                  <embed :src="videos[3]" class="simpleVideo" width="360px" height="274px" type="application/x-vlc-plugin" version="VideoLAN.VLCPlugin.2" pluginspage="http://www.videolan.org" >
                </object>
              </div>
            </li>
          </ul>
        </div>
        <div class="right">
          <div id="container1" style="width:100%;height:210px;margin-bottom:50px"/>
          <div id="container2" style="width:100%;height:210px;"/>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div id="container" style="width:100%;height:240px"/>
    </div>
  </div>
</template>

<script>
// import axios from '@/http/axios'
import service from '@/utils/request'
import $ from 'jquery'
import echarts from 'echarts'
import Highcharts from 'highcharts'
export default {
  data() {
    return {
      // 所有的机房
      allRooms: [],
      // 报警数量
      alarmCount: 0,
      // 所有的审批
      examineCount: [],
      // 未审批数量
      examineCount1: 5,
      // 当前时间
      currentTime: '',
      // 当前机房id
      currentRoomId: 0,
      // 温湿度id
      id1: 0,
      // 温度
      temperature: [],
      temperature1: [],
      // 湿度
      humidity: [],
      humidity1: [],
      // 获取温湿度时间
      temperatureTimes: [],
      temperatureTimes1: [],
      temperatureTimes2: [],
      // 获取所有的视频
      videos: [],
      // 获取ups交流输出电压
      upsDataPV1: [],
      upsDataPV2: [],
      upsDataPV3: [],
      // 获取ups交流输出电流
      upsDataCT1: [],
      upsDataCT2: [],
      upsDataCT3: [],
      // 获取ups交流输出电流电压的时间
      upsDataTimes: [],
      // 定时器的名称
      timer: null
    }
  },
  created() {
    this.findAllrooms()
    this.getAllAlarms()
    this.timeSetInterval()
    this.getAllExamine()
    this.timeToRefresh()
  },
  mounted() {
    // 高度
    $('.video').height($(window).height() - 16)
  },
  // 当页面发生跳转的时候清除定时器
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    // 每隔1分钟重新刷新所有的数据
    timeToRefresh() {
      this.timer = setInterval(() => {
        this.findAllrooms()
        // this.getAllAlarms()
        this.timeSetInterval()
        // this.getAllExamine()
        this.findRoomAllMessage(this.currentRoomId)
      }, 60000)
    },
    // 获取所有的机房
    findAllrooms() {
      service.get('/api_room/list_all_room/').then(({ data }) => {
        // console.log('所有的机房的信息', data)
        this.currentRoomId = data[0].room_id
        // 通过id查找机房的设备信息
        // this.findAllMessages(this.currentRoomId)
        this.findRoomAllMessage(this.currentRoomId)
        // alert(this.currentRoomId)
        this.allRooms = data
      })
    },
    // 通过id查找机房的设备信息
    // findAllMessages(id) {
    //   // alert(id)
    //   service.get('/api_room_monitor/get_types_in_room?room_id='+id).then(({data})=>{
    //     console.log(data)
    //     data.map((item)=>{
    //       if(item.devicetype_name === '温湿度') {
    //         this.id1 = item.devicetype_id
    //         console.log('要查找的机房的温湿度的id为',this.id1)
    //         // this.findRoomAllMessage(this.id1)
    //         // 通过获得到的温湿度的id找到温湿度的数据
    //         if(this.id1 !== 0){
    //           this.findHumitureMessage(this.id1)
    //         } else {
    //           this.$notify.error({
    //             title: '错误',
    //             message: '无温湿度信息'
    //           })
    //         }
    //       }
    //     })
    //   }).catch(()=>{

    //   })
    // },
    // 获取所有的报警信息
    getAllAlarms() {
      // console.log(1)
      service.get('/api_alarm/get_current_alarm/').then(({ data }) => {
        // console.log('data', data)
        if (data.alarm_total >= 1) {
          this.alarmCount = data.alarm_total - 1
        } else {
          this.alarmCount = 0
        }
        // console.log('报警数量', this.alarmCount)
      }).catch(() => {

      })
    },
    // 获取所有的未审批
    getAllExamine() {
      // alert(1)
      service.get('/api_approval/get_approval_list/').then(({ data }) => {
        // console.log('data==========', data)
        data.result.map((item) => {
          if (item.approval_status === '未审批') {
            this.examineCount.push(item.approval_status)
          }
        })
        // console.log('未审批个数', this.examineCount)
        this.examineCount1 = this.examineCount.length
      }).catch(() => {

      })
    },
    // 获取当前时间
    getCurrentTime() {
      const date = new Date()
      // console.log(date)
      // alert(1)
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      month = this.addZero(month)
      let day = date.getDate()
      day = this.addZero(day)
      let hours = date.getHours()
      hours = this.addZero(hours)
      let minutes = date.getMinutes()
      minutes = this.addZero(minutes)
      let seconds = date.getSeconds()
      seconds = this.addZero(seconds)
      this.currentTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
      // console.log(this.currentTime)
    },
    addZero(num) {
      return num < 10 ? '0' + num : num
    },
    // 设置时间的定时器
    timeSetInterval() {
      setInterval(() => {
        this.getCurrentTime()
      }, 1000)
    },
    // 获取首页信息,获取温湿度信息
    findRoomAllMessage(id) {
      // this.currentRoomId = id
      // alert(id)
      service.get('api_room_monitor/getSimpleIndexData/?room_id=' + id).then(({ data }) => {
        // console.log('=======', data)
        this.simpleBaseData = data
        this.videos = data.video_src
        // console.log('所有的视频',this.videos)
        this.humitureArray = data.thData
        // 获取ups交流输出电压
        // alert(1)
        // this.upsDataPV1 = data.upsData[0].data.map((item) => {
        //   return item[1]
        // })
        // this.upsDataPV2 = data.upsData[1].data.map((item) => {
        //   return item[1]
        // })
        // this.upsDataPV3 = data.upsData[2].data.map((item) => {
        //   return item[1]
        // })
        // this.upsDataTimes = data.upsData[0].data.map((item) => {
        //   return item[0].split('T')[1]
        // })
        if (data.upsData.length !== 0) {
          this.upsDataPV1 = data.upsData[0].data.map((item) => {
            return item[1]
          })
          this.upsDataPV2 = data.upsData[1].data.map((item) => {
            return item[1]
          })
          this.upsDataPV3 = data.upsData[2].data.map((item) => {
            return item[1]
          })
          this.upsDataTimes = data.upsData[0].data.map((item) => {
            return item[0].split('T')[1]
          })
          // 获取UPS电流
          this.upsDataCT1 = data.upsData[3].data.map((item) => {
            return item[1]
          })
          this.upsDataCT2 = data.upsData[4].data.map((item) => {
            return item[1]
          })
          this.upsDataCT3 = data.upsData[5].data.map((item) => {
            return item[1]
          })
        } else {
          this.upsDataPV1 = []
          this.upsDataPV2 = []
          this.upsDataPV3 = []
          this.upsDataTimes = []
          this.upsDataCT1 = []
          this.upsDataCT2 = []
          this.upsDataCT3 = []
        }
        // alert(2)
        // console.log('时间为:',this.upsDataTimes)
        // console.log('upsDataCT1',this.upsDataPV1)
        // console.log('upsDataPV2',this.upsDataPV2)
        // console.log('upsDataPV3',this.upsDataPV3)
        // 获取UPS电流
        // this.upsDataCT1 = data.upsData[3].data.map((item) => {
        //   return item[1]
        // })
        // this.upsDataCT2 = data.upsData[4].data.map((item) => {
        //   return item[1]
        // })
        // this.upsDataCT3 = data.upsData[5].data.map((item) => {
        //   return item[1]
        // })
        // console.log('humitureArray',this.humitureArray)
        // console.log('++++', this.humitureArray)
        if ((this.humitureArray[0].data.length !== 0) || (this.humitureArray[1].data.length !== 0)) {
          this.temperature = this.humitureArray[0].data
          this.temperature.map((item) => {
            //  console.log('====',item[1])
            this.temperature1.push(item[1])
          })
          // console.log('温度',this.temperature)
          // console.log('温度1', this.temperature1)
          this.humidity = this.humitureArray[1].data
          this.humidity.map((item) => {
            this.humidity1.push(item[1])
          })
          // console.log(this.temperatureTimes1)
          // console.log('湿度',this.humidity)
          //  alert(this.humidity1)
          // console.log('湿度1', this.humidity1)
          this.humidity.map((item) => {
            this.temperatureTimes.push(item[0])
          })
          // console.log('温湿度时间', this.temperatureTimes)
          this.temperatureTimes.map((item) => {
            this.temperatureTimes1.push(item.split('T'))
          })
          // console.log('温湿度时间1', this.temperatureTimes1)
          this.temperatureTimes1.map((item) => {
            this.temperatureTimes2.push(item[1])
          })
          // console.log('温湿度时间2', this.temperatureTimes2)
          // console.log('湿度',this.humidity)
          //  alert(this.humidity1)
          this.humidity.map((item) => {
            this.temperatureTimes.push(item[0])
          })
          this.temperatureTimes.map((item) => {
            this.temperatureTimes1.push(item.split('T'))
          })
          this.temperatureTimes1.map((item) => {
            this.temperatureTimes2.push(item[1])
          })
          // console.log(this.temperatureTimes2, '----')
        } else {
          this.temperature1 = []
          this.humidity1 = []
        }
        this.drawVis1()
        this.drawVis2()
        this.drawVis3()
      }).catch(() => {

      })
    },
    // 绘制温湿度图表
    drawVis1() {
      // console.log(timeData)
      // var myChart = echarts.init(document.getElementById('container'))
      // myChart.setOption({
      //   // noDataLoadingOption: {
      //   //   text: '暂无数据',
      //   //   effect: 'bubble',
      //   //   effectOption: {
      //   //     effect: {
      //   //       n: 0
      //   //     }
      //   //   }
      //   // },
      //   textStyle: {
      //     color: 'rgba(255, 255, 255, 0.3)'
      //   },
      //   tooltip: {
      //     trigger: 'axis'
      //   },
      //   legend: {
      //     data: ['温度℃', '湿度%'],
      //     textStyle: {
      //       color: 'rgba(255, 255, 255, 0.3)'
      //     }
      //   },
      //   grid: {
      //     left: '3%',
      //     right: '4%',
      //     bottom: '3%',
      //     containLabel: true
      //   },
      //   xAxis: {
      //     type: 'category',
      //     boundaryGap: false,
      //     data: this.temperatureTimes2.reverse()
      //   },
      //   yAxis: [{
      //     name: '℃',
      //     type: 'value'
      //   }],
      //   color: ['#F56C6C', '#E6A23C', '#b03a5b'],
      //   series: [
      //     {
      //       name: '温度℃',
      //       type: 'line',
      //       smooth: true,
      //       data: this.temperature1
      //     },
      //     {
      //       name: '湿度%',
      //       type: 'line',
      //       smooth: true,
      //       data: this.humidity1
      //     }
      //   ]
      // })
      var chart = Highcharts.chart('container', {
        // style: {
        //   backgroundColor:'#304156',
        //   plotBackgroundColor :'#304156',
        //   color: '#6f7a89'
        // },
        chart: {
          backgroundColor: '#304156',
          type: 'line',
          color: '#6f7a89'
        },
        colors: ['#F56C6C', '#E6A23C', '#b03a5b'],
        title: {
          text: '当前温湿度',
          style: {
            color: '#6f7a89', // 字体颜色
            fontSize: '14px' // 字体大小
            // fontWeight: 'bold'
          }
        },
        yAxis: {
          title: {
            text: '温湿度'
          },
          labels: {
            // y: 20, //x轴刻度往下移动20px
            style: {
              color: '#6f7a89', // 颜色
              fontSize: '12px' // 字体
            }
          }
        },
        xAxis: {
          categories: this.temperatureTimes2.reverse(),
          labels: {
            // y: 20, //x轴刻度往下移动20px
            style: {
              color: '#6f7a89', // 颜色
              fontSize: '12px' // 字体
            }
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },
        // plotOptions: {
        //   series: {
        //     label: {
        //       connectorAllowed: false
        //     },
        //     pointStart: 2010
        //   }
        // },
        credits: {
          enabled: false // 禁用版权信息
        },
        series: [{
          name: '温度℃',
          data: this.temperature1
        }, {
          name: '湿度%',
          data: this.humidity1
        }],
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
    // 绘制UPS交流输出电压图表
    drawVis2() {
      // console.log(timeData)
      var myChart = echarts.init(document.getElementById('container1'))
      myChart.setOption({
        textStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['UPS交流输出电压 ph_A', 'UPS交流输出电压 ph_B', 'UPS交流输出电压 ph_C'],
          textStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
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
          data: this.upsDataTimes.reverse()
        },
        yAxis: [{
          name: 'V',
          type: 'value'
        }],
        color: ['#F56C6C', '#E6A23C', '#b03a5b'],
        series: [
          {
            name: 'UPS交流输出电压 ph_A',
            type: 'line',
            smooth: true,
            data: this.upsDataPV1
          },
          {
            name: 'UPS交流输出电压 ph_B',
            type: 'line',
            smooth: true,
            data: this.upsDataPV2
          },
          {
            name: 'UPS交流输出电压 ph_C',
            type: 'line',
            smooth: true,
            data: this.upsDataPV3
          }
        ]
      })
    },
    // 绘制UPS交流输出电流图表
    drawVis3() {
      // console.log(timeData)
      var myChart = echarts.init(document.getElementById('container2'))
      myChart.setOption({
        textStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['UPS交流输出电流 ph_A', 'UPS交流输出电流 ph_B', 'UPS交流输出电流 ph_C'],
          textStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
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
          data: this.upsDataTimes
        },
        yAxis: [{
          name: 'A',
          type: 'value'
        }],
        color: ['#F56C6C', '#E6A23C', '#b03a5b'],
        series: [
          {
            name: 'UPS交流输出电流 ph_A',
            type: 'line',
            smooth: true,
            data: this.upsDataCT1
          },
          {
            name: 'UPS交流输出电流 ph_B',
            type: 'line',
            smooth: true,
            data: this.upsDataCT2
          },
          {
            name: 'UPS交流输出电流 ph_C',
            type: 'line',
            smooth: true,
            data: this.upsDataCT3
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
  .video {
    padding: .5em;
    /* overflow-y:auto; */
    background-color: #304156
  }
  .video .top {
    width: 100%;
    height: 57px;
    /* background-color: aqua; */
    overflow: hidden;
  }
  .video .top .left {
    width: 22%;
    height: 100%;
    /* background-color: beige; */
    box-sizing: border-box;
    float: left;
  }
  .video .top .left img {
    width: 12%;
    margin-left: 4%;
    margin-top: 1.5%;
    float: left;
  }
  .video .top .left span {
    display: inline-block;
    margin-top: .8em;
    margin-left: 1em;
    font-size: 18px;
    float: left;
  }
  .video .top .rooms {
    width: 54%;
    height: 100%;
    box-sizing: border-box;
    float: left;
  }
  ul,li{
    list-style: none;
    padding: 0;
    margin: 0
  }
  .video .top .rooms ul {
    /* width: 20px; */
    height: 100%;
    width: 100%;
    /* margin: 0 auto; */
    /* overflow: hidden; */
    text-align: center;
  }
  .video .top .rooms ul li {
    /* float: left; */
    display: inline;
    cursor: pointer;
    /* margin-top: 1em; */
    line-height: 59px;
  }
  .video .top .rooms ul li:not(:last-child){
    margin-right: 1em
  }
  .video .top .right {
    width: 23%;
    height: 100%;
    /* background-color: blueviolet; */
    box-sizing: border-box;
    float: right;
    text-align: right
  }
  .video .top .right .badgeDiv{
    /* float: right;
    margin-top: .8em;
    margin-right: .5em */
    display: inline-block;
    line-height: 59px
  }
  .video .top .right .badgeDiv:not(:first-child){
    margin-right: 1em
  }
  .video .middle {
    height: 617px;
    width: 100%;
    margin-bottom: .5em;
    margin-top: .5em;
    /* background-color: blueviolet */
  }
  .video .middle .middle_top {
    height: 54px;
    width: 100%;
    overflow: hidden;
    /* background-color: darkkhaki */
  }
  .video .middle .middle_top div {
    float: left;
    height: 100%
  }
  .video .middle .middle_top .one {
    width: 80%;
    float: left;
    background-color: #254598;
    border-radius: 10px;
    margin-left: 0.3%;
  }
  .video .middle .middle_top .one span {
    font-size: 22px;
    /* color: #fff; */
    font-weight: lighter;
    margin-left: 5%;
    line-height: 54px;
    /* margin-top: 2%; */
    /* display: inline-block */
  }
  .video .middle .middle_top .two {
    width: 19%;
    height: 100%;
    float: right;
    background-color: #1e6f09;
    border-radius: 10px;
    margin-right: 0.3%
  }
  .video .middle .middle_top .two span {
    font-size: 22px;
    /* color: #fff; */
    font-weight: lighter;
    margin-left: 25%;
    line-height: 54px
  }
  .video .middle .middle_bottom {
    position: relative;
  }
  .video .middle .middle_bottom .left {
    height: 563px;
    width: 40%;
    box-sizing: border-box;
    /* background-color: #1e6f09; */
    margin-right: .5em;
    display: inline-block;
    padding: .5em
  }
  .video .middle .middle_bottom .left ul{
    overflow: hidden;
  }
  .video .middle .middle_bottom .left li{
    width: 49%;
    height: 270px;
    float: left;
    /* background-color: burlywood */
  }
  .video .middle .middle_bottom .left li:nth-child(1){
    margin-right: .3em;
    margin-bottom: .6em
  }
   .video .middle .middle_bottom .left li:nth-child(2){
    margin-bottom: .6em
  }
  .video .middle .middle_bottom .left li:nth-child(3){
    margin-right: .3em;
  }
  .video .middle .middle_bottom .right {
    width: 59%;
    height: 553px;
    /* background-color: darkturquoise; */
    display: inline-block;
    position: absolute;
    top: 10px;
    padding: .5em
  }
  .video .bottom {
    height: 257px;
    width: 100%;
    /* background-color: cornflowerblue */
  }
</style>
