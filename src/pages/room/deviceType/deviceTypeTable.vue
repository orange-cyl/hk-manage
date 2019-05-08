<template>
  <div class="deviceTypeTable">
    <!-- 设备类型表格 -->
    <el-table v-loading="loading" :data="deviceTypes" :height="he" style="width: 100%" size="mini">
      <el-table-column prop="row_no" label="序号" width="200" align="center" />
      <el-table-column prop="devicetype_name" label="类型名称" align="center" />
      <el-table-column prop="devicetype_desc" label="类型描述" align="center" />
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="{row}">
          <el-dropdown :hide-on-click="false" trigger="click" @command="handleCommand">
            <span class="el-dropdown-link" @click="load(row)">&nbsp;&nbsp;&nbsp;&nbsp;查看<i class="el-icon-arrow-down el-icon--right" /></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">数据项</el-dropdown-item>
              <el-dropdown-item command="b">操作项</el-dropdown-item>
              <el-dropdown-item command="c">配置项</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom" style="text-align:right;">
      <el-pagination :page-size="pageSize" :current-page.sync="currentPage" layout="prev, pager, next, jumper, total" @current-change="handleCurrentChange" />
    </div>
    <Dmodal ref="Dmodal" />
    <Omodal ref="Omodal" />
    <Cmodal ref="Cmodal" />
  </div>
</template>
<script type="text/javascript">
// import service from '@/http/service'
import service from '@/utils/request'
import conf from '@/http/config.js'
import $ from 'jquery'
import Dmodal from '@/pages/room/deviceType/Dmodal.vue'
import Cmodal from '@/pages/room/deviceType/Cmodal.vue'
import Omodal from '@/pages/room/deviceType/Omodal.vue'
export default {
  components: {
    Dmodal,
    Cmodal,
    Omodal
  },
  data() {
    return {
      deviceTypes: [],
      pageSize: conf.pageSize,
      currentPage: 1,
      loading: false
    }
  },
  created() {
    this.loadDeviceTypes()
    this.he = $(window).height() - 150
  },
  methods: {
    // 分页查找设备类型
    handleCurrentChange(val) {
      const obj = {
        params: {
          page: val
        }
      }
      this.findChildDeviceType(obj).then(() => {
        // 查找成功
      }).catch(() => {
        this.$notify({ type: 'info', message: '查找失败!' })
      })
    },
    handleCommand(command) {
      if (command === 'a') {
        this.$refs.Dmodal.dialogVisible1 = true
      } else if (command === 'b') {
        this.$refs.Omodal.dialogVisible2 = true
      } else if (command === 'c') {
        this.$refs.Cmodal.dialogVisible3 = true
      }
    },
    // 加载所有设备类型
    loadDeviceTypes(obj) {
      this.loading = true
      if (obj) {
        service.get('/api_devicetype/list_detail_devicetypes/', obj).then(({ data }) => {
          this.deviceTypes = data.results
        }).catch(() => {
          this.$notify.error({
            title: '网络超时',
            message: '这是一条错误的提示消息'
          })
        }).finally(() => {
          this.loading = false
        })
      } else {
        service.get('/api_devicetype/list_detail_devicetypes/')
          .then(({ data }) => {
            this.deviceTypes = data.results
          }).catch(() => {
            this.$notify.error({
              title: '网络超时',
              message: '这是一条错误的提示消息'
            })
          }).finally(() => {
            this.loading = false
          })
      }
    },
    // 传递值给配置,数据,操作项
    load(row) {
      this.$refs.Dmodal.title = row.devicetype_name
      this.$refs.Dmodal.dataType = row.dataitems
      this.$refs.Dmodal.currentDevicetypeId = row.devicetype_id
      this.$refs.Omodal.operationType = row.operitems
      this.$refs.Omodal.title = row.devicetype_name
      this.$refs.Omodal.currentDevicetypeId = row.devicetype_id
      this.$refs.Cmodal.configurationType = row.configitems
      this.$refs.Cmodal.title = row.devicetype_name
      this.$refs.Cmodal.currentDevicetypeId = row.devicetype_id
    }
  }
}

</script>
