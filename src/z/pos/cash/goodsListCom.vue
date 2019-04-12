<template>
  <el-table
    v-loading="listLoading"
    :data="goodsList"
    tooltip-effect="dark"
    style="width: 100%"
    height="350"
    empty-text="货品信息区域"
    border
  >
    <el-table-column label="状态" align="center" fixed="left" width="80%">
      <template slot-scope="scope">
        <span>{{statusMean(scope.row)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="货号" align="center" fixed="left">
      <template slot-scope="scope">
        <span>{{ scope.row.code }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('activity') > -1" label="促销活动" align="center">
      <template slot-scope="scope">
        <el-select v-model="scope.row.activityId" placeholder="请选择" @change="doSetAllGoods">
          <el-option v-for="item in scope.row.canJoinActivityList" :label="item.name" :value="item.id"/>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_name') > -1" label="货品名称" align="center" width="200%">
      <template slot-scope="scope">
        <span>{{ scope.row.goodsName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('goods_color_code') > -1" label="颜色编号" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.goodsColorCode }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('goods_color_name') > -1" label="颜色名称" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.goodsColorName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('goods_size_name') > -1" label="尺码" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.goodsSizeName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_brand') > -1" label="品牌" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.brandName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_category') > -1" label="类别" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.categoryName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_category2') > -1" label="二级类别" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.categoryName2 }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_series') > -1" label="系列" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.seriesName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_pattern') > -1" label="款型" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.patternName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_style') > -1" label="风格" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.styleName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_season') > -1" label="季节" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.seasonName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_year') > -1" label="年份" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.yearName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_sex') > -1" label="性别" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.sexName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_supplier_code') > -1" label="供应商编号" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.supplierCode }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_supplier_name') > -1" label="供应商名称" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.supplierName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('tag_price') > -1" label="吊牌价" align="center" width="70%">
      <template slot-scope="scope">
        <span>{{ scope.row.tagPrice }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('sale_price') > -1" label="零售价" align="center" width="70%">
      <template slot-scope="scope">
        <span>{{ scope.row.salePrice }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('bill_count') > -1" label="数量" align="center" width="50%">
      <template slot-scope="scope">
        <el-input-number style="width: 100%;" v-model="scope.row.billCount" :precision="0" :step="1" :controls="false" @change="doSetAllGoods"></el-input-number>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('discount') > -1" label="折扣" align="center" width="70%">
      <template slot-scope="scope">
        <el-input-number style="width: 100%;" v-model="scope.row.discount" :precision="2" :step="0.1" :min="0" :controls="false" @change="scope.row.price=scope.row.tagPrice*scope.row.discount;diyPrice(scope.row)"></el-input-number>
        <!--<span>{{ scope.row.price/scope.row.tagPrice }}</span>-->
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('price') > -1" label="单价" align="center" width="120%">
      <template slot-scope="scope">
        <el-input-number style="width: 100%;" v-model="scope.row.price" :precision="2" :step="0.1" :min="0" :controls="false" @change="diyPrice(scope.row)"></el-input-number>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('amount') > -1" label="金额" align="center" width="95%">
      <template slot-scope="scope">
        <span>{{ scope.row.amount }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('employ') > -1" label="营业员" align="center" width="200%">
      <template slot-scope="scope">
        <el-select v-model="scope.row.employId" filterable clearable remote default-first-option placeholder="请输入营业员" :remote-method="searchEmploy" @change="changeEmploy(scope.row)" :loading="loadingEmploy" style="width: 100%">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <el-option v-for="item in optionEmploy" :value="item.id" :label="item.code"/>
          <el-option v-if="scope.row.employId != '' && scope.row.employId != null && optionEmploy.every(e => e.id != scope.row.employId)" :value="scope.row.employId" :label="scope.row.employCode"/>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('market_point') > -1" label="结算码" align="center" width="200%">
      <template slot-scope="scope">
        <el-select v-model="scope.row.pointId" filterable clearable remote default-first-option placeholder="请输入商场扣点码" :remote-method="searchPoint" @change="changePoint(scope.row)" :loading="loadingPoint" style="width: 100%">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <el-option v-for="item in optionPoint" :value="item.id" :label="item.code"/>
          <el-option v-if="scope.row.pointId != '' && scope.row.pointId != null && optionPoint.every(e => e.id != scope.row.pointId)" :value="scope.row.pointId" :label="scope.row.pointCode"/>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('stock_count') > -1" label="库存" align="center" width="50%">
      <template slot-scope="scope">
        <span>{{ scope.row.stockCount }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.length == 0 || diyValues.indexOf('remarks') > -1" label="备注" align="center">
      <template slot-scope="scope">
        <el-input v-model="scope.row.remarks" placeholder="请输入内容"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="50%" fixed="right">
      <template slot-scope="scope">
        <el-button type="text" @click="goodsList.splice(scope.$index,1);doSetAllGoods()">删除</el-button>
      </template>
    </el-table-column>
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
      totalActivityList: {
        default: []
      },
      goodsList: {
        default: []
      },
      listLoading: {
        default: false
      },
      lastEmploy: {
        default: {}
      },
      diyValues: {
        default: []
      },
      lastPoint: {
        default: {}
      }
    },
    watch: {},
    methods: {
      init() {
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
      //查询结算码
      searchPoint(query) {
        if (query !== '') {
          this.loadingPoint = true
          getPointList({pageIndex: 1, pageSize: 10, searchKey: query}).then(response => {
            this.optionPoint = response.data.content
          }).finally(() => this.loadingPoint = false)
        } else {
          this.optionPoint = []
        }
      },
      //修改结算码
      changePoint(row) {
        if (row.pointId != null && row.pointId != '') {
          let point = this.optionPoint.find(e => e.id === row.pointId)
          row.pointName = point.name
          row.pointCode = point.code
          this.goodsList.filter(g => g.pointId == null || g.pointId == '').forEach(g => {
            g.pointId = row.pointId
            g.pointName = row.pointName
            g.pointCode = row.pointCode
          })
          this.$emit('update:lastPoint', {id: row.pointId, name: row.pointName, code: row.pointCode})
        } else {
          row.pointName = ''
          row.pointCode = ''
        }
      },
      //查询员工
      searchEmploy(query) {
        if (query !== '') {
          this.loadingEmploy = true
          getEmployList({pageIndex: 1, pageSize: 10, searchKey: query}).then(response => {
            this.optionEmploy = response.data.content
          }).finally(() => this.loadingEmploy = false)
        } else {
          this.optionEmploy = []
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
      },
      //自定义价格
      diyPrice(row) {
        row.isDiyPrice = true
        row.isVipDiscount = false
        row.vipDiscount = 1
        this.doSetAllGoods()
      },
      doSetAllGoods() {
        this.$emit('doSetAllGoods', "")
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
