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
                <el-form-item label="手工单号" prop="manualCode">
                  <el-input v-model="form.manualCode" clearable/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="订货单号" prop="grandParentBillId">
                  <el-select :disabled="form.parentBillId != ''" v-model="form.grandParentBillId" filterable clearable remote default-first-option placeholder="请输入订货单号" :loading="loadingOptionGrandParentBillList" style="width: 100%" :remote-method="searchGrandParentBillOption" @change="changeOptionGrandParentBill">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="optionGrandParentBillList.length === 0 && form.grandParentBillId != ''" :value="form.grandParentBillId" :label="form.grandParentBillCode"/>
                    <el-option v-for="item in optionGrandParentBillList" :value="item.id" :label="item.code"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="配货单号" prop="parentBillId">
                  <el-select v-model="form.parentBillId" filterable clearable remote default-first-option placeholder="请输入配货单号" :loading="loadingOptionParentBillList" style="width: 100%" :remote-method="searchParentBillOption" @change="changeOptionParentBill">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-for="item in optionParentBillList" :value="item.id" :label="item.code"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="仓库" prop="warehouseId">
                  <el-select :disabled="form.parentBillId != '' || form.grandParentBillId != ''" v-model="form.warehouseId" filterable clearable remote default-first-option placeholder="请输入仓库" :loading="loadingOptionWarehouseList" style="width: 100%" :remote-method="searchWarehouseOption">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="optionWarehouseList.length === 0 && form.warehouseId != ''" :value="form.warehouseId" :label="form.warehouseName +'-'+form.warehouseCode"/>
                    <el-option v-for="item in optionWarehouseList" :value="item.id" :label="item.name +'-'+item.code"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="渠道" prop="channelId">
                  <el-select :disabled="form.parentBillId != '' || form.grandParentBillId != ''" v-model="form.channelId" filterable clearable remote default-first-option placeholder="请输入渠道" :loading="loadingOptionChannelList" style="width: 100%" :remote-method="searchChannelOption">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="optionChannelList.length === 0 && form.channelId != ''" :value="form.channelId" :label="form.channelName +'-'+form.channelCode"/>
                    <el-option v-for="item in optionChannelList" :value="item.id" :label="item.name +'-'+item.code"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="货品信息" name="GOODS" :disabled="form.warehouseId == ''">
            <detail-goods ref="detailGoods" :list-loading="listLoading" :list.sync="list" :hasParent="form.parentBillId != ''" :parentList="parentList" :warehouseId="form.warehouseId" :parentTypeName="'配货单'"/>
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
  import Sticky from '@/components/Sticky'
  import {save, get, getParentBill, getParentBillGoods, getGrandParentBill, getGrandParentBillGoods} from '@/api/bill/warehouse2channel'
  import {getList as getChannelList} from '@/api/info/channel'
  import {getList as getWarehouseList} from '@/api/info/warehouse'
  import detailGoods from '@/z/bill/components/detailGoods'
  import diffGoods from '@/z/bill/components/diffGoods'
  import {initDate, getPickerOptions} from '@/z/bill/components/commonMethod'
  import {backUrl} from '@/z/common/commonMethod'

  export default {
    name: 'warehouse2channel_detail',
    components: {
      Sticky, detailGoods, diffGoods
    },
    data() {
      return {
        pickerOptions: getPickerOptions(),
        //扫锚
        barCode: '',
        barCodeAutoFocus: false,
        form: {
          id: '',
          channelId: '',
          warehouseId: '',
          billDate: initDate(),
          code: '',
          status: 'PENDING',
          manualCode: '',
          grandParentBillId: '',
          parentBillId: ''
        },
        //明细列表
        list: [],
        listLoading: false,
        rules: {
          billDate: [{required: true, message: '必填字段', trigger: 'blur'}],
          channelId: [{required: true, message: '必填字段', trigger: 'blur'}],
          warehouseId: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
        loading: false,
        activeName: 'BASE',
        isDetail: false,
        //搜索上上游单据
        loadingOptionGrandParentBillList: false,
        optionGrandParentBillList: [],
        //搜索上游单据
        loadingOptionParentBillList: false,
        optionParentBillList: [],
        parentList: [],
        //搜索渠道
        loadingOptionChannelList: false,
        optionChannelList: [],
        //搜索仓库
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
          this.optionChannelList.push({id: this.form.channelId, name: this.form.channelName, code: this.form.channelCode})
          this.optionWarehouseList.push({id: this.form.warehouseId, name: this.form.warehouseName, code: this.form.warehouseCode})
          this.list = response.data.goodsList
          if (this.form.parentBillId != '') {
            this.loading = true
            this.optionParentBillList.push({
              id: this.form.parentBillId, code: this.form.parentBillCode, parentBillId: this.form.grandParentBillId, parentBillCode: this.form.grandParentBillCode,
              channelName: this.form.channelName, channelCode: this.form.channelCode, channelId: this.form.channelId,
              warehouseName: this.form.warehouseName, warehouseCode: this.form.warehouseCode, warehouseId: this.form.warehouseId
            })
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
          this.$refs.detailGoods.initFocus()
        } else if (tab.name === 'DIFF') {
          this.$refs.diffGoods.init()
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
              backUrl(this, '/bill/warehouse/warehouse2channel')
            }).catch((err) => this.loading = false)
          } else {
            this.activeName = 'BASE'
          }
        })
      },
      //搜索渠道
      searchChannelOption(query) {
        if (query !== '') {
          this.loadingOptionChannelList = true
          getChannelList({pageIndex: 1, pageSize: 10, searchKey: query}).then(response => {
            this.loadingOptionChannelList = false
            this.optionChannelList = response.data.content
          })
        } else {
          this.optionChannelList = []
        }
      },
      //搜索仓库
      searchWarehouseOption(query) {
        if (query !== '') {
          this.loadingOptionWarehouseList = true
          getWarehouseList({pageIndex: 1, pageSize: 10, searchKey: query}).then(response => {
            this.loadingOptionWarehouseList = false
            this.optionWarehouseList = response.data.content
          })
        } else {
          this.optionWarehouseList = []
        }
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
        this.form.grandParentBillId = this.form.grandParentBillCode = this.form.warehouseId = this.form.warehouseName = this.form.warehouseCode = ''
        if (id != '') {
          let ele = this.optionParentBillList.find(r => r.id === id)
          this.form.grandParentBillCode = ele.parentBillCode
          this.form.grandParentBillId = ele.parentBillId
          this.form.parentBillCode = ele.code
          this.form.channelId = ele.channelId
          this.form.channelName = ele.channelName
          this.form.channelCode = ele.channelCode
          this.form.warehouseId = ele.warehouseId
          this.form.warehouseName = ele.warehouseName
          this.form.warehouseCode = ele.warehouseCode
          this.loading = true
          getParentBillGoods({id: id}).then(response => {
            this.parentList = JSON.parse(JSON.stringify(response.data))
            this.list = response.data
            this.list.forEach(g => g.detail.forEach(d => d.billCount = ''))
          }).finally(() => this.loading = false)
        }
      },
      //搜索上上游单据
      searchGrandParentBillOption(query) {
        if (query !== '') {
          this.loadingOptionGrandParentBillList = true
          getGrandParentBill({pageIndex: 1, pageSize: 10, code: query}).then(response => {
            this.loadingOptionGrandParentBillList = false
            this.optionGrandParentBillList = response.data.content
          })
        } else {
          this.optionGrandParentBillList = []
        }
      },
      changeOptionGrandParentBill(id) {
        this.form.grandPparentBillCode = this.form.channelId = this.form.channelName = this.form.channelCode = ''
        this.form.parentBillId = this.form.parentBillCode = this.form.warehouseId = this.form.warehouseName = this.form.warehouseCode = ''
        if (id != '') {
          let ele = this.optionGrandParentBillList.find(r => r.id === id)
          this.form.grandParentBillCode = ele.code
          this.form.channelId = ele.channelId
          this.form.channelName = ele.channelName
          this.form.channelCode = ele.channelCode
          this.form.warehouseId = ele.warehouseId
          this.form.warehouseName = ele.warehouseName
          this.form.warehouseCode = ele.warehouseCode
          this.loading = true
          getGrandParentBillGoods({id: id}).then(response => {
            this.list = response.data
            this.list.forEach(g => g.detail.forEach(d => d.billCount = d.billCount - d.quotedCount))
          }).finally(() => this.loading = false)
        }
      }
    }
  }
</script>

