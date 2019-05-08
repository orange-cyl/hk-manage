<template>
  <!-- 授权模态框 -->
  <div class="user_accredit_dialog">
    <el-dialog :title="accreditDialog.title" :visible.sync="accreditDialog.visible" width="25%" center="">
      <!-- <el-form :model="accreditDialog.form"> {{ accreditDialog.form }} -->
      <!-- <el-checkbox v-model="accredits" :label="accreditDialog.form.name" />> -->
      <!-- <el-checkbox v-model="accreditDialog.form.checked2">普通管理员</el-checkbox> -->
       <el-checkbox-group v-model="checkboxGroup" size="small">
        <el-checkbox
          v-for="item in accredits"
          :label="item.group_id"
          :key="item.group_id"
          style="margin-left:0px;margin-right:10px;"
          border>
          {{ item.group_name }}
        </el-checkbox>
      </el-checkbox-group>
      <!-- </el-form> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="toCloseDialog">取 消</el-button>
        <el-button type="primary" @click="subAuthorization">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import service from '@/utils/request'
// import service from '@/http/service'

export default {
  data() {
    return {
      // 授权模态框开始
      accreditDialog: {
        title: '',
        form: {
          checked1: false,
          checked2: false
        },
        visible: false
      },
      ids: [],
      ids1: [],
      accredits: [],
      checkboxGroup: [],
    }
  },
  methods: {
    // 打开模态框
    toOpenDialog() {
      this.accreditDialog.title = '添加授权'
      this.accreditDialog.visible = true
    },
    // 关闭模态框
    toCloseDialog() {
      this.accreditDialog.visible = false
      this.checkboxGroup = []
      this.$parent.findAllUsers()
    },
    // 获取所有的用户组
    getGroupsOfUser(ids) {
      this.ids = ids
      this.ids1 = this.ids
      // console.log('所有选中的用户的id',this.ids1)
      service.get('/api_group/get_groups_of_user?user_id=' + this.ids1).then(({ data: result }) => {
        // alert(1)
        // console.log('==========', result)
        this.accredits = result.data
        // console.log('this.accredits', this.accredits)
        // this.toOpenDialog()
        this.checkboxGroup = []
        this.accredits.map((item)=>{
          if(item.has_id !== 0) {
            this.checkboxGroup.push(item.group_id)
          }
        })
        if (this.ids) {
          this.toOpenDialog()
        } else {
          this.$notify.error({
            title: '错误',
            message: '请选择需要授权的用户'
          })
        }
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '这是一条错误的提示消息'
        })
      })
    },
    // 确定
    subAuthorization() {
      // alert(this.ids1)
      const obj1 = {
        'user_ids': this.ids1,
        'group_ids': this.checkboxGroup
      }
      // console.log(obj1)
      service.post('api_group/set_user_groups/', obj1).then(() => {
        this.$notify({
          title: '成功',
          message: '授权成功',
          type: 'success'
        })
        this.toCloseDialog()
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '这是一条错误的提示消息'
        })
      })
    }
  }
}
</script>

