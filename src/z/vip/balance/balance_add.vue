<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="会员编号" v-model.trim="listQuery.searchKey" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
    </div>
    <div class="filter-container">
      <el-button v-permission="'user_user_add'" class="filter-item" type="primary" icon="el-icon-plus" @click="createElement" :disabled="listLoading">新增</el-button>
      <el-button v-permission="'user_user_delete'" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteElement" :disabled="listLoading || selectedIds.length == 0">失效</el-button>
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
      <el-table-column label="会员编号" align="center">
        <template slot-scope="scope">
          {{ scope.row.vipCode }}
        </template>
      </el-table-column>
      <el-table-column label="会员名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.vipName }}
        </template>
      </el-table-column>
      <el-table-column label="充值时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值积分" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.integral }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值经验" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.xp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.xp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否失效" align="center">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column label="失效人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.xp }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>


    <el-dialog :title="dialogStatus==='create' ? '新增' : (temp.id == null ? '加载中...':'修改')" :visible.sync="dialogFormVisible">
      <el-form ref="vipBalanceAddForm" :rules="rules" :model="temp" v-loading="saving || (dialogStatus !='create' && temp.id == null)">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="会员" prop="vip">
              <vipSelect style="width: 100%" :vipId.sync="temp.vipId" :vipCode.sync="temp.vipCode" :vipName.sync="temp.vipName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="充值金额" prop="balance">
              <el-input-number :precision="2" style="width: 100%" v-model="temp.balance" :min="0" :max="99999999" label="输入数字" :step="100" @keyup.enter.native="saveData"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="充值积分" prop="integral">
              <el-input-number :precision="0" style="width: 100%" v-model="temp.integral" :min="0" :max="99999999" label="输入数字" :step="100" @keyup.enter.native="saveData"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="充值经验" prop="xp">
              <el-input-number :precision="0" style="width: 100%" v-model="temp.xp" :min="0" :max="99999999" label="输入数字" :step="100" @keyup.enter.native="saveData"/>
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
  import {getList, save, deleteEle} from '@/api/vip/vipIntegralUpRule'
  import Pagination from '@/components/Pagination'
  import permission from '@/directive/permission/index.js'
  import {initDate} from '@/z/bill/components/commonMethod'
  import vipSelect from '@/z/common/select/vipSelect'

  export default {
    name: 'vip_info',
    components: {
      Pagination, vipSelect
    },
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
        rules: {
          vip: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
        selectedIds: [],
        list: null,
        total: 0,
        listLoading: false,
        temp: {},
        dialogStatus: '',
        dialogFormVisible: false,
        saving: false,
        gradeList: []
      }
    },
    created() {
      this.listLoading = true
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
      //弹出框新增
      createElement() {
        this.temp = {id: '', vipId: '', balance: 0, integral: 0, xp: 0}
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['vipBalanceAddForm'].clearValidate()
        })
      },
      //弹出框修改
      updateElement() {
        this.createElement()
        this.dialogStatus = 'update'
        this.temp = this.list.find(r => r.id === this.selectedIds[0].id)
      },
      saveData() {
        this.$refs['vipBalanceAddForm'].validate((valid) => {
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
        this.$confirm('确定要失效选中的数据吗?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
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
