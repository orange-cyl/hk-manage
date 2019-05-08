<template>
  <div class="DaddModal">
    <!-- 数据项新增模态框 -->
    <el-dialog :visible.sync="dialogFormVisible1" title="新增数据项类型">
      <el-form ref="dataitemForm" :model="dataitemForm" :rules="dataitemRules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="数据项名称" prop="dataitem_name">
          <el-input v-model="dataitemForm.dataitem_name" />
        </el-form-item>
        <el-form-item label="数据项码" prop="dataitem_code">
          <el-input v-model="dataitemForm.dataitem_code" />
        </el-form-item>
        <el-form-item label="数据项单位" prop="dataitem_unit">
          <el-input v-model="dataitemForm.dataitem_unit" />
        </el-form-item>
        <el-form-item label="数据项分组名" prop="dataitem_groupname">
          <el-input v-model="dataitemForm.dataitem_groupname" />
        </el-form-item>
        <el-form-item label="数据项优先级" prop="priority">
          <el-input v-model="dataitemForm.priority" />
        </el-form-item>
        <el-form-item label="数据项描述" prop="dataitem_desc">
          <el-input v-model="dataitemForm.dataitem_desc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="close()">取 消</el-button>
        <el-button type="primary" plain @click="add()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
// import service from '@/http/service'
import service from '@/utils/request'
export default {
  data() {
    return {
      currentDevicetypeId1: '',
      dialogFormVisible1: false,
      dataitemForm: {
        dataitem_name: '',
        dataitem_code: '',
        dataitem_unit: '',
        dataitem_groupname: '',
        priority: '',
        dataitem_desc: ''
      },
      dataitemRules: {
        dataitem_name: [
          { required: true, message: '请输入数据项名称', trigger: 'blur' }
        ],
        dataitem_code: [
          { required: true, message: '请输入数据项码', trigger: 'blur' }
        ],
        dataitem_unit: [
          { required: true, message: '请输入数据项单位', trigger: 'blur' }
        ],
        dataitem_groupname: [
          { required: true, message: '请输入数据项分组名', trigger: 'blur' }
        ],
        priority: [
          { required: true, message: '优先级不能为空', trigger: 'blur' },
          { type: 'number', message: '优先级必须为数字值', trigger: 'blur' }
        ],
        dataitem_desc: [
          { required: true, message: '请输入数据项描述', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    priorityHandler() {
      return this.dataitemForm.priority
    }
  },
  watch: {
    priorityHandler(newValue, oldValue) {
      this.dataitemForm.priority = Number(this.dataitemForm.priority)
    }
  },
  methods: {
    close() {
      this.dialogFormVisible1 = false
      this.dataitemForm = { priority: '' }
    },
    add() {
      this.dialogFormVisible1 = false
      if (this.dataitemForm.dataitem_id) {
        // console.log(this.dataitemForm.dataitem_id)
        var items = {
          dataitem_id: this.dataitemForm.dataitem_id,
          dataitem_code: this.dataitemForm.dataitem_code,
          dataitem_name: this.dataitemForm.dataitem_name,
          dataitem_groupname: this.dataitemForm.dataitem_groupname,
          dataitem_unit: this.dataitemForm.dataitem_unit,
          dataitem_desc: this.dataitemForm.dataitem_desc,
          priority: this.dataitemForm.priority
        }
        // const obj = { dataitems: [item] }
        service.post('/api_devicetype/update_dataitems/', items)
          .then(() => {
            this.$parent.update()
            this.$parent.updateData()
            this.$notify({
              title: '创建成功',
              message: '这是一条成功的提示消息',
              type: 'success'
            })
          }).catch(() => {
            this.$notify.error({
              title: '创建失败',
              message: '这是一条错误的提示消息'
            })
          })
        this.dataitemForm = { priority: '' }
      } else {
        var item = {
          dataitem_code: this.dataitemForm.dataitem_code,
          dataitem_name: this.dataitemForm.dataitem_name,
          dataitem_groupname: this.dataitemForm.dataitem_groupname,
          dataitem_unit: this.dataitemForm.dataitem_unit,
          dataitem_desc: this.dataitemForm.dataitem_desc,
          priority: this.dataitemForm.priority,
          devicetype: this.currentDevicetypeId1
        }
        const obj = { dataitems: [item] }
        service.post('/api_devicetype/create_dataitems/', obj)
          .then(() => {
            this.$parent.updateData()
            this.$parent.update()
            this.$notify({
              title: '创建成功',
              message: '这是一条成功的提示消息',
              type: 'success'
            })
          }).catch(() => {
            this.$notify.error({
              title: '创建失败',
              message: '这是一条错误的提示消息'
            })
          })
        this.dataitemForm = { priority: '' }
      }
    }
  }
}

</script>
