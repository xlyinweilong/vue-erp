<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="输入条形码" v-model.trim="listQuery.code" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-input placeholder="输入货号" v-model.trim="listQuery.goodsCode" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
    </div>
    <div class="filter-container">
      <el-button v-permission="'info_barcode_add'" class="filter-item" type="primary" icon="el-icon-plus" :disabled="listLoading" @click="$router.push({ path: '/info/barCode_create'})">新增</el-button>
      <el-button v-permission="'info_barcode_edit'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="listLoading || selectedIds.length != 1" @click="updateElement">修改</el-button>
      <el-button v-permission="'info_barcode_delete'" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteElement" :disabled="listLoading || selectedIds.length == 0">删除</el-button>
      <el-button v-permission="'info_barcode_import'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-upload2" @click="importDialogVisible=true" :disabled="listLoading">导入</el-button>
      <!--<el-button v-permission="'info_barcode_export'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-download" @click="getList" :disabled="listLoading || total ==  0">导出</el-button>-->
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
      <el-table-column label="条形码" align="center">
        <template slot-scope="scope">
          <router-link :to="'/info/barCode_detail/'+scope.row.id" class="link-type">
            {{ scope.row.code }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="货号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货品名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsName }}</span>
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
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>

    <commonUpload :show.sync="importDialogVisible" :downloadTemplateUrl="'/static/download/barCode/barCode.xlsx'" :importAction="importAction" :typeKey="'barcode'" @get-list="getList"/>
  </div>
</template>

<script>
  import {getList, deleteEle} from '@/api/info/barCode'
  import Pagination from '@/components/Pagination'
  import permission from '@/directive/permission/index.js'
  import commonUpload from '@/z/common/upload/commonUpload'

  export default {
    name: 'barCode',
    components: {Pagination, commonUpload},
    directives: {permission},
    filters: {},
    data() {
      return {
        //列表相关
        listQuery: {
          pageIndex: 1,
          pageSize: 10,
          code: '',
          goodsCode: ''
        },
        selectedIds: [],
        list: null,
        total: 0,
        listLoading: true,
        importDialogVisible: false,
        importAction: process.env.BASE_API + '/api/info/barCode/upload',
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
        this.$router.push({path: '/info/barCode_update/' + id});
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
