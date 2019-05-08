<template>
  <div class="log_data_table">
    <!-- 日志数据 -->
    <el-table
      v-loading="loading"
      :height="he"
      :data="logs"
      size="mini"
      style="width: 100%">
      <el-table-column
        prop="row_no"
        label="序号"
        width="80"/>
      <el-table-column
        prop="log_time"
        label="日志时间"/>
      <el-table-column
        prop="log_type"
        label="日志类型"/>
      <el-table-column
        prop="last_name"
        label="用户姓名"/>
      <el-table-column
        prop="user_ip"
        label="用户IP"/>
      <el-table-column
        prop="log_text"
        label="日志内容"/>
    </el-table>
  </div>
</template>
<script>
// import axios from '@/http/axios'
import service from '@/utils/request'
import $ from 'jquery'
export default {
  data() {
    return {
      // 加载中
      loading: false,
      // 所有日志
      logs: []
    }
  },
  created() {
    // 表格盖度
    this.he = $(window).height() - 230
    // 加载日志信息
    this.findAllLog()
  },
  methods: {
    // 获取所有日志信息
    findAllLog() {
      this.loading = true
      const params = this.$parent.params
      // delete params.page
      // params.start_time = this.$parent.time[0]
      // params.end_time = this.$parent.time[1]
      // console.log(params)
      service.get('/api_log/get_log_list/', {
        params: params
      })
        .then(({ data }) => {
          // console.log(data)
          this.logs = data.result
          this.$parent.total = data.count
        })
        .catch((error) => {
          // console.log(error)
          this.$notify({
            title: '失败',
            message: '网络异常',
            type: 'error'
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped>

</style>
