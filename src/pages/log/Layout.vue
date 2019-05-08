<template>
  <div class="log">
    <!-- 日志管理 -->
    <!-- 日志表单 用于模糊选择 -->
    <div class="log_form">
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-select v-model="params.log_type" placeholder="请选择日志类型" clearable>
            <el-option v-for="(logtype,index) in logTypes" :key="index" :label="logtype" :value="logtype"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="params.last_name" placeholder="请输入用户姓名" clearable/>
        </el-form-item>
        <el-form-item>
          <!-- <el-date-picker
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd"
            clearable
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker> -->
          <!-- {{time[0]}}
          {{time[1]}} -->
          <el-date-picker
            v-model="params.start_time"
            type="date"
            placeholder="选择开始日期"/>
          <el-date-picker
            v-model="params.end_time"
            type="date"
            placeholder="选择结束日期"/>
            <!-- {{ params.start_time }}
          {{ params.end_time }} -->
        </el-form-item>
      </el-form>
    </div>
    <!-- 日志按钮 -->
    <div class="log_btns">
      <el-button type="primary" plain size="mini" @click="exportLog()">导出日志</el-button>
    </div>
    <!-- 日志数据 -->
    <div class="log_table">
      <log-data-table ref="logDataTable" />
    </div>
    <!-- 日志分页 -->
    <div class="log_pagination">
      <el-pagination
        :page-size="10"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
// import service from '@/http/service'
import service from '@/utils/request'
import $ from 'jquery'
import logDataTable from './DataTable'
export default {
  components: {
    logDataTable
  },
  data() {
    return {
      // 日志类型
      logTypes: [],
      // 监听数据
      params: {
        log_type: undefined,
        last_name: undefined,
        start_time: undefined,
        end_time: undefined,
        page: 1
      },
      // 选择时间
      time: [],
      // 日志总数
      total: 0
    }
  },
  watch: {
    params: {
      handler: function() {
        // alert(1)
        // this.params.start_time = this.time[0]
        // alert(this.params.start_time)
        // this.params.end_time = this.time[1]
        // alert(this.params.last_time)

        this.$refs.logDataTable.findAllLog()
      },
      deep: true
    },
    'params.log_type': function() {
      this.params.page = 1
    },
    'params.last_name': function() {
      this.params.page = 1
    },
    'params.start_time': function() {
      // this.params.start_time = this.time[0]
      // this.params.end_time = this.time[1]

      this.params.page = 1
    },
    'params.end_time': function() {
      // this.params.end_time = this.time[1]
      this.params.page = 1
    }
  },
  created() {
    // 加载所有的日志类型
    this.findAllLogType()
  },
  methods: {
    // 当前页的改变
    handleCurrentChange(page) {
      this.params.page = page
    },
    // 导出日志
    exportLog() {
      this.$confirm('将导出搜索的结果,确认要导出么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delete this.params.page
          const str = $.param(this.params)
          this.url = service.defaults.baseURL + '/api_log/export_log_list/?' + str
          console.log(this.url)
          window.location.href = this.url
          this.$notify({
            title: '成功',
            message: '正在下载...',
            type: 'success'
          })
        })
        .catch(() => {
          this.$notify.error({
            title: '错误',
            message: '导出失败'
          })
        })
    },
    // 获取所有日志类型
    findAllLogType() {
      service.get('/api_log/get_log_type/')
        .then(({ data }) => {
          // console.log(data)
          this.logTypes = data.logtype
        })
        .catch(() => {
          this.$notify({
            title: '失败',
            message: '网络异常',
            type: 'error'
          })
        })
    }
  }
}
</script>

<style scoped>
  .log {
    margin: 1em;
    background: #ffffff;
    border-radius: 3px;
    padding: 1em;
  }
  .log .log_form {
    float: left;
  }
  .log .log_btns {
    text-align: right;
  }
  .log .log_pagination {
    text-align: right;
  }
</style>
