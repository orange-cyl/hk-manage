<template>
  <!-- 设备管理分页 -->
  <div class="device_pagination">
    <el-pagination
      :page-size="1"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange" />
      <!-- </el-pagination> -->
  </div>
</template>

<script>
import service from '@/utils/request'
export default {
  data() {
    return {
      total: 10,
      pagination: {

      }
    }
  },
  methods: {
    // 当前页的改变
    handleCurrentChange(page) {
      // console.log(1)
      this
    }
  }
}
</script>

<style scoped>
  /* 设备管理分页 */
  .device_pagination {
    text-align: right;
  }
</style>
