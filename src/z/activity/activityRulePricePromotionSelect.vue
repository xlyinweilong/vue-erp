<template>
  <div>
    <div class="filter-container">
      <el-select class="filter-item" v-model="type" placeholder="请选择">
        <el-option label="货号" value="GOODS_CODE"/>
        <el-option label="范围" value="RANGE"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addOneRow" :loading="listLoading">增加一行</el-button>
    </div>

    <el-row :gutter="20" v-show="goodsList.length > 0">
      <el-table
        v-loading="listLoading"
        :data="goodsList"
        tooltip-effect="dark"
        style="width: 100%"
        fit
        border
      >
        <el-table-column label="货品编号" align="center" min-width="250">
          <template slot-scope="scope">
            <goodsSelect style="width: 100%" :goodsId.sync="scope.row.goodsId" :goodsCode.sync="scope.row.goodsCode" :goodsName.sync="scope.row.goodsName"></goodsSelect>
          </template>
        </el-table-column>
        <!--<el-table-column label="标准吊盘价" align="center" min-width="250">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="价格" align="center" min-width="50">
          <template slot-scope="scope">
            <el-input-number style="width: 100%" v-model="scope.row.price" :precision="2" :step="1" :min="0" :controls="false"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" circle @click="goodsList.splice(scope.$index,1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row :gutter="20" v-show="rangeList.length > 0">
      <el-table
        v-loading="listLoading"
        :data="rangeList"
        tooltip-effect="dark"
        style="width: 100%"
        fit
        border
      >
        <el-table-column label="货品品牌" align="center" min-width="250">
          <template slot-scope="scope">
            <commonDictSelect style="width: 100%" type1="GOODS" type2="BRAND" :eleId.sync="scope.row.goodsBrandId" :eleName.sync="scope.row.goodsBrandName"></commonDictSelect>
          </template>
        </el-table-column>
        <el-table-column label="货品品类" align="center" min-width="250">
          <template slot-scope="scope">
            <commonDictSelect style="width: 100%" type1="GOODS" type2="CATEGORY" :eleId.sync="scope.row.goodsCategoryId" :eleName.sync="scope.row.goodsCategoryName"></commonDictSelect>
          </template>
        </el-table-column>
        <el-table-column label="货品年份" align="center" min-width="250">
          <template slot-scope="scope">
            <commonDictSelect style="width: 100%" type1="GOODS" type2="YEAR" :eleId.sync="scope.row.goodsYearId" :eleName.sync="scope.row.goodsYearName"></commonDictSelect>
          </template>
        </el-table-column>
        <el-table-column label="货品季节" align="center" min-width="250">
          <template slot-scope="scope">
            <commonDictSelect style="width: 100%" type1="GOODS" type2="SEASON" :eleId.sync="scope.row.goodsSeasonId" :eleName.sync="scope.row.goodsSeasonName"></commonDictSelect>
          </template>
        </el-table-column>
        <el-table-column label="折扣" align="center" min-width="50">
          <template slot-scope="scope">
            <el-input-number style="width: 100%" v-model="scope.row.discount" :precision="2" :step="0.1" :min="0" :controls="false"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" circle @click="rangeList.splice(scope.$index,1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import goodsSelect from '@/z/common/select/goodsSelect'
  import commonDictSelect from '@/z/common/select/commonDictSelect'

  export default {
    name: 'activity_goods_select',
    components: {
      goodsSelect, commonDictSelect
    },
    props: {
      goodsList: {default: []},
      rangeList: {default: []},
      isDisabled: {default: false}
    },
    data() {
      return {
        type: 'GOODS_CODE',
        listLoading: false,
        loading: false,
      }
    },
    created() {
    },
    methods: {
      addOneRow() {
        if (this.type === 'GOODS_CODE') {
          this.goodsList.push({goodsId: ''})
        } else {
          this.rangeList.push({discount: 1})
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


