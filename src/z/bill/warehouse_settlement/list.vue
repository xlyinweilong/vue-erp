<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="关键词" v-model.trim="listQuery.searchKey" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
    </div>
    <div class="filter-container">
      <el-button v-permission="'bill_warehouse_settlement_delete'" type="danger" :disabled="selectedIds.length == 0" @click="deleteDialogVisible = true">删除</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="selectionChange"
      highlight-current-row
      fit
      border
    >
      <el-table-column type="selection" width="35"/>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('bill_code') > -1" label="结存编号" align="center" width="300%">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('bill_Date') > -1" label="结存时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.billDate }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.indexOf('create_date') > -1" label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('warehouse_cde') > -1" label="仓库编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.warehouseCode }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('warehouse_name') > -1" label="仓库名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.warehouseName }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>

    <deleteSettlementDialog :selected-ids="selectedIds" :show.sync="deleteDialogVisible" @get-list="getList"/>
  </div>
</template>

<script>
  import {getList} from '@/api/bill/settlement'
  import Pagination from '@/components/Pagination'
  import deleteSettlementDialog from '@/z/bill/components/deleteSettlementDialog'
  import permission from '@/directive/permission/index.js'
  import {getList as getDiy} from '@/api/user/diy'

  export default {
    name: 'warehouse_settlement',
    components: {
      Pagination, deleteSettlementDialog
    },
    directives: {permission},
    filters: {},
    data() {
      return {
        showSearchMore: false,
        //列表相关
        listQuery: {
          type: 'WAREHOUSE',
          pageIndex: 1,
          pageSize: 10,
        },
        selectedIds: [],
        list: null,
        total: 0,
        listLoading: false,
        //删除
        deleteDialogVisible: false,
        //偏好
        diyValues: []
      }
    },
    created() {
      getDiy({type: 'BILL_LIST'}).then(response => this.diyValues = response.data)
      this.getList()
    },
    methods: {
      //获取列表
      getList() {
        if (!this.listLoading) {
          this.listLoading = true
          getList(this.listQuery).then(response => {
            this.selectedIds = []
            this.list = response.data.content
            this.total = response.data.totalElements
            this.listLoading = false
          })
        }
      },
      //选择
      selectionChange(val) {
        this.selectedIds = val
      }
    }
  }
</script>

