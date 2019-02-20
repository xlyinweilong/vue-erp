<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="getList" placeholder="活动编号或名称" v-model.trim="listQuery.searchKey" style="width: 200px;" class="filter-item"/>
      <el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
    </div>
    <div class="filter-container">
      <el-button v-permission="'user_user_add'" class="filter-item" type="primary" icon="el-icon-plus" :disabled="listLoading" @click="$router.push({ path: '/activity/activity_create/'})">新增</el-button>
      <el-button v-permission="'user_user_edit'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="$router.push({ path: '/activity/activity_update/' + selectedIds[0].id})" :disabled="listLoading || selectedIds.length != 1">修改</el-button>
      <el-button v-permission="'user_user_delete'" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteElement" :disabled="listLoading || selectedIds.length == 0 || selectedIds.some(r => r.indexDepth != null)">删除</el-button>
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
      <el-table-column label="活动编号" align="center">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="活动名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.startDate }}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.endDate }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 'PENDING'" type="info">未审核</el-tag>
          <el-tag v-if="scope.row.status == 'AUDITED'" type="success">已审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="活动类型" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 'PRICE_PROMOTION'">零售价促销</el-tag>
          <el-tag v-if="scope.row.type == 'BUY_DISCOUNT'">买满打折</el-tag>
          <el-tag v-if="scope.row.type == 'BUY_PLUS'">买满立减</el-tag>
          <el-tag v-if="scope.row.type == 'BUY_GIVE'">买满赠送</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行星期" align="center">
        <template slot-scope="scope">
          {{scope.row.executeWeek}}
        </template>
      </el-table-column>
      <el-table-column label="商场扣点" align="center">
        <template slot-scope="scope">
          {{scope.row.points}}
        </template>
      </el-table-column>
      <el-table-column label="优先级别" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.priority < 3" type="info">{{scope.row.priority}}</el-tag>
          <el-tag v-if="scope.row.priority >= 3 && scope.row.priority <= 6">{{scope.row.priority}}</el-tag>
          <el-tag v-if="scope.row.priority > 6" type="success">{{scope.row.priority}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>
  </div>
</template>

<script>
  import {getList, save, deleteEle} from '@/api/activity/activity'
  import permission from '@/directive/permission/index.js'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'activity_list',
    components: {Pagination},
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
        selectedIds: [],
        list: [],
        listLoading: false,
        total:0
      }
    },
    created() {
      this.getList()
    },
    methods: {
      //获取列表
      getList() {
        this.listLoading = true
        getList(this.listQuery).then(response => {
          this.selectedIds = []
          this.list = response.data.content
          this.total = response.data.totalElements
        }).finally(() => this.listLoading = false)
      },
      //选择
      selectionChange(val) {
        this.selectedIds = val
      },
      //删除
      deleteElement() {
        this.$confirm('确定要删除选中的数据吗?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          deleteEle({ids: this.selectedIds.map(s => s.id)}).then(response => {
            this.$message({message: response.message, type: 'success'});
            this.getList()
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
