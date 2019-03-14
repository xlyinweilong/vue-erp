<template>
  <div>
    <div class="filter-container">
      <el-date-picker
        v-model="pickDate"
        type="daterange"
        format="yyyy-MM-dd" value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-input placeholder="渠道编号" v-model.trim="listQuery.channelCode" style="width: 200px;" @keyup.enter.native="getList"/>
      <el-input placeholder="货号" v-model.trim="listQuery.goodsCode" style="width: 200px;" @keyup.enter.native="getList"/>
      <el-input placeholder="颜色编号" v-model.trim="listQuery.goodsColorCode" style="width: 100px;" @keyup.enter.native="getList"/>
      <el-input placeholder="颜色名称" v-model.trim="listQuery.goodsColorName" style="width: 100px;" @keyup.enter.native="getList"/>
      <el-input placeholder="尺码" v-model.trim="listQuery.goodsSizeName" style="width: 100px;" @keyup.enter.native="getList"/>
      <el-button :loading="listLoading" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      border
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column label="单据时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.billDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="颜色编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsColorCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="颜色名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsColorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="尺码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsSizeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.billCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>
  </div>
</template>

<script>
  import {getPosList} from '@/api/pos/pos'
  import Pagination from '@/components/Pagination'
  import {initDate} from '@/z/bill/components/commonMethod'

  export default {
    computed: {},
    components: {
      Pagination
    },
    data() {
      return {
        total: 0,
        pickDate: [initDate(), initDate()],
        listQuery: {
          channelCode: '',
          goodsCode: '',
          goodsColorCode: '',
          goodsColorName: '',
          goodsSizeName: '',
          pageIndex: 1,
          pageSize: 10,
          startDate: '',
          endDate: ''
        },
        listLoading: false,
        list: [],
        totalAmount: 0,
        totalCount: 0
      };
    },
    props: {},
    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.startDate = this.pickDate[0]
        this.listQuery.endDate = this.pickDate[1]
        getPosList(this.listQuery).then(response => {
          this.list = response.data.page.content
          this.total = response.data.page.totalElements
          this.totalAmount = response.data.totalAmount
          this.totalCount = response.data.totalCount
        }).finally(() => this.listLoading = false)
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '多页总计';
            return;
          }
          if (index + 2 === columns.length) {
            sums[index] = this.totalCount;
            return;
          }
          if (index + 1 === columns.length) {
            sums[index] = this.totalAmount;
            return;
          }
        });
        return sums;
      }
    }
  }
</script>
