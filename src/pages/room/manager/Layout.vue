<template>
  <!-- 机房管理 -->
  <div class="manager">
    <!-- 表单 -->
    <div class="manager_form">
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item label="">
          <el-select v-model="params.room_id" clearable placeholder="选择机房">
            <el-option
              v-for="room in roomNames"
              :key="room.room_id"
              :label="room.room_name"
              :value="room.room_id" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="manager_btns">
      <el-button type="primary" plain size="mini" @click="toAddManager">新增</el-button>
      <el-button type="primary" plain size="mini" @click="batchDeleteManager">批量删除</el-button>
    </div>
    <!-- 机房列表 -->
    <!-- <div class="room_list">
      <el-row :gutter="20">
        <el-col v-for="room in rooms" :key="room.room_id" :span="6">
          <div class="room">
            <el-row>
              <el-col :span="8">
                <img src="room.room_plane_imgpath" alt="..." class="room_img">
              </el-col>
              <el-col :span="16">
                <div>
                  <div class="room_name">{{ room.room_name }}</div>
                  <div class="device_count">{{ room.device_count }}</div>
                </div>
                <div class="room_desc">{{ room.room_desc }}</div>
                <div class="room_btns">
                  <i class="el-icon-edit" title="修改" @click="toUpdateManager(row)" />
                  <i class="el-icon-delete" title="删除" @click="deleteManager(row.room_id)" />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div> -->
    <!-- 数据表格 -->
    <!-- <manager-data-table /> -->
    <div class="manager_table">
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="rooms"
        :height="he"
        :row-style="rowStyle"
        tooltip-effect="dark"
        style="width: 100%"
        size="mini"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          prop="room_id"
          align="center"
          width="55" />
        <el-table-column
          prop="room_name"
          label="机房名称"
          align="center"
          width="200" />
        <el-table-column
          align="center"
          prop="room_plane_imgpath"
          label="机房图片"
          width="300">
          <template slot-scope="{row}">
            <img :src="row.room_plane_imgpath" height="50" alt="请添加图片">
          </template>
        </el-table-column>
        <el-table-column
          prop="device_count"
          label="设备数量"
          align="center"
          width="200" />
        <el-table-column
          prop="room_desc"
          label="机房描述"
          align="center" />
        <el-table-column
          width="100"
          label="操作"
          align="center">
          <template slot-scope="{row}">
            <i class="el-icon-edit" title="修改" @click="toUpdateManager(row)" />
            <i class="el-icon-delete" title="删除" @click="deleteManager(row.room_id)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <!-- <manager-pagination /> -->
    <div class="manager_pagination">
      <el-pagination
        :total="total"
        :page-size="10"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange" />
    </div>
    <!-- 模态框 -->
    <!-- <manager-dialog /> -->
    <div class="manager_dialog">
      <el-dialog :visible.sync="managerDialog.visible" :title="managerDialog.title" :before-close="closeDialog" width="30%">
        <!-- {{ managerDialog.form }} -->
        <el-form ref="ruleForm" :rules="rules" :model="managerDialog.form" size="mini">
          <el-form-item :label-width="formLabelWidth" prop="room_name" label="机房名称">
            <el-input v-model="managerDialog.form.room_name" auto-complete="off" clearable />
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" prop="room_desc" label="机房描述">
            <el-input :rows="2" v-model="managerDialog.form.room_desc" type="textarea" placeholder="" />
          </el-form-item>
          <el-form-item v-if="roomImgShow" :label-width="formLabelWidth" label="上传图片" prop="imageUrl">
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
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="closeDialog">取 消</el-button>
          <el-button type="primary" size="mini" @click="saveOrUpdateManager">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
