<template>
  <div>
    <sticky class-name="sub-navbar draft">
      <el-button style="margin-left: 10px;" type="success" @click="saveData" :loading="loading">保存</el-button>
    </sticky>

    <div class="tab-container">
      <el-form ref="billForm" :model="form" :rules="rules" v-loading="loading">
        <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card" @tab-click="handleTagPaneClick">
          <el-tab-pane label="基本资料" name="BASE">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="活动编号" prop="code">
                  <el-input v-model="form.code" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="活动名称" prop="name">
                  <el-input v-model="form.name" placeholder="请输入活动名称"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="促销方式" prop="type">
                  <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
                    <el-option label="买满打折" value="BUY_DISCOUNT" />
                    <el-option label="买满立减" value="BUY_PLUS" />
                    <el-option label="买满赠送" value="BUY_GIVE" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="优先级别" prop="priority">
                  <el-select v-model="form.priority" placeholder="请选择" style="width: 100%" filterable default-first-option>
                    <el-option v-for="item in [0,1,2,3,4,5,6,7,8,9]" :label="item" :value="item"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="商场扣点" prop="points">
                  <el-input-number style="width: 100%" v-model="form.points" :min="0" :max="1" :precision="3" :step="0.01" label="输入0到1的小数"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="活动开始时间" prop="startDate">
                  <el-date-picker style="width: 100%" v-model="form.startDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="活动结束时间" prop="endDate">
                  <el-date-picker style="width: 100%" v-model="form.endDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="特定星期">
                  <el-select v-model="form.executeWeek" placeholder="请选择" style="width: 100%" filterable multiple default-first-option>
                    <el-option v-for="item in [1,2,3,4,5,6,7]" :label="item" :value="item"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="备注">
                <el-input type="textarea" :rows="2" placeholder="请输入备注说明" v-model="form.marks"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

          </el-tab-pane>

          <el-tab-pane label="促销规则" name="RULE">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="条件方式" prop="type">
                  <el-select v-model="form.ruleType" placeholder="请选择" style="width: 100%">
                    <el-option label="按照数量" value="QUANTITY" />
                    <el-option label="按照金额" value="AMOUNT" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <activityRuleSelect :activityType="form.type" :ruleType="form.ruleType" :list="ruleList"></activityRuleSelect>
          </el-tab-pane>

          <el-tab-pane label="参与店铺" name="CHANNEL">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="参与店铺" prop="type">
                  <el-select v-model="form.joinChannelType" placeholder="请选择" style="width: 100%">
                    <el-option label="所有店铺参加" value="ALL" />
                    <el-option label="指定的店铺参加" value="APPOINT" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <activityChannelSelect v-show="form.joinChannelType == 'APPOINT'" :list="channelList"></activityChannelSelect>
          </el-tab-pane>
          <el-tab-pane label="条件商品" name="CONDITION_GOODS">
            <activityGoodsSelect :list="conditionGoodsList"></activityGoodsSelect>
          </el-tab-pane>
          <el-tab-pane label="促销商品" name="ACTIVITY_GOODS">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="促销商品" prop="type">
                  <el-select v-model="form.joinGoodsType" placeholder="请选择" style="width: 100%">
                    <el-option label="所有商品参加" value="ALL" />
                    <el-option label="指定的商品参加" value="APPOINT" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <activityGoodsSelect v-show="form.joinGoodsType == 'APPOINT'" :list="goodsList"></activityGoodsSelect>
          </el-tab-pane>
          <el-tab-pane label="参与会员" name="VIP">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="参与会员" prop="type">
                  <el-select v-model="form.joinVipType" placeholder="请选择" style="width: 100%">
                    <el-option label="所有人可参加" value="ALL" />
                    <el-option label="只能会员参加" value="ONLY_VIP" />
                    <el-option label="只能指定的会员参加" value="APPOINT_VIP" />
                    <!--<el-option label="只能会员生日当月" value="VIP_BIRTHDAY_MONTH" />-->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="会员折扣" prop="type">
                  <el-select v-model="form.vipDiscountType" placeholder="请选择" style="width: 100%">
                    <el-option label="会员折上折" value="DOUBLE_DISCOUNT" />
                    <el-option label="会员不打折" value="NO_DISCOUNT" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <activityVipSelect v-show="form.joinVipType == 'APPOINT_VIP'" :list="vipList"></activityVipSelect>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {save, getInfo} from '@/api/activity/activity'
  import {initDateTime} from '@/z/bill/components/commonMethod'
  import activityChannelSelect from '@/z/activity/activityChannelSelect'
  import activityVipSelect from '@/z/activity/activityVipSelect'
  import activityGoodsSelect from '@/z/activity/activityGoodsSelect'
  import activityRuleSelect from '@/z/activity/activityRuleSelect'

  export default {
    name: 'activity_detail',
    components: {
      Sticky,activityChannelSelect,activityVipSelect,activityGoodsSelect,activityRuleSelect
    },
    data() {
      return {
        form: {
          id: '',
          code: '',
          priority:1,
          type:'BUY_DISCOUNT',
          startDate:initDateTime(),
          status: 'PENDING',
          joinChannelType:'ALL',
          joinVipType:'ALL',
          vipDiscountType:'DOUBLE_DISCOUNT',
          joinGoodsType:'APPOINT',
          ruleType:'QUANTITY'
        },
        rules: {
          name: [{required: true, message: '必填字段', trigger: 'blur'}],
          type: [{required: true, message: '必填字段', trigger: 'blur'}],
          priority: [{required: true, message: '必填字段', trigger: 'blur'}],
          startDate: [{required: true, message: '必填字段', trigger: 'blur'}],
          endDate: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
        loading: false,
        activeName: 'BASE',
        channelList:[],
        vipList:[],
        conditionGoodsList:[],
        goodsList:[],
        ruleList:[]
      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      if (id != null) {
        this.loading = true
        getInfo({id: id}).then(response => {
          this.loading = false
          this.form = response.data
          this.channelList = response.data.activityChannelList
          this.vipList = response.data.activityVipList
          this.conditionGoodsList = response.data.activityConditionGoodsList
          this.goodsList = response.data.activityGoodsList
          this.ruleList = response.data.activityRuleList
        }).finally(() => this.loading = false)
      }
    },
    methods: {
      //修改tag pane
      handleTagPaneClick(tab, event) {
        if (tab.name === 'GOODS') {
          this.$refs.detailGoods.initFocus()
        }
      },
      //保存
      saveData() {
        this.$refs['billForm'].validate((valid) => {
          if (valid) {
            if(this.form.joinChannelType == 'APPOINT' && this.channelList.filter(r => r.channelId != '').length == 0){
              this.$message.error('请输入参与的渠道')
              return
            }
            if(this.form.joinVipType == 'APPOINT_VIP' && this.vipList.filter(r => r.gradeId != '').length == 0){
              this.$message.error('请输入参与的会员')
              return
            }
            this.form.activityChannelList = this.channelList.filter(r => r.channelId != '')
            this.form.activityVipList = this.vipList.filter(r => r.gradeId != '')
            this.form.activityConditionGoodsList = this.conditionGoodsList.filter(r => r.goodsId != '' || r.goodsBrandId != '' || r.goodsCategoryId != '' || r.goodsYearId != '' || r.goodsSeasonId != '')
            this.form.activityGoodsList = this.goodsList.filter(r => r.goodsId != '' || r.goodsBrandId != '' || r.goodsCategoryId != '' || r.goodsYearId != '' || r.goodsSeasonId != '')
            this.form.activityRuleList = this.ruleList
            this.loading = true
            save(this.form).then(response => {
              this.$message({message: response.message, type: 'success'})
              let thisView = this.$store.state.tagsView.visitedViews.find(r => r.fullPath == this.$route.fullPath)
              this.$store.dispatch('delView', thisView).then(() => {
                let backView = this.$store.state.tagsView.visitedViews.find(r => r.fullPath == "/activity/list")
                if (backView != null) {
                  this.$store.dispatch('delCachedView', backView).then(() => this.$nextTick(() => this.$router.replace({path: '/redirect' + backView.fullPath})))
                }
              })
            }).finally(() => this.loading = false)
          } else {
            this.activeName = 'BASE'
          }
        })
      }

    }
  }
</script>


