<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="会员编号" v-model.trim="listQuery.searchKey" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      fit
      border
    >
      <el-table-column label="会员编号" align="center">
        <template slot-scope="scope">
          {{ scope.row.vipCode }}
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center">
        <template slot-scope="scope" :formatter="dateFormat">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.balance }}
        </template>
      </el-table-column>
      <el-table-column label="原因" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>

  </div>
</template>

<script>
  import {getList} from '@/api/vip/vipBalanceLog'
  import Pagination from '@/components/Pagination'
  import permission from '@/directive/permission/index.js'

  export default {
    name: 'vip_balance_log',
    components: {
      Pagination
    },
    directives: {permission},
    filters: {},
    data() {
      return {
        //列表相关
        listQuery: {
          pageIndex: 1,
          pageSize: 10,
          searchKey: ''
        },
        list: null,
        total: 0,
        listLoading: false
      }
    },
    created() {
      this.listLoading = true
      this.getList()
    },
    methods: {
      //获取列表
      getList() {
        this.listLoading = true
        getList(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
        }).finally(() => this.listLoading = false)
      }
    }
  }
</script>

<style scoped>
</style>
