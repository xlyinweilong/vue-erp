<template>
  <el-dialog title="查询" :visible="show" width="45%" @close="onClose" @open="onOpen">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" :loading="loading" @click="create()">新增</el-button>
    </div>
    <el-table
      :data="list"
      v-loading="loading"
      stripe
      style="width: 100%">
      <el-table-column
        prop="createDate"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text">编辑</el-button>
          <el-button type="text" @click="deleteEle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">关闭</el-button>
    </div>
    <plan-detail-dialog :show.sync="planDetailDialogVisible" @getList="getList" :plan-id="planId" :keyType="keyType"/>
  </el-dialog>
</template>

<script>

  import {getList, deleteEle} from '@/api/report/plan'
  import planDetailDialog from '@/z/report/base/components/planDetailDialog'

  export default {
    computed: {},
    components: {planDetailDialog},
    data() {
      return {
        loading: false,
        list: [],
        planDetailDialogVisible: false,
        planId: ''
      };
    },
    props: {
      show: {default: false},
      keyType: {default: ''}
    },
    methods: {
      onClose() {
        this.$emit('getPlanList', {})
        this.$emit('update:show', false)
      },
      onOpen() {
        this.getList()
      },
      getList() {
        this.loading = true
        getList({key: this.keyType}).then(response => {
          this.list = response.data
        }).finally(() => this.loading = false)
      },
      deleteEle(row) {
        this.loading = true
        deleteEle({ids: [row.id]}).then(response => {
          this.getList()
        }).finally(() => this.loading = false)
      },
      edit(row) {
        this.planId = row.id
        this.planDetailDialogVisible=true
      },
      create(){
        this.planId = ''
        this.planDetailDialogVisible=true
      }
    }
  }
</script>
