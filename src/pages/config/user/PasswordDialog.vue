<template>
  <!-- 修改密码模态框 -->
  <div class="user_password_dialog">
    <el-dialog :visible.sync="passwordDialog.visible" title="修改密码" width="25%" center="">
      <el-form :model="passwordDialog.form" label-position="left">
        <el-form-item :label-width="formLabelWidth" label="新密码:">
          <el-input v-model="passwordDialog.form.password" autocomplete="off" type="password" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="确认密码:">
          <el-input v-model="passwordDialog.form.password1" autocomplete="off" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="savePassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import service from '@/http/service'
import service from '@/utils/request'

export default {
  data() {
    return {
      formLabelWidth: '80px',
      passwordDialog: {
        visible: false,
        form: {}
      }
    }
  },
  methods: {
    toOpenDialog(row) {
      this.passwordDialog.form = {}
      this.passwordDialog.visible = true
      this.passwordDialog.form.id = row.id
    },
    savePassword() {
      // console.log(this.passwordDialog.form)
      // service.post('/api_user/update_user/', this.passwordDialog.form).then(() => {
      //   this.$notify({
      //     title: '成功',
      //     message: '修改密码成功',
      //     type: 'success'
      //   })
      //   this.passwordDialog.visible = false
      // }).catch(() => {
      //   this.$notify.error({
      //     title: '错误',
      //     message: '这是一条错误的提示消息'
      //   })
      // })
      if (this.passwordDialog.form.password === this.passwordDialog.form.password1) {
        // console.log(this.passwordDialog.form)
        const obj = {
          id: this.passwordDialog.form.id,
          password: this.passwordDialog.form.password
        }
        service.post('/api_user/update_user/', obj).then(() => {
          this.$notify({
            title: '成功',
            message: '修改密码成功',
            type: 'success'
          })
          this.passwordDialog.visible = false
        }).catch(() => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          })
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: '两次输入的密码不一致'
        })
      }
    }
  }
}
</script>
