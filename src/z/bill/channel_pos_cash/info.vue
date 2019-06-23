<template>
  <div>
    <div class="tab-container">
      <el-form ref="billForm" :model="form" :rules="rules" v-loading="loading">
        <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card" @tab-click="handleTagPaneClick">
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
                <el-form-item label="调出渠道" prop="channelId">
                  <el-input prefix-icon="el-icon-search" :value="form.channelName  +'-'+form.channelCode" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="调入渠道" prop="supplierId">
                  <el-input prefix-icon="el-icon-search" :value="form.toChannelName  +'-'+form.toChannelCode" :disabled="true"/>
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
            <info-detail-goods ref="detailGoods" :list-loading="listLoading" :hasParent="form.parentBillId != ''" :parentList="parentList" :channelId="form.channelId"/>
          </el-tab-pane>

          <el-tab-pane label="差异数" name="DIFF" :disabled="form.parentBillId == ''">
            <diff-goods ref="diffGoods" :list-loading="listLoading" :list.sync="list" :parentList="parentList"/>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </div>

  </div>
</template>

<script>
  import {save, get,getParentBillGoods} from '@/api/bill/channel2channelIn'
  import infoDetailGoods from '@/z/bill/components/infoDetailGoods'
  import diffGoods from '@/z/bill/components/diffGoods'


  export default {
    name: 'channel2channel_in_info',
    components: {
      infoDetailGoods,diffGoods
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
        activeName: 'BASE',
        parentList:[]
      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      if (id != null) {
        this.loading = true
        get({id: id}).then(response => {
          this.form = response.data
          this.list = response.data.goodsList
          getParentBillGoods({id: this.form.parentBillId}).then(response => {
            this.parentList = response.data
          }).finally(() => this.loading = false)
        }).catch(() => this.loading = false)
      }
    },
    methods: {
      //修改tag pane
      handleTagPaneClick(tab, event) {
        if (tab.name === 'GOODS') {
          this.$refs.detailGoods.initPage(this.list)
        } else if (tab.name === 'DIFF') {
          this.$refs.diffGoods.init()
        }
      }
    }
  }
</script>
