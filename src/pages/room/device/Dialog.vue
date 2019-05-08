<template>
  <!-- 设备管理模态框 -->
  <div class="device_dialog">
    <!-- 修改设备数据信息 -->
    <el-dialog :visible.sync="deviceDialog.visible" :title="deviceDialog.title" :before-close="closeDialog">
      <!-- {{ devicetypes }} -->
      <!-- 体 -->
      <el-form ref="ruleForm" :rules="rules" :model="deviceDialog.form" size="mini">
        <el-form-item :label-width="formLabelWidth" label="设备名称" prop="device_name">
          <el-input v-model="deviceDialog.form.device_name" auto-complete="off" clearable />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="设备码" prop="device_code">
          <el-input v-model="deviceDialog.form.device_code" auto-complete="off" clearable />
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item :label-width="formLabelWidth" label="设备类型" prop="devicetype">
              <el-select v-model="deviceDialog.form.devicetype" :disabled="deviceDialog.disabled" placeholder="请选择类型" clearable>
                <el-option v-for="devicetype in devicetypes" :key="devicetype.devicetype_id" :label="devicetype.devicetype_name" :value="devicetype.devicetype_id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label-width="formLabelWidth" label="所属机房" prop="room">
              <el-select v-model="deviceDialog.form.room" placeholder="请选择机房" clearable>
                <el-option v-for="r in rooms" :key="r.room_id" :label="r.room_name" :value="r.room_id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label-width="formLabelWidth" label="设备描述" prop="device_desc">
          <el-input :rows="2" v-model="deviceDialog.form.device_desc" type="textarea" placeholder="" />
        </el-form-item>
        <!-- {{ deviceDialog.form }} -->
        <el-form-item v-if="deviceImgShow" :label-width="formLabelWidth" label="上传图片" prop="imageUrl">
          <!-- 上传图片 -->
          <el-upload
            :data="imgData"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="beforeAvatarUpload"
            :action="actionImg"
            class="avatar-uploader">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 尾 -->
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button type="primary" size="mini" @click="saveOrUpdateDevice">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看数据详细信息模态框 -->
    <el-dialog
      :model="deviceViewDialog.devices"
      :title="deviceViewDialog.title"
      :visible.sync="deviceViewDialog.visible"
      :before-close="closeViewDialog"
      width="30%">
      <!-- {{ deviceViewDialog.devices }} -->
      <el-row :gutter="20">
        <el-col :span="14">
          <ul>
            <li>
              设备码：<span>{{ deviceViewDialog.devices.device_code }}</span>
            </li>
            <li>
              设备类型：<span>{{ deviceViewDialog.devices.devicetype.devicetype_name }}</span>
            </li>
            <li>
              所属机房：<span>{{ deviceViewDialog.devices.room.room_name }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="10" style="text-align:center;">
          <img :src="deviceViewDialog.devices.device_imgpath" alt="" height="130" >
        </el-col>
      </el-row>
      <ul>
        <li>
          描述：<span>{{ deviceViewDialog.devices.device_desc }}</span>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
// import service from '@/http/service'
import service from '@/utils/request'
export default {
  props: {
    // rooms: Array,
    // devices: Array
    // rooms: {
    //   type: Array,
    //   default: []
    // },
    devices: {
      type: Array,
      default: function() {
        return []
      }
    },
    findAllDevice: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      // 设备类型
      devicetypes: [],
      // 机房
      rooms: [],
      // 修改模态框
      deviceDialog: {
        title: '',
        visible: false,
        disabled: false,
        form: {}
      },
      // 显示模态框
      deviceViewDialog: {
        title: '查看图片',
        visible: false,
        devices: {
          devicetype: {},
          room: {}
        }
      },
      formLabelWidth: '100px',
      // 验证规则
      rules: {
        device_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        device_code: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        devicetype: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        room: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        device_desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      imageUrl: '',
      // 是否显示机房图片
      deviceImgShow: false,
      // 上传图片地址
      actionImg: service.defaults.baseURL + '/api_device/upload_device_image/',
      // 上传图片时传递的值
      imgData: {
        device_id: ''
      },
      // 修改信息的deviceId
      currentDeviceId: ''
    }
  },
  mounted() {
    this.findAllDeviceType()
    this.findAllroom()
  },
  methods: {
    // 保存或修改
    saveOrUpdateDevice() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.deviceDialog.form.device_id) {
            // 修改
            service.post('/api_device/update_device/', this.deviceDialog.form)
              .then(() => {
                // console.log(this.deviceDialog.form)
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success'
                })
                this.$parent.findAllDevice()
                this.closeDialog()
                // this.findAllDevice()
                // this.$parent.find_all_deviceName()
                this.deviceImgShow = true
              })
              .catch(() => {
                this.$notify({
                  title: '失败',
                  message: '修改失败',
                  type: 'error'
                })
              })
          } else {
            // 新增
            service.post('/api_device/create_device/', this.deviceDialog.form)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success'
                })
                this.closeDialog()
                // this.$emit.findAllDevice()
                // this.$parent.findAllroom()
                // this.$parent.findAllDeviceType()
                this.$parent.findAllDevice()
                // this.$parent.find_all_deviceName()
              })
              .catch(() => {
                this.$notify({
                  title: '失败',
                  message: '保存失败',
                  type: 'error'
                })
              })
          }
        }
      })
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.$parent.findAllDevice()
      this.closeDialog()
      this.$notify({
        title: '成功',
        type: 'success',
        message: '设备信息上传成功'
      })
    },
    // 上传图片失败
    handleAvatarError() {
      this.$notify({
        title: '失败',
        type: 'error',
        message: '设备信息上传失败'
      })
    },
    // 上传图片之前
    beforeAvatarUpload(file) {
      if (this.deviceDialog.title === '修改设备信息') {
        this.imgData.device_id = this.currentDeviceId
        // alert(this.imgData.device_id)
      }
      // 图片格式与大小
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 获取所有的设备
    // findAllDevice() {
    //   this.loading = true
    //   service.get('/api_device/list_device/', {
    //     params: this.params
    //   })
    //     .then(({ data }) => {
    //       // console.log(data)
    //       this.devices = data.results
    //       // this.count = data.count
    //       // this.$parent.total = data.count
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //       this.$notify({
    //         title: '失败',
    //         message: '网络异常',
    //         type: 'error'
    //       })
    //     })
    //     .finally(() => {
    //       this.loading = false
    //     })
    // },
    // 获取所有设备类型
    findAllDeviceType() {
      service.get('/api_devicetype/list_all_devicetypes/')
        .then(({ data }) => {
          this.devicetypes = data
          // console.log(this.devicetypes)
        })
        .catch(() => {
          this.$notify({
            title: '失败',
            message: '网络异常',
            type: 'error'
          })
        })
    },
    // 获取所有机房
    findAllroom() {
      service.get('/api_room/list_all_room/')
        .then(({ data }) => {
          // console.log(data)
          this.rooms = data
        })
        .catch(() => {
          this.$notify({
            title: '失败',
            message: '网络异常',
            type: 'error'
          })
        })
    },
    // 关闭查看信息模态框
    closeViewDialog() {
      this.deviceViewDialog.visible = false
    },
    // 显示查看信息模态框
    showViewDialog() {
      this.deviceViewDialog.visible = true
    },
    // 关闭模态框
    closeDialog() {
      this.deviceDialog.visible = false
    },
    // 显示模态框
    showDialog() {
      this.deviceDialog.visible = true
    }
  }
}
</script>
<style scoped>
  .device_dialog ul {
    margin: 0 10px;
    padding: 0;
  }
  .device_dialog ul li {
    list-style: none;
    line-height: 3em;
    padding: 0 10px;
    border-bottom: 1px dashed #ccc;
  }
  /* .device_dialog img {
    border: 1px dashed #ccc;
  } */
  /* 上传图片样式 */
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
