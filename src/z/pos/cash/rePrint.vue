<template>
  <el-dialog
    title="单据打印"
    :visible="show"
    @close="onClose"
    @open="onOpen"
    width="55%">
    <el-table
      :data="billList"
      border
      style="width: 100%">
      <el-table-column
        prop="createDate"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="code"
        label="单号">
      </el-table-column>
      <el-table-column
        prop="totalCount"
        label="总数量">
      </el-table-column>
      <el-table-column
        prop="totalAmount"
        label="总金额">
      </el-table-column>
      <el-table-column
        label="打印">
        <template slot-scope="scope">
          <el-button
            @click="print(scope.row)">打印
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination class="print-pagination" v-show="total>0 && !loading" :total="total" :page.sync="pageIndex" :limit.sync="pageSize" @pagination="findBillPost"/>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose" :loading="loading">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import {findMyPosBill} from '@/api/pos/pos'
  import PrintJs from 'print-js'
  import Pagination from '@/components/Pagination'

  export default {
    computed: {},
    components: {Pagination},
    data() {
      return {
        billList: [],
        loading: false,
        pageSize: 10,
        pageIndex: 1,
        baseApi: process.env.BASE_API,
        total: 0
      }
    },
    props: {
      show: {default: false},
      channelId: {default: ''},
    },
    created() {
    },
    watch: {},
    methods: {
      init() {
      },
      onOpen() {
        this.findBillPost()
      },
      onClose() {
        this.$emit('update:show', false)
      },
      //查询单据
      findBillPost() {
        this.loading = true
        findMyPosBill({channelId: this.channelId, pageIndex: this.pageIndex, pageSize: this.pageSize}).then(response => {
          this.billList = response.data.content
          this.total = response.data.totalElements
        }).finally(() => this.loading = false)
      },
      print(row) {
        PrintJs({printable: this.baseApi + '/api/pos/cash/print?code=' + row.code, type: 'pdf', header: '收银', maxWidth: 800, headerStyle: 'font-weight: 300;', targetStyles: ['*']})
      }
    }
  }
</script>

<style scoped>
  .el-dialog__body {
    padding-top: 0;
  }

  .print-pagination {
    padding-top: 0px;
    padding-bottom: 0px;
  }
</style>
