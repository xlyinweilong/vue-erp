<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker style="width: 200px;" class="filter-item" v-model="listQuery.startBillDate" type="date" placeholder="单据开始时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker style="width: 200px;" class="filter-item" v-model="listQuery.endBillDate" type="date" placeholder="单据结束时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
      <el-select style="width: 200px;" class="filter-item" v-model="listQuery.statusList" placeholder="单据状态" clearable multiple>
        <el-option value="DRAFT" label="草稿"/>
        <el-option value="PENDING" label="待审核"/>
        <el-option value="AUDITED" label="通过审核"/>
        <el-option value="AUDIT_FAILURE" label="审核失败"/>
        <el-option value="QUOTE" label="被引用"/>
        <el-option value="COMPLETE" label="完成"/>
      </el-select>
      <el-input placeholder="关键词" v-model.trim="listQuery.searchKey" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
      <el-tooltip class="item" effect="dark" :content="showSearchMore ? '收起更多查询条件':'展开更多查询条件'" placement="top">
        <el-button :loading="listLoading" class="filter-item" :icon="showSearchMore ? 'el-icon-caret-top':'el-icon-caret-bottom'" type="info" @click="showSearchMore = !showSearchMore" circle plain></el-button>
      </el-tooltip>
    </div>
    <transition name="el-zoom-in-top">
      <div class="filter-container" v-show="showSearchMore">
        <el-input placeholder="单据编号" v-model.trim="listQuery.code" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="订货单号" v-model.trim="listQuery.grandParentBillCode" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="配货单号" v-model.trim="listQuery.parentBillCode" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="仓库编号" v-model.trim="listQuery.warehouseCode" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="渠道编号" v-model.trim="listQuery.channelCode" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="创建人" v-model.trim="listQuery.createUserName" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="审核人" v-model.trim="listQuery.auditUserName" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      </div>
    </transition>
    <div class="filter-container">
      <add-button v-permission="'bill_warehouse_ckch_add'" :list-loading.sync="listLoading" bill-type="warehouse2channel" parent-type="warehouse"/>
      <edit-button v-permission="'bill_warehouse_ckch_edit'" :list-loading.sync="listLoading" bill-type="warehouse2channel" :selected-ids="selectedIds" parent-type="warehouse"/>
      <el-button v-permission="'bill_warehouse_ckch_audit'" class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-goods" @click="auditDialogVisible = true" :disabled="listLoading || selectedIds.length == 0 || selectedIds.filter(r => r.status != 'PENDING').length > 0">审核</el-button>
      <el-button v-permission="'bill_warehouse_ckch_unaudit'" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-sold-out" @click="unAuditDialogVisible = true" :disabled="listLoading || selectedIds.length == 0 || selectedIds.filter(r => r.status != 'AUDITED').length > 0">反审核</el-button>
      <delete-button v-permission="'bill_warehouse_ckch_delete'" :list-loading.sync="listLoading" bill-type="warehouse2channel" :selected-ids="selectedIds" @get-list="getList"/>
      <el-button v-permission="'bill_warehouse_ckch_import'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-upload2" @click="importDialogVisible = true" :disabled="listLoading">导入</el-button>
      <el-button v-permission="'bill_warehouse_ckch_export'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-download" @click="exportDialogVisible = true" :disabled="listLoading || total ==  0">导出</el-button>
      <el-button v-permission="'bill_warehouse_ckch_print'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-printer" @click="printDialogVisible = true" :disabled="listLoading || selectedIds.length !=  1">打印</el-button>
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
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('bill_code') > -1" label="单据编号" align="center" width="300%">
        <template slot-scope="scope">
          <router-link :to="'/bill/warehouse/warehouse2channel_detail/'+scope.row.id" class="link-type">
            {{ scope.row.code }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('bill_date') > -1" label="单据时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.billDate }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.indexOf('create_date') > -1" label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.indexOf('update_date') > -1" label="更新时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('grand_parent_code') > -1" label="订货单号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.grandParentBillCode }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('parent_code') > -1" label="配货单号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parentBillCode }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('warehouse_code') > -1" label="仓库编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.warehouseCode }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('warehouse_name') > -1" label="仓库名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.warehouseName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('channel_code') > -1" label="渠道编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelCode }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('channel_name') > -1" label="渠道名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('total_count') > -1" label="总数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalCount }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('total_amount') > -1" label="总金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('total_tag_amount') > -1" label="总吊牌额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalTagAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('create_user_name') > -1" label="创建人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('audit_user_name') > -1" label="审核人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('status') > -1" label="状态" align="center">
        <template slot-scope="scope">
          <span><el-tag :type="getStatusTag(scope.row.status)">{{ scope.row.statusMean }}</el-tag></span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>

    <audit-dialog :show.sync="auditDialogVisible" bill-type="warehouse2channel" :selected-ids="selectedIds" @get-list="getList"/>

    <un-audit-dialog :show.sync="unAuditDialogVisible" bill-type="warehouse2channel" :selected-ids="selectedIds" @get-list="getList"/>

    <export-dialog :show.sync="exportDialogVisible" bill-type="warehouse2channel"/>

    <import-dialog :show.sync="importDialogVisible" bill-type="warehouse2channel" bill-key="w2c" @get-list="getList"/>

    <print-dialog :show.sync="printDialogVisible" :selected-ids="selectedIds" bill-type="warehouse2Channel"/>

  </div>
</template>

<script>
  import {getList} from '@/api/bill/warehouse2channel'
  import Pagination from '@/components/Pagination'
  import auditDialog from '@/z/bill/components/auditDialog'
  import unAuditDialog from '@/z/bill/components/unAuditDialog'
  import exportDialog from '@/z/bill/components/exportDialog'
  import importDialog from '@/z/bill/components/importDialog'
  import deleteButton from '@/z/bill/components/deleteButton'
  import editButton from '@/z/bill/components/editButton'
  import addButton from '@/z/bill/components/addButton'
  import permission from '@/directive/permission/index.js'
  import {getList as getDiy} from '@/api/user/diy'
  import printDialog from '@/z/bill/components/printDialog'

  export default {
    name: 'warehouse2channel',
    components: {
      Pagination, auditDialog, unAuditDialog, exportDialog, importDialog, deleteButton, editButton, addButton,printDialog
    },
    directives: { permission },
    filters: {},
    data() {
      return {
        showSearchMore: false,
        //列表相关
        listQuery: {
          pageIndex: 1,
          pageSize: 10,
          startBillDate: '',
          endBillDate: '',
          statusList: [],
          code: '',
          createUserName: '',
          auditUserName: '',
          channelCode: '',
          warehouseCode: ''
        },
        selectedIds: [],
        list: null,
        total: 0,
        listLoading: false,
        //审核
        auditDialogVisible: false,
        //反审核
        unAuditDialogVisible: false,
        //导出
        exportDialogVisible: false,
        //导入
        importDialogVisible: false,
        //打印
        printDialogVisible: false,
        //偏好
        diyValues: []
      }
    },
    created() {
      getDiy({type: 'BILL_LIST'}).then(response => this.diyValues = response.data)
      this.getList()
    },
    methods: {
      getStatusTag(status) {
        switch (status) {
          case 'DRAFT':
            return 'info'
          case 'AUDIT_FAILURE':
            return 'danger'
          case 'AUDITED':
          case 'COMPLETE':
          case 'QUOTE':
            return 'success'
        }
        return '';
      },
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

<style scoped>

</style>
