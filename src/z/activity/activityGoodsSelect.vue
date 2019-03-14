<template>
  <div>
    <div class="filter-container">
      <goodsSelect class="filter-item" :isCallBack="true" :goodsId.sync="temp.goodsId" @change="changeSelect"/>
      <el-button class="filter-item" type="success" icon="el-icon-upload2" @click="importDialogVisible = true" :disabled="listLoading">导入</el-button>
    </div>

    <el-row :gutter="20">
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
          </template>
        </el-table-column>
        <el-table-column label="货品名称" align="center" min-width="250">
          <template slot-scope="scope">
            <span>{{scope.row.goodsName}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="货品品牌" align="center" min-width="250">-->
        <!--<template slot-scope="scope">-->
        <!--<commonDictSelect style="width: 100%" type1="GOODS" type2="BRAND" :eleId.sync="scope.row.goodsBrandId" :eleName.sync="scope.row.goodsBrandName"></commonDictSelect>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="货品品类" align="center" min-width="250">-->
        <!--<template slot-scope="scope">-->
        <!--<commonDictSelect style="width: 100%" type1="GOODS" type2="CATEGORY" :eleId.sync="scope.row.goodsCategoryId" :eleName.sync="scope.row.goodsCategoryName"></commonDictSelect>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="货品年份" align="center" min-width="250">-->
        <!--<template slot-scope="scope">-->
        <!--<commonDictSelect style="width: 100%" type1="GOODS" type2="YEAR" :eleId.sync="scope.row.goodsYearId" :eleName.sync="scope.row.goodsYearName"></commonDictSelect>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="货品季节" align="center" min-width="250">-->
        <!--<template slot-scope="scope">-->
        <!--<commonDictSelect style="width: 100%" type1="GOODS" type2="SEASON" :eleId.sync="scope.row.goodsSeasonId" :eleName.sync="scope.row.goodsSeasonName"></commonDictSelect>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" circle @click="list.splice(scope.$index,1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-if="list.length != null" :total="list.length" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"/>
    </el-row>

    <commonUpload :show.sync="importDialogVisible" :downloadTemplateUrl="'/static/download/activity/activityGoods.xlsx'" :importAction="importAction" :typeKey="'activity'" @get-list="callBack"/>
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
        return this.list.filter(r => this.listQuery.searchKey == ''
          || r.goodsCode.indexOf(this.listQuery.searchKey) > -1 || r.goodsName.indexOf(this.listQuery.searchKey) > -1 || r.price == this.listQuery.searchKey
        ).slice((this.listQuery.pageIndex - 1) * this.listQuery.pageSize, this.listQuery.pageIndex * this.listQuery.pageSize)
      }
    },
    props: {
      list: {default: []},
      isDisabled: {default: false}
    },
    data() {
      return {
        temp: {
          goodsId: ""
        },
        listQuery: {
          pageIndex: 1,
          pageSize: 10,
          searchKey: ""
        },
        listLoading: false,
        loading: false,
        importDialogVisible: false,
        importAction: process.env.BASE_API + '/api/activity/upload_goods'
      }
    },
    created() {
    },
    methods: {
      // addOneRow() {
      //   this.list.push({channelId: '', channelName: '', channelCode: '', optionChannel: []})
      // },
      callBack(d) {
        d.data.filter(data => !this.list.some(g => g.goodsId == data.id)).forEach(data => this.list.push({goodsId: data.id, price: data.price, goodsCode: data.code, goodsName: data.name}))
      },
      changeSelect(goods) {
        if (goods.id != null && goods.id != '') {
          if (this.list.every(g => g.goodsId != goods.id)) {
            this.list.unshift({goodsId: goods.id, price: '', goodsCode: goods.code, goodsName: goods.name})
          }
        }
        this.temp.goodsId = ''
      }
    }
  }
</script>


