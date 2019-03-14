<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="输入编号" v-model.trim="listQuery.code" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-input placeholder="输入名称" v-model.trim="listQuery.goodsCode" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
    </div>
    <div class="filter-container">
      <el-button v-permission="'info_market_point_add'" class="filter-item" type="primary" icon="el-icon-plus" :disabled="listLoading" @click="createElement">新增</el-button>
      <el-button v-permission="'info_market_point_edit'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="listLoading || selectedIds.length != 1" @click="updateElement">修改</el-button>
      <el-button v-permission="'info_market_point_delete'" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteElement" :disabled="listLoading || selectedIds.length == 0">删除</el-button>
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
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扣点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.point }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>

    <el-dialog :title="dialogStatus==='create' ? '新增' : (temp.id == null ? '加载中...':'修改')" :visible.sync="dialogFormVisible">
      <el-form ref="marketPointForm" :rules="rules" :model="temp" v-loading="saving || (dialogStatus !='create' && temp.id == null)">
        <el-form-item label="编号" prop="code">
          <el-input ref="marketPointCode" v-model.trim="temp.code" @keyup.enter.native="saveData"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="temp.name" @keyup.enter.native="saveData"/>
        </el-form-item>
        <el-form-item label="扣点" prop="point">
          <el-input-number style="width: 100%" v-model="temp.point" :precision="4" :step="0.01" :max="1" :min="0" @keyup.enter.native="saveData"/>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model.trim="temp.remarks"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="saveData" :loading="saving || (dialogStatus !='create' && temp.id == null)">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {getList, deleteEle, save} from '@/api/info/marketPoint'
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
        rules: {
          code: [{required: true, message: '必填字段', trigger: 'blur'}],
          name: [{required: true, message: '必填字段', trigger: 'blur'}],
          point: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
        selectedIds: [],
        list: null,
        total: 0,
        listLoading: true,
        temp: {},
        dialogStatus: '',
        dialogFormVisible: false,
        saving: false
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
            this.$message({message: response.message, type: 'success'});
            this.getList()
          })
        })
      },
      //弹出框新增
      createElement() {
        this.temp = {id: '', name: '', code: '', remarks: '', point: 0}
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => this.$refs['marketPointForm'].clearValidate())
        this.$nextTick(() => this.$refs.marketPointCode.focus())
      },
      //弹出框修改
      updateElement() {
        this.createElement()
        this.dialogStatus = 'update'
        this.temp = this.list.find(r => r.id === this.selectedIds[0].id)
      },
      //保存数据
      saveData() {
        this.$refs['marketPointForm'].validate((valid) => {
          if (valid) {
            this.saving = true
            save(this.temp).then(response => {
              this.dialogFormVisible = false
              this.$message({message: response.message, type: 'success'});
              this.getList()
            }).finally(() => this.saving = false)
          }
        })
      },
    }
  }
</script>


<style scoped>
</style>
