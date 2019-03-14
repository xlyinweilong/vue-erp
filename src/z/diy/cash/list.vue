<template>
  <div>
    <sticky class-name="sub-navbar draft">
      <el-button style="margin-left: 10px;" type="success" @click="saveData" :loading="loading">保存</el-button>
    </sticky>
    <div style="text-align: center;margin-top: 10px;">
      <el-transfer v-loading="loading" :titles="['不显示的标题', '显示的标题']" v-model="diyValues" :data="diyList" style="text-align: left; display: inline-block;"></el-transfer>
    </div>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {save, getList} from '@/api/user/diy'

  export default {
    name: 'diy_cash_list',
    components: {Sticky},
    data() {
      return {
        loading: false,
        diyList: [{key: 'activity', label: '促销活动'}, {key: 'goods_name', label: '货品名称'}, {key: 'goods_color_code', label: '颜色编号'}, {key: 'goods_color_name', label: '颜色名称'}, {key: 'goods_size_name', label: '尺码'}
          , {key: 'goods_brand', label: '品牌'}, {key: 'goods_category', label: '类别'}, {key: 'goods_category2', label: '二级类别'}, {key: 'goods_series', label: '系列'}, {key: 'goods_pattern', label: '款型'}
          , {key: 'goods_style', label: '风格'}, {key: 'goods_season', label: '季节'}, {key: 'goods_year', label: '年份'}, {key: 'goods_sex', label: '性别'}, {key: 'goods_supplier_code', label: '供应商编号'}, {key: 'goods_supplier_name', label: '供应商名称'}
          , {key: 'tag_price', label: '吊牌价'}, {key: 'sale_price', label: '零售价'}, {key: 'bill_count', label: '数量'}, {key: 'discount', label: '折扣'}, {key: 'price', label: '单价'}, {key: 'amount', label: '金额'}, {key: 'employ', label: '营业员'}, {key: 'market_point', label: '结算码'}
          , {key: 'stock_count', label: '库存'}, {key: 'remarks', label: '备注'}],
        diyValues: [],
        type: 'POS_CASH_LIST'
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.loading = true
        getList({type: this.type}).then(response => {
          this.diyValues = response.data
        }).finally(() => this.loading = false)
      },
      //偏好设置
      saveData() {
        this.loading = true
        save({keys: this.diyValues, type: this.type}).then(response => {
          this.$message({message: '保存成功', type: 'success'});
        }).finally(() => this.loading = false)
      }
    }
  }
</script>
