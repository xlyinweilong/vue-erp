<template>
  <div>
    <sticky class-name="sub-navbar draft" v-if="!isDetail">
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
                  <el-date-picker class="full_with_date" v-model="form.billDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions" :disabled="isDetail"/>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="仓库" prop="warehouseId">
                  <el-select :disabled="isDetail" v-model="form.warehouseId" filterable clearable remote default-first-option placeholder="请输入仓库编号" :loading="loadingOptionWarehouseList" style="width: 100%" :remote-method="searchWarehouseOption">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-for="item in optionWarehouseList" :value="item.id" :label="item.name +'-'+item.code"/>
                  </el-select>
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
            <detail-goods ref="detailGoods" :list-loading="listLoading" :list.sync="list"/>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </div>

  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {save, get} from '@/api/bill/warehouseLoss'
  import {getList as getWarehouseList} from '@/api/info/warehouse'
  import detailGoods from '@/z/bill/components/detailGoods'
  import {initDate,getPickerOptions} from '@/z/bill/components/commonMethod'



  export default {
    name: 'warehouse_loss_detail',
    components: {
      Sticky,detailGoods
    },
    data() {
      return {
        pickerOptions: getPickerOptions(),
        //扫锚
        barCode: '',
        barCodeAutoFocus: false,
        form: {
          id: '',
          toWarehouseId: '',
          warehouseId: '',
          billDate: initDate(),
          code: '',
          status: 'PENDING'
        },
        //明细列表
        list: [],
        listLoading: false,
        rules: {
          billDate: [{required: true, message: '必填字段', trigger: 'blur'}],
          warehouseId: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
        loading: false,
        activeName: 'BASE',
        isDetail: false,
        //搜索渠道
        loadingOptionWarehouseList: false,
        optionWarehouseList: []
      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      this.isDetail = this.$route.name.indexOf("_detail") > -1;
      if (id != null) {
        this.loading = true
        get({id: id}).then(response => {
          this.loading = false
          this.form = response.data
          if (this.form.status !== 'DRAFT') {
            this.form.status = 'PENDING'
          }
          this.optionWarehouseList.push({id: this.form.warehouseId, name: this.form.warehouseName, code: this.form.warehouseCode})
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
            this.loading = true
            this.form.goodsList = this.list
            save(this.form).then(response => {
              this.loading = false
              this.$message({message: response.message, type: 'success'})
              let thisView = this.$store.state.tagsView.visitedViews.find(r => r.fullPath == this.$route.fullPath)
              this.$store.dispatch('delView', thisView).then(() => {
                let backView = this.$store.state.tagsView.visitedViews.find(r => r.fullPath == "/bill/warehouse/warehouse_loss")
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
      //搜索渠道
      searchWarehouseOption(query) {
        if (query !== '') {
          this.loadingOptionWarehouseList = true
          getWarehouseList({pageIndex: 1, pageSize: 10, code: query}).then(response => {
            this.loadingOptionWarehouseList = false
            this.optionWarehouseList = response.data.content
          })
        } else {
          this.optionWarehouseList = []
        }
      }
    }
  }
</script>
