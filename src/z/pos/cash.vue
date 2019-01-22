<template>
  <div>
    <sticky class-name="sub-navbar draft">
      选择渠道：
      <el-select class="filter-item" v-model="channelId" placeholder="请选择" style="width: 300px;" :disable="loadingChannelList">
        <el-option v-for="channel in channelList" :label="channel.name + '-' + channel.code" :value="channel.id"></el-option>
      </el-select>
    </sticky>

    <div class="app-container">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleTagPaneClick">
        <el-tab-pane label="收银" name="CASH">
          <div class="filter-container">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item>
                <el-select :disabled="loading" class="filter-item" v-model="inputType" style="width: 120px;" placeholder="请选择">
                  <el-option label="扫码" :value="0"></el-option>
                  <el-option label="手动输入" :value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态：">
                <el-select class="filter-item" style="width: 100px;" v-model="cashStatus" placeholder="请选择">
                  <el-option label="销售" :value="1"></el-option>
                  <el-option label="退货" :value="-1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="数量：">
                <el-input-number style="width: 112px;" class="filter-item" v-model="inputCount" :min="1" :max="100" label="数量"></el-input-number>
              </el-form-item>
              <el-form-item v-show="inputType === 0">
                <!--扫码-->
                <el-input :readonly="loading" ref="scanCode" class="filter-item" placeholder="条形码" v-model.trim="barCode" style="width: 200px;" @keyup.enter.native="doScanCode"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
              </el-form-item>
              <!--手动输入货品-->
              <input-goods1 v-show="inputType === 1" @add-goods="addGoods"></input-goods1>
            </el-form>
          </div>
          <goods-list-com :goodsList.sync="goodsList" :lastEmployId.sync="lastEmployId"></goods-list-com>
        </el-tab-pane>
        <el-tab-pane label="查询库存" name="SEARCH_STOCK">

        </el-tab-pane>
        <el-tab-pane label="查询销售" name="SEARCH_SALE">

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
  import {searchBarCode} from '@/api/pos/pos'
  import {sotckInfo} from '@/api/stock/channelStock'

  export default {
    name: 'cash',
    components: {Sticky, inputGoods1, goodsListCom},
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
        lastEmployId: ''
      }
    },
    created() {
      this.loadingChannelList = true
      getChannelList({pageIndex: 1, pageSize: 99999}).then(response => {
        this.channelList = response.data.content
        this.channelId = this.channelList[0].id
      }).finally(() => this.loadingChannelList = false)
    },
    methods: {
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
        let inGoods = this.goodsList.find(g => g.code === goods.code && g.goodsSizeId === goods.goodsSizeId && g.goodsColorId === goods.goodsColorId && g.cashStatus === goods.cashStatus)
        if (inGoods == null) {
          sotckInfo({channelId: this.channelId, goodsId: goods.id, goodsColorId: goods.goodsColorId, goodsSizeId: goods.goodsSizeId}).then(response => {
            console.log(response.data)
            this.goodsList.push(JSON.parse(JSON.stringify(goods)))
          }).finally(() => this.loading = false)
        } else {
          inGoods.billCount = inGoods.billCount + goods.billCount
        }
      },
      doScanCode() {
        if (!this.loading) {
          this.loading = true
          searchBarCode({code: this.barCode}).then(response => {
            this.addGoods(response.data)
          }).finally(() => this.loading = false)
        }
      }
    }
  }
</script>

<style scoped>

</style>
