<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="关键词" v-model.trim="listQuery.searchKey" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
      <el-tooltip class="item" effect="dark" :content="showSearchMore ? '收起更多查询条件':'展开更多查询条件'" placement="top">
        <el-button :loading="listLoading" class="filter-item" :icon="showSearchMore ? 'el-icon-caret-top':'el-icon-caret-bottom'" type="info" @click="showSearchMore = !showSearchMore" circle plain></el-button>
      </el-tooltip>
    </div>
    <transition name="el-zoom-in-top">
      <div class="filter-container" v-show="showSearchMore">
        <el-input placeholder="货号" v-model.trim="listQuery.code" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="名称" v-model.trim="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="尺码组" v-model.trim="listQuery.sizeGroupName" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="品牌" v-model.trim="listQuery.brandName" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="类别" v-model.trim="listQuery.categoryName" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="二级类别" v-model.trim="listQuery.category2Name" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="系列" v-model.trim="listQuery.seriesName" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="款型" v-model.trim="listQuery.patternName" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="风格" v-model.trim="listQuery.styleName" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="季节" v-model.trim="listQuery.seasonName" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="年份" v-model.trim="listQuery.yearName" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="性别" v-model.trim="listQuery.sexName" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="供应商编号" v-model.trim="listQuery.supplierCode" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
        <el-input placeholder="供应商名称" v-model.trim="listQuery.supplierName" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      </div>
    </transition>
    <div class="filter-container">
      <el-button v-permission="'info_goods_add'" class="filter-item" type="primary" icon="el-icon-plus" :disabled="listLoading" @click="$router.push({ path: '/info/goods_create'})">新增</el-button>
      <el-button v-permission="'info_goods_edit'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="listLoading || selectedIds.length != 1" @click="updateElement">修改</el-button>
      <el-button v-permission="'info_goods_delete'" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteElement" :disabled="listLoading || selectedIds.length == 0">删除</el-button>
      <el-button v-permission="'info_goods_import'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-upload2" @click="importDialogVisible = true" :disabled="listLoading">导入</el-button>
      <el-button v-permission="'info_goods_export'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-download" @click="exportDialogVisible = true" :disabled="listLoading || total ==  0">导出</el-button>
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
      <el-table-column label="货号" align="center" width="200%">
        <template slot-scope="scope">
          <router-link :to="'/info/goods_detail/'+scope.row.id" class="link-type">
            {{ scope.row.code }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="尺码组" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sizeGroupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.brandName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="二级类别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.category2Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系列" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.seriesName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="款型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.patternName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="风格" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.seriesName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="季节" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.seasonName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年份" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.yearName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sexName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplierName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="吊牌价" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tagPrice1 }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>

    <el-dialog title="导出" :visible.sync="exportDialogVisible" width="35%">
      <el-form>
        <el-form-item label="导出类型">
          <el-select v-model="exportDialogType" placeholder="请选择">
            <el-option value="BASE" label="基本数据"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exportDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="exportElement()">导出</el-button>
      </div>
    </el-dialog>

    <commonUpload :show.sync="importDialogVisible" :downloadTemplateUrl="'/static/download/goods/goods.xlsx'" :importAction="importAction" :typeKey="'goods'" @get-list="getList"/>
  </div>
</template>

<script>
  import animate from 'animate.css'
  import {getList, deleteEle, uploadStatus} from '@/api/info/goods'
  import {getToken} from '@/utils/auth'
  import Pagination from '@/components/Pagination'
  import {param, urlEncode} from '@/utils'
  import permission from '@/directive/permission/index.js'
  import commonUpload from '@/z/common/upload/commonUpload'

  export default {
    name: 'goods',
    components: {Pagination,commonUpload},
    directives: { permission },
    filters: {},
    data() {
      return {
        showSearchMore: false,
        //列表相关
        listQuery: {
          pageIndex: 1,
          pageSize: 10,
          code: '',
          name: '',
          brandName: '',
          categoryName: '',
          category2Name: '',
          seriesName: '',
          patternName: '',
          styleName: '',
          seasonName: '',
          yearName: '',
          sexName: '',
          supplierCode: '',
          supplierName: ''
        },
        selectedIds: [],
        list: null,
        total: 0,
        listLoading: false,
        //导出
        exportDialogVisible: false,
        exportDialogType: 'BASE',
        //导入
        importDialogVisible: false,
        importAction: process.env.BASE_API + '/api/info/goods/upload_goods'
      }
    },
    created() {
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
      },
      //删除
      deleteElement() {
        this.$confirm('确定要删除选中的数据吗?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          deleteEle({ids: this.selectedIds.map(s => s.id)}).then(response => {
            this.dialogFormVisible = false
            this.$message({message: response.message, type: 'success'})
            this.getList()
          })
        })
      },
      //修改
      updateElement() {
        let id = this.selectedIds[0].id
        this.$router.push({path: '/info/goods_update/' + id})
      },
      //导出
      exportElement() {
        window.open(process.env.BASE_API + "/api/info/goods/export?token=" + getToken() + urlEncode({type: this.exportDialogType}))
      }
    }
  }
</script>

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

  /*.router-slid-enter-active, .router-slid-leave-active {*/
  /*transition: all .2s;*/
  /*}*/

  /*.router-slid-enter, .router-slid-leave-active {*/
  /*transform: translate3d(0, -1rem, 0);*/
  /*opacity: 0;*/
  /*}*/
</style>
