<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="关键词" v-model.trim="listQuery.searchKey" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
    </div>
    <div class="filter-container">
      <el-button v-permission="'user_user_add'" class="filter-item" type="primary" icon="el-icon-plus" @click="createElement" :disabled="listLoading">新增</el-button>
      <el-button v-permission="'user_user_edit'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="updateElement" :disabled="listLoading || selectedIds.length != 1">修改</el-button>
      <el-button v-permission="'user_user_delete'" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteElement" :disabled="listLoading || selectedIds.length == 0">删除</el-button>
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
      <el-table-column label="用户名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>

    <el-dialog :title="dialogStatus==='create' ? '新增' : (temp.id == null ? '加载中...':'修改')" :visible.sync="dialogFormVisible">
      <el-form ref="userForm" :rules="rules" :model="temp" v-loading="saving || (dialogStatus !='create' && temp.id == null)">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="temp.name" @keyup.enter.native="saveData"/>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model.trim="temp.account" @keyup.enter.native="saveData"/>
        </el-form-item>
        <el-form-item label="密码" prop="passwd">
          <el-input type="password" v-model.trim="temp.passwd" @keyup.enter.native="saveData"/>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="temp.roleId" filterable clearable remote default-first-option placeholder="请输入角色名称" :loading="loadingOptionRoleList" style="width: 100%" :remote-method="searchRoleOption">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <el-option v-for="item in optionRoleList" :value="item.id" :label="item.name"/>
          </el-select>
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
  import {getList, save as saveRole, deleteEle} from '@/api/user/user'
  import {getList as searchRole} from '@/api/user/role'
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
          searchKey: '',
          pageIndex: 1,
          pageSize: 10,
          name: '',
          account: '',
          passwd: ''
        },
        selectedIds: [],
        list: [],
        total: 0,
        listLoading: false,
        //新增修改
        saving: false,
        dialogFormVisible: false,
        dialogStatus: '',
        temp: {id: '', name: '', passwd: '', account: '', roleId: ''},
        rules: {
          name: [{required: true, message: '必填字段', trigger: 'blur'}],
          account: [{required: true, message: '必填字段', trigger: 'blur'}],
          passwd: [{required: true, message: '必填字段', trigger: 'blur'}],
          roleId: [{required: true, message: '必填字段', trigger: 'blur'}],
        },
        //查询角色
        optionRoleList: [],
        loadingOptionRoleList: false

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
        this.temp = {id: '', name: '', passwd: '', account: '', roleId: ''}
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['userForm'].clearValidate()
        })
        this.searchRoleOption(' ')
      },
      //弹出框修改
      updateElement() {
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
        this.temp = this.list.find(r => r.id === this.selectedIds[0].id)
        this.optionRoleList = [];
        this.optionRoleList.push({id: this.temp.roleId, name: this.temp.roleName})
        this.$nextTick(() => {
          this.$refs['userForm'].clearValidate()
        })
      },
      //保存数据
      saveData() {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            this.saving = true
            saveRole(this.temp).then(response => {
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
          deleteEle({ids: this.selectedIds.map(s => s.id)}).then(response => {
            this.$message({message: response.message, type: 'success'});
            this.getList()
          })
        })
      },
      //查询角色
      searchRoleOption(query) {
        if (query !== '') {
          this.loadingOptionRoleList = true
          searchRole({pageIndex: 1, pageSize: 10, name: query}).then(response => {
            this.optionRoleList = response.data.content
          }).finally(() => this.loadingOptionRoleList = false)
        }
      }
    }
  }
</script>

<style scoped>

</style>
