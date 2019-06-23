<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="角色名称" v-model.trim="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
    </div>
    <div class="filter-container">
      <el-button v-permission="'user_role_add'" class="filter-item" type="primary" icon="el-icon-plus" @click="createElement" :disabled="listLoading">新增</el-button>
      <el-button v-permission="'user_role_edit'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="updateElement" :disabled="listLoading || selectedIds.length != 1">修改</el-button>
      <el-button v-permission="'user_role_delete'" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteElement" :disabled="listLoading || selectedIds.length == 0">删除</el-button>
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
      <el-table-column label="角色名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button  v-permission="'user_role_power'" plain class="filter-item" type="primary" icon="el-icon-setting" @click="$router.push({ path: '/user/role_power/' + scope.row.id})">权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>

    <el-dialog :title="dialogStatus==='create' ? '新增' : (temp.id == null ? '加载中...':'修改')" :visible.sync="dialogFormVisible">
      <el-form ref="roleForm" :rules="rules" :model="temp" auto-complete="off" v-loading="saving || (dialogStatus !='create' && temp.id == null)">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="temp.name" @keyup.enter.native="saveData"/>
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
  import {getList, save as saveRole, deleteEle} from '@/api/user/role'
  import Pagination from '@/components/Pagination'
  import permission from '@/directive/permission/index.js'

  export default {
    name: 'role',
    components: {Pagination},
    directives: { permission },
    filters: {},
    data() {
      return {
        //列表相关
        listQuery: {
          pageIndex: 1,
          pageSize: 10,
          name: ''
        },
        selectedIds: [],
        list: [],
        total: 0,
        listLoading: false,
        //新增修改
        saving: false,
        dialogFormVisible: false,
        dialogStatus: '',
        temp: {id: '', name: ''},
        rules: {
          name: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
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
      //弹出框新增
      createElement() {
        this.temp = {id: '', name: ''}
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['roleForm'].clearValidate()
        })
      },
      //弹出框修改
      updateElement() {
        this.createElement()
        this.dialogStatus = 'update'
        this.temp = this.list.find(r => r.id == this.selectedIds[0].id)
      },
      //保存数据
      saveData() {
        this.$refs['roleForm'].validate((valid) => {
          if (valid) {
            this.saving = true
            saveRole(this.temp).then(response => {
              this.dialogFormVisible = false
              this.$message({message: response.message, type: 'success'})
              this.getList()
            }).finally(() => this.saving = false)
          }
        })
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
