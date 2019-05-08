<template>
  <div class="check">
    <el-row>
      <el-form :inline="true" :model="form" class="demo-form-inline" size="mini">
        <el-col :span="3">
          <el-form-item>
            <el-input v-model="form.check_name" placeholder="申请人" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="form.check_id" placeholder="审批类型" clearable>
              <el-option v-for="item in check_types" :key="item.type_id" :label="item.type_text" :value="item.type_id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="form.status_id" placeholder="审批状态" clearable>
              <el-option v-for="item in check_states" :key="item.status_id" :label="item.status_text" :value="item.status_id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <div>
              <el-date-picker v-model="form.time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-form-item>
            <el-button type="primary" size="mini" plain @click="filtrate()">查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2" :offset="2">
          <el-row type="flex" justify="end">
            <el-form-item>
              <el-button type="primary" size="mini" style="float: right;width: 6em;" plain @click="addRequst()">添加申请</el-button>
            </el-form-item>
          </el-row>
        </el-col>
      </el-form>
    </el-row>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="check_list" :height="he" style="width: 100%" size="mini">
      <el-table-column prop="row_no" label="序号" align="center" width="50" />
      <el-table-column prop="approval_type" label="审批类型" align="center" />
      <el-table-column prop="approval_user" label="申请人" align="center" />
      <el-table-column prop="approval_text" label="申请内容" align="center" />
      <el-table-column prop="approval_time" label="申请时间" align="center" />
      <el-table-column prop="approval_history" label="审批记录" align="center" />
      <el-table-column prop="approval_status" label="审批状态" align="center" />
      <el-table-column prop="approval_id" label="操作" align="center" width="80">
        <template slot-scope="{row}">
          <i v-if="row.result" class="fa fa-edit" style="color:#448db8" title="审批" @click="checkRequst(row)" />
          <i v-if="row.result" class="el-icon-delete" style="color:#f56c6c" title="删除" @click="deleteRequst(row.approval_id)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加申请模态框 -->
    <addRequstModal ref="addRequstModal" />
    <checkModal ref="checkModal" />
  </div>
</template>
<style scoped>
.check {
  margin: 1em;
  background: #ffffff;
  border-radius: 3px;
  padding: 1em;
}
.check i {
  cursor:pointer
}
</style>
<script>
import addRequstModal from '@/pages/check/addRequstModal.vue'
import checkModal from '@/pages/check/checkModal.vue'
import $ from 'jquery'
// import service from '@/http/service'
import service from '@/utils/request'
export default {
  components: {
    addRequstModal,
    checkModal
  },
  data() {
    return {
      loading: false,
      check_types: [],
      check_states: [],
      form: {
        check_name: '',
        check_id: '',
        status_id: '',
        time: null
      },
      check_list: []
    }
  },
  created() {
    this.loadCheck_types()
    this.loadCheck_states()
    this.loadCheck_list()
    this.he = $(window).height() - 200
  },
  methods: {
    // 时间序列化
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
    // 筛选符合条件的
    filtrate() {
      var filtrate = {}
      if (this.form.check_name !== '') {
        filtrate.last_name = this.form.check_name
      }
      if (this.form.check_id !== '') {
        filtrate.approval_type = this.form.check_id
      }
      if (this.form.status_id !== '') {
        filtrate.approval_status = this.form.status_id
      }
      if (this.form.time && this.form.time.length !== 0) {
        var startDate = this.timestampToTime(this.form.time[0])
        var endDate = this.timestampToTime(this.form.time[1])
        filtrate.start_time = startDate
        filtrate.end_time = endDate
      }
      this.loadCheck_list(filtrate)
    },
    // 加载审批类型
    loadCheck_types() {
      service.get('/api_approval/get_approval_type/')
        .then(({ data }) => {
          this.check_types = data.result
        }).catch(() => {
          this.$notify.error({
            title: '网络超时',
            message: '这是一条错误的提示消息'
          })
        })
    },
    // 加载审批状态
    loadCheck_states() {
      service.get('/api_approval/get_approval_status/')
        .then(({ data }) => {
          this.check_states = data.result
        }).catch(() => {
          this.$notify.error({
            title: '网络超时',
            message: '这是一条错误的提示消息'
          })
        })
    },
    // 加载申请列表
    loadCheck_list(obj) {
      this.loading = true
      service.get('/api_approval/get_approval_list/', { params: obj })
        .then(({ data }) => {
          data.result.forEach(function(obj, index) {
            // 没有审核的才可以尽心删除 才能出现删除的按钮
            if (obj.status_id === 0) {
              obj.result = true
            } else {
              obj.result = false
            }
          })
          this.check_list = data.result
        }).catch(() => {
          this.$notify.error({
            title: '网络超时',
            message: '这是一条错误的提示消息'
          })
        }).finally(() => {
          this.loading = false
        })
    },
    // 添加申请
    addRequst() {
      this.$refs.addRequstModal.dialogFormVisible = true
      this.$refs.addRequstModal.check_type = this.check_types
    },
    checkRequst(data) {
      this.$refs.checkModal.visible1 = true
      this.$refs.checkModal.user_check = [data]
    },
    deleteRequst(oId) {
      // console.log(oId)
      const obj = {
        approval_id: [oId]
      }
      service.post('/api_approval/delete_approval/', obj)
        .then(() => {
          this.loadCheck_types()
          this.loadCheck_states()
          this.loadCheck_list()
          this.$notify({
            title: '删除成功',
            message: '这是一条成功的提示消息',
            type: 'success'
          })
        }).catch(() => {
          this.$notify.error({
            title: '删除失败',
            message: '这是一条错误的提示消息'
          })
        })
    }
  }
}

</script>
