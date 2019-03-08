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
              <el-col :span="6">
                <el-form-item label="手工单号" prop="manualCode">
                  <el-input v-model="form.manualCode" clearable/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="订货单号" prop="parentBillId">
                  <el-select v-model="form.parentBillId" filterable clearable remote default-first-option placeholder="请输入订货单号" :loading="loadingOptionParentBillList" style="width: 100%" :remote-method="searchParentBillOption" @change="changeOptionParentBill">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-for="item in optionParentBillList" :value="item.id" :label="item.code"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="仓库" prop="warehouseId">
                  <el-select :disabled="form.parentBillId != ''" v-model="form.warehouseId" filterable clearable remote default-first-option placeholder="请输入调出渠道编号" :loading="loadingOptionWarehouseList" style="width: 100%" :remote-method="searchWarehouseOption">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="optionWarehouseList.length === 0 && form.warehouseId != ''" :value="form.warehouseId" :label="form.warehouseName +'-'+form.warehouseCode"/>
                    <el-option v-for="item in optionWarehouseList" :value="item.id" :label="item.name +'-'+item.code"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="渠道" prop="channelId">
                  <el-select :disabled="form.parentBillId != ''" v-model="form.channelId" filterable clearable remote default-first-option placeholder="请输入调入渠道编号" :loading="loadingOptionChannelList" style="width: 100%" :remote-method="searchChannelOption">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="optionChannelList.length === 0 && form.channelId != ''" :value="form.channelId" :label="form.channelName +'-'+form.channelCode"/>
                    <el-option v-for="item in optionChannelList" :value="item.id" :label="item.name +'-'+item.code"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="货品信息" name="GOODS" :disabled="form.warehouseId == ''">
            <detail-goods ref="detailGoods" :list-loading="listLoading" :list.sync="list" :warehouseId="form.warehouseId"/>
          </el-tab-pane>
          <!--<el-tab-pane label="差异数" name="DIFF" :disabled="form.parentBillId == ''">-->
          <!--<diff-goods ref="diffGoods" :list-loading="listLoading" :list.sync="list" :parentList="parentList"/>-->
          <!--</el-tab-pane>-->
        </el-tabs>
      </el-form>

    </div>


  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {save, get, getParentBill, getParentBillGoods} from '@/api/bill/delivery'
  import {getList as getWarehouseList} from '@/api/info/warehouse'
  import {getList as getChannelList} from '@/api/info/channel'
  import detailGoods from '@/z/bill/components/detailGoods'
  import diffGoods from '@/z/bill/components/diffGoods'
  import {initDate, getPickerOptions} from '@/z/bill/components/commonMethod'
  import {backUrl} from '@/z/common/commonMethod'

  export default {
    name: 'delivery_detail',
    components: {
      Sticky, detailGoods, diffGoods
    },
    data() {
      return {
        pickerOptions: getPickerOptions(),
        form: {
          id: '',
          parentBillId: '',
          billDate: initDate(),
          code: '',
          status: 'PENDING',
          manualCode: '',
          warehouseId: '',
          channelId: ''
        },
        //明细列表
        list: [],
        listLoading: false,
        rules: {
          billDate: [{required: true, message: '必填字段', trigger: 'blur'}],
          warehouseId: [{required: true, message: '必填字段', trigger: 'blur'}],
          channelId: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
        loading: false,
        activeName: 'BASE',
        //搜索上游单据
        loadingOptionParentBillList: false,
        optionParentBillList: [],
        //搜索渠道
        loadingOptionChannelList: false,
        optionChannelList: [],
        //搜索仓库
        loadingOptionWarehouseList: false,
        optionWarehouseList: [],
      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      if (id != null) {
        this.loading = true
        get({id: id}).then(response => {
          this.form = response.data
          if (this.form.status !== 'DRAFT') {
            this.form.status = 'PENDING'
          }
          if(this.form.parentBillId != ''){
            this.optionParentBillList.push({id: this.form.parentBillId, code: this.form.parentBillCode,channelId:this.form.channelId,channelCode:this.form.channelCode,channelName:this.form.channelName,warehouseId:this.form.warehouseId,warehouseCode:this.form.warehouseCode,warehouseName:this.form.warehouseName})
          }
          this.list = response.data.goodsList
          this.loading = false
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
              backUrl(this, '/bill/chain/delivery')
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
        this.form.warehouseId = this.form.warehouseName = this.form.warehouseCode = ''
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
            this.list = response.data
            this.list.forEach(g => g.detail.forEach(d => d.billCount = d.billCount - d.quotedCount))
          }).finally(() => this.loading = false)
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
      }


    }
  }
</script>


