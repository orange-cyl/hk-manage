<template>
  <!-- 设备管理 -->
  <div class="device">
    <!-- 表单 -->
    <div class="device_form">
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item label="">
          <el-select v-model="params.room_name" clearable placeholder="请选择机房">
            <el-option
              v-for="room in rooms"
              :key="room.room_id"
              :label="room.room_name"
              :value="room.room_name" />
              <!-- </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="params.devicetype_name" clearable placeholder="请选择类型">
            <el-option
              v-for="devicetype in devicetypes"
              :key="devicetype.devicetype_id"
              :label="devicetype.devicetype_name"
              :value="devicetype.devicetype_name" />
              <!-- </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="params.device_name"
            placeholder="请输入名称"
            clearable />
            <!-- </el-input> -->
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="device_btns">
      <el-button type="primary" plain size="mini" @click="toAddDevice">新增</el-button>
      <el-button type="primary" plain size="mini" @click="batchDeleteDevice">批量删除</el-button>
    </div>
    <!-- 数据表格 -->
    <device-data-table ref="deviceDataTable" :params="params" :devicetypes="devicetypes" :rooms="rooms" />
    <!-- 分页 -->
    <!-- <device-pagination /> -->
    <div class="device_pagination">
      <el-pagination
        :page-size="10"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange" />
        <!-- </el-pagination> -->
    </div>
    <!-- 模态框 -->
    <device-dialog ref="deviceDialog" :rooms="rooms" />
  </div>
</template>

<script>
// import service from '@/http/service'
import service from '@/utils/request'
import deviceDataTable from './DataTable.vue'
import deviceDialog from './Dialog.vue'
export default {
  components: {
    deviceDataTable,
    // devicePagination,
    deviceDialog
  },
  data() {
    return {
      // 所有机房
      rooms: [],
      // 所有设备类型
      devicetypes: [],
      // 所有设备名称
      deviceNames: [],
      // 设备总数
      total: 0,
      // 监听数据
      params: {
        page: 1,
        room_name: undefined,
        devicetype_name: undefined,
        device_name: undefined
      }
    }
  },
  // 侦听器
  watch: {
    params: {
      handler: function() {
        // alert(1)
        this.$refs.deviceDataTable.findAllDevice()
      },
      deep: true
    },
    'params.room_name': function() {
      this.params.page = 1
    },
    'params.devicetype_name': function() {
      this.params.page = 1
    },
    'params.device_name': function() {
      this.params.page = 1
    }
  },
  // 生命周期钩子
  created() {
    this.findAllroom()
    this.findAllDeviceType()
    // this.total = this.$refs.deviceDataTable.count
    // console.log(this.total)
  },
  // 方法
  methods: {
    // 当前页的改变
    handleCurrentChange(page) {
      this.params.page = page
    },
    // 新增
    toAddDevice() {
      // this.deviceDialog.visible = true
      this.$refs.deviceDialog.showDialog()
      this.$refs.deviceDialog.deviceDialog.title = '添加设备信息'
      this.$refs.deviceDialog.deviceDialog.form = {}
    },
    // 批量删除
    batchDeleteDevice() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const ids = this.$refs.deviceDataTable.multipleSelection.map(item => item.device_id)
          service.post('/api_device/delete_device/', {
            device_ids: ids
          })
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
              this.$refs.deviceDataTable.findAllDevice()
            })
            .catch(() => {
              this.$notify({
                title: '失败',
                message: '删除失败',
                type: 'error'
              })
            })
        })
    },
    // 获取所有机房
    findAllroom() {
      service.get('/api_room/list_all_room/')
        .then(({ data }) => {
          // console.log(data)
          this.rooms = data
        })
        .catch(() => {
          this.$notify({
            title: '失败',
            message: '网络异常',
            type: 'error'
          })
        })
    },
    // 获取所有设备类型
    findAllDeviceType() {
      service.get('/api_devicetype/list_all_devicetypes/')
        .then(({ data }) => {
          // console.log(data)
          this.devicetypes = data
        })
        .catch(() => {
          this.$notify({
            title: '失败',
            message: '网络异常',
            type: 'error'
          })
        })
    },
    // 获取设备列表名称
    findAllDeviceName() {
      service.get('/api_device/list_device_name/')
        .then(({ data }) => {
          // console.log(data)
          this.deviceNames = data
        })
        .catch(() => {
          this.$notify({
            title: '失败',
            message: '网络异常',
            type: 'error'
          })
        })
    },
    // 获取所有的设备
    findAllDevice() {
      // this.loading = true
      service.get('/api_device/list_device/', {
        params: this.$refs.deviceDataTable.params
      })
        .then(({ data }) => {
          // console.log(data)
          this.$refs.deviceDataTable.devices = data.results
          // this.$refs.deviceDataTable.count = data.count
          this.total = data.count
        })
        .catch(() => {
          this.$notify({
            title: '失败',
            message: '网络异常',
            type: 'error'
          })
        })
        .finally(() => {
          // this.loading = false
        })
    }
  }
}
</script>

<style scoped>
  /* 设备管理 */
  .device {
    background-color: #ffffff;
    margin: 1em;
    padding: 1em;
    border-radius: 3px;
    /* min-height: 500px; */
  }
  /* 表单 */
  .device_form {
    float: left;
  }
  /* 按钮 */
  .device_btns {
    text-align: right;
  }
   /* 设备管理分页 */
  .device_pagination {
    text-align: right;
  }
</style>

