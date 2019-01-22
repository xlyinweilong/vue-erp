<template>
  <div>
    <sticky class-name="sub-navbar draft">
      <el-select v-model="form.status" placeholder="请选择">
        <el-option label="草稿" value="DRAFT"/>
        <el-option label="提交" value="PENDING"/>
      </el-select>
      <el-button style="margin-left: 10px;" type="success" @click="saveData" :loading="loading">保存</el-button>
    </sticky>

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
                  <el-date-picker class="full_with_date" v-model="form.billDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="渠道退货" prop="parentBillId">
                  <el-select v-model="form.parentBillId" filterable clearable remote default-first-option placeholder="请输入渠道退货单号" :loading="loadingOptionParentBillList" style="width: 100%" :remote-method="searchParentBillOption" @change="changeOptionParentBill">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-for="item in optionParentBillList" :value="item.id" :label="item.code"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="渠道">
                  <el-input :value="form.parentBillId == '' ? '' : form.channelName + '-' + form.channelCode" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="仓库">
                  <el-input :value="form.parentBillId == '' ? '' : form.warehouseName + '-' + form.warehouseCode" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" v-if="isDetail">
              <el-col :span="6">
                <el-form-item label="创建时间">
                  <el-input prefix-icon="el-icon-time" :value="form.createDate"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建人">
                  <el-input :value="form.createUserName"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="审核时间">
                  <el-input prefix-icon="el-icon-time" :value="form.auditDate"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="审核人">
                  <el-input :value="form.auditUserName"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" v-if="isDetail">
              <el-col :span="6">
                <el-form-item label="最后更新时间">
                  <el-input prefix-icon="el-icon-time" :value="form.updateDate"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="单据状态">
                  <el-input :value="form.statusMean"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="总数量">
                  <el-input :value="form.totalCount"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="总金额">
                  <el-input :value="form.totalAmount"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="货品信息" name="GOODS">
            <detail-goods ref="detailGoods" :list-loading="listLoading" :list.sync="list"/>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </div>

  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {save, get, getParentBill, getParentBillGoods} from '@/api/bill/inwarehouse'
  import detailGoods from '@/z/bill/components/detailGoods'
  import {initDate,getPickerOptions} from '@/z/bill/components/commonMethod'


  export default {
    name: 'inwarehouse_detail',
    components: {
      Sticky, detailGoods
    },
    data() {
      return {
        pickerOptions: getPickerOptions(),
        //扫锚
        barCode: '',
        barCodeAutoFocus: false,
        form: {
          id: '',
          parentBillId: '',
          billDate: initDate(),
          code: '',
          status: 'PENDING'
        },
        //明细列表
        list: [],
        listLoading: false,
        rules: {
          billDate: [{required: true, message: '必填字段', trigger: 'blur'}],
          parentBillId: [{required: true, message: '必填字段', trigger: 'blur'}],
        },
        loading: false,
        activeName: 'BASE',
        isDetail: false,
        //搜索上游单据
        loadingOptionParentBillList: false,
        optionParentBillList: []
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
          this.optionParentBillList.push({id: this.form.parentBillId, code: this.form.parentBillCode})
          response.data.goodsList.forEach(d => {
            d.optionGoodsList = []
            d.optionGoodsList.push({id: d.goodsId, name: d.goodsName, code: d.goodsCode})
          })
          this.list = response.data.goodsList
        }).catch(() => this.loading = false)
      }
    },
    methods: {
      //修改tag pane
      handleTagPaneClick(tab, event) {
        if (tab.name === 'GOODS') {
          this.$refs.detailGoods.initFocus()
        }
      },
      //保存
      saveData() {
        this.$refs['billForm'].validate((valid) => {
          if (valid) {
            //判断list
            if (this.list.filter(r => r.goodsId === '').length > 0 || this.list.length === 0) {
              this.activeName = 'GOODS'
              this.$message.error('请输入货品')
              return
            }
            if (!this.list.every(r => r.price !== '' && r.price >= 0 && r.price <= 999999999)) {
              this.activeName = 'GOODS'
              this.$message.error('货品价格必须大于等于0')
              return
            }
            if (this.list.filter(r => r.detail.filter(d => d.billCount > 0).reduce((t, d) => t + parseInt(d.billCount), 0) === 0).length > 0) {
              this.activeName = 'GOODS'
              this.$message.error('请输入货品数量')
              return
            }
            //查询是否

            this.loading = true
            this.form.goodsList = this.list
            save(this.form).then(response => {
              this.loading = false
              this.$message({message: response.message, type: 'success'})
              let thisView = this.$store.state.tagsView.visitedViews.find(r => r.fullPath == this.$route.fullPath)
              this.$store.dispatch('delView', thisView).then(() => {
                let backView = this.$store.state.tagsView.visitedViews.find(r => r.fullPath == "/bill/channel/inwarehouse")
                if (backView != null) {
                  this.$store.dispatch('delCachedView', backView).then(() => this.$nextTick(() => this.$router.replace({path: '/redirect' + backView.fullPath})))
                }
              })
            }).catch((err) => this.loading = false)
          } else {
            this.activeName = 'BASE'
          }
        })
      },
      //搜索上游单据
      searchParentBillOption(query) {
        if (query !== '') {
          this.loadingOptionParentBillList = true
          getParentBill({pageIndex: 1, pageSize: 10, code: query}).then(response => {
            this.loadingOptionParentBillList = false
            this.optionParentBillList = response.data.content
          })
        } else {
          this.optionParentBillList = []
        }
      },
      changeOptionParentBill(id) {
        this.form.parentBillCode = this.form.channelId = this.form.channelName = this.form.channelCode = ''
        this.form.warehouseId = this.form.warehouseName = this.form.warehouseName = ''
        if (id != '') {
          let ele = this.optionParentBillList.find(r => r.id === id)
          this.form.parentBillCode = ele.code
          this.form.channelId = ele.channelId
          this.form.channelName = ele.channelName
          this.form.channelCode = ele.channelCode
          this.form.warehouseId = ele.warehouseId
          this.form.warehouseName = ele.warehouseName
          this.form.warehouseCode = ele.warehouseCode
          this.loading = true
          getParentBillGoods({id: id}).then(response => {
            response.data.forEach(d => {
              d.optionGoodsList = []
              d.optionGoodsList.push({id: d.goodsId, name: d.goodsName, code: d.goodsCode})
            })
            this.loading = false
            this.list = response.data
          })
        }
      }
    }
  }
</script>

