<template>
  <el-dialog
    title="代用卷"
    :visible="show"
    @close="onClose"
    @open="onOpen"
    v-loading="loading"
    width="45%"
    append-to-body>
    <el-table
      ref="multipleTable"
      :data="myCouponList"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="code"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="金额">
      </el-table-column>
      <el-table-column
        prop="conditionAmount"
        label="条件金额">
      </el-table-column>
      <el-table-column
        prop="endDate"
        label="失效时间">
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose" :loading="loading">关闭</el-button>
      <el-button type="primary" @click="ok" :loading="loading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>

  import {getMyList} from '@/api/vip/coupon'

  export default {
    computed: {},
    components: {},
    data() {
      return {
        loading: false,
        myCouponList: [],
        listQuery: {
          used: false,
          pageIndex: 1,
          pageSize: 10
        },
        multipleSelection: []
      }
    },
    props: {
      vip: {default: {id: '', name: ''}},
      show: {default: false},
      couponList: {default: []}
    },
    created() {
    },
    watch: {},
    methods: {
      getCouponList() {
        this.loading = true
        this.listQuery.vipId = this.vip.id
        this.multipleSelection = []
        getMyList(this.listQuery).then(response => {
          this.myCouponList = response.data.content
          // this.multipleSelection = this.myCouponList.filter(coupon => this.couponList.some(c => c.id === coupon.id))
          // this.$nextTick(() => {
          //   this.multipleSelection.forEach(coupon => {
          //     this.$refs.multipleTable.toggleRowSelection(coupon)
          //   })
          // })
        }).finally(() => this.loading = false)
      },
      onOpen() {
        this.getCouponList()
      },
      onClose() {
        this.$emit('update:show', false)
      },
      ok() {
        this.$emit('updateCouponList', this.multipleSelection)
        this.onClose()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  }
</script>

<style scoped>
  .el-dialog__body {
    padding-top: 0;
  }
</style>
