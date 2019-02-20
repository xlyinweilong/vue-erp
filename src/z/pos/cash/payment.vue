<template>
  <el-dialog
    title="支付方式"
    :visible="show"
    @close="onClose"
    @open="onOpen"
    v-loading="listLoading"
    width="45%">
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="8"><b style="font-size:18px">总计：{{totalAmount}}</b></el-col>
      <el-col :span="8"><b style="font-size:18px">待支付：{{toBePaid}}</b></el-col>
      <el-col :span="8"><b style="font-size:18px">找零：{{giveChange}}</b></el-col>
    </el-row>
    <el-form ref="form" label-width="100px" style="padding-bottom: 0px;">
      <el-form-item v-for="payment in paymentList" v-if="payment.startUp === 1" :label="payment.name+'：'" style="margin-bottom: 8px;" v-show="vip.id != '' || (payment.sysType != 'COUPON' && payment.sysType != 'INTEGRAL' && payment.sysType != 'BALANCE')">

        <el-row :gutter="24"  v-if="payment.sysType === 'BALANCE'" style="margin-left: 0px; margin-right: 0px;">
          <el-col :span="12" >账户余额:{{vip.balance}}</el-col>
          <el-col :span="12" style="padding-right: 0px;"><el-input-number v-if="payment.sysType === 'BALANCE'" :disabled="vip.balance <= 0" style="width: 100%" v-model="payment.amount" :controls="false" :precision="2" :max="vip.balance"></el-input-number></el-col>
        </el-row>

        <el-row :gutter="24"  v-if="payment.sysType === 'INTEGRAL'" style="margin-left: 0px; margin-right: 0px;">
          <el-col :span="12" v-text="vip.integralToMoney == null ? '等级未设置换算规则' : ('账户积分:' + vip.integral + ',备注:' + vip.integralToMoney + '积分为1元')"></el-col>
          <el-col :span="6"><el-input-number :disabled="true" style="width: 100%" v-model="payment.amount" :controls="false" :precision="0" :max="parseInt(vip.integral / vip.integralToMoney)"></el-input-number></el-col>
          <el-col :span="6" style="padding-right: 0px;"><el-input-number :disabled="vip.integralToMoney == null || parseInt(vip.integral / vip.integralToMoney) == 0" style="width: 100%" placeholder="请输入积分" v-model="payment.integral" :controls="false" :precision="0" :max="vip.integral" @change="payment.amount = parseInt(payment.integral / vip.integralToMoney)"></el-input-number></el-col>
        </el-row>

        <el-input-number v-if="payment.sysType != 'BALANCE' && payment.sysType != 'INTEGRAL'" style="width: 100%" v-model="payment.amount" :controls="false" :precision="2" :disabled="payment.sysType === 'COUPON'"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">关闭</el-button>
      <el-button type="primary" @click="pay" :disabled="toBePaid > 0" :loading="loading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>

  import {getList} from '@/api/config/payment'

  export default {
    computed: {
      paid() {
        return this.paymentList.filter(p => p.amount != null).reduce((t, d) => t + parseFloat(d.amount), 0)
      },
      toBePaid() {
        return this.paid > this.totalAmount ? 0 : this.totalAmount - this.paid
      },
      giveChange() {
        return this.paid > this.totalAmount ? this.paid - this.totalAmount : 0
      }
    },
    components: {},
    data() {
      return {
        listLoading: false,
        paymentList: []
      }
    },
    props: {
      vip: {default: {id: '', name: ''}},
      show: {default: false},
      totalAmount: {default: 0},
      loading:  {default: false},
    },
    created() {
      this.getPaymentList()
    },
    watch: {},
    methods: {
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
        this.paymentList.forEach(p => p.amount = null)
        this.paymentList.filter(p => p.sysType === 'CASH').forEach(p => p.amount = this.totalAmount)
      },
      onClose() {
        this.$emit('update:show', false)
      },
      pay() {
        this.$emit('pay', this.paymentList)
      }
    }
  }
</script>

<style scoped>
  .el-dialog__body {
    padding-top: 0;
  }
</style>
