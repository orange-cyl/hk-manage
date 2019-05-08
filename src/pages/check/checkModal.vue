<template>
  <div class="checkModal">
    <el-dialog :visible.sync="visible1" title="审批申请" center>
      <el-form size="mini">
        <el-table :data="user_check" style="width: 100%">
          <el-table-column prop="approval_type" label="审批类型" />
          <el-table-column prop="approval_user" label="申请人" />
          <el-table-column prop="approval_text" label="申请内容" />
          <el-table-column prop="approval_time" label="申请时间" />
          <el-table-column prop="approval_history" label="审批记录" />
          <el-table-column prop="approval_status" label="审批状态" />
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" plain @click="closeCheckModal()">取 消</el-button>
        <el-button size="mini" type="primary" plain @click="passCheck(1)">通过</el-button>
        <el-button size="mini" plain @click="passCheck(-1)">拒绝</el-button>
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
      visible1: false,
      user_check: []
    }
  },
  methods: {
    closeCheckModal() {
      this.visible1 = false
      this.user_check = {}
    },
    passCheck(num) {
      var approval_id = 0
      if (num === 1) {
        approval_id = 1
      } else if (num === -1) {
        approval_id = -1
      }
      const obj = {
        'approval_id': this.user_check[0].approval_id,
        'approval_level': approval_id
      }
      service.post('/api_approval/approval_level/', obj)
        .then(({ data }) => {
          this.$parent.loadCheck_types()
          this.$parent.loadCheck_states()
          this.$parent.loadCheck_list()
          this.$notify({
            title: '审核成功',
            message: '这是一条成功的提示消息',
            type: 'success'
          })
          this.user_check = []
          this.visible1 = false
        }).catch(() => {
          this.$notify.error({
            title: '审核失败',
            message: '这是一条错误的提示消息'
          })
        })
    }
  }
}

</script>
