<template>
  <div class="Omodal">
    <!-- 操作项模态框 -->
    <el-dialog :visible.sync="dialogVisible2" :title="title" width="100%" fullscreen>
      <span class="deviceType_title">操作项:</span>
      <el-row>
        <el-button type="primary" plain size="mini" style="float:right;margin:1em;" @click="showAddModal()">新增</el-button>
      </el-row>
      <el-table :data="operationType" border style="width: 100%" size="mini">
        <el-table-column align="center" prop="operitem_name" label="名称" />
        <el-table-column align="center" prop="operitem_code" label="操作项码" />
        <el-table-column align="center" prop="operitem_type" label="类型" />
        <el-table-column align="center" prop="operitem_desc" label="描述" />
        <el-table-column align="center" prop="name" label="操作">
          <template slot-scope="{row}">
            <i class="fa fa-edit" style="color:#448db8" title="编辑" @click="toUpdateOperation(row)" />
            <i class="fa fa-trash-o" style="color:#f56c6c" title="删除" @click="deleteOperationType(row.operitem_id)" />
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer"><el-button plain @click="dialogVisible2 = false">取 消</el-button></span>
    </el-dialog>
    <OaddModal ref="OaddModal" />
  </div>
</template>
<script type="text/javascript">
import OaddModal from '@/pages/room/deviceType/OaddModal.vue'
// import service from '@/http/service'
import service from '@/utils/request'
export default {
  components: {
    OaddModal
  },
  data() {
    return {
      dialogVisible2: false,
      operationType: [],
      title: '',
      currentDevicetypeId: ''
    }
  },
  methods: {
    showAddModal() {
      this.$refs.OaddModal.currentDevicetypeId1 = this.currentDevicetypeId
      this.$refs.OaddModal.dialogFormVisible2 = true
    },
    deleteOperationType(oId) {
      const obj = { operitem_ids: [oId + ''] }
      service.post('/api_devicetype/delete_operitems/', obj)
        .then(() => {
          this.update()
          this.updateData()
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
    toUpdateOperation(row) {
      this.$refs.OaddModal.dialogFormVisible2 = true
      this.$refs.OaddModal.operitemForm = row
    },
    updateData() {
      // let num = this.currentDevicetypeId + ''
      service.post('/api_devicetype/operitems/', this.currentDevicetypeId).then(({ data }) => {
        this.operationType = data.list
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
    }
  }
}
</script>
