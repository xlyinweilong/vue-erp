<template>
  <el-dialog
    title="支付方式"
    :visible="show"
    @close="onClose"
    @open="onOpen"
    v-loading="listLoading"
    width="55%">
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="8"><b style="font-size:18px">总计：{{totalAmount}}</b></el-col>
      <el-col :span="8"><b style="font-size:18px;" :style="toBePaid > 0 ? 'color:#F56C6C' : ''">待支付：{{toBePaid}}</b></el-col>
      <el-col :span="8"><b style="font-size:18px" :style="giveChange > 0 ? 'color:#F56C6C' : ''">找零：{{giveChange}}</b></el-col>
    </el-row>
    <el-form ref="form" label-width="100px" style="padding-bottom: 0px;">
      <el-form-item v-for="payment in paymentList" v-if="payment.startUp === 1" :label="payment.name+'：'" style="margin-bottom: 8px;" v-show="vip.id != '' || (payment.sysType != 'INTEGRAL' && payment.sysType != 'BALANCE')">

        <el-row :gutter="24" v-if="payment.sysType === 'BALANCE'" style="margin-left: 0px; margin-right: 0px;">
          <el-col :span="12" style="padding-left: 0px;">账户余额:{{vip.balance}}</el-col>
          <el-col :span="12" style="padding-right: 0px;">
            <el-input-number @change="changeInputNumber(payment)" v-if="payment.sysType === 'BALANCE'" :disabled="vip.balance <= 0" style="width: 100%" v-model="payment.amount" :controls="false" :precision="2" :max="vip.balance"></el-input-number>
          </el-col>
        </el-row>

        <el-row :gutter="24" v-if="payment.sysType === 'INTEGRAL'" style="margin-left: 0px; margin-right: 0px;">
          <el-col :span="12" style="padding-left: 0px; padding-right: 12px;">
            <span v-text="vip.integralToMoney == null ? '等级未设置换算规则' : ('账户积分:' + vip.integral + ',备注:' + vip.integralToMoney + '积分为1元')"></span>
          </el-col>
          <el-col :span="6">
            <el-input-number @change="changeInputNumber(payment)" :disabled="true" style="width: 100%" v-model="payment.amount" :controls="false" :precision="0" :max="parseInt(vip.integral / vip.integralToMoney)"></el-input-number>
          </el-col>
          <el-col :span="6" style="padding-right: 0px;">
            <el-input-number :disabled="vip.integralToMoney == null || parseInt(vip.integral / vip.integralToMoney) == 0" style="width: 100%" placeholder="请输入积分" v-model="payment.integral" :controls="false" :precision="0" :max="vip.integral" @change="payment.amount = parseInt(payment.integral / vip.integralToMoney);changeInputNumber(payment)"></el-input-number>
          </el-col>
        </el-row>

        <el-row :gutter="24" v-if="payment.sysType === 'COUPON'" style="margin-left: 0px; margin-right: 0px;">
          <el-col :span="12" style="padding-left: 0px;">
            <el-input style="width: 100%" placeholder="请输入代用卷编号" v-model="couponCode" @keyup.enter.native="searchCouponCode"/>
          </el-col>
          <el-col :span="12" style="padding-right: 0px;">
            <el-input-number @change="changeInputNumber(payment)" :disabled="true" style="width: 100%" v-model="payment.amount" :controls="false" :precision="2"></el-input-number>
          </el-col>
        </el-row>

        <el-input-number @change="changeInputNumber(payment)" v-if="payment.sysType != 'BALANCE' && payment.sysType != 'INTEGRAL' && payment.sysType != 'COUPON'" style="width: 100%" v-model="payment.amount" :controls="false" :precision="2"></el-input-number>
      </el-form-item>
      <el-table v-show="couponList.length > 0"
                :data="couponList"
                style="width: 100%">
        <el-table-column
          prop="code"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="失效时间">
        </el-table-column>
        <el-table-column
          prop="conditionAmount"
          width="100"
          label="条件金额">
        </el-table-column>
        <el-table-column
          prop="amount"
          width="80"
          label="金额">
        </el-table-column>
        <el-table-column
          label="操作"
          width="60">
          <template slot-scope="scope">
            <el-button @click="deleteCoupon(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose" :loading="loading">关闭</el-button>
      <el-button type="primary" v-show="vip.id != ''" @click="showCoupon = true" plain :loading="loading">代用卷</el-button>
      <el-button type="primary" @click="pay" :disabled="toBePaid !== 0" :loading="loading">确定</el-button>
    </span>
    <coupon :show.sync="showCoupon" :vip="vip" :couponList="couponList" @updateCouponList="updateCouponList"/>
  </el-dialog>
