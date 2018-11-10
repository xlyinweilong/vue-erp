<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column label="日志ID">
        <template slot-scope="scope" width="110" align="center">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="天气日期"  >
        <template slot-scope="scope">
          <span>{{ scope.row.weatherDate }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="开始时间"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="结束时间"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成功数量"  >
        <template slot-scope="scope">
          <span>{{ scope.row.successCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失败数量"  >
        <template slot-scope="scope">
          <span>{{ scope.row.errorCount }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getLogList } from '@/api/weather'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery:{
        pageIndex:1,
        pageSize:10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getLogList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements;
        this.listLoading = false
      })
    }
  }
}
</script>
