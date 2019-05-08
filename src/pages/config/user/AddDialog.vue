<template>
  <!-- 新增权限模态框 -->
  <div class="user_data_dialog1">
    <el-dialog :title="addUserModel.title" :visible.sync="addUserModel.visible" center="" width="35%">
      <el-form ref="addUserModel.form" :model="addUserModel.form" :rules="rules" label-position="left" label-width="80px">
        <el-form-item :label-width="formLabelWidth" label="账号:" prop="username">
          <el-input v-model="addUserModel.form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="密码:" prop="password">
          <el-input v-model="addUserModel.form.password" autocomplete="off" type="password" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="确认密码:" prop="password2">
          <el-input v-model="addUserModel.form.password2" autocomplete="off" type="password" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="用户姓名:" prop="last_name">
          <el-input v-model="addUserModel.form.last_name" autocomplete="off" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="联系电话:" prop="user_tel">
          <el-input v-model="addUserModel.form.user_tel" autocomplete="off" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="地址:" prop="user_address">
          <el-input v-model="addUserModel.form.user_address" autocomplete="off" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="用户描述:" prop="user_note">
          <el-input v-model="addUserModel.form.user_note" type="textarea" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="管理员:">
          <el-switch
            v-model="addUserModel.form.is_superuser"
            active-color="#13ce66"
            inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="启用:">
          <el-switch
            v-model="addUserModel.form.is_active"
            active-color="#13ce66"
            inactive-color="#ff4949" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toCloseDialog()">取 消</el-button>
        <el-button type="primary" @click="saveAddUser()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import service from '@/http/service'
import service from '@/utils/request'

export default {
  data() {
    // var validatePass = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入密码'));
    //   } else {
    //     if (this.ruleForm.password !== '') {
    //       this.$refs.ruleForm.validateField('password');
    //     }
    //     callback();
    //   }
    // };
    // var validatePass2 = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请再次输入密码'));
    //   } else if (value !== this.ruleForm.password2) {
    //     callback(new Error('两次输入密码不一致!'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      addUserModel: {
        title: '',
        visible: false,
        form: {}
      },
      formLabelWidth: '120px',
      // 新增的switch开关
      value1: true,
      value2: true,
      // 新增模态框表单验证
      ruleForm: {
        username: '',
        password: '',
        password2: '',
        last_name: '',
        user_tel: '',
        user_address: '',
        user_note: ''
      },
      rules: {
        username: [
          { required: true, message: '账号仅限数字字母下划线', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
          // { validator: validatePass, trigger: 'blur' }
        ],
        password2: [
          // { validator: validatePass, trigger: 'blur' }
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        last_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        user_tel: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        user_address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        user_note: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 弹出修改模态框
    toOpenDialog() {
      this.addUserModel.title = '添加用户'
      this.addUserModel.form = {
        is_superuser: false,
        is_active: false
      }
      this.addUserModel.visible = true
    },
    // 关闭模态框
    toCloseDialog() {
      this.addUserModel.visible = false
      // this.$nextTick(() => {
      //   this.$refs['addUserModel.formruleForm'].resetFields()
      // })
    },
    // 新增用户确定
    saveAddUser() {
      if (this.addUserModel.form.password === this.addUserModel.form.password2) {
        // console.log(this.addUserModel.form)
        // service.post('api_user/create_user/', this.addUserModel.form).then(() => {
        //   this.$notify({
        //     title: '成功',
        //     message: '新增成功',
        //     type: 'success'
        //   })
        //   this.addUserModel.visible = false
        // }).catch(() => {
        //   this.$notify.error({
        //     title: '错误',
        //     message: '请按照要求填写所有的信息'
        //   })
        // })
        const a = /^[0-9a-zA-Z_]{1,}$/i
        if (a.test(this.addUserModel.form.username)) {
          // alert(1)
          service.post('api_user/judge_username/', { username: this.addUserModel.form.username }).then(({ data }) => {
            // console.log('=======data', data)
            if (data.is_usable === false) {
              const b = /^([\u4e00-\u9fa5]){2,4}$/
              if (b.test(this.addUserModel.form.last_name)) {
                // const c = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
                // if (c.test(this.addUserModel.form.user_tel)) {
                //   console.log(this.addUserModel.form)
                //   service.post('api_user/create_user/', this.addUserModel.form).then(() => {
                //     this.$notify({
                //       title: '成功',
                //       message: '新增成功',
                //       type: 'success'
                //     })
                //     this.addUserModel.visible = false
                //     this.$parent.findAllUsers()
                //   }).catch(() => {
                //     this.$notify.error({
                //       title: '错误',
                //       message: '请按照要求填写所有的信息'
                //     })
                //   })
                // } else {
                //   this.$notify.error({
                //     title: '错误',
                //     message: '电话输入错误，请输入例如13812341234，021-12345678，1234567',
                //   })
                // }
                // console.log(this.addUserModel.form)
                service.post('api_user/create_user/', this.addUserModel.form).then(() => {
                  this.$notify({
                    title: '成功',
                    message: '新增成功',
                    type: 'success'
                  })
                  this.addUserModel.visible = false
                  this.$parent.findUsers()
                }).catch(() => {
                  this.$notify.error({
                    title: '错误',
                    message: '请按照要求填写所有的信息'
                  })
                })
              } else {
                this.$notify.error({
                  type: 'warning',
                  message: '错误，姓名仅限2-4位中文'
                })
              }
            } else {
              this.$notify.error({
                title: '错误',
                message: '账号已存在,请重新输入'
              })
            }
          }).catch(() => {

          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '帐号仅限数字字母下划线'
          })
        }
      } else {
        this.$notify.error({
          title: '错误',
          message: '两次密码输入不一致'
        })
      }
    }
  }
}
</script>
