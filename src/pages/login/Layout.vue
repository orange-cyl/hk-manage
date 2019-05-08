<template>
  <!-- 登录页面 -->
  <div class="login">
    <img src="@/assets/bg.png" alt="">
    <div class="login_title">
      涉密IDC动力环境监控系统
    </div>
    <div class="login_content">
      <div class="left">
        <p>欢迎登录</p>
        <p>请输入您的用户名和密码</p>
        <a href="">下载vlc视频插件</a>
      </div>
      <div class="right">
        <i class="fa fa-key" style="font-size:100px;color:#dddddd;" />
      </div>
      <div class="login_form">
        <!-- {{ form }} -->
        <el-form ref="ruleForm" :model="form" class="demo-ruleForm">
          <el-form-item label="" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" @keyup.enter.native="login" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%;" @click.native.prevent="login()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import service from '@/http/service'
import service from '@/utils/request'
import conf from '@/http/config'
// import $ from 'jquery'
import md5 from 'md5.js'
export default {
  data() {
    return {
      // 用户名和密码
      form: {
        username: '',
        password: ''
      },
      // 验证规则
      // rules: {
      //   username: [
      //     { required: true, message: '请输入用户名', trigger: 'blur' },
      //     { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
      //   ],
      //   password: [
      //     { required: true, message: '请输入密码', trigger: 'blur' },
      //     { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
      //   ]
      // },
      psd: '',
      redirect: undefined,
      token:''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 密码加密处理
    encryption() {
      this.psd = md5(this.password)
    },
    // 创建cookie
    setCookie(cname, cvalue, exdays) {
      document.cookie = 'Token=' + this.token
    },
    // 登录
    login() {
      const params = {
        'username': this.form.username,
        'password': this.form.password
      }
      service.post('/api_token_auth/', params).then((res) => {
        if (res.status == 200) {
          // console.log(res.data)
          this.token = res.data.token
          this.setCookie()
          service.defaults.headers.common['Authorization'] = conf.getCookie('Token')
          this.$store.dispatch('LoginByUsername', this.form).then(() => {
            this.loading = false
            this.$router.push({ path: '/video' })
          })
        }
      }).catch((error) => {
        // reject(error);
        this.$notify.error({
          title: '错误',
          message: '用户名或密码错误'
        })
      })
    }
  }
}
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}
.login {
    background: #498de0;
    height: 100%;
    overflow: hidden;
}
.login > img {
  height: 100%;
  width: 100%;
}
.login_title {
  position: absolute;
  top: 30%;
  left: 30%;
  color: #fff;
  width: 40%;
  text-align: center;
	font-size: 28px;
	font-weight: bolder;
}
.login_content {
    position: absolute;
    top: 40%;
    left: 30%;
    background: #fff;
    height: 363px;
    width: 40%;
    padding: 20px 0;
    border-radius: 10px;
}
.login_content::after {
  content: '';
	display: block;
	clear: both;
}
.login_content .left {
  float: left;
  width: 60%;
  margin-bottom: 30px;
  margin-left: 30px;
}
.login_content .left > p:nth-child(1) {
  font-size: 22px;
}
.login_content .left > p:nth-child(2) {
  font-size: 14px;
  color:  rgb(136, 136, 136);
}
.login_content .left > a {
  font-size: 14px;
  color: #498de0;
  cursor: pointer;
}
.login_content .right {
  margin-left: 60%;
  margin-top: 20px;
  text-align: center;
}
.login_content .login_form {
  /* background: #eeeeee; */
  padding: 20px 30px;
}
</style>
