<template>
  <div class="tab-container">
    <el-form ref="billForm" :model="form" :rules="rules" v-loading="loading" auto-complete="off">
      <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
        <el-tab-pane label="基本资料" name="BASE">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="单据编号" prop="billCode">
                <el-input v-model="form.code" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单据时间" prop="billDate">
                <el-input prefix-icon="el-icon-time" :value="form.billDate" :disabled="isDetail"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手工单号" prop="manualCode">
                <el-input v-model="form.manualCode" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="盘次" prop="times">
                <el-input v-model="form.times" :disabled="true"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="渠道" prop="warehouseId">
                <el-input prefix-icon="el-icon-search" :value="form.warehouseName  +'-'+form.warehouseCode" :disabled="isDetail"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="isDetail">
            <el-col :span="6">
              <el-form-item label="创建时间">
                <el-input prefix-icon="el-icon-time" :value="form.createDate" :disabled="isDetail"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建人">
                <el-input v-model="form.createUserName" :disabled="isDetail"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="审核时间">
                <el-input prefix-icon="el-icon-time" :value="form.auditDate" :disabled="isDetail"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="审核人">
                <el-input v-model="form.auditUserName" :disabled="isDetail"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="isDetail">
            <el-col :span="6">
              <el-form-item label="最后更新时间">
                <el-input prefix-icon="el-icon-time" :value="form.updateDate" :disabled="isDetail"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单据状态">
                <el-input v-model="form.statusMean" :disabled="isDetail"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="总数量">
                <el-input v-model="form.totalCount" :disabled="isDetail"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="总金额">
                <el-input v-model="form.totalAmount" :disabled="isDetail"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="货品信息" name="GOODS">
          <info-detail-goods ref="detailGoods" :list-loading="listLoading" :list.sync="list"/>
        </el-tab-pane>
      </el-tabs>
    </el-form>

  </div>
</template>

<script>
  import {save, get} from '@/api/bill/warehouseInventory'
  import infoDetailGoods from '@/z/bill/components/infoDetailGoods'

  export default {
    name: 'warehouse_inventory_info',
    components: {
      infoDetailGoods
    },
    data() {
      return {
        form: {
          id: '',
          supplierId: '',
          warehouseId: '',
          billDate: '',
          code: '',
          status: 'PENDING'
        },
        //明细列表
        list: [],
        detailList: [],
        listLoading: false,
        rules: {},
        loading: false,
        activeName: 'BASE',
        isDetail: false

      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      this.isDetail = true
      if (id != null) {
        this.loading = true
        get({id: id}).then(response => {
          this.loading = false
          this.form = response.data
          if (this.form.status !== 'DRAFT') {
            this.form.status = 'PENDING'
          }
          this.list = response.data.goodsList
          this.$refs.detailGoods.initPage(this.list)
        }).catch(() => this.loading = false)
      }
    },
    methods: {
    }
  }
</script>
