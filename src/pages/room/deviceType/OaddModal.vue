<template>
  <div class="OaddModal">
    <!-- 操作项新增模态框 -->
    <el-dialog :visible.sync="dialogFormVisible2" title="新增操作项类型">
      <el-form ref="operitemForm" :model="operitemForm" :rules="operitemRules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="操作项名称" prop="operitem_name">
          <el-input v-model="operitemForm.operitem_name" />
        </el-form-item>
        <el-form-item label="操作项码" prop="operitem_code">
          <el-input v-model="operitemForm.operitem_code" />
        </el-form-item>
        <el-form-item label="操作项类型" prop="operitem_type">
          <el-radio-group v-model="operitemForm.operitem_type">
            <el-radio label="开关类型" />
            <el-radio label="输入类型" />
            <el-radio label="三路开关类型" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="操作项优先级" prop="priority">
          <el-input v-model="operitemForm.priority" />
        </el-form-item>
        <el-form-item label="操作项描述" prop="operitem_desc">
          <el-input v-model="operitemForm.operitem_desc" />
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
      dialogFormVisible2: false,
      operitemForm: {
        operitem_name: '',
        operitem_code: '',
        operitem_type: '',
        operitem_desc: '',
        priority: ''
      },
      operitemRules: {
        operitem_name: [
          { required: true, message: '请输入操作项名称', trigger: 'blur' }
        ],
        operitem_code: [
          { required: true, message: '请输入操作项码', trigger: 'blur' }
        ],
        operitem_type: [
          { required: true, message: '请选择操作项类型', trigger: 'change' }
        ],
        operitem_desc: [
          { required: true, message: '请输入操作项描述', trigger: 'blur' }
        ],
        priority: [
          { required: true, message: '优先级不能为空', trigger: 'blur' },
          { type: 'number', message: '优先级必须为数字值', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    priorityHandler() {
      return this.operitemForm.priority
    }
  },
  watch: {
    priorityHandler(newValue, oldValue) {
      this.operitemForm.priority = Number(this.operitemForm.priority)
    }
  },
  methods: {
    close() {
      this.dialogFormVisible2 = false
      this.operitemForm = { priority: '' }
    },
    add() {
      this.dialogFormVisible2 = false
      if (this.operitemForm.operitem_id) {
        var items = {
          operitem_id: this.operitemForm.operitem_id,
          operitem_code: this.operitemForm.operitem_code,
          operitem_type: this.operitemForm.operitem_type,
          operitem_name: this.operitemForm.operitem_name,
          operitem_desc: this.operitemForm.operitem_desc,
          priority: this.operitemForm.priority
        }
        service.post('/api_devicetype/update_operitems/', items)
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
        this.operitemForm = { priority: '' }
      } else {
        var item = {
          operitem_code: this.operitemForm.operitem_code,
          operitem_type: this.operitemForm.operitem_type,
          operitem_name: this.operitemForm.operitem_name,
          operitem_desc: this.operitemForm.operitem_desc,
          priority: this.operitemForm.priority,
          devicetype: this.currentDevicetypeId1
        }
        const obj = { operitems: [item] }
        service.post('/api_devicetype/create_operitems/', obj)
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
        this.operitemForm = { priority: '' }
      }
    }
  }
}

</script>