</template>
<script>
  import {getList} from '@/api/config/payment'
  import {findByCodeForCanUse} from '@/api/vip/coupon'
  import coupon from '@/z/pos/cash/coupon'

  export default {
    computed: {
      paid() {
        return this.paymentList.filter(p => p.amount != null).reduce((t, d) => t + parseFloat(d.amount), 0)
      },
      toBePaid() {
        return this.paid > this.totalAmount ? 0 : this.totalAmount - this.paid
      },
      giveChange() {
        let cashPayment = this.paymentList.find(p => p.sysType === 'CASH')
        if (cashPayment != null && cashPayment.amount > 0) {
          return this.paid > this.totalAmount ? this.paid - this.totalAmount : 0
        }
        return 0
      }
    },
    components: {coupon},
    data() {
      return {
        listLoading: false,
        paymentList: [],
        showCoupon: false,
        couponCode: '',
        coupon: {id: ''},
        couponList: []
      }
    },
    props: {
      vip: {default: {id: '', name: ''}},
      show: {default: false},
      totalAmount: {default: 0},
      loading: {default: false},
    },
    created() {
      this.getPaymentList()
    },
    watch: {},
    methods: {
      changeInputNumber(payment) {
        if (payment.sysType !== 'CASH') {
          let cashPayment = this.paymentList.find(p => p.sysType === 'CASH')
          if (this.giveChange > 0 && cashPayment.amount > 0) {
            cashPayment.amount = cashPayment.amount > this.giveChange ? (cashPayment.amount - this.giveChange) : 0
          }
        }
      },
      init() {

      },
      getPaymentList() {
        this.listLoading = true
        getList({pageIndex: 1, pageSize: 100}).then(response => {
          response.data.forEach(p => p.amount = null)
          this.paymentList = response.data
        }).finally(() => this.listLoading = false)
      },
      onOpen() {
        this.couponList = []
        this.paymentList.forEach(p => p.amount = null)
        this.paymentList.filter(p => p.sysType === 'CASH').forEach(p => p.amount = this.totalAmount)
      },
      onClose() {
        this.$emit('update:show', false)
      },
      pay() {
        this.$emit('pay', this.paymentList)
      },
      //查询代用卷
      searchCouponCode() {
        this.listLoading = true
        findByCodeForCanUse({code: this.couponCode, vipId: this.vip.id}).then(response => {
          this.couponCode = ''
          this.coupon = response.data
          if (this.couponList.every(c => c.id != this.coupon.id)) {
            this.couponList.unshift(this.coupon)
            let paymentCoupon = this.paymentList.find(p => p.sysType === 'COUPON')
            paymentCoupon.amount = this.couponList.reduce((t, d) => t + parseFloat(d.amount), 0)
            let cashPayment = this.paymentList.find(p => p.sysType === 'CASH')
            cashPayment.amount = 0
            this.changeInputNumber(paymentCoupon)
            this.$emit('updateCouponList', this.couponList)
          }
        }).finally(() => this.listLoading = false)
      },
      deleteCoupon(row) {
        let index = this.couponList.indexOf(row);
        this.couponList.splice(index, 1)
        let paymentCoupon = this.paymentList.find(p => p.sysType === 'COUPON')
        paymentCoupon.amount = this.couponList.reduce((t, d) => t + parseFloat(d.amount), 0)
        this.changeInputNumber(paymentCoupon)
        this.$emit('updateCouponList', this.couponList)
      },
      updateCouponList(multipleSelection){
        this.couponList = multipleSelection
        let paymentCoupon = this.paymentList.find(p => p.sysType === 'COUPON')
        paymentCoupon.amount = this.couponList.reduce((t, d) => t + parseFloat(d.amount), 0)
        this.changeInputNumber(paymentCoupon)
        this.$emit('updateCouponList', this.couponList)

      },
    }
  }
</script>

<style scoped>
  .el-dialog__body {
    padding-top: 0;
  }
</style>
