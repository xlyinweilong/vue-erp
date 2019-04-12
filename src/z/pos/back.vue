<template>
  <div>
    <sticky class-name="sub-navbar draft">
      <el-select class="filter-item" v-model="channelId" placeholder="请选择" style="width: 300px;" :disable="loadingChannelList" @change="changeChannel">
        <el-option v-for="channel in channelList" :label="channel.name + '-' + channel.code" :value="channel.id"></el-option>
      </el-select>
    </sticky>

    <div class="app-container">
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="24">
          <span>原单号：</span>
          <el-input v-loading="loading" placeholder="请输入原单号" v-model.trim="billCode" style="width: 300px;" @keyup.enter.native="searchBill"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
          <el-button type="primary" :loading="loading" @click="searchBill" plain>确定</el-button>
        </el-col>
      </el-row>
      <el-row v-if="oldPo.code != null" :gutter="20" style="margin-top: 10px;margin-bottom: 10px;">
        <el-col :span="18">
          单据时间：{{oldPo.billDate}}
        </el-col>
        <el-col :span="6">

        </el-col>
      </el-row>
      <goods-list-com :goodsList.sync="oldGoodsList" :list-loading.sync="loading" ref="goodsListCom"/>
      <div class="filter-container" style="margin-top: 5px;">
        <el-button type="primary" :loading="loading" :disabled="oldGoodsList.every(g => !g.isBack)" @click="doPayment">结算</el-button>
      </div>
    </div>
    <payment :show.sync="showPayment" :totalBackAmount="totalBackAmount" :paymentList="paymentList" :vip="vip" @pay="pay"/>
  </div>
</template>

<script>
  import {findByBillCode, doBack, backPayment} from '@/api/pos/back'
  import Sticky from '@/components/Sticky'
  import permission from '@/directive/permission/index.js'
  import {getList as getChannelList} from '@/api/info/channel'
  import goodsListCom from '@/z/pos/back/goodsListCom'
  import payment from '@/z/pos/back/payment'
  import PrintJs from 'print-js'


  export default {
    name: 'back',
    computed: {},
    components: {Sticky, goodsListCom, payment},
    directives: {permission},
    filters: {},
    data() {
      return {
        loading: false,
        //渠道
        loadingChannelList: false,
        channelList: [],
        channelId: '',
        //单号
        billCode: '',
        //货品列表
        oldPo: {},
        oldBillCode: '',
        oldGoodsList: [],
        showPayment: false,
        paymentList: [],
        totalBackAmount: 0,
        vip: {},
        baseApi: process.env.BASE_API
      }
    },
    created() {
      this.loadingChannelList = true
      getChannelList({pageIndex: 1, pageSize: 99999}).then(response => {
        this.channelList = response.data.content
        if (this.channelList.length > 0) {
          this.channelId = this.channelList[0].id
          this.init()
        }
      }).finally(() => this.loadingChannelList = false)
    },
    methods: {
      //切换渠道
      changeChannel() {
        this.init()
      },
      searchBill() {
        this.loading = true
        this.oldPo = {}
        findByBillCode({channelId: this.channelId, billCode: this.billCode}).then(response => {
          this.oldPo = response.data.posCashPo
          this.oldBillCode = this.billCode
          response.data.goodsList.forEach(g => {
            g.backCount = g.billCount;
            g.isBack = false
          })
          this.oldGoodsList = response.data.goodsList
          this.billCode = ''
        }).catch(() => this.oldPo = {}).finally(() => this.loading = false)
      },
      //支付
      pay(paymentList) {
        doBack({billCode: this.oldBillCode, goodsList: this.oldGoodsList.filter(g => g.isBack), paymentList: paymentList}).then(response => {
          this.showPayment = false
          this.init()
          this.$message({message: '操作成功', type: 'success'})
          //弹出打印
          PrintJs({printable: this.baseApi + '/api/pos/cash/print?code=' + response.data.code, type: 'pdf', header: '收银', maxWidth: 800, headerStyle: 'font-weight: 300;', targetStyles: ['*']})
        }).finally(() => this.loading = false)
      },
      //退货支付方式
      doPayment() {
        this.loading = true
        backPayment({billCode: this.oldBillCode, goodsList: this.oldGoodsList.filter(g => g.isBack)}).then(response => {
          response.data.paymentList.forEach(p => p.oldAmount = p.amount)
          let totalAmount = response.data.paymentList.filter(p => p.oldAmount != null).reduce((t, d) => t + parseFloat(d.oldAmount), 0)
          response.data.paymentList.forEach(p => {
            p.amount = 0
          })
          this.paymentList = response.data.paymentList
          this.totalBackAmount = response.data.totalBackAmount
          this.vip = response.data.vip
          this.showPayment = true
          // this.init()
          // this.$message({message: '操作成功', type: 'success'})
        }).finally(() => this.loading = false)
      },
      //初始化页面
      init() {
        this.oldPo = {}
        this.billCode = ''
        this.oldGoodsList = []
      }
    }
  }
</script>

<style scoped>

</style>
