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
      <el-form ref="billForm" :model="form" :rules="rules" v-loading="loading" auto-complete="off">
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
              <el-col :span="6">
                <el-form-item label="渠道" prop="channelId">
                  <el-select v-model="form.channelId" filterable clearable remote default-first-option placeholder="请输入渠道" :loading="loadingOptionChannelList" style="width: 100%" :remote-method="searchChannelOption">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-for="item in optionChannelList" :value="item.id" :label="item.name +'-'+item.code"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="货品信息" name="GOODS" :disabled="form.channelId == ''">
            <pos-detail-goods ref="detailGoods" :list-loading="listLoading" :goodsList.sync="list" :channelId="form.channelId"/>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </div>


  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {save, get, getParentBill, getParentBillGoods} from '@/api/bill/channel2channelIn'
  import posDetailGoods from '@/z/bill/components/posDetailGoods'
  import {initDate,getPickerOptions} from '@/z/bill/components/commonMethod'
  import {backUrl} from '@/z/common/commonMethod'
  import {getList as getChannelList} from '@/api/info/channel'

  export default {
    name: 'channel_pos_detail',
    components: {
      Sticky, posDetailGoods
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
          manualCode:''
        },
        //明细列表
        list: [],
        listLoading: false,
        rules: {
          billDate: [{required: true, message: '必填字段', trigger: 'blur'}],
          toChannelId: [{required: true, message: '必填字段', trigger: 'blur'}],
          channelId: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
        loading: false,
        activeName: 'BASE',
        //搜索渠道
        loadingOptionChannelList: false,
        optionChannelList: []
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
          this.optionParentBillList.push({
            id: this.form.parentBillId, code: this.form.parentBillCode,
            channelName: this.form.channelName, channelCode: this.form.channelCode, channelId: this.form.channelId
            , toChannelName: this.form.toChannelName, toChannelCode: this.form.toChannelCode, toChannelId: this.form.toChannelId
          })
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
          this.$refs.detailGoods.initFocus()
        }else if (tab.name === 'DIFF') {
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
              backUrl(this, '/bill/channel/channel2channel_in')
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
      }
    }
  }
</script>


