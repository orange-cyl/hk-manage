<template>
  <div>
    <div class="user_data_table">
      <!-- 表格开始 -->
      <el-table
        v-loading="loading"
        :data="users1"
        :height="he"
        size="mini"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
          fixed
          align="center" />
        <el-table-column
          prop="row_no"
          label="序号"
          width="80"
          align="center" />
        <el-table-column
          prop="last_name"
          label="姓名"
          width="220"
          align="center" />
        <el-table-column
          prop="username"
          label="账号"
          align="center"/>
        <el-table-column
          prop="is_superuser"
          label="管理员"
          align="center" />
        <el-table-column
          prop="user_tel"
          label="电话"
          align="center" />
        <el-table-column
          prop="is_active"
          label="状态"
          align="center" />
        <el-table-column
          label="操作"
          fixed="right"
          width="120"
          align="center">
          <template slot-scope="{row}">
            <i class="el-icon-delete" title="删除" @click="delUser(row)" />
            <i class="el-icon-edit" title="修改" @click="toUpdateUser(row)" />
            <i class="el-icon-tickets" title="查看详细信息" @click="toShowModel(row)" />
            <i class="el-icon-setting" title="修改密码" @click="toShowPasswordModel(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格结束 -->
    <!-- 详细信息模态框开始 -->
    <div>
      <user-data-dialog ref="userDataDialog" />
    </div>
    <!-- 详细信息模态框结束 -->
    <!-- 修改模态框组件开始 -->
    <div>
      <user-update-dialog ref="userUpdateDialog" />
    </div>
    <!-- 修改模态框组件结束 -->
    <!-- 修改密码模态框开始 -->
    <div>
      <user-password-dialog ref="userPasswordDialog" />
    </div>
    <!-- 修改密码模态框结束 -->
    <!-- 授权模态框开始 -->
    <div>
      <user-accredit-dialog ref="userAccreditDialog" />
    </div>
    <!-- 授权模态框结束 -->
  </div>
</template>
<script>
// import service from '@/http/service'
import service from '@/utils/request'
import $ from 'jquery'
import userDataDialog from './DataDialog.vue'
import userUpdateDialog from './UpdateDialog.vue'
import userPasswordDialog from './PasswordDialog.vue'
import userAccreditDialog from './AccreditDialog.vue'
export default {
  components: {
    userDataDialog,
    userUpdateDialog,
    userPasswordDialog,
    userAccreditDialog
  },
  data() {
    return {
      users: [],
      users1: [],
      multipleSelection: [],
      ids: [],
      idss: [],
      loading: true
    }
  },
  // watch: {
  //   multipleSelection: function(now, old) {
  //     this.foo()
  //   }
  // },
  created() {
    this.he = $(window).height() - 237
    this.findAllUsers()
  },
  methods: {
    // 加载表格内容
    findAllUsers(params) {
      service.get('/api_user/user_list/', { params }).then(({ data: result }) => {
        // console.log('=======================', result)
        this.users = result.results
        this.transform()
        this.loading = false
      }).catch(() => {
        this.$notify.error({
          title: '网络错误',
          message: '加载失败'
        })
      })
    },
    // 转换获取到的用户信息
    transform() {
      // console.log(this.users)
      this.users.map((item) => {
        if (item.is_active === true) {
          item.is_active = '启用'
        } else {
          item.is_active = '禁用'
        }
        if (item.is_superuser === true) {
          item.is_superuser = '是'
        } else {
          item.is_superuser = '否'
        }
      })
      this.users1 = this.users
      // console.log('---', this.users1)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.idss = this.multipleSelection.map((item) => {
        return item.id
      })
    },
    // 详情模态框
    toShowModel(row) {
      this.$refs.userDataDialog.toOpenDialog(row)
    },
    // 修改模态框
    toUpdateUser(row) {
      this.$refs.userUpdateDialog.toOpenDialog(row)
    },
    // 修改密码模态框
    toShowPasswordModel(row) {
      this.$refs.userPasswordDialog.toOpenDialog(row)
    },
    // 删除
    delUser(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // alert(row.id)
        service.post('/api_user/delete_user/', { 'user_ids': [row.id] }).then(() => {
          this.$notify({
            title: '删除成功',
            message: '这是一条成功的提示消息',
            type: 'success'
          })
          this.findAllUsers()
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
    delUsers1() {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ids = this.multipleSelection.map((item) => {
          return item.id + ''
        })
        // alert(this.ids)
        // this.ids = this.$refs.roleDataTable.ids
        // console.log(this.ids)
        const obj1 = {
          'user_ids': this.ids
        }
        // console.log('?????????', obj1)
        service.post('/api_user/delete_user/', obj1).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
          this.findAllUsers()
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
    // 将要授权的ids给授权模态框
    getIds() {
      // console.log(this.idss)
      const id1 = this.idss
      // alert(id1)
      if (id1.length !== 0) {
        this.$refs.userAccreditDialog.getGroupsOfUser(id1)
      } else {
        this.$notify.error({
          title: '错误',
          message: '请选择需要授权的用户'
        })
      }
    }
    // // 拿到批量删除的ids
    // // 向父组件发送批量删除的ids
    // foo() {
    //   // alert(1)
    //   // this.$emit('headCallBack', this.ids)
    //   this.ids = this.multipleSelection.map((item) => {
    //     return item.id
    //   })
    //   alert(this.ids)
    // }
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

