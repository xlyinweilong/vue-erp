<template>
  <el-dialog
    title="支付方式"
    :visible="show"
    @close="onClose"
    @open="onOpen"
    width="55%">
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="6"><b style="font-size:18px">支付总计：{{totalAmount}}</b></el-col>
      <el-col :span="6"><b style="font-size:18px;">需要退回：{{totalBackAmount}}</b></el-col>
      <el-col :span="6"><b style="font-size:18px;">当前退回：{{paid}}</b></el-col>
      <el-col :span="6"><b style="font-size:18px" :style="toBePaid != 0 ? 'color:#F56C6C' : ''">待退回：{{toBePaid}}</b></el-col>
    </el-row>
    <el-form ref="form" label-width="100px" style="padding-bottom: 0px;">
      <el-form-item v-for="payment in paymentList" :label="payment.paymentName+'：'" style="margin-bottom: 8px;">
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

        <el-row :gutter="24" v-if="payment.sysType != 'BALANCE' && payment.sysType != 'INTEGRAL' && payment.sysType != 'COUPON'" style="margin-left: 0px; margin-right: 0px;">
          <el-col :span="12" style="padding-left: 0px;">
            <el-input-number style="width: 100%" v-model="payment.amount" :controls="false" :precision="2" :min="0" :max="payment.oldAmount"></el-input-number>
          </el-col>
          <el-col :span="12" style="padding-right: 0px;">
            <el-input-number :disabled="true" style="width: 100%" v-model="payment.oldAmount" :controls="false" :precision="2"></el-input-number>
          </el-col>
        </el-row>

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
      </el-table>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose" :loading="loading">关闭</el-button>
      <el-button type="primary" @click="pay" :disabled="toBePaid !== 0" :loading="loading">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import {getList} from '@/api/config/payment'
  import {findByCodeForCanUse} from '@/api/vip/coupon'
  import coupon from '@/z/pos/cash/coupon'

  export default {
    computed: {
      totalAmount() {
        return this.paymentList.filter(p => p.oldAmount != null).reduce((t, d) => t + parseFloat(d.oldAmount), 0)
      },
      paid() {
        return this.paymentList.filter(p => p.amount != null).reduce((t, d) => t + parseFloat(d.amount), 0)
      },
      toBePaid() {
        return this.totalBackAmount - this.paid
      },
    },
    components: {coupon},
    data() {
      return {
        showCoupon: false,
        couponCode: '',
        coupon: {id: ''},
        couponList: []
      }
    },
    props: {
      paymentList: {default: []},
      vip: {default: {}},
      show: {default: false},
      totalBackAmount: {default: 0},
      loading: {default: false},
    },
    created() {
    },
    watch: {},
    methods: {
      init() {

      },
      onOpen() {
      },
      onClose() {
        this.$emit('update:show', false)
      },
      pay() {
        this.$emit('pay', this.paymentList)
      },
      //查询代用卷
      searchCouponCode() {
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
