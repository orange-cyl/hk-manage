<template>
  <!-- 修改权限模态框 -->
  <div class="user_data_dialog2">
    <el-dialog :title="updateModel.title" :visible.sync="updateModel.visible" width="35%" center="">
      <el-form ref="ruleForm" :model="updateModel.form" :rules="rules" label-position="left">
        <el-form-item :label-width="formLabelWidth" label="账号:" prop="username">
          <el-input v-model="updateModel.form.username" autocomplete="off" readonly />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="用户姓名:" prop="last_name">
          <el-input v-model="updateModel.form.last_name" autocomplete="off" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="联系电话:" prop="user_tel">
          <el-input v-model="updateModel.form.user_tel" autocomplete="off" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="地址:" prop="user_address">
          <el-input v-model="updateModel.form.user_address" autocomplete="off" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="用户描述:" prop="user_note">
          <el-input v-model="updateModel.form.user_note" type="textarea" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="管理员:" prop="is_superuser">
          <el-switch
            v-model="updateModel.form.is_superuser"
            active-color="#13ce66"
            inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="启用:" prop="is_active">
          <el-switch
            v-model="updateModel.form.is_active"
            active-color="#13ce66"
            inactive-color="#ff4949" />
        </el-form-item>
        <!-- <el-form-item :label-width="formLabelWidth" label="更换头像:" prop="description">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="updateModel.form.user_note.user_avatarpath">
            class="avatar-uploader"
            <img v-if="updateModel.form.user_note.user_avatarpath" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />>
          </el-upload>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toCloseDialog">取 消</el-button>
        <el-button type="primary" @click="saveUser()">确 定</el-button>
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
      updateModel: {
        title: '',
        form: {},
        visible: false
      },
      // 修改模态框的switch开关
      value3: true,
      value4: false,
      formLabelWidth: '120px',
      ruleForm: {
        number: '',
        name: '',
        tel: '',
        address: '',
        description: ''
      },
      rules: {
        number: [
          { required: true, message: '账号仅限数字字母下划线', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 弹出修改模态框
    toOpenDialog(row) {
      this.updateModel.title = '修改密码'
      // console.log(row)
      if (row.is_superuser === '是') {
        row.is_superuser = true
      } else {
        row.is_superuser = false
      }
      if (row.is_active === '启用') {
        row.is_active = true
      } else {
        row.is_active = false
      }
      // console.log(row)
      this.users1 = this.users
      this.updateModel.title = '修改用户'
      this.updateModel.form = row
      this.updateModel.visible = true
    },
    // 关闭模态框
    toCloseDialog() {
      //  if (row.is_superuser === true) {
      //   row.is_superuser = '是'
      // } else {
      //   row.is_superuser = '否'
      // }
      // if (row.is_active === true) {
      //   row.is_active = '启用'
      // } else {
      //   row.is_active = '禁用'
      // }
      this.updateModel.visible = false
    },
    // 保存
    saveUser() {
      // console.log(this.updateModel.form)
      // service.post('/api_user/update_user/', this.updateModel.form).then(() => {
      //   this.$notify({
      //     title: '成功',
      //     message: '这是一条成功的提示消息',
      //     type: 'success'
      //   })
      // }).catch(() => {
      //   this.$notify.error({
      //     title: '错误',
      //     message: '这是一条错误的提示消息'
      //   })
      // })
      const a = /^([\u4e00-\u9fa5]){2,4}$/
      if (a.test(this.updateModel.form.last_name)) {
        // const b = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
        // if(b.test(this.updateModel.user_tel)) {
        //   console.log(this.updateModel.form)
        //   service.post('/api_user/update_user/', this.updateModel.form).then(() => {
        //     this.$notify({
        //       title: '成功',
        //       message: '这是一条成功的提示消息',
        //       type: 'success'
        //     })
        //     this.toCloseDialog()
        //     this.$parent.findAllUsers()
        //   }).catch(() => {
        //     this.$notify.error({
        //       title: '错误',
        //       message: '这是一条错误的提示消息'
        //     })
        //   })
        // } else {
        //   this.$notify.error({
        //     title: '错误',
        //     message: '地址输入错误，请输入例如13812341234，021-12345678，1234567',
        //   });
        // }
        // console.log(this.updateModel.form)
        service.post('/api_user/update_user/', this.updateModel.form).then(() => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
          this.toCloseDialog()
          this.$parent.findAllUsers()
        }).catch(() => {
          this.$notify.error({
            title: '错误',
            message: '修改失败'
          })
        })
      } else {
        this.$notify.error({
          type: 'warning',
          message: '错误，姓名仅限2-4位中文'
        })
      }
    }
    // 上传头像
    // handleAvatarSuccess(res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw)
    // },
    // beforeAvatarUpload(file) {
    //   const isJPG = file.type === 'image/jpeg'
    //   const isLt2M = file.size / 1024 / 1024 < 2

    //   if (!isJPG) {
    //     this.$message.error('上传头像图片只能是 JPG 格式!')
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('上传头像图片大小不能超过 2MB!')
    //   }
    //   return isJPG && isLt2M
    // }
  }
}
</script>
