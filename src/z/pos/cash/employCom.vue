<template>
  <div class="filter-container">
    <el-select style="width: 210px;" v-model="employId" filterable clearable remote default-first-option placeholder="请输入营业员编号/姓名" :remote-method="searchEmploy" @change="changeEmploy" :loading="loadingEmploy">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
      <el-option v-for="item in optionEmploy" :value="item.id" :label="item.code"/>
    </el-select>
    <el-button type="primary" plain @click="multiEmployDialogVisible = true">多人分配</el-button>
    <span v-show="employList.length  > 0  || employId != ''"><el-tag closable type="success" @close="clear" v-text="employId != '' ? 1 : employList.filter(e => e.rate > 0).length"></el-tag></span>
    <el-dialog
      title="多营业员比例分配"
      :visible.sync="multiEmployDialogVisible"
      width="55%"
    >
      <div class="filter-container">
        <span>添加一个营业员:</span>
        <el-select style="width: 210px;" v-model="addEmployId" filterable clearable remote default-first-option placeholder="请输入营业员编号/姓名" :remote-method="searchAddEmploy" @change="changeAddEmploy" :loading="loadingEmploy">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <el-option v-for="item in optionEmployList" :value="item.id" :label="item.code"/>
        </el-select>
      </div>
      <el-table
        :data="employList"
        style="width: 100%">
        <el-table-column
          prop="code"
          align="center"
          label="员工编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="员工名称"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          label="获得比例">
          <template slot-scope="scope">
            <el-input-number @change="changeRate(scope.row)" style="width: 100%" v-model="scope.row.rate" :controls="false" :precision="2" :max="1" :min="0"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          label="删除"
          align="center"
          width="80">
          <template slot-scope="scope">
            <el-button @click="deleteRate(scope.$index)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="multiEmployDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="multiEmploy">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getList as getEmployList} from '@/api/info/employ'
  import {activityList} from '@/api/pos/pos'
  import pointSelect from '@/z/common/select/pointSelect'
  import {getList as getPointList} from '@/api/info/marketPoint'

  export default {
    computed: {},
    components: {pointSelect},
    data() {
      return {
        optionEmploy: [],
        loadingEmploy: false,
        employId: '',
        multiEmployDialogVisible: false,
        employList: [],
        optionEmployList: [],
        addEmployId: ''
      };
    },
    props: {
      channelId: {
        default: ''
      },
    },
    watch: {},
    methods: {
      init() {
        this.multiEmployDialogVisible = false
        this.addEmployId = ''
        this.employId = ''
        this.employList = []
      },
      //查询员工
      searchEmploy(query) {
        if (query !== '') {
          this.loadingEmploy = true
          getEmployList({pageIndex: 1, pageSize: 10, searchKey: query,channelId:this.channelId}).then(response => {
            this.optionEmploy = response.data.content
          }).finally(() => this.loadingEmploy = false)
        } else {
          this.optionEmploy = []
        }
      },
      //修改员工
      changeEmploy() {
        this.employList = []
        this.$emit('changeEmploy', [{id: this.employId, rate: 1}])
      },
      changeRate(employ) {

      },
      searchAddEmploy(query) {
        if (query !== '') {
          this.loadingEmploy = true
          getEmployList({pageIndex: 1, pageSize: 10, searchKey: query,channelId:this.channelId}).then(response => {
            this.optionEmployList = response.data.content
          }).finally(() => this.loadingEmploy = false)
        } else {
          this.optionEmployList = []
        }
      },
      changeAddEmploy() {
        if (this.addEmployId != null && this.addEmployId != '' && this.optionEmployList.length > 0) {
          if (this.employList.findIndex(e => e.id === this.addEmployId) < 0) {
            let employ = this.optionEmployList.find(e => e.id === this.addEmployId)
            employ.rate = 1
            this.employList.unshift(employ)
          }
        }
      },
      deleteRate(index) {
        this.employList.splice(index, 1)
      },
      multiEmploy() {
        if (this.employList.filter(e => e.rate > 0).reduce((t, e) => t + e.rate, 0) !== 1) {
          this.$message.error('总计的比例必须是1')
          return
        }
        this.employId = ''
        this.optionEmploy = []
        this.$emit('changeEmploy', this.employList.filter(e => e.rate > 0))
        this.multiEmployDialogVisible = false
      },
      clear() {
        this.init()
        this.$emit('changeEmploy', [])
      }
    }
  }
</script>

<style scoped>
  .el-input-number /deep/ .el-input__inner {
    padding-left: 2px;
    padding-right: 2px;
  }
</style>
