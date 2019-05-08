<template>
  <el-dialog
    :title="toUpdataRoleDialog.title"
    :visible.sync="toUpdataRoleDialog.visible"
    width="30%"
    center
  >
    <div class="dialogCenter">
      <el-tree
        ref="tree"
        :data="allPowers"
        :default-expanded-keys="Options.parent_ids"
        :default-checked-keys="Options.hasOptions"
        :props="defaultProps"
        show-checkbox
        node-key="id"/>
    </div>
    <div slot="footer" class="dialog-footer" style="text-align:right">
      <el-button size="mini" @click="toCloseDialog">取 消</el-button>
      <el-button type="primary" size="mini" class="btn-rig" @click="updateGroupPower()">确 定</el-button>
      <!-- <el-button type="primary" size="mini" class="btn-rig  btn-rig1" @click="updateGroupPowerAll()">删除全部权限</el-button> -->
    </div>
  </el-dialog>
</template>
<script>
// import service from '@/http/service'
import service from '@/utils/request'
export default {
  data() {
    return {
      toUpdataRoleDialog: {
        title: '',
        form: {},
        visible: false,
      },
      // 所有的权限
      allDevicesId: [],
      allDevicesName: [],
      allDevices: [],
      options: [{
        name: '机房名称',
        id: 1
      }],
      Options: {
        parent_ids: [],
        hasOptions: []
      },
      // 组id
      groupId: 0,
      allPowers: [],
      // arr1: [],
      // arr2: [],
      // arr3: [],
      // arr4: []
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 将已经选中的权限放进数组aa中,用数组长度判读if-else语句
      aa: []
    }
  },
  methods: {
    // 关闭模态框
    toCloseDialog() {
      this.Options.hasOptions = []
      this.Options.parent_ids = []
      this.toUpdataRoleDialog.visible = false
    },
    // 打开模态框
    toOpenDialog(row) {
      // console.log('row', row)
      // this.arr2 = row.permission_names.split('：')
      // console.log('arr2', this.arr2)
      // this.arr3 = this.arr2[0].split(',')
      // console.log('arr3', this.arr3)
      // // this.checkList = this.arr3
      // this.arr4 = this.arr2[1].split(',')
      // console.log('arr4', this.arr4)
      this.aa = []
      this.toUpdataRoleDialog.title = '更改角色权限'
      this.findAllJurisdiction(row)
      this.groupId = row.group_id
      this.toUpdataRoleDialog.visible = true
      setTimeout(() => {
        this.toUpdataRoleDialog.visible = true
      }, 1000)
    },
    // 查找所有的权限
    findAllJurisdiction(row) {
      // let str = row.permission_ids
      // console.log('str:',str)
      // // 将str转换成数组
      // let arr = str.split(",")
      // console.log(str.split(","))
      // this.Options.parent_ids = arr;
      // this.Options.hasOptions = arr
      // this.groupId = row.group_id
      service.get('/api_permission/get_permission_of_group?group_id=' + row.group_id).then((data) => {
        this.allDevices = data.data.data
        console.log('++++++',this.allDevices)
        // 将已经选中的权限放进数组中
        this.allDevices.map((item)=>{
          if(item.has_id !== 0) {
            this.aa.push(item.has_id)
          } 
        })
        console.log('aa',this.aa)
        if(this.aa.length !== 0) {
          let str = row.permission_ids
          console.log('str:',str)
          // 将str转换成数组
          let arr = str.split(",")
          console.log(str.split(","))
          this.Options.parent_ids = arr;
          this.Options.hasOptions = arr
          this.groupId = row.group_id
          data.data.data.forEach((item) => {
          if(item.has_id!=0 && item.upper_id!=0){
              this.Options.hasOptions.push(item.permission_id)
              this.Options.parent_ids.push(item.upper_id)
          }
        })
        this.Options.hasOptions = arr
        console.log(this.Options.hasOptions)
        console.log(this.Options.parent_ids)
        this.allPowers = []
        var allList = []
        data.data.data.forEach((item) => {
          if (item.upper_id === 0) {
            var parent_id = item.permission_id
            var chs = []
            data.data.data.forEach(function(obj) {
              if (obj.upper_id !== 0 && obj.upper_id === parent_id) {
                var secondTitle = {
                  id: obj.permission_id,
                  label: obj.permission_name
                }
                chs.push(secondTitle)
              }
            })
            var list = {
              id: item.permission_id,
              label: item.permission_name,
              children: chs
            }
            allList.push(list)
          }
        })
        this.allPowers = allList
        } else {
          this.allPowers = []
          var allList = []
          data.data.data.forEach((item) => {
            if (item.upper_id === 0) {
              var parent_id = item.permission_id
              var chs = []
              data.data.data.forEach(function(obj) {
                if (obj.upper_id !== 0 && obj.upper_id === parent_id) {
                  var secondTitle = {
                    id: obj.permission_id,
                    label: obj.permission_name
                  }
                chs.push(secondTitle)
              }
            })
            var list = {
              id: item.permission_id,
              label: item.permission_name,
              children: chs
            }
            allList.push(list)
          }
        })
        this.allPowers = allList
        }
      })
    },
    // 删除所有的权限
    updateGroupPowerAll() {
      this.$refs.tree.setCheckedKeys([])
      this.updateGroupPower()
    },
    // 修改权限
    updateGroupPower() {
      // 获取所有选中的权限提交给后台，然后重新获取所有权限
      var allPowersId = this.$refs.tree.getCheckedKeys()
      console.log('===========',this.$refs.tree.getCheckedKeys())
      var obj = {
        'group_id': this.groupId,
        'permission_ids': allPowersId
      }
      this.$confirm('组权限将被修改,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.post('/api_permission/set_permission_of_group', obj).then(() => {
          this.$notify({ title: '成功', type: 'success', message: '修改权限成功!' })
          // this.$parent.findAllRoles()
        }).catch(() => {
          this.$notify({ title: '失败', type: 'error', message: '修改权限失败' })
        })
      }).catch(() => {
        this.$message({ title: '提示', type: 'info', message: '已取消权限更改' })
      })
      this.toCloseDialog()
      setTimeout((item) => {
        this.$parent.findAllRoles()
        this.$parent.loading = true
      }, 2000)
    }
  }
}
</script>

