<template>
  <div>
    <div class="filter-container">
      <el-select class="filter-item" v-model="inputType" placeholder="请选择" @change="initFocus">
        <el-option label="扫码" :value="0"></el-option>
        <el-option label="手动输入" :value="1"></el-option>
      </el-select>
      <el-input v-show="inputType === 0" ref="searchBarCodeRef" class="filter-item" placeholder="扫描条形码" suffix-icon="el-icon-edit-outline" v-model.trim="barCode" style="width: 250px;" @keyup.enter.native="searchBarCode" :loading="listLoading"></el-input>
      <el-select style="width: 250px;" v-show="inputType === 1" ref="searchGoodsCodeRef" class="filter-item" v-model.trim="goodsId" filterable clearable remote default-first-option placeholder="请输入货号" :loading="loadingOptionGoodsList" :remote-method="searchGoodsOption" @change="changeGoodsSelect" @clear="clearGoodsSelect">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
        <el-option v-for="item in optionGoodsList" :value="item.id" :label="item.code"/>
      </el-select>
    </div>

    <el-row :gutter="20">
      <el-table
        v-loading="listLoading"
        :data="detailList"
        :row-class-name="goodsTableRowClassName"
        tooltip-effect="dark"
        style="width: 100%"
        fit
        border
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column label="货品" align="center" min-width="250">
          <template slot-scope="scope">
            <span>{{scope.row.goodsCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价" align="center">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.price" @keyup.enter.native="openDialogForm(scope.row.goodsId)"></el-input>
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
            <el-button type="primary" icon="el-icon-edit" circle @click="openDialogForm(scope.row.goodsId)" :disabled="scope.row.goodsId == ''"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="list.splice(scope.$index,1);initFocus()"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <pagination v-if="list.length != null" :total="list.length" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"/>

    <el-dialog title="货品详情" :visible.sync="dialogFormShow" width="85%">
      <el-table
        :data="goodsDetail.tableData"
        v-loading="dialogLoading"
        border
        style="width: 100%"
        class="myt"
        :row-class-name="tableRowClassName"
      >
        <el-table-column fixed label="颜色编号" width="120" align="center">
          <template slot-scope="scope"><span v-text="scope.row.isData ? scope.row.colorCode : scope.row.typeName"></span></template>
        </el-table-column>
        <el-table-column fixed label="颜色名称" width="120" align="center">
          <template slot-scope="scope"><span v-text="scope.row.isData ? scope.row.colorName : ''"></span></template>
        </el-table-column>
        <el-table-column v-for="(s,index) in goodsDetail.sizeList" :label="s.name" min-width="60" align="center">
          <template slot-scope="scope">
            <!--<el-input-number class="padding1" style="width: 100%" v-model="scope.row.data[index].billCount" :controls="false" :precision="0" :step="1" :max="999999" @keyup.enter.native="dialogFormOk"></el-input-number>-->
            <el-input v-if="scope.row.isData" ref="detailGoodsInput" class="padding1" maxlength="6" v-model.trim="scope.row.data[index].billCount" @keyup.native="keyUpDetailCountInput($event,scope.$index,index)" @focus="focusDetailCountInput(scope.$index,index)"></el-input>
            <span v-if="!scope.row.isData" ref="detailGoodsInput" v-text="scope.row.data[index] == null ? '0' : scope.row.data[index].billCount"></span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormShow = false">关闭</el-button>
        <el-button type="primary" @click="dialogFormOk">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getGoodsColorAndSizeList} from '@/api/info/goods'
  import {getGoodsList, searchBarCode} from '@/api/bill/bill'
  import {stockList as channelStockList} from '@/api/stock/channelStock'
  import {stockList as warehouseStockList} from '@/api/stock/warehouseStock'
  import Pagination from '@/components/Pagination'

  export default {
    computed: {
      detailList: function () {
        return this.list.filter(r => this.listQuery.searchKey == ''
          || r.goodsCode.indexOf(this.listQuery.searchKey) > -1 || r.goodsName.indexOf(this.listQuery.searchKey) > -1 || r.price == this.listQuery.searchKey
        ).slice((this.listQuery.pageIndex - 1) * this.listQuery.pageSize, this.listQuery.pageIndex * this.listQuery.pageSize)
      }
    },
    components: {
      Pagination
    },
    data() {
      return {
        inputType: 0,
        //扫锚
        barCode: '',
        //搜索货品
        goodsId: '',
        optionGoodsList: null,
        loadingOptionGoodsList: false,
        //弹出层
        dialogFormShow: false,
        dialogFormGoodsId: '',
        goodsDetail: {sizeList: [], tableData: [], stockList: []},
        dialogLoading: false,
        listQuery: {pageIndex: 1, pageSize: 50, searchKey: ''}
      };
    },
    props: {
      warehouseId: {default: '', required: false},
      channelId: {default: '', required: false},
      listLoading: {default: false, required: false},
      list: {default: []},
      parentList: {required: false},
      hasParent: {default: false, required: false},
      parentTypeName: {default: '', required: false},
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (!row.isData) {
          return 'gray-row';
        }
        return '';
      },
      initFocus() {
        if (this.inputType === 0) {
          this.$nextTick(() => this.$refs.searchBarCodeRef.focus())
        } else {
          this.$nextTick(() => this.$refs.searchGoodsCodeRef.focus())
        }
      },
      //明细数据
      //扫锚
      searchBarCode() {
        if (!this.listLoading) {
          this.$emit('update:list-loading', true)
          searchBarCode({code: this.barCode}).then(response => {
            this.barCode = ''
            let data = response.data
            let theBillGoods = this.list.find(l => l.goodsId != '' && l.goodsId === data.goodsId)
            //判断单据货品是否已经存在
            if (theBillGoods == null) {
              let d = []
              d.push({sizeName: data.goodsSizeName, colorCode: data.goodsColorCode, colorName: data.goodsColorName, colorId: data.goodsColorId, sizeId: data.goodsSizeId, billCount: 1})
              let g = {price: data.price, tagPrice: data.tagPrice, goodsId: data.goodsId, goodsCode: data.goodsCode, detail: d};
              this.list.unshift(g)
            } else {
              //判断detail是否存在
              let theBillDetail = theBillGoods.detail.find(d => d.colorId === data.goodsColorId && d.sizeId === data.goodsSizeId)
              if (theBillDetail != null) {
                theBillDetail.billCount += 1
              } else {
                theBillDetail.detail.push({colorId: data.goodsColorId, sizeId: data.goodsSizeId, billCount: 1})
              }
            }
          }).catch(() => this.$emit('update:list-loading', false))
        }
      },
      //货品表格样式
      goodsTableRowClassName({row, rowIndex}) {
        if (!(row.price !== '' && row.price >= 0 && row.price <= 999999999)) {
          return 'warning-row'
        }
        if (row.goodsId === '' || row.detail.filter(d => d.billCount > 0).reduce((t, d) => t + parseInt(d.billCount), 0) === 0) {
          return 'warning-row'
        }
        return ''
      },
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
      //查询货品
      searchGoodsOption(query) {
        if (query !== '') {
          this.loadingOptionGoodsList = true
          getGoodsList({pageIndex: 1, pageSize: 10, searchKey: query.trim()}).then(response => {
            this.loadingOptionGoodsList = false
            this.optionGoodsList = response.data.content
          })
        } else {
          this.optionGoodsList = []
        }
      },
      //选择货品
      changeGoodsSelect() {
        if (this.goodsId != '') {
          let goods = this.list.find(g => g.goodsId === this.goodsId)
          if (goods == null) {
            let g = this.optionGoodsList.find(r => r.id === this.goodsId)
            goods = {goodsId: g.id, goodsCode: g.code, detail: [], price: g.price, tagPrice: g.tagPrice}
            this.list.unshift(goods)
          }
          this.clearGoodsSelect()
          this.openDialogForm(goods.goodsId)
        }
      },
      //清空货品
      clearGoodsSelect() {
        this.goodsId = ''
        this.optionGoodsList = []
      },
      //弹出框
      openDialogForm(goodsId) {
        this.dialogFormShow = true;
        this.dialogFormGoodsId = goodsId
        this.goodsDetail.tableData = []
        if (this.warehouseId == '' && this.channelId == '') {
          this.searchGoodsColorAndInSizeAndSizeList(goodsId, false)
        } else {
          this.searchStock(goodsId, true)
        }
      },
      //查询货品的颜色、尺码
      searchGoodsColorAndInSizeAndSizeList(goodsId, isShowPlaceholder) {
        this.dialogLoading = true
        this.goodsDetail.sizeList = []
        let goods = this.list.find(r => r.goodsId === goodsId)
        getGoodsColorAndSizeList({id: goodsId}).then(response => {
          this.goodsDetail.sizeList = response.data.sizeList
          response.data.colorList.forEach(color => {
            let d = []
            let pd = []//上游
            let sd = []//库存
            response.data.sizeList.forEach(s => {
              let detail = goods.detail.find(g => g.sizeId === s.id && g.colorId === color.colorId)
              d.push({sizeName: s.name, sizeId: s.id, billCount: detail != null ? detail.billCount : ''})
              //上游
              if (this.hasParent && this.parentList != null) {
                //输入上游数量
                let parentGoods = this.parentList.find(g => g.goodsId === goodsId)
                if (parentGoods != null) {
                  let parentDetail = parentGoods.detail.find(d => d.colorId === color.colorId && d.sizeId === s.id)
                  pd.push({sizeName: s.name, sizeId: s.id, billCount: parentDetail != null ? parentDetail.billCount : 0})
                } else {
                  pd.push({sizeName: s.name, sizeId: s.id, billCount: 0})
                }
              }
              //库存
              if (this.warehouseId != '' || this.channelId != '') {
                let stock = this.goodsDetail.stockList.find(st => st.goodsId === goodsId && st.goodsSizeId === s.id && st.goodsColorId === color.colorId)

                sd.push({sizeName: s.name, sizeId: s.id, billCount: stock != null ? stock.stockCount : 0})
              }
            })
            this.goodsDetail.tableData.push({colorId: color.colorId, colorCode: color.colorCode, colorName: color.colorName, data: d, isData: true})
            //上游
            if (this.hasParent && this.parentList != null) {
              this.goodsDetail.tableData.push({colorId: color.colorId, colorCode: color.colorCode, colorName: color.colorName, data: pd, isData: false, type: 'PARENT', typeName: this.parentTypeName})
            }
            //库存
            if (this.warehouseId != '' || this.channelId != '') {
              this.goodsDetail.tableData.push({colorId: color.colorId, colorCode: color.colorCode, colorName: color.colorName, data: sd, isData: false, type: 'STOCK', typeName: '库存'})
            }
          })
          this.$nextTick(() => setTimeout(() => this.$refs.detailGoodsInput[0].focus(), 200))
        }).finally(() => this.dialogLoading = false)
      },
      //查询库存
      searchStock(goodsId, isShowPlaceholder) {
        let fun = this.warehouseId != '' ? warehouseStockList : channelStockList
        this.dialogLoading = true
        fun({warehouseId: this.warehouseId, channelId: this.channelId, goodsId: goodsId, pageIndex: 1, pageSize: 65535}).then(response => {
          this.goodsDetail.stockList = response.data.content
          this.searchGoodsColorAndInSizeAndSizeList(goodsId, isShowPlaceholder)
        })
      },
      //弹出框确定
      dialogFormOk() {
        let goods = this.list.find(r => r.goodsId === this.dialogFormGoodsId)
        goods.detail = []
        //数据int化
        this.goodsDetail.tableData.forEach(d => d.data.filter(s => s.billCount > 0).forEach(s => s.billCount = parseInt(s.billCount)))
        this.goodsDetail.tableData.forEach(d => d.data.filter(s => s.billCount > 0).forEach(s => goods.detail.push({colorName: d.colorName, colorCode: d.colorCode, sizeName: s.sizeName, sizeId: s.sizeId, colorId: d.colorId, billCount: s.billCount})));
        this.dialogFormShow = false
        this.initFocus()
      },
      //数量获取焦点
      focusDetailCountInput(rowIndex, index) {
        this.$refs.detailGoodsInput[rowIndex * this.goodsDetail.sizeList.length + index].select()
      },
      //操作上下左右
      keyUpDetailCountInput(event, rowIndex, index) {
        let i = 1
        if (this.hasParent && this.parentList != null) {
          i++
        }
        //库存
        if (this.warehouseId != '' || this.channelId != '') {
          i++
        }
        if (event.keyCode === 13) {
          this.dialogFormOk()
        } else if (event.keyCode === 38) {
          this.focusDetailCountInput(rowIndex > 0 ? rowIndex - i : rowIndex, index)
        } else if (event.keyCode === 40) {
          this.focusDetailCountInput(rowIndex + 1 < this.goodsDetail.tableData.filter(d => d.isData).length ? rowIndex + i : rowIndex, index)
        } else if (event.keyCode === 39) {
          this.focusDetailCountInput(rowIndex, index + 1 < this.goodsDetail.sizeList.length ? index + 1 : index)
        } else if (event.keyCode === 37) {
          this.focusDetailCountInput(rowIndex, index > 0 ? index - 1 : index)
        }
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


<style scoped>
  .el-table .gray-row {
    background: #C0C4CC
  }
</style>
