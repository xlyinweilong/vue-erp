<template>
  <div>
    <div class="filter-container">
      <el-input class="filter-item" placeholder="搜素货品" suffix-icon="el-icon-search" v-model.trim="listQuery.searchKey" style="width: 350px;" @keyup.native="findPage"></el-input>
    </div>

    <el-row :gutter="20">
      <el-table
        v-loading="listLoading"
        :data="detailList"
        tooltip-effect="dark"
        style="width: 100%"
        fit
        border
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column label="货品" align="center" min-width="250">
          <template slot-scope="scope">
            <el-input prefix-icon="el-icon-search" :value="scope.row.goodsName  +'-'+scope.row.goodsCode" :disabled="true"/>
          </template>
        </el-table-column>
        <el-table-column label="单价" align="center">
          <template slot-scope="scope">
            <el-input :disabled="true" v-model.trim="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column label=吊牌价 align="center">
          <template slot-scope="scope">
            <span>{{scope.row.tagPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.detail.filter(d => d.billCount > 0 || d.billCount < 0).reduce((t,d) => t + parseInt(d.billCount),0) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="hasParent" label="差异数" align="center">
          <template slot-scope="scope">
            <span :style="differenceGoodsCount(scope.row) > 0 ? 'color:red' : ''" v-text="differenceGoodsCount(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column label="金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.detail.filter(d => d.billCount > 0 || d.billCount < 0).reduce((t,d) => t + parseInt(d.billCount),0) * scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label=吊牌额 align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.detail.filter(d => d.billCount > 0 || d.billCount < 0).reduce((t,d) => t + parseInt(d.billCount),0) * scope.row.tagPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-view" circle @click="openDialogForm(scope.row.goodsId)" :disabled="scope.row.goodsId == ''"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <pagination :total="list.length" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="findPage"/>

    <el-dialog title="货品详情" :visible.sync="dialogFormShow" width="85%">
      <el-table
        :data="goodsDetail.tableData"
        :loading="dialogLoading"
        border
        style="width: 100%"
        class="myt"
      >
        <el-table-column fixed label="颜色编号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.colorCode}}</template>
        </el-table-column>
        <el-table-column fixed label="颜色名称" width="120" align="center">
          <template slot-scope="scope">{{scope.row.colorName}}</template>
        </el-table-column>
        <el-table-column v-for="(s,index) in goodsDetail.sizeList" :label="s.name" min-width="60" align="center">
          <template slot-scope="scope">
            <el-input :disabled="true" class="padding1" maxlength="5" v-model.trim="scope.row.data[index].billCount" @keyup.enter.native="dialogFormOk"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormShow = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import {getGoodsColorAndSizeList} from '@/api/info/goods'

  export default {
    components: {
      Pagination
    },
    computed: {},
    data() {
      return {
        detailList: [],
        //搜索货品
        focusGoodsSelected: null,
        loadingOptionGoodsList: false,
        searchedGoods: false,
        //弹出层
        dialogFormShow: false,
        dialogFormGoodsId: '',
        goodsDetail: {sizeList: [], tableData: []},
        dialogLoading: false,
        list:[],
        listQuery: {pageIndex: 1, pageSize: 10, searchKey: ''}
      };
    },
    props: {
      warehouseId: {default: '', required: false},
      channelId: {default: '', required: false},
      listLoading: {default: false},
      parentList: {required: false},
      hasParent: {default: false, required: false}
    },
    methods: {
      initPage(list) {
        this.list = list
        this.findPage()
      },
      findPage() {
        this.detailList = this.list.filter(r => this.listQuery.searchKey == ''
          || r.goodsCode.indexOf(this.listQuery.searchKey) > -1 || r.goodsName.indexOf(this.listQuery.searchKey) > -1 || r.price == this.listQuery.searchKey
        ).slice((this.listQuery.pageIndex - 1) * this.listQuery.pageSize, this.listQuery.pageIndex * this.listQuery.pageSize)
      },
      //明细数据
      //合计
      getSummaries(param) {
        const sums = [];
        sums[0] = '合计'
        sums[3] = param.data.reduce((x, y) => x + y.detail.filter(d => d.billCount > 0).reduce((t, d) => t + parseInt(d.billCount), 0), 0)
        let amountNum = 4
        let tagAmountNum = 5
        if (this.hasParent) {
          amountNum += 1
          tagAmountNum += 1
        }
        sums[amountNum] = param.data.reduce((x, y) => x + y.price * y.detail.filter(d => d.billCount > 0).reduce((t, d) => t + parseInt(d.billCount), 0), 0)
        sums[tagAmountNum] = param.data.reduce((x, y) => x + (isNaN(y.tagPrice) ? 0 : y.tagPrice) * y.detail.filter(d => d.billCount > 0).reduce((t, d) => t + parseInt(d.billCount), 0), 0)
        return sums;
      },
      //弹出框
      openDialogForm(goodsId) {
        this.dialogFormShow = true;
        this.dialogFormGoodsId = goodsId
        this.searchGoodsColorAndInSizeAndSizeList(goodsId)
      },
      //查询货品的颜色、内长、尺码
      searchGoodsColorAndInSizeAndSizeList(goodsId) {
        this.dialogLoading = true
        this.goodsDetail.sizeList = this.goodsDetail.tableData = []
        let goods = this.list.find(r => r.goodsId === goodsId)
        getGoodsColorAndSizeList({id: goodsId}).then(response => {
          this.dialogLoading = false
          this.goodsDetail.sizeList = response.data.sizeList
          response.data.colorList.forEach(color => {
            let d = [];
            response.data.sizeList.forEach(s => {
              let detail = goods.detail.find(g => g.sizeId === s.id && g.colorId === color.colorId);
              if (detail != null) {
                d.push({sizeId: s.id, billCount: detail.billCount})
              } else {
                d.push({sizeId: s.id, billCount: ''})
              }
            })
            this.goodsDetail.tableData.push({colorId: color.colorId, colorCode: color.colorCode, colorName: color.colorName, data: d})
          });
        })
      },
      //弹出框确定
      dialogFormOk() {
        let goods = this.list.find(r => r.goodsId === this.dialogFormGoodsId)
        goods.detail = [];
        this.goodsDetail.tableData.forEach(d => d.data.filter(s => s.billCount > 0).forEach(s => goods.detail.push({sizeId: s.sizeId, colorId: d.colorId, billCount: s.billCount})));
        this.dialogFormShow = false
      },
      //差异数
      differenceGoodsCount(row) {
        if (!this.hasParent) {
          return 0
        }
        let goods = this.parentList.find(p => p.goodsId === row.goodsId)
        if (goods != null) {
          //对比每个尺码
          let totalDiff = 0
          goods.detail.forEach(p => {
            let rs = row.detail.find(s => s.sizeId === p.sizeId && s.colorId === p.colorId)
            if (rs != null) {
              totalDiff += Math.abs(p.billCount - rs.billCount)
            } else {
              totalDiff += p.billCount
            }
          })
          row.detail.forEach(p => {
            let rs = goods.detail.find(s => s.sizeId === p.sizeId && s.colorId === p.colorId)
            if (rs == null) {
              totalDiff += p.billCount
            }
          })
          return totalDiff
        } else {
          return row.detail.filter(d => d.billCount > 0).reduce((t, d) => t + parseInt(d.billCount), 0)
        }
      }
    }
  }
</script>
