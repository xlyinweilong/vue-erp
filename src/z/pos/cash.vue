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
          <el-form :inline="true" class="demo-form-inline" auto-complete="off">
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
            <el-col :span="9">
              <searchVip ref="searchVip" :vip="vip" @changeVip="changeVip"/>
            </el-col>
            <el-col :span="9">
              <employCom ref="searchEmploy" @changeEmploy="changeEmploy" :channelId="channelId"/>
            </el-col>
            <el-col :span="6">
              总金额：{{totalAmount}}
            </el-col>
          </el-row>
          <goods-list-com :goodsList.sync="goodsList" :lastPoint.sync="lastPoint" :lastEmploy.sync="lastEmploy" :list-loading.sync="loading" :diy-values.sync="diyValues" :totalActivityList="totalActivityList" ref="goodsListCom" @doSetAllGoods="doSetAllGoods"/>
          <div class="filter-container" style="margin-top: 5px;">
            <el-button type="primary" @click="showPayment = true" :disabled="goodsList.length == 0">结算</el-button>
            <el-button type="success" plain @click="showPuUp = true">挂单</el-button>
            <el-button type="warning" plain @click="showDayKnots = true">日结</el-button>
            <el-button type="success" plain @click="showPrint = true">单据打印</el-button>
          </div>
          <payment :show.sync="showPayment" :vip="vip" :totalAmount="totalAmount" :loading.sync="loading" @pay="pay" @updateCouponList="updateCouponList"/>
          <rePrint :show.sync="showPrint" :vip="vip" :channelId="channelId" :loading.sync="loading" @pay="pay" @updateCouponList="updateCouponList"/>
        </el-tab-pane>
        <el-tab-pane label="查询库存" name="SEARCH_STOCK">
          <searchStock/>
        </el-tab-pane>
        <el-tab-pane label="查询销售" name="SEARCH_SALE">
          <searchSale/>
        </el-tab-pane>
      </el-tabs>
    </div>
    <putUpCom :show.sync="showPuUp" :goodsList="goodsList" :vip="vip" @callBack="putUpBack"/>
    <dayKnotsCom :show.sync="showDayKnots" :channelId="channelId" @callBack="putUpBack"/>
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
  import employCom from '@/z/pos/cash/employCom'
  import rePrint from '@/z/pos/cash/rePrint'
  import saleActivity from '@/z/pos/cash/saleActivity'
  import payment from '@/z/pos/cash/payment'
  import {searchBarCode, pay} from '@/api/pos/pos'
  import {stockInfo} from '@/api/stock/channelStock'
  import {getList as getDiy} from '@/api/user/diy'
  import PrintJs from 'print-js'
  import {activityList} from '@/api/pos/pos'
  import putUpCom from '@/z/pos/cash/putUpCom'
  import dayKnotsCom from '@/z/pos/cash/dayKnotsCom'


  export default {
    name: 'cash',
    computed: {
      totalAmount() {
        return this.goodsList.reduce((t, d) => t + parseFloat(d.amount), 0)
      }
    },
    components: {Sticky, inputGoods1, goodsListCom, searchStock, searchSale, searchVip, saleActivity, payment, putUpCom, dayKnotsCom, rePrint, employCom},
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
        lastPoint: {id: '', code: ''},
        diyValues: [],
        //会员
        vip: {id: '', name: '', code: ''},
        employList: [],
        showPayment: false,
        //促销活动
        totalActivityList: [],
        //挂单
        showPuUp: false,
        //日结
        showDayKnots: false,
        //使用的待用卷
        couponList: [],
        //打印
        showPrint: false,
        baseApi: process.env.BASE_API
      }
    },
    created() {
      this.loadingChannelList = true
      getChannelList({pageIndex: 1, pageSize: 99999}).then(response => {
        this.channelList = response.data.content
        if (this.channelList.length > 0) {
          this.channelId = this.channelList[0].id
          this.init()
        }
      }).finally(() => this.loadingChannelList = false)
      getDiy({type: 'POS_CASH_LIST'}).then(response => this.diyValues = response.data)
    },
    methods: {
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
        goods.billCount = this.inputCount * this.cashStatus
        goods.remarks = ''
        goods.employId = this.lastEmploy.id
        goods.employCode = this.lastEmploy.code
        goods.employName = this.lastEmploy.name
        //默认的商场扣点
        let channel = this.channelList.find(c => c.id === this.channelId)
        goods.pointId = channel.marketPointId
        goods.pointCode = channel.marketPointCode
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
          goods.price = goods.salePrice = goods.tagPrice
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
      //修改会员
      changeEmploy(employList) {
        this.employList = employList
      },
      doSetAllGoods() {
        //初始化价格
        this.goodsList.filter(g => !g.isDiyPrice).forEach(g => {
          g.price = g.salePrice = g.tagPrice
        })
        //手动改价促销活动为空
        this.goodsList.filter(g => g.isDiyPrice).forEach(g => {
          g.canJoinActivityList = [{id: '', name: '请选择'}]
          g.activityId = ''
        })
        //设置促销活动
        let self = this
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
            g.price = Math.ceil(g.vipDiscount * g.price * 100) / 100
          }
          g.discount = g.price / g.salePrice
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
                g.price = g.salePrice = rr.discount * g.tagPrice
              }
              //货品改价
              let rg = activity.activityRuleGoodsList.find(rg => rg.goodsId === g.id)
              if (rg != null) {
                g.price = g.salePrice = rg.price
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
                        g.price = parseInt(Math.ceil((g.price * g.billCount - plusAmount) / g.billCount * 100)) / 100
                      }
                    } else {
                      //比例
                      let plusAmount = parseInt(g.price / totalGoodsAmount * totalPlusAmount * 100) / 100
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
        vo.couponList = this.couponList
        vo.employList = this.employList
        pay(vo).then(response => {
          this.showPayment = false
          this.init()
          this.$message({message: '支付成功', type: 'success'})
          //弹出打印
          PrintJs({printable: this.baseApi + '/api/pos/cash/print?code=' + response.data.code, type: 'pdf', header: '收银', maxWidth: 800, headerStyle: 'font-weight: 300;', targetStyles: ['*']})
        }).finally(() => this.loading = false)
      },
      //初始化页面
      init() {
        this.$refs.goodsListCom.init()
        this.$refs.searchVip.init()
        this.$refs.searchEmploy.init()
        this.goodsList = []
        this.vip = {id: '', name: '', code: ''}
        this.lastEmploy = {id: '', name: '', code: ''}
        this.lastPoint = {id: '', code: ''}
        this.getAllActivity()
      },
      putUpBack(json) {
        this.init()
        if (json.goodsList != null) {
          this.goodsList = json.goodsList
          this.vip = json.vip
          this.doSetAllGoods()
        }
      },
      updateCouponList(couponList) {
        this.couponList = couponList
      }
    }
  }
</script>

<style scoped>

</style>
