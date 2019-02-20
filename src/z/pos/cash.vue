<template>
  <div>
    <sticky class-name="sub-navbar draft">
      <el-select class="filter-item" v-model="channelId" placeholder="请选择" style="width: 300px;" :disable="loadingChannelList" @change="changeChannel">
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
            <input-goods1 ref="inputGoods1" v-show="inputType === 1" @add-goods="addGoods" :isDetail="loading"></input-goods1>
          </el-form>
          <el-row :gutter="20">
            <el-col :span="18">
              <searchVip ref="searchVip" :vip="vip" @changeVip="changeVip"/>
            </el-col>
            <el-col :span="6">
              总金额：{{totalAmount}}
            </el-col>
          </el-row>
          <goods-list-com :goodsList.sync="goodsList" :lastEmploy.sync="lastEmploy" :list-loading.sync="loading" :diy-values.sync="diyValues" :totalActivityList="totalActivityList" ref="goodsListCom" @doSetAllGoods="doSetAllGoods"/>
          <div class="filter-container" style="margin-top: 5px;">
            <el-button type="primary" @click="showPayment = true" :disabled="goodsList.length == 0">结算</el-button>
            <el-button type="success" plain>挂单</el-button>
          </div>
          <!--<saleActivity :channelId="channelId"/>-->
          <payment :show.sync="showPayment" :vip="vip" :totalAmount="totalAmount" :loading.sync="loading" @pay="pay"/>
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
  import searchVip from '@/z/pos/cash/searchVip'
  import saleActivity from '@/z/pos/cash/saleActivity'
  import payment from '@/z/pos/cash/payment'
  import {searchBarCode, pay} from '@/api/pos/pos'
  import {stockInfo} from '@/api/stock/channelStock'
  import {save as saveDiy, get as getDiy} from '@/api/pos/saleDiy'
  import PrintJs from 'print-js'
  import {activityList} from '@/api/pos/pos'

  export default {
    name: 'cash',
    computed: {
      totalAmount() {
        return this.goodsList.reduce((t, d) => t + parseFloat(d.amount), 0)
      }
    },
    components: {Sticky, inputGoods1, goodsListCom, searchStock, searchSale, searchVip, saleActivity, payment},
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
        lastEmploy: {id: '', name: '', code: ''},
        diyList: [{key: 'goods_name', label: '货品名称'}, {key: 'goods_color_code', label: '颜色编号'}, {key: 'goods_color_name', label: '颜色名称'}, {key: 'goods_size_name', label: '尺码'}
          , {key: 'goods_brand', label: '品牌'}, {key: 'goods_category', label: '类别'}, {key: 'goods_category2', label: '二级类别'}, {key: 'goods_series', label: '系列'}, {key: 'goods_pattern', label: '款型'}
          , {key: 'goods_style', label: '风格'}, {key: 'goods_season', label: '季节'}, {key: 'goods_year', label: '年份'}, {key: 'goods_sex', label: '性别'}, {key: 'goods_supplier_code', label: '供应商编号'}
          , {key: 'tag_price', label: '吊牌价'}, {key: 'bill_count', label: '数量'}, {key: 'price', label: '单价'}, {key: 'amount', label: '金额'}, {key: 'employ', label: '营业员'}
          , {key: 'goods_supplier_name', label: '供应商名称'}, {key: 'stock_count', label: '库存'}, {key: 'remarks', label: '备注'}],
        diyValues: [],
        //会员
        vip: {id: '', name: '', code: ''},
        showPayment: false,
        //促销活动
        totalActivityList: []
      }
    },
    created() {
      this.loadingChannelList = true
      getChannelList({pageIndex: 1, pageSize: 99999}).then(response => {
        this.channelList = response.data.content
        this.channelId = this.channelList[0].id
        this.init()
      }).finally(() => this.loadingChannelList = false)
      getDiy().then(response => {
        this.diyValues = response.data
      })

    },
    methods: {
      //偏好设置
      changeDiv() {
        saveDiy(this.diyValues).then()
      },
      //点击TAB页
      handleTagPaneClick(tab, event) {
        if (tab.name === 'CASH') {
          setTimeout(() => this.$refs.scanCode.$el.querySelector('input').focus(), 200);
        }
      },
      //切换渠道
      changeChannel() {
        this.init()
      },
      //查询当前渠道今天的全部促销活动
      getAllActivity() {
        this.loading = true
        activityList({channelId: this.channelId}).then(response => {
          this.totalActivityList = response.data
        }).finally(() => this.loading = false)
      },
      addGoods(goods) {
        goods.cashStatus = this.cashStatus
        goods.billCount = this.inputCount
        goods.remarks = ''
        goods.employId = this.lastEmploy.id
        goods.employCode = this.lastEmploy.code
        goods.employName = this.lastEmploy.name
        goods.amount = goods.stockCount = 0
        goods.isVipDiscount = goods.isDiyPrice = false
        goods.vipDiscount = 1
        goods.activityId = null
        goods.canJoinActivityList = []
        if (this.vip.id != '') {
          goods.isVipDiscount = true
          goods.vipDiscount = this.vip.discount
        }
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
        //把数量重置为1,把选择内容清空
        this.$refs.inputGoods1.init()
        this.inputCount = 1
      },
      doScanCode() {
        if (!this.loading) {
          this.loading = true
          searchBarCode({code: this.barCode}).then(response => {
            this.barCode = ''
            this.loading = false
            this.addGoods(response.data)
          }).catch(() => this.loading = false)
        }
      },
      //修改会员
      changeVip(vip) {
        this.vip = vip
        if (this.vip.id != '') {
          this.goodsList.forEach(g => {
            g.isVipDiscount = true
            g.vipDiscount = this.vip.discount
          })
        } else {
          this.goodsList.forEach(g => {
            g.isVipDiscount = false
            g.vipDiscount = 1
          })
        }
        this.doSetAllGoods()
      },
      doSetAllGoods() {
        //初始化价格
        this.goodsList.filter(g => !g.isDiyPrice).forEach(g => {
          g.price = g.tagPrice
        })
        //设置促销活动
        let self = this
        console.log(self.totalActivityList)
        this.goodsList.filter(g => !g.isDiyPrice).forEach(g => {
          g.canJoinActivityList = self.totalActivityList.filter(a =>
            (a.joinVipType === 'ALL') && (
              (a.type === 'PRICE_PROMOTION' && a.activityRuleGoodsList.some(rg => rg.goodsId === g.id)) ||
              (a.type === 'PRICE_PROMOTION' && a.activityRuleRangeList.some(rg => (rg.goodsBrandId == null || rg.goodsBrandId === g.brandId) && (rg.goodsCategoryId == null || rg.goodsCategoryId === g.categoryId) && (rg.goodsSeasonId == null || rg.goodsSeasonId === g.seasonId) && (rg.goodsYearId == null || rg.goodsYearId === g.yearId))) ||
              ((a.type === 'BUY_DISCOUNT' || a.type === 'BUY_PLUS') && (a.joinGoodsType === 'ALL' || a.activityGoodsList.some(rg => (rg.goodsId == null || rg.goodsId === g.id) && (rg.goodsBrandId == null || rg.goodsBrandId === g.brandId) && (rg.goodsCategoryId == null || rg.goodsCategoryId === g.categoryId) && (rg.goodsSeasonId == null || rg.goodsSeasonId === g.seasonId) && (rg.goodsYearId == null || rg.goodsYearId === g.yearId))))
            )
          )
          if (g.canJoinActivityList.length > 0 && !(g.activityId != null && g.canJoinActivityList.some(ja => ja.id === g.activityId)) && g.activityId != '') {
            g.activityId = g.canJoinActivityList[0].id
          }
          g.canJoinActivityList.unshift({id: '', name: '请选择'})
        })
        //执行活动
        this.doActivity()
        //设置价格
        this.goodsList.forEach(g => {
          //会员折扣
          if (!g.isDiyPrice && g.isVipDiscount) {
            g.price = Math.ceil(g.vipDiscount * g.price * 100)/100
          }
          g.discount = g.price / g.tagPrice
          g.amount = g.price * g.billCount
        })
      },
      //执行促销活动
      doActivity() {
        this.totalActivityList.filter(a => this.goodsList.some(g => g.activityId === a.id)).forEach(activity => {
          if (activity.type === 'PRICE_PROMOTION') {
            this.goodsList.filter(g => g.activityId === activity.id).forEach(g => {
              //货品改折扣
              let rr = activity.activityRuleRangeList.find(rg => (rg.goodsBrandId == null || rg.goodsBrandId === g.brandId) && (rg.goodsCategoryId == null || rg.goodsCategoryId === g.categoryId) && (rg.goodsSeasonId == null || rg.goodsSeasonId === g.seasonId) && (rg.goodsYearId == null || rg.goodsYearId === g.yearId))
              if (rr != null) {
                g.price = rr.discount * g.price
              }
              //货品改价
              let rg = activity.activityRuleGoodsList.find(rg => rg.goodsId === g.id)
              if (rg != null) {
                g.price = rg.price
              }
            })
          } else if (activity.type === 'BUY_DISCOUNT' || activity.type === 'BUY_PLUS') {
            let r = null
            if (activity.ruleType === 'QUANTITY') {
              let goodsCount = this.goodsList.filter(g => g.activityId === activity.id).length
              r = activity.activityRuleList.find(r => r.quantity <= goodsCount)
            } else if (activity.ruleType === 'AMOUNT') {
              let goodsAmount = this.goodsList.filter(g => g.activityId === activity.id).reduce((t, d) => t + parseFloat(d.price * d.billCount), 0)
              r = activity.activityRuleList.find(r => r.amount <= goodsAmount)
            }
            if (r != null) {
              if (activity.type === 'BUY_DISCOUNT') {
                this.goodsList.filter(g => g.activityId === activity.id).forEach(g => g.price = g.price * r.discount)
              } else if (activity.type === 'BUY_PLUS') {
                //总计减去的金额
                let totalPlusAmount = r.plusAmount
                //参加活动货品总金额
                let totalGoodsAmount = this.goodsList.filter(g => g.activityId === activity.id).reduce((t, d) => t + parseFloat(d.price * d.billCount), 0)
                if (totalGoodsAmount <= totalPlusAmount) {
                  this.goodsList.filter(g => g.activityId === activity.id).forEach(g => g.price = 0)
                } else {
                  //已经减去的金额
                  let hasPlusAmount = 0
                  let totalLine = this.goodsList.filter(g => g.activityId === activity.id).length
                  this.goodsList.filter(g => g.activityId === activity.id).sort((a, b) => a.price < b.price).forEach((g, i) => {
                    //判断当前商品是否是最后一个
                    if (totalLine == i + 1) {
                      //最后一个
                      let plusAmount = totalPlusAmount - hasPlusAmount
                      if (g.billCount === 1) {
                        g.price = g.price - plusAmount
                      } else {
                        g.price = parseInt(Math.ceil((g.price * g.billCount - plusAmount)/g.billCount * 100)) / 100
                      }
                    } else {
                      //比例
                      let plusAmount = parseInt(g.price / totalGoodsAmount * totalPlusAmount * 100) /100
                      g.price = g.price - plusAmount
                      hasPlusAmount += plusAmount * g.billCount
                    }
                  })
                }
              }
            }
          }
        })
      },
      //支付
      pay(paymentList) {
        let channel = this.channelList.find(c => c.id = this.channelId)
        let vo = {channelId: this.channelId, channelName: channel.name, channelCode: channel.code}
        vo.vipCode = this.vip.code
        vo.vipName = this.vip.name
        vo.vipId = this.vip.id
        vo.vipGradeId = this.vip.gradeId
        vo.goodsList = this.goodsList
        vo.paymentList = paymentList.filter(p => p.amount > 0)
        this.loading = true
        if (vo.vipId == '') {
          vo.goodsList.forEach(g => g.vipDiscount = null)
        }
        vo.goodsList.filter(g => g.isDiyPrice).forEach(g => g.diyPrice = g.price)
        pay(vo).then(response => {
          this.showPayment = false
          this.init()
          this.$message({message: '支付成功', type: 'success'})
          //弹出打印
          PrintJs({printable: 'http://localhost:9527/static/print.html', type: 'pdf', header: '收银', maxWidth: 800, headerStyle: 'font-weight: 300;', targetStyles: ['*']})
        }).finally(() => this.loading = false)
      },
      //初始化页面
      init() {
        this.$refs.goodsListCom.init()
        this.$refs.searchVip.init()
        this.goodsList = []
        this.lastEmploy = {id: '', name: '', code: ''}
        this.getAllActivity()
      }
    }
  }
</script>

<style scoped>

</style>
