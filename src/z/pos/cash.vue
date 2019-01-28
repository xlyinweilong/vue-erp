<template>
  <div>
    <sticky class-name="sub-navbar draft">
      <el-select class="filter-item" v-model="channelId" placeholder="请选择" style="width: 300px;" :disable="loadingChannelList">
        <el-option v-for="channel in channelList" :label="channel.name + '-' + channel.code" :value="channel.id"></el-option>
      </el-select>
    </sticky>

    <div class="app-container">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleTagPaneClick">
        <el-tab-pane label="收银" name="CASH">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-select :disabled="loading" v-model="inputType" style="width: 120px;" placeholder="请选择">
                <el-option label="扫码" :value="0"></el-option>
                <el-option label="手动输入" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select style="width: 100px;" v-model="cashStatus" placeholder="请选择">
                <el-option label="销售" :value="1"></el-option>
                <el-option label="退货" :value="-1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数量：">
              <el-input-number style="width: 112px;" v-model="inputCount" :min="1" :max="100" label="数量"></el-input-number>
            </el-form-item>
            <el-form-item v-show="inputType === 0">
              <!--扫码-->
              <el-input :readonly="loading" ref="scanCode" placeholder="条形码" v-model.trim="barCode" style="width: 200px;" @keyup.enter.native="doScanCode"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
            </el-form-item>
            <!--手动输入货品-->
            <input-goods1 v-show="inputType === 1" @add-goods="addGoods" :isDetail="loading"></input-goods1>
          </el-form>
          <goods-list-com :goodsList.sync="goodsList" :lastEmployId.sync="lastEmployId" :list-loading.sync="loading" :diy-values.sync="diyValues"/>
          <div class="filter-container" style="margin-top: 5px;">
            <el-button type="primary">结算</el-button>
            <el-button type="success" plain>挂单</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="查询库存" name="SEARCH_STOCK">
          <searchStock/>
        </el-tab-pane>
        <el-tab-pane label="查询销售" name="SEARCH_SALE">
          <searchSale/>
        </el-tab-pane>
        <el-tab-pane label="偏好" name="CASH_DIY">
          <div style="text-align: center;">
            <el-transfer :titles="['不显示的标题', '显示的标题']" v-model="diyValues" :data="diyList" style="text-align: left; display: inline-block;" @change="changeDiv"></el-transfer>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import permission from '@/directive/permission/index.js'
  import {getList as getChannelList} from '@/api/info/channel'
  import inputGoods1 from '@/z/pos/cash/inputGoods1'
  import goodsListCom from '@/z/pos/cash/goodsListCom'
  import searchStock from '@/z/pos/cash/searchStock'
  import searchSale from '@/z/pos/cash/searchSale'
  import {searchBarCode} from '@/api/pos/pos'
  import {stockInfo} from '@/api/stock/channelStock'
  import {save as saveDiy,get as getDiy} from '@/api/pos/saleDiy'

  export default {
    name: 'cash',
    components: {Sticky, inputGoods1, goodsListCom, searchStock, searchSale},
    directives: {permission},
    filters: {},
    data() {
      return {
        loading: false,
        //渠道
        loadingChannelList: false,
        channelList: [],
        channelId: '',
        //tab
        activeName: 'CASH',
        //货品录入
        inputType: 0,
        inputCount: 1,
        cashStatus: 1,
        //扫码
        barCode: '',
        //货品列表
        goodsList: [],
        lastEmployId: '',
        diyList: [{key: 'goods_name', label: '货品名称'}, {key: 'goods_color_code', label: '颜色编号'}, {key: 'goods_color_name', label: '颜色名称'}, {key: 'goods_size_name', label: '尺码'}
          , {key: 'goods_brand', label: '品牌'}, {key: 'goods_category', label: '类别'}, {key: 'goods_category2', label: '二级类别'}, {key: 'goods_series', label: '系列'}, {key: 'goods_pattern', label: '款型'}
          , {key: 'goods_style', label: '风格'}, {key: 'goods_season', label: '季节'}, {key: 'goods_year', label: '年份'}, {key: 'goods_sex', label: '性别'}, {key: 'goods_supplier_code', label: '供应商编号'}
          , {key: 'tag_price', label: '吊牌价'}, {key: 'bill_count', label: '数量'}, {key: 'price', label: '单价'}, {key: 'amount', label: '金额'}, {key: 'employ', label: '营业员'}
          , {key: 'goods_supplier_name', label: '供应商名称'}, {key: 'stock_count', label: '库存'}, {key: 'remarks', label: '备注'}],
        diyValues: []
      }
    },
    created() {
      this.loadingChannelList = true
      getChannelList({pageIndex: 1, pageSize: 99999}).then(response => {
        this.channelList = response.data.content
        this.channelId = this.channelList[0].id
      }).finally(() => this.loadingChannelList = false)
      getDiy().then(response => {
        this.diyValues = response.data
      })
    },
    methods: {
      changeDiv() {
        saveDiy(this.diyValues).then()
      },
      handleTagPaneClick(tab, event) {
        if (tab.name === 'CASH') {
          setTimeout(() => this.$refs.scanCode.$el.querySelector('input').focus(), 200);
        }
      },
      addGoods(goods) {
        goods.cashStatus = this.cashStatus
        goods.billCount = this.inputCount
        goods.remarks = ''
        goods.employId = this.lastEmployId
        goods.amount = goods.stockCount = 0
        let inGoods = this.goodsList.find(g => g.code === goods.code && g.goodsSizeId === goods.goodsSizeId && g.goodsColorId === goods.goodsColorId && g.cashStatus === goods.cashStatus)
        if (inGoods == null) {
          goods.price = goods.tagPrice
          this.loading = true
          stockInfo({channelId: this.channelId, goodsId: goods.id, goodsColorId: goods.goodsColorId, goodsSizeId: goods.goodsSizeId}).then(response => {
            if (response.data != null) {
              goods.stockCount = response.data.stockCount
            }
            this.goodsList.push(JSON.parse(JSON.stringify(goods)))
            this.doSetAllGoods()
          }).finally(() => this.loading = false)
        } else {
          inGoods.billCount = inGoods.billCount + goods.billCount
          this.doSetAllGoods()
        }
      },
      doScanCode() {
        if (!this.loading) {
          this.loading = true
          searchBarCode({code: this.barCode}).then(response => {
            this.barCode =  ''
            this.loading = false
            this.addGoods(response.data)
          }).catch(() => this.loading = false)
        }
      },
      doSetAllGoods() {
        this.goodsList.forEach(g => {
          g.amount = g.price * g.billCount
        })
      }
    }
  }
</script>

<style scoped>

</style>
