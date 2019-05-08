<template>
  <div class="Dmodal">
    <!-- 数据项模态框 -->
    <el-dialog :visible.sync="dialogVisible1" :title="title" width="100%" fullscreen>
      <span class="deviceType_title">数据项:</span>
      <el-row>
        <el-button type="primary" plain size="mini" style="float:right;margin:1em;" @click="showAddModal()">新增</el-button>
      </el-row>
      <el-table :data="dataType" border style="width: 100%" size="mini">
        <el-table-column align="center" prop="dataitem_name" label="名称" />
        <el-table-column align="center" prop="dataitem_code" label="数据项码" />
        <el-table-column align="center" prop="dataitem_groupname" label="分组名" />
        <el-table-column align="center" prop="dataitem_desc" label="描述" />
        <el-table-column align="center" prop="row" label="单位" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <i class="fa fa-edit" style="color:#448db8" title="编辑" @click="toUpdateData(row)" />
            <i class="fa fa-trash-o" style="color:#f56c6c" title="删除" @click="deleteDataType(row.dataitem_id)" />
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer"><el-button plain @click="dialogVisible1 = false">取 消</el-button></span>
    </el-dialog>
    <DaddModal ref="DaddModal" />
  </div>
</template>
<script type="text/javascript">
// import service from '@/http/service'
import service from '@/utils/request'

import DaddModal from '@/pages/room/deviceType/DaddModal.vue'
export default {
  components: {
    DaddModal
  },
  data() {
    return {
      dialogVisible1: false,
      dataType: [],
      title: '',
      currentDevicetypeId: ''
    }
  },
  methods: {
    showAddModal() {
      this.$refs.DaddModal.currentDevicetypeId1 = this.currentDevicetypeId
      this.$refs.DaddModal.dialogFormVisible1 = true
    },
    deleteDataType(oId) {
      const obj = { dataitem_ids: [oId + ''] }
      service.post('/api_devicetype/delete_dataitems/', obj)
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
    toUpdateData(row) {
      this.$refs.DaddModal.dialogFormVisible1 = true
      this.$refs.DaddModal.dataitemForm = row
    },
    // 刷新数据项
    updateData() {
      // let num = this.currentDevicetypeId + ''
      service.post('/api_devicetype/dataitems/', {"typeid":this.currentDevicetypeId}).then(({ data }) => {
        this.dataType = data.list
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
