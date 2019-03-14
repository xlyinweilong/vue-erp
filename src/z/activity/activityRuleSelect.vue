<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addOneRow" :loading="listLoading">增加一行</el-button>
    </div>

    <el-row :gutter="20">
      <el-table
        v-loading="listLoading"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        fit
        border
        show-summary
      >
        <el-table-column v-if="ruleType == 'QUANTITY'" label="数量" align="center" min-width="250">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.quantity" :min="1" :max="99999" label="请输入数量"/>
          </template>
        </el-table-column>
        <el-table-column v-if="ruleType == 'AMOUNT'" label="金额" align="center" min-width="250">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.amount" :min="0.01" :max="9999999" label="请输入金额"/>
          </template>
        </el-table-column>
        <el-table-column v-if="activityType == 'BUY_DISCOUNT'" label="折扣" align="center" min-width="250">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.discount" :min="0.01" :max="10" label="请输入折扣"/>
          </template>
        </el-table-column>
        <el-table-column v-if="activityType == 'BUY_PLUS'" label="立减金额" align="center" min-width="250">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.plusAmount" :min="0.01" :max="9999999" label="请输入金额"/>
          </template>
        </el-table-column>
        <el-table-column v-if="activityType == 'BUY_GIVE'" label="赠送数量" align="center" min-width="250">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.giveCount" :min="0" :max="99999" label="请输入数量"/>
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

  export default {
    name: 'activity_channel_select',
    components: {
    },
    props: {
      list: {default: []},
      isDisabled: {default: false},
      ruleType: {default: ''},
      activityType: {default: ''}
    },
    data() {
      return {
        listLoading: false,
        loading: false
      }
    },
    created() {
    },
    methods: {
      addOneRow() {
        this.list.push({quantity: '', amount: '', discount: '', plusAmount: '',giveCount:''})
      }
    }
  }
</script>


