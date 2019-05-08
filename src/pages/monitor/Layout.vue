<template>
  <div class="monitor">
    <!-- 机房部分 -->
    <div class="monitor_nav">
      <el-menu class="el-menu-vertical-demo" background-color="#F0F2F5">
        <el-menu-item v-for="item in rooms" :index="item.room_id+''" :key="item.room_id" default-active="2" @click="updateRoom(item.room_id)">
          <i class="el-icon-menu" />
          <span slot="title" :title="item.room_name">{{ item.room_name }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="monitor_content">
      <!-- 下拉菜单 -->
      <div class="monitor_content_top">
        <!-- {{devicetype_id}} -->
        <el-select v-model="devicetype_id">
          <el-option v-for="item in deviceType" :key="item.devicetype_id" :label="item.devicetype_name" :value="item.devicetype_id" />
        </el-select>
        <!-- {{device_id}} -->
        <el-select v-model="device_id">
          <el-option v-for="item in device" :key="item.device_id" :label="item.device_name" :value="item.device_id"/>
        </el-select>
      </div>
      <!-- 主页面部分 -->
      <div class="monitor_content_content">
        <!-- ups -->
        <upsIT v-if="devicetype_id === 16" ref="upsIT" />
        <!-- ups电池巡检仪 -->
        <upsBattery v-if="devicetype_id === 15" ref="upsBattery" />
        <!-- 温湿度 -->
        <TemperatureAndHumidity v-if="devicetype_id === 4" ref="TemperatureAndHumidity" />
        <!-- 漏水 -->
        <leak v-if="devicetype_id === 5" ref="leak" />
        <!-- 配电 -->
        <distribution v-if="devicetype_id === 3" ref="distribution" />
        <!-- 空调 -->
        <CoolMaster v-if="devicetype_id === 17" ref="CoolMaster" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.monitor {
  margin: 1em;
  background: #ffffff;
  border-radius: 3px;
  padding: 1em;
  min-height: calc(100vh - 84px);
  overflow: hidden;
}
.el-menu {
  border-right: 0
}
.monitor_nav {
  min-height: calc(100vh - 84px);
  width: 180px;
  float: left;
  background-color: #F0F2F5;
}
.monitor_content {
  min-height: calc(100vh - 84px);
  width: 100%;
  background-color: #F0F2F5;
  margin-left: 190px;
  padding: 1em;
  box-sizing: border-box;
  border: 1px solid white;
}
.monitor_content_top {
	width: 100%;
	height: 60px;
}
.monitor_content_content {
  width: 100%;
  padding: 1em;
  height: calc(100vh - 180px);
  overflow: auto;
  background-color: #ffffff;
}

</style>
<script>
import service from '@/utils/request'
import upsIT from '@/pages/monitor/type/upsIT.vue'
import leak from '@/pages/monitor/type/leak.vue'
import CoolMaster from '@/pages/monitor/type/CoolMaster.vue'
import distribution from '@/pages/monitor/type/distribution.vue'
import upsBattery from '@/pages/monitor/type/upsBattery.vue'
import TemperatureAndHumidity from '@/pages/monitor/type/TemperatureAndHumidity.vue'
// import service from '@/http/service'
// import $ from 'jquery'
export default {
  components: {
    upsIT,
    upsBattery,
    TemperatureAndHumidity,
    leak,
    distribution,
    CoolMaster
  },
  data() {
    return {
      // 所有机房的信息
      rooms: [],
      // 设备类型
      deviceType: [],
      // 设备id
      device_id: '',
      // 设备类型id
      devicetype_id: '',
      // 设备
      device: [],
      roomId: ''
    }
  },
  watch: {
    'devicetype_id': function(newVal, oldVal) {
      this.loadDevice()
    },
    'roomId': function(newVal, oldVal) {
      this.loadDevice()
    },
    'device_id': function(newVal, oldVal) {
      this.change()
    }
  },
  created() {
    if (!this.roomId) {
      this.updateRoom(2)
    }
    this.loadRoom()
    // this.loadDevice()
    this.change()
  },
  methods: {
    updateRoom(roomId) {
      service.get('/api_room_monitor/get_types_in_room/', { params: { room_id: roomId }}).then(({ data }) => {
        // console.log(data)
        this.deviceType = data
        this.roomId = roomId
        if (this.deviceType[0]) {
          this.devicetype_id = this.deviceType[0].devicetype_id
        } else {
          this.devicetype_id = ''
        }
        this.loadDevice()
      })
    },
    loadDevice() {
      // console.log('11111111111111111',this.roomId)
      service.get('/api_room_monitor/get_devices/', { params: { room_id: this.roomId, devicetype_id: this.devicetype_id }})
        .then(({ data }) => {
          // console.log(data)
          this.device = data
          // console.log('=====', this.device)
          if (this.device[0]) {
            this.device_id = this.device[0].device_id
          } else {
            this.device_id = ''
          }
          this.$refs.upsIT.device_id = this.device_id
          this.$refs.upsIT.loadAllDevice()
          // console.log('=====', this.devicetype_id)
          // console.log('++++++', this.device_id)
          this.$refs.upsIT.devicetype_id = this.devicetype_id
          this.$refs.upsIT.loadAllDevice()
          // setInterval(() => { this.$refs.upsIT.loadAllDevice() }, 1000)
        })
    },
    // 加载机房
    loadRoom() {
      service.get('/api_room/list_all_room/').then(({ data }) => {
        this.rooms = data
      })
    },
    change() {
      if (this.devicetype_id === 16) {
        this.$refs.upsIT.device_id = this.device_id
        this.$refs.upsIT.loadAllDevice()
      } else if (this.devicetype_id === 15) {
        this.$refs.upsBattery.device_id = this.device_id
        this.$refs.upsBattery.loadAllDevice()
      } else if( this.devicetype_id === 5 ) {
        this.$refs.leak.query.device_id = this.device_id
        // this.$refs.leak.findAllLeakData()
      } else if(this.devicetype_id === 4) {
        this.$refs.TemperatureAndHumidity.thQuery.device_id = this.device_id
        // this.$refs.TemperatureAndHumidity.findAllHumitureData()
      } else if (this.devicetype_id === 17) {
        this.$refs.CoolMaster.findAllData1(this.device_id)
        this.$refs.CoolMaster.device_id = this.device_id
      } else if (this.devicetype_id === 17) {
        this.$refs.CoolMaster.findAllData1(this.device_id)
        this.$refs.CoolMaster.device_id = this.device_id
        this.$refs.CoolMaster.findAllData(this.devicetype_id)
        this.$refs.CoolMaster.findAcCoolDeviceDetails(this.device_id)
      } else if (this.devicetype_id === 3) {
        // 获取图片
        this.$refs.distribution.getDevice(this.roomId, this.devicetype_id)
        this.$refs.distribution.deviceId = this.device_id
      }
    }
}
}

</script>
