<template>
  <span>
    <el-form-item>
      <el-select :disabled="isDetail" v-model="form.goodsId" filterable clearable remote default-first-option placeholder="请输入货号" :remote-method="searchGoods" @change="changeGoods" :loading="loadingGoods" style="width: 100%">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
        <el-option v-for="item in optionGoods" :value="item.id" :label="item.code"/>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select :disabled="isDetail || form.goodsId == ''" v-model="form.goodsColorId" filterable placeholder="请选择颜色" :loading="loadingGoodsColorAndInSizeAndSize" style="width: 100%">
        <el-option v-for="item in optionGoodsColor" :value="item.colorId" :label="item.colorName +'-'+item.colorCode"/>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select :disabled="isDetail || form.goodsId == ''" v-model="form.goodsSizeId" filterable placeholder="请选择尺码" :loading="loadingGoodsColorAndInSizeAndSize" style="width: 100%">
        <el-option v-for="item in optionGoodsSize" :value="item.id" :label="item.name"/>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button :disabled="isDetail || form.goodsId == ''"  class="filter-item" :loading="loadingGoods || loadingGoodsColorAndInSizeAndSize"  icon="el-icon-search" type="primary" @click="selectOk">确定</el-button>
    </el-form-item>
  </span>
</template>

<script>
  import {getGoodsColorAndSizeList} from '@/api/info/goods'
  import {getGoodsList} from '@/api/pos/pos'


  export default {
    computed: {},
    data() {
      return {
        form: {
          goods:{},
          goodsId: '',
          goodsColorId: '',
          goodsSizeId: ''
        },
        loadingGoods: false,
        loadingGoodsColorAndInSizeAndSize: false,
        optionGoods: [],
        optionGoodsSize: [],
        optionGoodsColor: []
      };
    },
    props: {
      isDetail: {
        default: false
      }
    },
    methods: {
      selectOk(){
        this.form.goods.goodsColorId = this.form.goodsColorId
        this.form.goods.goodsColorCode = this.optionGoodsColor.find(r => r.colorId == this.form.goodsColorId).colorCode
        this.form.goods.goodsColorName = this.optionGoodsColor.find(r => r.colorId == this.form.goodsColorId).colorName
        this.form.goods.goodsSizeId = this.form.goodsSizeId
        this.form.goods.goodsSizeName = this.optionGoodsSize.find(r => r.id === this.form.goodsSizeId).name
        this.form.goods.goodsName = this.form.goods.name
        this.$emit('add-goods', this.form.goods)
      },
      //搜索货品
      searchGoods(query) {
        if (query !== '') {
          this.loadingGoods = true
          getGoodsList({pageIndex: 1, pageSize: 10, searchKey: query}).then(response => {
            this.optionGoods = response.data.content
          }).finally(() => this.loadingGoods = false)
        } else {
          this.optionGoods = []
        }
      },
      changeGoods(goodsId) {
        let goods = this.optionGoods.find(g => g.id == goodsId)
        this.form.goodsName = (goods == null ? '' : goods.name)
        this.searchGoodsColorList(goodsId)
        this.form.goods = goods
      },
      //货品颜色
      searchGoodsColorList(goodsId) {
        if (goodsId !== '' && goodsId != null) {
          this.loadingGoodsColorAndInSizeAndSize = true
          getGoodsColorAndSizeList({id: goodsId}).then(response => {
            this.optionGoodsColor = response.data.colorList
            if (this.optionGoodsColor.length > 0) {
              this.form.goodsColorId = this.optionGoodsColor[0].colorId
            }
            this.optionGoodsSize = response.data.sizeList
            if (this.optionGoodsSize.length > 0) {
              this.form.goodsSizeId = this.optionGoodsSize[0].id
            }
          }).finally(() => this.loadingGoodsColorAndInSizeAndSize = false)
        } else {
          this.form.goodsSizeId = this.form.goodsColorId = ''
          this.optionGoodsSize = this.optionGoodsColor = []
        }
      }
    }
  }
</script>
