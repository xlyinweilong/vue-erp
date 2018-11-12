<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="输入编号" v-model.trim="listQuery.code" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-input placeholder="输入名称" v-model.trim="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
    </div>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" plain :disabled="listLoading" @click="$router.push({ path: '/info/supplier_create'})">新增</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" plain :disabled="listLoading || selectedIds.length != 1" @click="updateElement">修改</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteElement" plain :disabled="listLoading || selectedIds.length == 0">删除</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-download" @click="getList" plain :disabled="listLoading || total ==  0">导出</el-button>
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
      <el-table-column label="编号" align="center">
        <template slot-scope="scope">
          <router-link :to="'/info/supplier_detail/'+scope.row.id" class="link-type">
            {{ scope.row.code }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>
  </div>
</template>

<script>
  import {getList, deleteEle} from '@/api/info/supplier'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'supplier',
    components: {Pagination},
    filters: {},
    data() {
      return {
        //列表相关
        listQuery: {
          pageIndex: 1,
          pageSize: 10,
          code: '',
          name: ''
        },
        selectedIds: [],
        list: null,
        total: 0,
        listLoading: true,
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
          this.listLoading = false
        })
      },
      //选择
      selectionChange(val) {
        this.selectedIds = val
      },
      //删除
      deleteElement() {
        this.$confirm('确定要删除选中的数据吗?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          deleteEle({ids: this.selectedIds.map(s => s.id)}).then(response => {
            this.dialogFormVisible = false
            this.$message({message: response.message, type: 'success'});
            this.getList()
          })
        })
      },
      //修改
      updateElement() {
        let id = this.selectedIds[0].id
        this.$router.push({path: '/info/supplier_update/' + id});
      }
    }
  }
</script>

<style>
  .sortable-ghost {
    opacity: .8;
    color: #fff !important;
    background: #42b983 !important;
  }
</style>

<style scoped>
  .icon-star {
    margin-right: 2px;
  }

  .drag-handler {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .show-d {
    margin-top: 15px;
  }
</style>
