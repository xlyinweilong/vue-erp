<template>
  <el-table
    v-show="totalActivityList.length > 0"
    v-loading="listLoading"
    :data="totalActivityList"
    tooltip-effect="dark"
    style="width: 100%"
    empty-text="促销活动"
    border
  >
    <el-table-column label="活动编号" align="center">
      <template slot-scope="scope">
        <span>{{scope.row.code}}</span>
      </template>
    </el-table-column>
    <el-table-column label="活动名称" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.name }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

  import {activityList} from '@/api/pos/pos'

  export default {
    computed: {},
    components: {},
    data() {
      return {
        listLoading: false,
        //所有的促销活动
        totalActivityList: [],
        //可以参加的促销活动
        canJoinActivityList: []
      }
    },
    props: {
      channelId: {default: ''}
    },
    watch: {
      channelId: 'init'
    },
    methods: {
      init() {
        this.getAll()
      },
      //查询当前渠道今天的全部促销活动
      getAll() {
        this.listLoading = true
        activityList({channelId: this.channelId}).then(response => {
          this.canJoinActivityList = []
          this.totalActivityList = response.data
        }).finally(() => this.listLoading = false)
      }
    }
  }
</script>