// import service from '@/http/service'
import service from '@/utils/request'
import $ from 'jquery'
export default {
  data() {
    return {
      // 加载
      loading: false,
      // 所有机房
      rooms: [],
      // 机房名称
      roomNames: [],
      // 机房总数
      total: 0,
      // 监听数据
      params: {
        room_id: undefined,
        page: 1
      },
      // 表格行高
      rowStyle: { height: '70px' },
      // 验证规则
      rules: {
        room_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        room_desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      // 每个机房数据
      multipleSelection: [],
      // 模态框
      managerDialog: {
        title: '',
        visible: false,
        form: {}
      },
      // 表单label宽度
      formLabelWidth: '100px',
      imageUrl: '',
      // 是否显示机房图片
      roomImgShow: false,
      // 上传图片地址
      actionImg: service.defaults.baseURL + '/api_room/upload_room_image/',
      // 上传图片时传递的值
      imgData: {
        room_id: ''
      },
      // 修改信息的roomId
      currentRoomId: ''
    }
  },
  watch: {
    params: {
      handler: function() {
        this.findAllRoom()
      },
      deep: true
    },
    'params.room_id': function() {
      this.params.page = 1
    }
  },
  created() {
    // 表格高度
    this.he = $(window).height() - 230
    // 加载所有机房信息
    this.findAllRoom()
    // 加载所有机房名称
    this.findAllRoomName()
  },
  methods: {
    // 保存或修改机房信息
    saveOrUpdateManager() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.managerDialog.form.room_id) {
            // 保存修改
            service.post('/api_room/update_room/', this.managerDialog.form)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success'
                })
                // this.closeDialog()
                this.findAllRoom()
                this.findAllRoomName()
                this.roomImgShow = true
              })
              .catch(() => {
                this.$notify({
                  title: '失败',
                  message: '修改失败',
                  type: 'error'
                })
              })
          } else {
            // 保存新增
            service.post('/api_room/create_room/', this.managerDialog.form)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success'
                })
                this.findAllRoom()
                this.findAllRoomName()
                this.closeDialog()
                // this.roomImgShow = true
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
    // 新增机房信息
    toAddManager() {
      this.managerDialog.visible = true
      this.managerDialog.title = '新增机房信息'
      this.managerDialog.form = {}
      this.roomImgShow = false
    },
    // 修改机房信息
    toUpdateManager(row) {
      this.managerDialog.visible = true
      this.roomImgShow = true
      this.managerDialog.title = '修改机房信息'
      this.managerDialog.form = row
      this.currentRoomId = row.room_id
      this.imageUrl = row.room_plane_imgpath
    },
    // 删除机房
    deleteManager(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service.post('/api_room/delete_room/', {
            room_ids: [id]
          })
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
              this.findAllRoom()
              this.findAllRoomName()
            })
            .catch(() => {
              this.$notify({
                title: '失败',
                message: '删除失败',
                type: 'error'
              })
            })
        })
    },
    // 批量删除机房
    batchDeleteManager() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const ids = this.multipleSelection.map(item => item.room_id)
          // console.log(ids)
          service.post('/api_room/delete_room/', {
            room_ids: ids
          })
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
              this.findAllRoom()
              this.findAllRoomName()
            })
            .catch((error) => {
              // console.log(error)
              this.$notify({
                title: '失败',
                message: '删除失败',
                type: 'error'
              })
            })
        })
    },
    // 多选框获取信息
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 当前页的改变
    handleCurrentChange(page) {
      // console.log(page)
      this.params.page = page
    },
    // 关闭模态框
    closeDialog() {
      this.managerDialog.visible = false
    },
    // 上传图片
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.findAllRoom()
      this.closeDialog()
      this.$notify({
        title: '成功',
        type: 'success',
        message: '机房信息上传成功'
      })
    },
    handleAvatarError() {
      this.$notify({
        title: '失败',
        type: 'error',
        message: '机房信息上传失败'
      })
    },
    // 上传图片之前
    beforeAvatarUpload(file) {
      // if(this.managerDialog.title === "新增机房信息"){
      //   this.imgData.room_id = this.newId
      // }
      if (this.managerDialog.title === '修改机房信息') {
        this.imgData.room_id = this.currentRoomId
        // alert(this.imgData.room_id)
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
    // 获取所有机房信息
    findAllRoom() {
      this.loading = true
      service.get('/api_room/list_room/', {
        params: this.params
      })
        .then(({ data }) => {
          // console.log(data)
          this.rooms = data.results
          this.total = data.count
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
    },
    // 获取所有机房名称
    findAllRoomName() {
      service.get('/api_room/list_all_room/')
        .then(({ data }) => {
          // console.log(data)
          this.roomNames = data
        })
        .catch((error) => {
          // console.log(error)
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
  /* 机房管理 */
  .manager {
    background-color: #ffffff;
    margin: 1em;
    padding: 1em;
    border-radius: 3px;
    /* min-height: 500px; */
  }
  /* 表单 */
  .manager_form {
    float: left;
  }
  /* 按钮 */
  .manager_btns {
    text-align: right;
    margin-bottom: 20px;
  }
  .room_list .room {
    /* border: 1px solid #ededed; */
    background: #f0f2f5;
    margin: 10px;
    padding: 10px;
  }
  .room_list .room_img {
    height: 100px;
    width: 100px;
    /* border: 1px solid #ccc; */
  }
  .room_list .room_name{
    /* font-size: 14px; */
    float: left;
    line-height: 3em;
  }
  .room_list .device_count{
    text-align: right;
    line-height: 3em;
  }
  .room_list .room_desc {
    height: 50px;
  }
  .room_list .room_btns {
    text-align: right
  }
  /* 表格中修改图标 */
  .room_list i.el-icon-edit {
    color: #409EFF;
  }
  /* 表格中删除图标 */
  .room_list i.el-icon-delete {
    color: #F56C6C;
    padding-left: .5em;
  }
  /* 分页 */
  .manager_pagination {
    text-align: right;
  }
  /* 表格中修改图标 */
  .manager_table i.el-icon-edit {
    color: #409EFF;
  }
  /* 表格中删除图标 */
  .manager_table i.el-icon-delete {
    color: #F56C6C;
    padding-left: .5em;
  }
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
