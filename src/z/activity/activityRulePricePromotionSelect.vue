<template>
  <div>
    <div class="filter-container">
      <!--<el-select class="filter-item" v-model="type" placeholder="请选择">-->
        <!--<el-option label="货号" value="GOODS_CODE"/>-->
        <!--<el-option label="范围" value="RANGE"/>-->
      <!--</el-select>-->
      <goodsSelect class="filter-item" :isCallBack="true" :goodsId.sync="temp.goodsId" @change="changeSelect"/>
      <!--<el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addOneRow" :loading="listLoading">确定</el-button>-->
      <el-button v-show="type === 'GOODS_CODE'" class="filter-item" type="success" icon="el-icon-upload2" @click="importDialogVisible = true" :disabled="listLoading">导入</el-button>
    </div>

    <el-row :gutter="20" v-show="goodsList.length > 0">
      <el-table
        v-loading="listLoading"
        :data="goodsDetailList"
        tooltip-effect="dark"
        style="width: 100%"
        fit
        border
      >
        <el-table-column label="货品编号" align="center" min-width="250">
          <template slot-scope="scope">
            <span>{{scope.row.goodsCode}}</span>
            <!--<goodsSelect style="width: 100%" :goodsId.sync="scope.row.goodsId" :goodsCode.sync="scope.row.goodsCode" :goodsName.sync="scope.row.goodsName"/>-->
          </template>
        </el-table-column>
        <el-table-column label="货品名称" align="center" min-width="250">
          <template slot-scope="scope">
            <span>{{scope.row.goodsName}}</span>
            <!--<goodsSelect style="width: 100%" :goodsId.sync="scope.row.goodsId" :goodsCode.sync="scope.row.goodsCode" :goodsName.sync="scope.row.goodsName"/>-->
          </template>
        </el-table-column>
        <!--<el-table-column label="标准吊牌价" align="center" min-width="250">-->
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

      <pagination :total="goodsList.length" :page.sync="goodsListQuery.pageIndex" :limit.sync="goodsListQuery.pageSize"/>
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

    <commonUpload :show.sync="importDialogVisible" :downloadTemplateUrl="'/static/download/activity/activityRulePricePromotion.xlsx'" :importAction="importAction" :typeKey="'activity'" @get-list="callBack"/>
  </div>
</template>

<script>
  import goodsSelect from '@/z/common/select/goodsSelect'
  import commonDictSelect from '@/z/common/select/commonDictSelect'
  import commonUpload from '@/z/common/upload/commonUpload'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'activity_goods_select',
    components: {
      goodsSelect, commonDictSelect, commonUpload, Pagination
    },
    computed: {
      goodsDetailList: function () {
        return this.goodsList.filter(r => this.goodsListQuery.searchKey == ''
          || r.goodsCode.indexOf(this.goodsListQuery.searchKey) > -1 || r.goodsName.indexOf(this.goodsListQuery.searchKey) > -1 || r.price == this.goodsListQuery.searchKey
        ).slice((this.goodsListQuery.pageIndex - 1) * this.goodsListQuery.pageSize, this.goodsListQuery.pageIndex * this.goodsListQuery.pageSize)
      }
    },
    props: {
      goodsList: {default: []},
      rangeList: {default: []},
      isDisabled: {default: false}
    },
    data() {
      return {
        temp: {
          goodsId: ""
        },
        goodsListQuery: {
          pageIndex: 1,
          pageSize: 10,
          searchKey: ""
        },
        type: 'GOODS_CODE',
        listLoading: false,
        loading: false,
        importDialogVisible: false,
        importAction: process.env.BASE_API + '/api/activity/upload_rule_price_promotion'
      }
    },
    created() {
    },
    methods: {
      // addOneRow() {
      //   if (this.type === 'GOODS_CODE') {
      //     this.goodsList.unshift({goodsId: ''})
      //   } else {
      //     this.rangeList.unshift({discount: 1})
      //   }
      // },
      callBack(d) {
        d.data.filter(data => !this.goodsList.some(g => g.goodsId == data.id)).forEach(data => this.goodsList.push({goodsId: data.id, price: data.price, goodsCode: data.code, goodsName: data.name}))
      },
      changeSelect(goods) {
        if (goods.id != null && goods.id != '') {
          if (this.goodsList.every(g => g.goodsId != goods.id)) {
            this.goodsList.unshift({goodsId: goods.id, price: '', goodsCode: goods.code, goodsName: goods.name})
          }
        }
        this.temp.goodsId = ''
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


