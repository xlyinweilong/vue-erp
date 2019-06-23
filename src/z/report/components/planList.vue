<template>
  <div class="app-container" v-loading="loading">
    <div class="filter-container">
      <el-select style="width: 200px;" class="filter-item" v-model="listQuery.plan" placeholder="选择方案" clearable>
        <el-option v-for="plan in planList" :value="plan.id" :label="plan.name"/>
      </el-select>
      <el-date-picker style="width: 150px;" class="filter-item" v-model="listQuery.startBillDate" type="date" placeholder="单据开始时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker style="width: 150px;" class="filter-item" v-model="listQuery.endBillDate" type="date" placeholder="单据结束时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker style="width: 150px;" class="filter-item" v-model="listQuery.startAuditDate" type="date" placeholder="审核开始时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker style="width: 150px;" class="filter-item" v-model="listQuery.endAuditDate" type="date" placeholder="审核结束时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker style="width: 150px;" class="filter-item" v-model="listQuery.startCreateDate" type="date" placeholder="录入开始时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
      <el-date-picker style="width: 150px;" class="filter-item" v-model="listQuery.endCreateDate" type="date" placeholder="录入结束时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
      <el-select style="width: 200px;" class="filter-item" v-model="listQuery.statusList" placeholder="单据状态" clearable multiple>
        <el-option value="DRAFT" label="草稿"/>
        <el-option value="PENDING" label="待审核"/>
        <el-option value="AUDITED" label="通过审核"/>
        <el-option value="AUDIT_FAILURE" label="审核失败"/>
        <el-option value="QUOTE" label="被引用"/>
        <el-option value="COMPLETE" label="完成"/>
      </el-select>
      <el-input placeholder="单号" v-model.trim="listQuery.billCode" style="width: 200px;" class="filter-item" @keyup.enter.native="getListInit"/>
      <el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="getListInit" :disabled="listQuery.plan == ''">查询</el-button>
      <el-button :loading="listLoading" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-download" @click="exportElement" :disabled="listQuery.plan == '' || total ==  0">导出</el-button>
      <el-button class="filter-item" type="primary" :disabled="listLoading" @click="planDialogVisible = true" plain>方案管理</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      v-if="!reloadTable"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      fit
      border
      @sort-change="sortChange"
    >
      <el-table-column v-for="(dict,index) in dictList" :label="dict.mainTitle + '-' + dict.title" align="center" sortable :prop="index + ''"/>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>

    <plan-dialog :show.sync="planDialogVisible" @getPlanList="getPlanList" :tableType="tableType" :reportDic="reportDic"/>
  </div>
</template>

<script>
  import {getList} from '@/api/bill/channel2channelOut'
  import Pagination from '@/components/Pagination'
  import permission from '@/directive/permission/index.js'
  import planDialog from '@/z/report/components/planDialog'
  import {getList as getPlanList} from '@/api/report/plan'
  import {search} from '@/api/report/bill'
  import {param, urlEncode} from '@/utils'
  import {getToken} from '@/utils/auth'

  export default {
    name: 'plan_list_report',
    components: {
      Pagination, planDialog
    },
    directives: {permission},
    filters: {},
    data() {
      return {
        loading: false,
        //列表相关
        listQuery: {
          pageIndex: 1,
          pageSize: 10,
          startBillDate: '',
          endBillDate: '',
          startAuditDate: '',
          endAuditDate: '',
          startCreateDate: '',
          endCreateDate: '',
          statusList: [],
          billCode: '',
          plan: '',
          orderBy: null,
          orderType: null
        },
        list: [],
        total: 0,
        listLoading: false,
        dictList: [],
        //方案
        schemeDialogVisible: false,
        planDialogVisible: false,
        planList: [],
        reloadTable: false,
      }
    },
    props: {
      tableType: {default: ''},
      reportDic:{default: {}}
    },
    created() {
      this.getPlanList()
    },
    methods: {
      getListInit() {
        this.reloadTable = true
        this.listQuery.orderBy = null
        this.listQuery.orderType = null
        this.getList()
      },
      //获取列表
      getList() {
        if (!this.listLoading) {
          this.listLoading = true
          search(this.listQuery).then(response => {
            this.dictList = response.data.dictList
            this.list = response.data.dataList
            this.total = response.data.total
          }).finally(() => {
            this.listLoading = false
            this.reloadTable = false
          })
        }
      },
      sortChange({column, prop, order}) {
        this.listQuery.orderBy = prop
        this.listQuery.orderType = order
        this.getList()
      },
      //获取方案
      getPlanList() {
        this.loading = true
        getPlanList({table: this.tableType}).then(response => {
          this.planList = response.data
          this.listQuery.plan = ''
        }).finally(() => this.loading = false)
      },
      //导出
      exportElement() {
        window.open(process.env.BASE_API + "/api/report/base/export?token=" + getToken() + urlEncode(this.listQuery))
      },
    }
  }
</script>

<style scoped>

</style>
