<template>
  <div class="CaddModal">
    <!-- 配置项新增模态框 -->
    <el-dialog :visible.sync="dialogFormVisible3" title="新增设备类型">
      <el-form ref="configitemForm" :model="configitemForm" :rules="configitemRules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="配置项名称" prop="configitem_name">
          <el-input v-model="configitemForm.configitem_name" />
        </el-form-item>
        <el-form-item label="配置项码" prop="configitem_code">
          <el-input v-model="configitemForm.configitem_code" />
        </el-form-item>
        <el-form-item label="配置项值" prop="configitem_value">
          <el-input v-model="configitemForm.configitem_value" />
        </el-form-item>
        <el-form-item label="配置项优先级" prop="priority">
          <el-input v-model="configitemForm.priority" />
        </el-form-item>
        <el-form-item label="配置项描述" prop="configitem_desc">
          <el-input v-model="configitemForm.configitem_desc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="close">取 消</el-button>
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
      dialogFormVisible3: false,
      // 配置项
      configitemForm: {
        configitem_name: '',
        configitem_code: '',
        configitem_value: '',
        priority: '',
        configitem_desc: ''
      },
      configitemRules: {
        configitem_name: [
          { required: true, message: '请输入配置项名称', trigger: 'blur' }
        ],
        configitem_code: [
          { required: true, message: '请输入配置项码', trigger: 'blur' }
        ],
        configitem_value: [
          { required: true, message: '请输入配置项默认值', trigger: 'blur' }
        ],
        priority: [
          { required: true, message: '优先级不能为空', trigger: 'blur' },
          { type: 'number', message: '优先级必须为数字值', trigger: 'blur' }
        ],
        configitem_desc: [
          { required: true, message: '请输入配置项描述', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    priorityHandler() {
      return this.configitemForm.priority
    }
  },
  watch: {
    // 监听configitemForm中的priority
    priorityHandler(newValue, oldValue) {
      this.configitemForm.priority = Number(this.configitemForm.priority)
    }
  },
  methods: {
    close() {
      this.dialogFormVisible3 = false
      this.configitemForm = { priority: '' }
    },
    add() {
      this.dialogFormVisible3 = false
      if (this.configitemForm.configitem_id) {
        var items = {
          configitem_id: this.configitemForm.configitem_id,
          configitem_code: this.configitemForm.configitem_code,
          configitem_name: this.configitemForm.configitem_name,
          configitem_value: this.configitemForm.configitem_value,
          configitem_desc: this.configitemForm.configitem_desc,
          priority: this.configitemForm.priority
        }
        service.post('/api_devicetype/update_configitems/', items)
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
        this.configitemForm = { priority: '' }
      } else {
        var item = {
          configitem_code: this.configitemForm.configitem_code,
          configitem_name: this.configitemForm.configitem_name,
          configitem_value: this.configitemForm.configitem_value,
          configitem_desc: this.configitemForm.configitem_desc,
          priority: this.configitemForm.priority,
          devicetype: this.currentDevicetypeId1
        }
        const obj = { configitems: [item] }
        service.post('/api_devicetype/create_configitems/', obj)
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
        this.configitemForm = { priority: '' }
      }
    }
  }
}

</script>
