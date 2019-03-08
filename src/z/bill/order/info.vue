<template>
  <div>
    <div class="tab-container">
      <el-form ref="billForm" :model="form" :rules="rules" v-loading="loading">
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
                  <el-input prefix-icon="el-icon-time" :value="form.billDate" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="手工单号" prop="manualCode">
                  <el-input v-model="form.manualCode" :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="仓库" prop="warehouseId">
                  <el-input prefix-icon="el-icon-search" :value="form.warehouseName  +'-'+form.warehouseCode" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="渠道" prop="channelId">
                  <el-input prefix-icon="el-icon-search" :value="form.channelName  +'-'+form.channelCode" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="创建时间">
                  <el-input prefix-icon="el-icon-time" :value="form.createDate" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建人">
                  <el-input v-model="form.createUserName" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="审核时间">
                  <el-input prefix-icon="el-icon-time" :value="form.auditDate" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="审核人">
                  <el-input v-model="form.auditUserName" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="最后更新时间">
                  <el-input prefix-icon="el-icon-time" :value="form.updateDate" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单据状态">
                  <el-input v-model="form.statusMean" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="总数量">
                  <el-input v-model="form.totalCount" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="总金额">
                  <el-input v-model="form.totalAmount" :disabled="true"/>
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

  </div>
</template>

<script>
  import {save, get} from '@/api/bill/order'
  import infoDetailGoods from '@/z/bill/components/infoDetailGoods'


  export default {
    name: 'order_info',
    components: {
      infoDetailGoods
    },
    data() {
      return {
        form: {
          id: '',
          supplierId: '',
          channelId: '',
          billDate: '',
          code: '',
          status: 'PENDING'
        },
        //明细列表
        list: [],
        listLoading: false,
        rules: {},
        loading: false,
        activeName: 'BASE'
      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
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
    methods: {}
  }
</script>
