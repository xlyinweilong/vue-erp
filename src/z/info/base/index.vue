<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.type1" class="filter-item" style="width: 130px" @change="changeType1">
        <el-option v-for="item in typeList1" :value="item.key" :key="item.key" :label="item.value"/>
      </el-select>
      <el-select v-model="listQuery.type2" class="filter-item" style="width: 130px" @change="changeType2">
        <el-option v-for="item in typeList2" :value="item.key" :key="item.key" :label="item.value"/>
      </el-select>
      <el-input v-if="showType === 1" placeholder="输入编号" v-model.trim="listQuery.code" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-input placeholder="输入名称" v-model.trim="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="getList"/>
      <el-button :loading="listLoading" class="filter-item" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
    </div>

    <div class="filter-container">
      <el-button v-permission="'info_base_add'" class="filter-item" type="primary" icon="el-icon-plus" @click="createElement" :disabled="listLoading">新增</el-button>
      <el-button v-permission="'info_base_edit'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="updateElement" :disabled="listLoading || selectedIds.length != 1">修改</el-button>
      <el-button v-permission="'info_base_delete'" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteElement" :disabled="listLoading || selectedIds.length == 0">删除</el-button>
      <!--<el-button v-permission="'info_base_export'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-download" @click="getList" :disabled="listLoading || total ==  0">导出</el-button>-->
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
      <el-table-column v-if="showType === 1" label="编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" :fixed="showType === 3">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showType === 3" v-for="sizeGroup in sizeGroupTileList" :label="sizeGroup.name" align="center">
        <template slot-scope="scope">
          <span v-text="scope.row.sizeList.length > sizeGroup.index ? scope.row.sizeList[sizeGroup.index].name : ''"></span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0 && !listLoading" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>

    <el-dialog :title="dialogStatus==='create' ? '新增' : (temp.id == null ? '加载中...':'修改')" :visible.sync="dialogFormVisible">
      <el-form ref="dictForm" :rules="rules" :model="temp" v-loading="saving || (dialogStatus !='create' && temp.id == null)">
        <el-form-item v-if="showType === 1" label="编号" prop="code">
          <el-input v-model.trim="temp.code" @keyup.enter.native="saveData"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="temp.name" @keyup.enter.native="saveData"/>
        </el-form-item>
        <el-form-item v-if="showType == 3">
          <el-button @click="addSize" type="primary">新增尺码</el-button>
          <el-button @click="moveUp" type="success" :disabled="selectedSizeRow == null || sizeList.indexOf(selectedSizeRow) <= 0">上移</el-button>
          <el-button @click="moveDown" type="success" :disabled="selectedSizeRow == null || sizeList.indexOf(selectedSizeRow) < 0 || sizeList.indexOf(selectedSizeRow) === (sizeList.length - 1)">下移</el-button>
        </el-form-item>
        <el-form-item v-if="showType == 3" @submit.native.prevent>
          <el-table :data="sizeList" row-key="id" border fit highlight-current-row style="width: 100%" @row-click="selectSizeRow">
            <el-table-column align="center" label="尺码">
              <template slot-scope="scope">
                <template>
                  <el-input placeholder="请输入尺码" v-model.trim="scope.row.name" @keyup.enter.native="saveData"></el-input>
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center" label="删除" width="80">
              <template slot-scope="scope">
                <el-button size="small" type="danger" icon="el-icon-delete" @click="removeSize(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
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
  import {getDictList, saveDict, getDict, deleteDict, getDictType} from '@/api/info/dict'
  import Pagination from '@/components/Pagination'
  import permission from '@/directive/permission/index.js'

  export default {
    name: 'baseGoods',
    components: {Pagination},
    directives: {permission},
    filters: {},
    data() {
      return {
        //1 有编号的 2 没有编号的 3 尺码组
        showType: 1,
        //类型
        typeList1: [],
        typeList2: [],
        //列表相关
        listQuery: {
          type1: null,
          type2: null,
          pageIndex: 1,
          pageSize: 10,
          code: '',
          name: ''
        },
        selectedIds: [],
        list: null,
        total: 0,
        listLoading: true,
        //弹出框相关
        dialogFormVisible: false,
        dialogStatus: '',
        temp: {
          id: null,
          code: '',
          name: '',
          sizeList: []
        },
        rules: {
          code: [{required: true, message: '必填字段', trigger: 'blur'}],
          name: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
        //尺码组
        sizeGroupTileList: [],
        sizeList: [],
        selectedSizeRow: null,
        saving: false
      }
    },
    created() {
      this.getDictType()
    },
    methods: {
      //获取字典类型1
      getDictType() {
        getDictType().then(response => {
          this.typeList1 = response.data
          this.listQuery.type1 = this.typeList1[0].key
          this.getDictType2(this.listQuery.type1)
        })
      },
      //获取字典类型2
      getDictType2() {
        getDictType({type: this.listQuery.type1}).then(response => {
          this.typeList2 = response.data
          this.listQuery.type2 = this.typeList2[0].key
          this.changeType2()
        })
      },
      //类型1改变
      changeType1() {
        this.getDictType2();
      },
      //类型2改变
      changeType2() {
        this.listQuery.code = this.listQuery.name = ''
        this.listQuery.pageIndex = 1
        let type = this.typeList2.find(r => r.key === this.listQuery.type2)
        this.showType = type.key === 'SIZE_GROUP' ? 3 : (type.type ? 1 : 2)
        this.getList();
      },
      //获取列表
      getList() {
        this.listLoading = true
        getDictList(this.listQuery).then(response => {
          this.selectedIds = []
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
          this.sizeGroupTileList = [];
          let max = 0;
          response.data.content.forEach(g => max = g.sizeList != null && max < g.sizeList.length ? g.sizeList.length : max);
          for (let i = 0; i < max; i++) {
            this.sizeGroupTileList.push({index: i, name: "尺码" + (i + 1)})
          }
        })
      },
      //选择
      selectionChange(val) {
        this.selectedIds = val
      },
      //弹出框新增
      createElement() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dictForm'].clearValidate()
        })
        this.sizeList = []
      },
      //弹出框修改
      updateElement() {
        this.createElement()
        this.dialogStatus = 'update'
        getDict({id: this.selectedIds[0].id}).then(response => {
          this.temp = response.data
          if (this.temp.sizeList != null) {
            this.sizeList = this.temp.sizeList;
          }
        })
      },
      //清空数据
      resetTemp() {
        this.temp = {id: null, code: '', name: '', type1: null, type2: null, sizeList: []}
      },
      //保存数据
      saveData() {
        this.$refs['dictForm'].validate((valid) => {
          if (valid) {
            this.temp.type1 = this.listQuery.type1;
            this.temp.type2 = this.listQuery.type2;
            this.temp.sizeList = [];
            if (this.showType === 3) {
              this.sizeList.filter(r => r.name != null && r.name != '').forEach(r => this.temp.sizeList.push(r))
            }
            this.saving = true
            saveDict(this.temp).then(response => {
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
          deleteDict({ids: this.selectedIds.map(s => s.id), type1: this.listQuery.type1, type2: this.listQuery.type2}).then(response => {
            this.$message({message: response.message, type: 'success'})
            this.getList()
          })
        })
      },
      //新增尺码
      addSize() {
        this.sizeList.push({name: ""});
      },
      //删除尺码
      removeSize(row) {
        let index = this.sizeList.indexOf(row);
        this.sizeList.splice(index, 1)
      },
      //移动
      moveUp() {
        let i = this.sizeList.indexOf(this.selectedSizeRow)
        let targetRow = this.sizeList.splice(i, 1)[0]
        this.sizeList.splice(i - 1, 0, targetRow)
      },
      moveDown() {
        let i = this.sizeList.indexOf(this.selectedSizeRow)
        let targetRow = this.sizeList.splice(i, 1)[0]
        this.sizeList.splice(i + 1, 0, targetRow)
      },
      //选择
      selectSizeRow(row, event, column) {
        this.selectedSizeRow = row
      }
    }
  }
</script>

<style>
  .sortable-ghost {
    opacity: .8;
    color: #fff !important;
    background: #42b983 !important;
  }
</style>

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
</style>
