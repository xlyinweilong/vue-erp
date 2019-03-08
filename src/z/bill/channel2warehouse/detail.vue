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
                <el-form-item label="渠道" prop="channelId">
                  <el-select :disabled="isDetail" v-model="form.channelId" filterable clearable remote default-first-option placeholder="请输入渠道" :loading="loadingOptionWarehouseList" style="width: 100%" :remote-method="searchWarehouseOption">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-for="item in optionWarehouseList" :value="item.id" :label="item.name +'-'+item.code"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="仓库" prop="warehouseId">
                  <el-select :disabled="isDetail" v-model="form.warehouseId" filterable clearable remote default-first-option placeholder="请输入渠道" :loading="loadingOptionChannelList" style="width: 100%" :remote-method="searchChannelOption">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-for="item in optionChannelList" :value="item.id" :label="item.name +'-'+item.code"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="货品信息" name="GOODS" :disabled="form.channelId == ''">
            <detail-goods ref="detailGoods" :list-loading="listLoading" :list.sync="list" :channelId="form.channelId"/>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </div>

  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {save, get} from '@/api/bill/channel2warehouse'
  import {getList as getChannelList} from '@/api/info/warehouse'
  import {getList as getWarehouseList} from '@/api/info/channel'
  import detailGoods from '@/z/bill/components/detailGoods'
  import {initDate,getPickerOptions} from '@/z/bill/components/commonMethod'
  import {backUrl} from '@/z/common/commonMethod'


  export default {
    name: 'channel2warehouse_detail',
    components: {
      Sticky,detailGoods
    },
    data() {
      return {
        pickerOptions: getPickerOptions(),
        form: {
          id: '',
          warehouseId: '',
          channelId: '',
          billDate: initDate(),
          code: '',
          status: 'PENDING',
          manualCode:''
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
        isDetail: false,
        //搜索渠道
        loadingOptionChannelList: false,
        optionChannelList: [],
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
          this.optionChannelList.push({id: this.form.warehouseId, name: this.form.warehouseName, code: this.form.warehouseCode})
          this.optionWarehouseList.push({id: this.form.channelId, name: this.form.channelName, code: this.form.channelCode})
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
              backUrl(this, '/bill/channel/channel2warehouse')
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
      //搜索渠道
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
      }
    }
  }
</script>
