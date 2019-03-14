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
      <el-button v-permission="'bill_channel_qddr_import'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-upload2" @click="importDialogVisible = true" :disabled="listLoading">导入</el-button>
      <el-button v-permission="'bill_channel_qddr_export'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-download" @click="exportDialogVisible = true" :disabled="listLoading || total ==  0">导出</el-button>
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
          <!--<router-link :to="'/bill/channel/channel2channel_in_detail/'+scope.row.id" class="link-type">-->
            {{ scope.row.code }}
          <!--</router-link>-->
        </template>
      </el-table-column>
      <el-table-column label="会员姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员性别" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex == 0" type="warning">女</el-tag>
          <el-tag v-if="scope.row.sex == 1" type="success">男</el-tag>
          <el-tag v-if="scope.row.sex == -1" type="info">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开卡日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.openDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开卡营业员编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.openEmployCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开卡营业员姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.openEmployName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开卡渠道编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.openChannelCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开卡渠道名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.openChannelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前余额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前积分" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.integral }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前经验值" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.xpValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员等级" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-text="gradeList.find(g => g.lowestXpValue <= scope.row.xpValue).name" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>


    <el-dialog :title="dialogStatus==='create' ? '新增' : (temp.id == null ? '加载中...':'修改')" :visible.sync="dialogFormVisible">
      <el-form ref="vipForm" :rules="rules" :model="temp" v-loading="saving || (dialogStatus !='create' && temp.id == null)">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="编号/手机号" prop="code">
              <el-input ref="vipCode" v-model.trim="temp.code" @keyup.enter.native="saveData"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model.trim="temp.name" @keyup.enter.native="saveData"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select style="width: 100%" v-model="temp.sex" placeholder="请选择">
                <el-option label="未知" :value="-1"/>
                <el-option label="男" :value="1"/>
                <el-option label="女" :value="0"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发卡时间" prop="openDate">
              <el-date-picker style="width: 100%" v-model="temp.openDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发卡营业员" prop="openEmployId">
              <employSelect style="width: 100%" ref="openEmploy" :employId.sync="temp.openEmployId" :employCode.sync="temp.openEmployCode" :employName.sync="temp.openEmployName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发卡渠道" prop="openChannelId">
              <channelSelect style="width: 100%" ref="openChannel" :channelId.sync="temp.openChannelId" :channelCode.sync="temp.openChannelCode" :channelName.sync="temp.openChannelName"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="saveData" :loading="saving || (dialogStatus !='create' && temp.id == null)">确定</el-button>
      </div>
    </el-dialog>

    <commonUpload :show.sync="importDialogVisible" :downloadTemplateUrl="'/static/download/vip/vip_info.xlsx'" :importAction="importAction" :typeKey="'vip_info'" @get-list="getList"/>
  </div>
</template>

<script>
  import {getList, save, deleteEle} from '@/api/vip/vip'
  import {getList as getGradeList} from '@/api/vip/grade'
  import Pagination from '@/components/Pagination'
  import permission from '@/directive/permission/index.js'
  import {initDate} from '@/z/bill/components/commonMethod'
  import employSelect from '@/z/common/select/employSelect'
  import channelSelect from '@/z/common/select/channelSelect'
  import commonUpload from '@/z/common/upload/commonUpload'

  export default {
    name: 'vip_info',
    components: {
      Pagination, employSelect, channelSelect,commonUpload
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
          code: [{required: true, message: '必填字段', trigger: 'blur'}],
        },
        selectedIds: [],
        list: null,
        total: 0,
        listLoading: false,
        temp: {},
        dialogStatus: '',
        dialogFormVisible: false,
        saving: false,
        gradeList: [],
        importDialogVisible:false,
        importAction: process.env.BASE_API + '/api/vip/vip/upload',
      }
    },
    created() {
      this.listLoading = true
      getGradeList().then(response => {
        this.gradeList = response.data.filter(r => r.indexDepth != null).sort((a, b) => a.indexDepth < b.indexDepth)
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
        this.temp = {id: '', name: '', sex: -1, openDate: initDate(), openChannelId: '', openEmployId: ''}
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['vipForm'].clearValidate()
        })
        setTimeout(() => this.$refs.vipCode.$el.querySelector('input').focus(), 200)
      },
      //弹出框修改
      updateElement() {
        this.createElement()
        this.dialogStatus = 'update'
        this.temp = this.list.find(r => r.id === this.selectedIds[0].id)
      },
      saveData() {
        this.$refs['vipForm'].validate((valid) => {
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
