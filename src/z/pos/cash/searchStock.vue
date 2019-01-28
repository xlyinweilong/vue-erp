<template>
  <div>
    <div class="filter-container">
      <el-select style="width: 150px;" v-model="listQuery.type" placeholder="查询类型" @change="getList">
        <el-option value="CHANNEL" label="渠道"/>
        <el-option value="WAREHOUSE" label="仓库"/>
      </el-select>
      <el-input :placeholder="listQuery.type == 'CHANNEL' ? '渠道编号' : '仓库编号'" v-model.trim="listQuery.code" style="width: 200px;" @keyup.enter.native="getList"/>
      <el-input placeholder="货号" v-model.trim="listQuery.goodsCode" style="width: 200px;" @keyup.enter.native="getList"/>
      <el-input placeholder="颜色编号" v-model.trim="listQuery.goodsColorCode" style="width: 100px;"  @keyup.enter.native="getList"/>
      <el-input placeholder="颜色名称" v-model.trim="listQuery.goodsColorName" style="width: 100px;"  @keyup.enter.native="getList"/>
      <el-input placeholder="尺码" v-model.trim="listQuery.goodsSizeName" style="width: 100px;"  @keyup.enter.native="getList"/>
      <el-button :loading="listLoading" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="stockList"
      tooltip-effect="dark"
      style="width: 100%"
      border
    >
      <el-table-column label="仓库编号" align="center" v-if="listQuery.type == 'WAREHOUSE'">
        <template slot-scope="scope">
          <span>{{ scope.row.warehouseCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库名称" align="center" v-if="listQuery.type == 'WAREHOUSE'">
        <template slot-scope="scope">
          <span>{{ scope.row.warehouseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺编号" align="center" v-if="listQuery.type == 'CHANNEL'">
        <template slot-scope="scope">
          <span>{{ scope.row.channelCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺名称" align="center" v-if="listQuery.type == 'CHANNEL'">
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
      <el-table-column label="库存数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stockCount }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>
  </div>
</template>

<script>
  import {stockList as channelStockList} from '@/api/stock/channelStock'
  import {stockList as warehouseStockList} from '@/api/stock/warehouseStock'
  import Pagination from '@/components/Pagination'

  export default {
    computed: {},
    components: {
      Pagination,
    },
    data() {
      return {
        total: 0,
        listQuery: {
          type: 'CHANNEL',
          code: '',
          channelCode: '',
          warehouseCode: '',
          goodsCode: '',
          goodsColorCode: '',
          goodsColorName: '',
          goodsSizeName: '',
          pageIndex: 1,
          pageSize: 10
        },
        listLoading: false,
        stockList: []
      };
    },
    props: {},
    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.warehouseCode = this.listQuery.channelCode = this.listQuery.code
        let fun = (this.listQuery.type == 'CHANNEL' ? channelStockList : warehouseStockList)
        fun(this.listQuery).then(response => {
          this.stockList = response.data.content
          this.total = response.data.totalElements
        }).finally(() => this.listLoading = false)
      }
    }
  }
</script>
