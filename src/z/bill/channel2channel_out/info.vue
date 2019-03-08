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
                  <el-input prefix-icon="el-icon-time" :value="form.billDate" :disabled="isDetail"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="手工单号" prop="manualCode">
                  <el-input v-model="form.manualCode" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="调出渠道" prop="channelId">
                  <el-input prefix-icon="el-icon-search" :value="form.channelName  +'-'+form.channelCode" :disabled="isDetail"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="调入渠道" prop="supplierId">
                  <el-input prefix-icon="el-icon-search" :value="form.toChannelName  +'-'+form.toChannelCode" :disabled="isDetail"/>
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
  import {save, get, getParentBillGoods} from '@/api/bill/channel2channelOut'
  import infoDetailGoods from '@/z/bill/components/infoDetailGoods'
  import diffGoods from '@/z/bill/components/diffGoods'

  export default {
    name: 'channel2channel_out_info',
    components: {
      infoDetailGoods, diffGoods
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
        detailList: [],
        listLoading: false,
        rules: {},
        loading: false,
        activeName: 'BASE',
        isDetail: false,
        parentList: []
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
          this.list = response.data.goodsList
          if (this.form.parentBillId != '') {
            this.loading = true
            getParentBillGoods({id: this.form.parentBillId}).then(response => {
              this.parentList = response.data
            }).finally(() => this.loading = false)
          }
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
