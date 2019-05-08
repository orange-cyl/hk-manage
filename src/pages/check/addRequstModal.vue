<template>
  <div class="addRequstModal">
    <el-dialog :visible.sync="dialogFormVisible" title="收货地址">
      <el-form ref="checkForm" :model="checkForm" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="申请类型" prop="check_id">
          <el-select v-model="checkForm.check_id" placeholder="请选择审批类型">
            <el-option v-for="item in check_type" :label="item.type_text" :key="item.type_id" :value="item.type_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="配置项描述" prop="apply_context">
          <el-input v-model="checkForm.apply_context" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="close()">取 消</el-button>
        <el-button type="primary" plain @click="saveRequst()">确 定</el-button>
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
      dialogFormVisible: false,
      check_type: [],
      checkForm: {},
      rules: {
        check_id: [
          { required: true, message: '请选择申请类型', trigger: 'change' }
        ],
        apply_context: [
          { required: true, message: '请输入申请的内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    close() {
      this.dialogFormVisible = false
      this.checkForm = {}
    },
    // 保存申请
    saveRequst() {
      this.dialogFormVisible = false
      const obj = {
        approval_type: this.checkForm.check_id,
        approval_text: this.checkForm.apply_context
      }
      service.post('/api_approval/create_approval/', obj)
        .then(() => {
          this.checkForm = {}
          this.$parent.loadCheck_types()
          this.$parent.loadCheck_states()
          this.$parent.loadCheck_list()
          this.$notify({
            title: '提交成功',
            message: '这是一条成功的提示消息',
            type: 'success'
          })
        }).catch(() => {
          this.$notify.error({
            title: '网络超时',
            message: '这是一条错误的提示消息'
          })
        })
    }
  }
}

</script>
