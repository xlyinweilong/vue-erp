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
    <el-table-column label="状态" align="center" fixed="left">
      <template slot-scope="scope">
        <span>{{statusMean(scope.row.cashStatus)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="货号" align="center" fixed="left">
      <template slot-scope="scope">
        <span>{{ scope.row.code }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_name') > -1" label="货品名称" align="center" width="200%">
      <template slot-scope="scope">
        <span>{{ scope.row.goodsName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_color_code') > -1" label="颜色编号" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.goodsColorCode }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_color_name') > -1" label="颜色名称" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.goodsColorName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('goods_size_name') > -1" label="尺码" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.goodsSizeName }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('tag_price') > -1" label="吊牌价" align="center" width="70%">
      <template slot-scope="scope">
        <span>{{ scope.row.tagPrice }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('bill_count') > -1" label="数量" align="center" width="50%">
      <template slot-scope="scope">
        <span>{{ scope.row.billCount }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('price') > -1" label="单价" align="center" width="70%">
      <template slot-scope="scope">
        <span>{{ scope.row.price }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('amount') > -1" label="金额" align="center" width="95%">
      <template slot-scope="scope">
        <span>{{ scope.row.amount }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('employ') > -1" label="营业员" align="center" width="200%">
      <template slot-scope="scope">
        <el-select v-model="scope.row.employId" filterable clearable remote default-first-option placeholder="请输入营业员" :remote-method="searchEmploy" @change="changeEmploy" :loading="loadingEmploy" style="width: 100%">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
        <el-option v-for="item in optionEmploy" :value="item.id" :label="item.code"/>
      </el-select>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('stock_count') > -1" label="库存" align="center" width="50%">
      <template slot-scope="scope">
        <span>{{ scope.row.stockCount }}</span>
      </template>
    </el-table-column>
    <el-table-column v-if="diyValues.indexOf('remarks') > -1" label="备注" align="center">
      <template slot-scope="scope">
        <el-input v-model="scope.row.remarks" placeholder="请输入内容"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="50%" fixed="right">
      <template slot-scope="scope">
        <el-button type="text" @click="goodsList.splice(scope.$index,1)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {getList as getEmployList} from '@/api/info/employ'

  export default {
    computed: {},
    data() {
      return {
        loadingEmploy: false,
        optionEmploy: []
      };
    },
    props: {
      goodsList: {
        default: []
      },
      listLoading: {
        default: false
      },
      lastEmployId: {
        default: ''
      },
      diyValues: {
        default: []
      }
    },
    methods: {
      statusMean(cashStatus) {
        return cashStatus === 1 ? '销售' : '退货'
      },
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
      changeEmploy(employId) {
        this.goodsList.filter(g => g.employId == null || g.employId == '').forEach(g => g.employId = employId)
        this.$emit('update:lastEmployId', employId)
      }
    }
  }
</script>
