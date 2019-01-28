<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="changeInput" placeholder="关键词" v-model.trim="listQuery.searchKey" style="width: 200px;" class="filter-item"/>
      <el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="changeInput">查询</el-button>
    </div>
    <div class="filter-container">
      <el-button v-permission="'user_user_add'" class="filter-item" type="primary" icon="el-icon-plus" @click="createElement" :disabled="listLoading">新增</el-button>
      <el-button v-permission="'user_user_edit'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="updateElement" :disabled="listLoading || selectedIds.length != 1">修改</el-button>
      <el-button v-permission="'user_user_delete'" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteElement" :disabled="listLoading || selectedIds.length == 0 || selectedIds.some(r => r.indexDepth != null)">删除</el-button>
      <el-button v-permission="'user_user_delete'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-setting" @click="$router.push({ path: '/vip/grade/set_grade'})" :disabled="listLoading || list.length == 0">设置级别</el-button>
      <el-button v-permission="'user_user_delete'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-sort-up" @click="$router.push({ path: '/vip/grade/set_up_grade'})" :disabled="listLoading || list.every(r => r.indexDepth == null)">升级规则</el-button>
      <!--<el-button v-permission="'user_user_delete'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-sort-down" @click="$router.push({ path: '/vip/grade/set_down_grade'})" :disabled="listLoading || list.every(r => r.indexDepth == null)">降级规则</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="selectionChange"
      highlight-current-row
      fit
      border
    >
      <el-table-column type="selection" width="35"/>
      <el-table-column label="等级名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="等级关系" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.indexDepth == null ? 'info': 'success'" v-text="scope.row.indexDepth == null ? '未设置' : '已设置'"></el-tag>
        </template>
      </el-table-column>
      <el-table-column label="默认等级" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.defaultGrade" active-color="#13ce66" :disabled="scope.row.indexDepth == null || scope.row.defaultGrade" @change="setDefaultGrade(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogStatus==='create' ? '新增' : (temp.id == null ? '加载中...':'修改')" :visible.sync="dialogFormVisible">
      <el-form ref="gradeForm" :rules="rules" :model="temp" v-loading="saving || (dialogStatus !='create' && temp.id == null)">
        <el-form-item label="等级名称" prop="name">
          <el-input ref="gradeName" v-model.trim="temp.name" @keyup.enter.native="saveData"/>
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
  import {getList, save, deleteEle, setDefaultGrade} from '@/api/vip/grade'
  import permission from '@/directive/permission/index.js'

  export default {
    name: 'vip_grade',
    components: {},
    directives: {permission},
    filters: {},
    data() {
      return {
        showSearchMore: false,
        //列表相关
        listQuery: {
          pageIndex: 1,
          pageSize: 10,
          searchKey: ''
        },
        rules: {
          name: [{required: true, message: '必填字段', trigger: 'blur'}],
        },
        selectedIds: [],
        list: [],
        dataList:[],
        listLoading: false,
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
      changeInput(){
        this.dataList = this.list.filter(r => this.listQuery.searchKey == '' || r.name.indexOf(this.listQuery.searchKey) > -1)
      },
      setDefaultGrade(id) {
        this.listLoading = true
        setDefaultGrade({id:id}).finally(() =>  this.getList())
      },
      //获取列表
      getList() {
        this.listLoading = true
        getList().then(response => {
          this.selectedIds = []
          this.dataList = this.list = response.data
          this.changeInput()
        }).finally(() => this.listLoading = false)
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
          this.$refs['gradeForm'].clearValidate()
        })
        setTimeout(() => this.$refs.gradeName.$el.querySelector('input').focus(), 200);
      },
      //弹出框修改
      updateElement() {
        this.createElement()
        this.dialogStatus = 'update'
        this.temp = this.list.find(r => r.id === this.selectedIds[0].id)
      },
      //保存数据
      saveData() {
        this.$refs['gradeForm'].validate((valid) => {
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
