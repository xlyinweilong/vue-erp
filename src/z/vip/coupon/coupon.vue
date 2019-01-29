<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="代用卷编号" v-model.trim="listQuery.searchKey" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
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
      <el-table-column label="编号" align="center">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="生效时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失效时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="条件金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.conditionAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.discount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属会员" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.vipName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已经使用" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.used ? 'waring':'success'" v-text="scope.row.used ? '已使用':'未使用'"></el-tag>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>


    <el-dialog :title="dialogStatus==='create' ? '新增' : (temp.id == null ? '加载中...':'修改')" :visible.sync="dialogFormVisible">
      <el-form ref="vipCouponForm" :rules="rules" :model="temp" v-loading="saving || (dialogStatus !='create' && temp.id == null)">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select style="width: 100%" v-model="temp.type" placeholder="请选择">
                <el-option label="抵金" value="AMOUNT"/>
                <el-option label="折扣" value="DISCOUNT"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="temp.type == 'AMOUNT' ? '金额':'折扣'" prop="amount">
              <el-input-number :precision="2" style="width: 100%" v-model="temp.amount" :min="0" :max="99999999" label="输入数字" :step="temp.type == 'AMOUNT' ? 10 : 0.01" @keyup.enter.native="saveData"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="生效时间" prop="startDate">
              <el-date-picker v-model="temp.startDate" style="width: 100%" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="充值金额" prop="endDate">
              <el-date-picker v-model="temp.endDate" style="width: 100%" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="会员" prop="vipId">
              <vipSelect style="width: 100%" :vipId.sync="temp.vipId" :vipCode.sync="temp.vipCode" :vipName.sync="temp.vipName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="条件金额" prop="conditionAmount">
              <el-input-number :precision="2" style="width: 100%" v-model="temp.conditionAmount" :min="0" :max="99999999" label="输入数字" :step="100" @keyup.enter.native="saveData"/>
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
  import {getList, save, deleteEle} from '@/api/vip/coupon'
  import Pagination from '@/components/Pagination'
  import permission from '@/directive/permission/index.js'
  import {initDate} from '@/z/bill/components/commonMethod'
  import vipSelect from '@/z/common/select/vipSelect'

  export default {
    name: 'vip_coupon',
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
          type: [{required: true, message: '必填字段', trigger: 'blur'}],
          amount: [{required: true, message: '必填字段', trigger: 'blur'}],
          startDate: [{required: true, message: '必填字段', trigger: 'blur'}]
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
        this.temp = {id: '', vipId: '', type: 'AMOUNT', startDate: initDate(), conditionAmount: 0}
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['vipCouponForm'].clearValidate()
        })
      },
      //弹出框修改
      updateElement() {
        this.createElement()

        this.dialogStatus = 'update'
        this.temp = this.list.find(r => r.id === this.selectedIds[0].id)
        if(this.temp.type == 'DISCOUNT'){
          this.temp.amount = this.temp.discount
          this.temp.discount = 0
        }
      },
      saveData() {
        this.$refs['vipCouponForm'].validate((valid) => {
          if (valid) {
            if(this.temp.type == 'DISCOUNT'){
              this.temp.discount = this.temp.amount
              this.temp.amount = 0
            }
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
