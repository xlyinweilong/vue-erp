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
      <el-table-column label="规则名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="会员等级" align="center">
        <template slot-scope="scope">
          <span v-text="scope.row.vipGradeId == null ? '':gradeList.find(r => r.id === scope.row.vipGradeId).name"></span>
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
      <el-table-column label="每元增加积分" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.integral }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优先级别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.priority }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="设置渠道" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button  v-permission="'user_role_power'" plain class="filter-item" type="primary" icon="el-icon-setting" @click="$router.push({ path: '/vip/integral/integral_add_goods/' + scope.row.id})">设置渠道</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="设置货品" align="center">
        <template slot-scope="scope">
          <el-button  v-permission="'user_role_power'" plain class="filter-item" type="primary" icon="el-icon-setting" @click="$router.push({ path: '/vip/integral/integral_add_goods/' + scope.row.id})">设置货品</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>


    <el-dialog :title="dialogStatus==='create' ? '新增' : (temp.id == null ? '加载中...':'修改')" :visible.sync="dialogFormVisible">
      <el-form ref="vipIntegralRuleForm" :rules="rules" :model="temp" v-loading="saving || (dialogStatus !='create' && temp.id == null)">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="规则名称" prop="name">
              <el-input ref="vipRukeName" placeholder="输入名称" v-model.trim="temp.name" @keyup.enter.native="saveData"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员等级" prop="vipGradeId">
              <el-select v-model="temp.vipGradeId" placeholder="请选择" style="width: 100%" filterable default-first-option>
                <el-option v-for="item in gradeList" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="生效时间" prop="startDate">
              <el-date-picker style="width: 100%" v-model="temp.startDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" @keyup.enter.native="saveData"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失效时间" prop="endDate">
              <el-date-picker style="width: 100%" v-model="temp.endDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" @keyup.enter.native="saveData"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="每元增加积分" prop="integral">
              <template>
                <el-input-number :precision="0" style="width: 100%" v-model="temp.integral" :min="0" :max="99999999" label="输入数字" :step="100" @keyup.enter.native="saveData"/>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级别" prop="priority">
              <el-select v-model="temp.priority" placeholder="请选择" style="width: 100%" filterable default-first-option>
                <el-option v-for="item in [0,1,2,3,4,5,6,7,8,9]" :label="item" :value="item"/>
              </el-select>
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
  import {getList as getGradeList} from '@/api/vip/grade'
  import Pagination from '@/components/Pagination'
  import permission from '@/directive/permission/index.js'
  import {initDateTime} from '@/z/bill/components/commonMethod'
  import employSelect from '@/z/common/select/employSelect'
  import channelSelect from '@/z/common/select/channelSelect'

  export default {
    name: 'vip_info',
    components: {
      Pagination, employSelect, channelSelect
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
          name: [{required: true, message: '必填字段', trigger: 'blur'}],
          vipGradeId: [{required: true, message: '必填字段', trigger: 'blur'}],
          startDate: [{required: true, message: '必填字段', trigger: 'blur'}],
          integral: [{required: true, message: '必填字段', trigger: 'blur'}],
          priority: [{required: true, message: '必填字段', trigger: 'blur'}]
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
      getGradeList().then(response => {
        this.gradeList = response.data.filter(r => r.indexDepth != null).sort((a, b) => a.indexDepth > b.indexDepth)
        this.getList()
      }).catch(() => this.listLoading = false)

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
        this.temp = {id: '', name: '', vipGradeId: '', startDate: initDateTime(), integral: 1, priority: 0}
        if(this.gradeList.length > 0){
          this.temp.vipGradeId = this.gradeList[0].id
        }
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['vipIntegralRuleForm'].clearValidate()
        })
        setTimeout(() => this.$refs.vipRukeName.$el.querySelector('input').focus(), 200)
      },
      //弹出框修改
      updateElement() {
        this.createElement()
        this.dialogStatus = 'update'
        this.temp = this.list.find(r => r.id === this.selectedIds[0].id)
      },
      saveData() {
        this.$refs['vipIntegralRuleForm'].validate((valid) => {
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
