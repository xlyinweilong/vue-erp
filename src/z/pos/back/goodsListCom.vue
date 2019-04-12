<template>
  <el-table
    v-loading="listLoading"
    :data="goodsList"
    tooltip-effect="dark"
    style="width: 100%"
    height="350"
    empty-text="原单据货品信息区域"
    border
    @select="selectRow"
  >
    <el-table-column type="selection" width="35"/>
    <el-table-column label="货号" align="center" fixed="left">
      <template slot-scope="scope">
        <span>{{ scope.row.goodsCode }}</span>
      </template>
    </el-table-column>
    <el-table-column label="退货数量" align="center" fixed="left">
      <template slot-scope="scope">
        <el-input-number style="width: 100%" v-model="scope.row.backCount" :min="1" :max="scope.row.billCount" :precision="0" :controls="false" :disabled="!scope.row.isBack"/>
      </template>
    </el-table-column>
    <el-table-column label="货品名称" align="center" min-width="200">
      <template slot-scope="scope">
        <span>{{ scope.row.goodsName }}</span>
      </template>
    </el-table-column>
    <el-table-column  label="颜色编号" align="center" min-width="70">
      <template slot-scope="scope">
        <span>{{ scope.row.goodsColorCode }}</span>
      </template>
    </el-table-column>
    <el-table-column  label="颜色名称" align="center" min-width="70">
      <template slot-scope="scope">
        <span>{{ scope.row.goodsColorName }}</span>
      </template>
    </el-table-column>
    <el-table-column  label="尺码" align="center" min-width="70">
      <template slot-scope="scope">
        <span>{{ scope.row.goodsSizeName }}</span>
      </template>
    </el-table-column>
    <el-table-column  label="吊牌价" align="center" min-width="70">
      <template slot-scope="scope">
        <span>{{ scope.row.tagPrice }}</span>
      </template>
    </el-table-column>
    <el-table-column label="零售价" align="center" min-width="70">
      <template slot-scope="scope">
        <span>{{ scope.row.salePrice }}</span>
      </template>
    </el-table-column>
    <el-table-column  label="数量" align="center" min-width="50">
      <template slot-scope="scope">
        <span>{{ scope.row.billCount }}</span>
      </template>
    </el-table-column>
    <el-table-column  label="折扣" align="center" min-width="70">
      <template slot-scope="scope">
        <span>{{ scope.row.price/scope.row.tagPrice }}</span>
      </template>
    </el-table-column>
    <el-table-column  label="单价" align="center" min-width="90">
      <template slot-scope="scope">
        <span>{{ scope.row.price }}</span>
      </template>
    </el-table-column>
    <el-table-column  label="金额" align="center" min-width="90">
      <template slot-scope="scope">
        <span>{{ scope.row.amount }}</span>
      </template>
    </el-table-column>
    <el-table-column label="结算码" align="center" min-width="120">
      <template slot-scope="scope">
        <span>{{ scope.row.pointCode }}</span>
      </template>
    </el-table-column>
    <el-table-column  label="备注" align="center" min-width="50">
      <template slot-scope="scope">
        <span>{{ scope.row.remarks }}</span>
      </template>
    </el-table-column>
    <!--<el-table-column label="操作" align="center" width="50%" fixed="right">-->
      <!--<template slot-scope="scope">-->
        <!--<el-button type="text" @click="goodsList.splice(scope.$index,1);doSetAllGoods()">删除</el-button>-->
      <!--</template>-->
    <!--</el-table-column>-->
  </el-table>
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
        loadingEmploy: false,
        optionEmploy: [],
        loadingPoint: false,
        optionPoint: [],
      };
    },
    props: {
      goodsList: {
        default: []
      },
      listLoading: {
        default: false
      }
    },
    watch: {},
    methods: {
      init() {
      },
      selectRow(selection, row){
        row.isBack = !row.isBack
      },
      //销售状态
      statusMean(row) {
        if (row.cashStatus === 1) {
          let status = '销售'
          if (row.vipDiscount != 1) {
            status = '会员'
          }
          if (row.isDiyPrice) {
            status = '手动改价'
          }
          return status
        } else {
          return '退货'
        }
      },
      //修改员工
      changeEmploy(row) {
        if (row.employId != null && row.employId != '') {
          let employ = this.optionEmploy.find(e => e.id === row.employId)
          row.employName = employ.name
          row.employCode = employ.code
          this.goodsList.filter(g => g.employId == null || g.employId == '').forEach(g => {
            g.employId = row.employId
            g.employName = row.employName
            g.employCode = row.employCode
          })
          this.$emit('update:lastEmploy', {id: row.employId, name: row.employName, code: row.employCode})
        } else {
          row.employName = ''
          row.employCode = ''
        }
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
