<template>
  <div class="Cmodal">
    <!-- 配置项模态框 -->
    <el-dialog :visible.sync="dialogVisible3" :title="title" width="100%" fullscreen>
      <span class="deviceType_title">配置项:</span>
      <el-row>
        <el-button type="primary" plain size="mini" style="float:right;margin:1em;" @click="showAddModal()">新增</el-button>
      </el-row>
      <el-table :data="configurationType" border style="width: 100%" size="mini">
        <el-table-column align="center" prop="configitem_name" label="名称" />
        <el-table-column align="center" prop="configitem_code" label="配置项码" />
        <el-table-column align="center" prop="configitem_value" label="配置项值" />
        <el-table-column align="center" prop="configitem_desc" label="描述" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <i class="fa fa-edit" style="color:#448db8" title="编辑" @click="toUpdateConfiguration(row)" />
            <i class="fa fa-trash-o" style="color:#f56c6c" title="删除" @click="deleteConfigurationType(row.configitem_id)" />
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer"><el-button plain @click="dialogVisible3 = false">取 消</el-button></span>
    </el-dialog>
    <CaddModal ref="CaddModal" />
  </div>
</template>
<script type="text/javascript">
import CaddModal from '@/pages/room/deviceType/CaddModal.vue'
// import service from '@/http/service'
import service from '@/utils/request'
export default {
  components: {
    CaddModal
  },
  data() {
    return {
      dialogVisible3: false,
      configurationType: [],
      title: '',
      currentDevicetypeId: ''
    }
  },
  methods: {
    showAddModal() {
      this.$refs.CaddModal.currentDevicetypeId1 = this.currentDevicetypeId
      this.$refs.CaddModal.dialogFormVisible3 = true
    },
    deleteConfigurationType(oId) {
      const obj = { configitem_ids: [oId + ''] }
      service.post('/api_devicetype/delete_configitems/', obj)
        .then(() => {
          this.updateData()
          this.update()
          this.$notify({
            title: '删除成功',
            message: '这是一条成功的提示消息',
            type: 'success'
          })
        }).catch(() => {
          this.$notify.error({
            title: '删除失败',
            message: '这是一条错误的提示消息'
          })
        })
    },
    update() {
      this.$parent.loadDeviceTypes()
    },
    updateData() {
      // let num = this.currentDevicetypeId + ''
      service.post('/api_devicetype/configitems/', { "typeid":this.currentDevicetypeId}).then(({ data }) => {
        this.configurationType = data.list
        this.$notify({
          title: '刷新成功',
          message: '这是一条成功的提示消息',
          type: 'success'
        })
      }).catch(() => {
        this.$notify.error({
          title: '网络超时',
          message: '这是一条错误的提示消息'
        })
      })
    },
    toUpdateConfiguration(row) {
      this.$refs.CaddModal.dialogFormVisible3 = true
      this.$refs.CaddModal.configitemForm = row
    }
  }
}
</script>
