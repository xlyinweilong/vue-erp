<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addOneRow" :loading="listLoading">增加一行</el-button>
      <el-input ref="searchBarCodeRef" class="filter-item" placeholder="扫描条形码" suffix-icon="el-icon-edit-outline" v-model.trim="barCode" style="width: 200px;" @keyup.enter.native="searchBarCode" :loading="listLoading"></el-input>
    </div>

    <el-row :gutter="20">
      <el-table
        v-loading="listLoading"
        :data="list"
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
            <el-select v-model.trim="scope.row.goodsId" filterable clearable remote default-first-option placeholder="请输入货号" :loading="loadingOptionGoodsList" style="width: 100%"
                       :remote-method="searchGoodsOption" @change="changeGoodsOption(scope.row)" @clear="clearGoodsSelect(scope.row)" @focus="focusGoodsSelected = scope.row">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
              <el-option v-for="item in scope.row.optionGoodsList" :value="item.id" :label="item.name +'-'+item.code"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="单价" align="center">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column label=吊牌价 align="center">
          <template slot-scope="scope">
            <span>{{scope.row.tagPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.detail.filter(d => d.billCount > 0).reduce((t,d) => t + parseInt(d.billCount),0) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.detail.filter(d => d.billCount > 0).reduce((t,d) => t + parseInt(d.billCount),0) * scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label=吊牌额 align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.detail.filter(d => d.billCount > 0).reduce((t,d) => t + parseInt(d.billCount),0) * scope.row.tagPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="openDialogForm(scope.row.goodsId)" :disabled="scope.row.goodsId == ''"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="list.splice(scope.$index,1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

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
            <el-input class="padding1" maxlength="5" v-model.trim="scope.row.data[index].billCount" @keyup.enter.native="dialogFormOk"></el-input>
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

  export default {
    computed: {},
    data() {
      return {
        //扫锚
        barCode: '',
        barCodeAutoFocus: false,
        //搜索货品
        focusGoodsSelected: null,
        loadingOptionGoodsList: false,
        searchedGoods: false,
        //弹出层
        dialogFormShow: false,
        dialogFormGoodsId: '',
        goodsDetail: {sizeList: [], tableData: []},
        dialogLoading: false
      };
    },
    props: {
      listLoading: {default: false},
      list: {default: []}
    },
    methods: {
      initFocus() {
        setTimeout(() => this.$refs.searchBarCodeRef.$el.querySelector('input').focus(), 200);
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
              d.push({colorId: data.goodsColorId, sizeId: data.goodsSizeId, billCount: 1})
              let optionGoodsList = []
              optionGoodsList.push({id: data.goodsId, name: data.goodsName, code: data.goodsCode})
              let g = {price: data.price, tagPrice: data.tagPrice, goodsId: data.goodsId, goodsCode: data.goodsCode, detail: d, optionGoodsList: optionGoodsList};
              this.list.push(g)
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
      //增加一行
      addOneRow() {
        this.list.push({price: '', tagPrice: 0, goodsId: '', goodsCode: '', detail: [], optionGoodsList: []})
      },
      //货品表格样式
      goodsTableRowClassName({row, rowIndex}) {
        if (!(row.price !== '' && row.price >= 0 && row.price <= 999999999)) {
          return 'warning-row';
        }
        if (row.goodsId === '' || row.detail.filter(d => d.billCount > 0).reduce((t, d) => t + parseInt(d.billCount), 0) === 0) {
          return 'warning-row';
        }
        return '';
      },
      //合计
      getSummaries(param) {
        const sums = [];
        sums[0] = '合计'
        sums[3] = param.data.reduce((x, y) => x + y.detail.filter(d => d.billCount > 0).reduce((t, d) => t + parseInt(d.billCount), 0), 0)
        sums[4] = param.data.reduce((x, y) => x + y.price * y.detail.filter(d => d.billCount > 0).reduce((t, d) => t + parseInt(d.billCount), 0), 0)
        sums[5] = param.data.reduce((x, y) => x + (isNaN(y.tagPrice) ? 0 : y.tagPrice) * y.detail.filter(d => d.billCount > 0).reduce((t, d) => t + parseInt(d.billCount), 0), 0)
        return sums;
      },
      //查询货品
      searchGoodsOption(query) {
        if (query !== '') {
          this.loadingOptionGoodsList = true
          getGoodsList({pageIndex: 1, pageSize: 10, searchKey: query}).then(response => {
            this.loadingOptionGoodsList = false
            this.focusGoodsSelected.optionGoodsList = response.data.content.filter(r => !this.list.some(g => g.goodsId == r.id));
          })
        } else {
          this.focusGoodsSelected.optionGoodsList = []
        }
      },
      //选择货品
      changeGoodsOption(goods) {
        goods.detail = []
        if (this.focusGoodsSelected == null) {
          goods.price = ''
          goods.tagPrice = 0
          goods.optionGoodsList = []
          return
        }
        let g = this.focusGoodsSelected.optionGoodsList.find(r => r.id === goods.goodsId)
        if (g != null) {
          goods.price = g.price
          goods.tagPrice = g.tagPrice
        }
      },
      //清空货品
      clearGoodsSelect(goods) {
        goods.optionGoodsList = []
        goods.detail = []
        goods.price = ""
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
      }
    }
  }
</script>
