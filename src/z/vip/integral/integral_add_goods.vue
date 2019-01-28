<template>
  <div class="app-container">
    <!--<div class="filter-container">-->
      <!--<el-input placeholder="关键词" v-model.trim="listQuery.searchKey" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>-->
      <!--<el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="getList">查询</el-button>-->
    <!--</div>-->
    <div class="filter-container">
      <!--<el-select class="filter-item" v-model="temp.type" placeholder="请选择">-->
        <!--<el-option label="货号" :value="0"/>-->
        <!--<el-option label="范围" :value="1"/>-->
      <!--</el-select>-->
      <el-button v-permission="'user_user_add'" class="filter-item" type="primary" icon="el-icon-plus" @click="createElement" :disabled="listLoading || temp.type == 0">新增</el-button>
      <el-button v-permission="'user_user_edit'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="updateElement" :disabled="listLoading || selectedIds.length != 1 || temp.type == 0">修改</el-button>
      <el-button v-permission="'user_user_delete'" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteElement" :disabled="listLoading || selectedIds.length == 0">删除</el-button>
      <!--<el-button v-permission="'bill_channel_qddr_import'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-upload2" @click="importDialogVisible = true" :disabled="temp.type == 1 || listLoading">导入货号</el-button>-->
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
      <el-table-column label="货品品牌" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.goodsBrandName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="货品品类" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.goodsCategoryName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="货品年份" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsYearName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货品季节" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsSeasonName }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>


    <el-dialog :title="dialogStatus==='create' ? '新增' : (temp.id == null ? '加载中...':'修改')" :visible.sync="dialogFormVisible">
      <el-form ref="vipIntegralRuleGoodsForm" :rules="rules" :model="temp" v-loading="saving || (dialogStatus !='create' && temp.id == null)">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="货品品牌" prop="goodsBrandId">
              <commonDictSelect ref="goodsBrand" style="width: 100%" type1="GOODS" type2="BRAND" :eleId.sync="temp.goodsBrandId" :eleName.sync="temp.goodsBrandName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货品品类" prop="goodsCategoryId">
              <commonDictSelect style="width: 100%" type1="GOODS" type2="CATEGORY" :eleId.sync="temp.goodsCategoryId" :eleName.sync="temp.goodsCategoryName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="货品年份" prop="goodsYearId">
              <commonDictSelect style="width: 100%" type1="GOODS" type2="YEAR" :eleId.sync="temp.goodsYearId"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货品季节" prop="goodsSeasonId">
              <commonDictSelect style="width: 100%" type1="GOODS" type2="SEASON" :eleId.sync="temp.goodsSeasonId"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="saveData" :loading="saving || (dialogStatus !='create' && temp.id == null)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getGoodsList, saveGoods, deleteGoods} from '@/api/vip/vipIntegralUpRule'
  import Pagination from '@/components/Pagination'
  import permission from '@/directive/permission/index.js'
  import commonDictSelect from '@/z/common/select/commonDictSelect'

  export default {
    name: 'vip_info',
    components: {
      Pagination, commonDictSelect
    },
    directives: {permission},
    filters: {},
    data() {
      return {
        //列表相关
        listQuery: {
          pageIndex: 1,
          pageSize: 10,
          searchKey: '',
          getVipIntegralUpRuleId: ''
        },
        rules: {},
        selectedIds: [],
        list: null,
        total: 0,
        listLoading: false,
        temp: {
          id: '',
          type: 1
        },
        dialogStatus: '',
        dialogFormVisible: false,
        saving: false
      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      this.listQuery.vipIntegralUpRuleId = id
      this.getList()
    },
    methods: {
      //获取列表
      getList() {
        this.listLoading = true
        getGoodsList(this.listQuery).then(response => {
          this.selectedIds = []
          this.list = response.data.content
          this.total = response.data.totalElements
        }).finally(() => this.listLoading = false)
      },
      //选择
      selectionChange(val) {
        this.selectedIds = val
      },
      //弹出框新增
      createElement() {
        this.temp = {id: '', vipIntegralUpRuleId: this.listQuery.vipIntegralUpRuleId, goodsBrandId: '', goodsBrandName: '', goodsCategoryId: '', goodsCategoryName: '', goodsYearId: '', goodsYearName: '', goodsSeasonId: '', goodsSeasonName: ''}
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['vipIntegralRuleGoodsForm'].clearValidate()
        })
        // setTimeout(() => this.$refs.goodsBrand.$el.querySelector('input').focus(), 200)
      },
      //弹出框修改
      updateElement() {
        this.createElement()
        this.dialogStatus = 'update'
        this.temp = this.list.find(r => r.id === this.selectedIds[0].id)
      },
      saveData() {
        this.$refs['vipIntegralRuleGoodsForm'].validate((valid) => {
          if (valid) {
            this.saving = true
            saveGoods(this.temp).then(response => {
              this.dialogFormVisible = false
              this.$message({message: response.message, type: 'success'});
              this.getList()
            }).finally(() => this.saving = false)
          }
        })
      },
      //删除
      deleteElement() {
        this.$confirm('确定要删除选中的数据吗?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          deleteGoods({ids: this.selectedIds.map(s => s.id)}).then(response => {
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
