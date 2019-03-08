<template>
  <div>
    <el-row :gutter="20">
      <el-table
        v-loading="listLoading"
        :data="goodsList"
        tooltip-effect="dark"
        style="width: 100%"
        fit
        border
      >
        <el-table-column label="货品" align="center" min-width="250">
          <template slot-scope="scope">
            <span>{{scope.row.goodsCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="颜色编号" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.colorCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="颜色名称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.colorName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="尺码" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.sizeName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="原单数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.parentCount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.billCount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="差异数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.parentCount - scope.row.billCount}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>

  export default {
    computed: {},
    data() {
      return {
        goodsList: []
      };
    },
    props: {
      listLoading: {default: false},
      list: {default: []},
      parentList: {default: []},
    },
    methods: {
      init() {
        this.goodsList = []
        this.list.forEach(g => g.detail.filter(d => d.billCount > 0).forEach(d => this.goodsList.push({goodsId: g.goodsId, colorId: d.colorId, sizeId: d.sizeId, goodsCode: g.goodsCode, colorName: d.colorName, colorCode: d.colorCode, sizeName: d.sizeName, billCount: d.billCount, parentCount: 0})))
        this.parentList.forEach(g => g.detail.filter(d => d.billCount > 0).forEach(d => {
          let parent = this.goodsList.find(gd => gd.colorId === d.colorId && gd.sizeId === d.sizeId && gd.goodsId === g.goodsId)
          if (parent == null) {
            this.goodsList.push({goodsId: g.goodsId, colorId: d.colorId, sizeId: d.sizeId, goodsCode: g.goodsCode, colorName: d.colorName, colorCode: d.colorCode, sizeName: d.sizeName, billCount: 0, parentCount: d.billCount})
          } else {
            parent.parentCount = d.billCount
          }
        }))
        this.goodsList = this.goodsList.filter(g => g.parentCount != g.billCount)
      }
    }
  }
</script>
