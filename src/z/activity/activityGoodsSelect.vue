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
        <el-table-column label="货品编号" align="center" min-width="250">
          <template slot-scope="scope">
            <goodsSelect style="width: 100%" :goodsId.sync="scope.row.goodsId" :goodsCode.sync="scope.row.goodsCode" :goodsName.sync="scope.row.goodsName"></goodsSelect>
          </template>
        </el-table-column>
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
  import goodsSelect from '@/z/common/select/goodsSelect'
  import commonDictSelect from '@/z/common/select/commonDictSelect'

  export default {
    name: 'activity_goods_select',
    components: {
      goodsSelect,commonDictSelect
    },
    props: {
      list: {default: []},
      isDisabled: {default: false}
    },
    data() {
      return {
        listLoading: false,
        loading: false,
      }
    },
    created() {
    },
    methods: {
      addOneRow() {
        this.list.push({channelId: '', channelName: '', channelCode: '', optionChannel: []})
      }
    }
  }
</script>


