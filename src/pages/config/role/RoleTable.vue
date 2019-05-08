<template>
  <div class="role_data_table">
    <el-table
      v-loading="loading"
      :data="roles"
      :height="he"
      size="mini"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="60"
        align="center" />
      <!-- <el-table-column
        prop="date"
        label="序号"
        width="180" /> -->
      <el-table-column
        prop="group_name"
        label="角色名称"
        width="170"
        align="center" />
      <el-table-column
        prop="permission_names"
        label="角色权限信息" />
      <el-table-column
        prop="last_names"
        label="用户名称"
        width="220"
        align="center" />
      <el-table-column
        width="100"
        align="center"
        label="操作">
        <template slot-scope="{row}">
          <i class="el-icon-delete" title="删除" @click="delRole(row)" />
          <i class="el-icon-edit" title="修改" @click="toUpdateRoleDialog(row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改模态框开始 -->
    <role-update-dialog ref="roleUpdateDialog" />
    <!-- 修改模态框结束 -->
  </div>
</template>
<script>
// import service from '@/http/service'
import service from '@/utils/request'

import roleUpdateDialog from './updateRoleDialog.vue'
import $ from 'jquery'
export default {
  components: {
    roleUpdateDialog
  },
  data() {
    return {
      roles: [],
      multipleSelection: [],
      ids: [],
      loading: true
    }
  },
  // watch: {
  //   multipleSelection: function(now, old) {
  //     this.foo()
  //   }
  // },
  created() {
    // 表格高度
    this.he = $(window).height() - 194
    this.findAllRoles()
  },
  methods: {
    // 加载表格数据
    findAllRoles() {
      // alert(1)
      service.get('/api_permission/get_permission_list').then(({ data: result }) => {
        // console.log('...', result.data)
        this.roles = result.data
        this.loading = false
      }).catch(() => {
        this.$notify.error({
          title: '网络错误',
          message: '加载失败'
        })
      })
    },
    // 删除
    delRole(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(row.group_id)
        // alert(id)
        service.post('/api_group/delete_group', { group_ids: [row.group_id] }).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
          this.findAllRoles()
        }).catch(() => {
          this.$notify.error({
            title: '错误',
            message: '删除失败'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 批量删除
    delRoles1() {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ids = this.multipleSelection.map((item) => {
          return item.group_id + ''
        })
        const obj1 = {
          'group_ids': this.ids
        }
        // console.log(obj1)
        service.post('/api_group/delete_group', obj1).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
          this.findAllRoles()
        }).catch(() => {
          this.$notify.error({
            title: '错误',
            message: '删除失败'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // foo() {
    //   this.ids = this.multipleSelection.map((item) => {
    //     return item.group_id + ''
    //   })
    //   alert(this.ids)
    // },
    // 多选框
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    toUpdateRoleDialog(row) {
      this.$refs.roleUpdateDialog.toOpenDialog(row)
    }
  }
}
</script>
<style scoped>
  i {
    cursor: pointer;
    margin-right: .5em
  }
  .el-icon-delete {
    color: #F56C6C
  }
  .el-icon-edit {
    color: #E6A23C
  }
  .el-icon-tickets {
    color: #67C23A
  }
</style>
