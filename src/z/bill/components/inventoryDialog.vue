<template>
  <el-dialog v-loading="loading" title="盘点" :visible="show" width="35%" @close="onClose" @open="loadChannelList">
    <el-form v-show="!loadingInventory">
      <el-form-item :label="this.billType === 'warehouse_inventory' ? '选择盘点仓库' : '选择盘点渠道'">
        <el-select v-model="eleId" placeholder="请选择" @change="loadInventoryDateList">
          <el-option v-for="ele in eleList" :label="ele.name + '-' + ele.code" :value="ele.id"/>
        </el-select>
      </el-form-item>
      <el-form-item v-show="eleId != ''" label="选择盘点日期">
        <el-select v-loading="loadingInventoryDateOptions" v-model="inventoryDate" placeholder="请选择">
          <el-option v-for="d in inventoryDateOptions" :label="d" :value="d"/>
        </el-select>
      </el-form-item>
    </el-form>
    <span v-show="loadingInventory">正在盘点，这可能要花一点时间，请稍等...</span>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="inventory('PART')" v-loading="loadingInventory || loadingInventoryDateOptions" :disabled="eleId == '' || inventoryDate == ''">部分盘点</el-button>
      <el-button type="primary" @click="inventory('ALL')" v-loading="loadingInventory || loadingInventoryDateOptions" :disabled="eleId == '' || inventoryDate == ''">整盘</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import {loadInventoryDateList, inventory} from '@/api/bill/bill'
  import {getList as getWarehouseList} from '@/api/info/warehouse'
  import {getList as getChannelList} from '@/api/info/channel'

  export default {
    components: {},
    data() {
      return {
        inventoryDate: '',
        inventoryDateOptions: [],
        loading: false,
        loadingInventory: false,
        loadingInventoryDateOptions: false,
        eleId: '',
        eleList: []
      };
    },
    props: {
      show: {default: false},
      billType: {default: ''}
    },
    methods: {
      loadChannelList() {
        this.loading = true
        let fun = this.billType === 'warehouse_inventory' ? getWarehouseList : getChannelList
        this.eleId = ''
        fun({pageIndex: 1, pageSize: 99999}).then(response => {
          this.eleList = response.data.content
          if (this.eleList.length > 0) {
            this.eleId = this.eleList[0].id
            this.loadInventoryDateList()
          }
        }).finally(() => this.loading = false)
      },
      loadInventoryDateList() {
        this.loadingInventoryDateOptions = true
        let params = this.billType === 'warehouse_inventory' ? {warehouseId: this.eleId} : {channelId: this.eleId}
        this.inventoryDate = ''
        loadInventoryDateList(this.billType, params).then(response => {
          this.inventoryDateOptions = response.data
          if (this.inventoryDateOptions.length > 0) {
            this.inventoryDate = this.inventoryDateOptions[0]
          }
        }).finally(() => {
          this.loadingInventoryDateOptions = false
        })
      },
      onClose() {
        this.$emit('update:show', false)
      },
      inventory(type) {
        if (!this.loadingInventory) {
          this.loadingInventory = true
          inventory(this.billType, {eleId: this.eleId, type: type, date: this.inventoryDate}).then(response => {
            this.$message({message: '盘点成功', type: 'success'})
            this.onClose()
            this.$emit('get-list', {})
          }).finally(() => this.loadingInventory = false)
        }
      }
    }
  }
</script>
