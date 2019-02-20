<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addOneRow" :loading="listLoading">增加一行
      </el-button>
    </div>

    <el-row :gutter="20">
      <el-table
        v-loading="listLoading"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        fit
        border
      >
        <el-table-column label="会员等级" align="center" min-width="250">
          <template slot-scope="scope">
            <el-select style="width: 100%" v-model="scope.row.gradeId" filterable clearable
                       default-first-option placeholder="请选择"
                       :loading="loading">
              <el-option v-for="grade in gradeList" :value="grade.id" :label="grade.name" :disabled="list.some(r => r.gradeId == grade.id)"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" circle @click="list.splice(scope.$index,1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>

  import {getList} from '@/api/vip/grade'

  export default {
    name: 'activity_vip_select',
    components: {
    },
    props: {
      list: {default: []},
      isDisabled: {default: false}
    },
    data() {
      return {
        listLoading: false,
        loading: false,
        gradeList:[]
      }
    },
    created() {
      //查询全部的等级
      this.listLoading = true
      getList({}).then(response => {
        this.gradeList = response.data.filter(r => r.indexDepth != null).sort((a, b) => a.indexDepth > b.indexDepth)
      }).finally(() => this.listLoading = false)
    },
    methods: {
      addOneRow() {
        this.list.push({gradeId: '', gradeName: ''})
      }
    }
  }
</script>


