<template>
  <div>
    <sticky class-name="sub-navbar draft" v-if="!isDetail">
      <el-button style="margin-left: 10px;" type="success" @click="saveData" :loading="loading">保存</el-button>
    </sticky>

    <div class="tab-container">
      <el-form ref="goodsForm" :model="form" :rules="rules" v-loading="loading">
        <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
          <el-tab-pane label="基本资料" name="BASE">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="货号" prop="code">
                  <el-input v-model.trim="form.code" @keyup.enter.native="saveData" placeholder="请输入货号" :disabled="isDetail" class="goods_detail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="名称" prop="name">
                  <el-input v-model.trim="form.name" @keyup.enter.native="saveData" placeholder="请输入货品名称" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="尺码组" prop="sizeGroupId">
                  <el-select :disabled="isDetail" v-model="form.sizeGroupId" filterable clearable remote default-first-option placeholder="请输入关键词" :remote-method="searchSizeGroup" :loading="searchText.loadingSizeGroup" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="form.sizeGroupId != '' && form.sizeGroupId != null && !searchText.searchedSizeGroup" :value="form.sizeGroupId" :label="form.sizeGroupName"/>
                    <el-option v-for="item in searchText.optionSizeGroup" :value="item.id" :label="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="颜色" prop="colorIdList">
                  <el-select :disabled="isDetail" v-model="form.colorIdList" multiple filterable remote reserve-keyword default-first-option placeholder="请输入关键词" :remote-method="searchColor" :loading="searchText.loadingColor" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="!searchText.searchedColor && form.colorList != null && form.colorList.length > 0" v-for="item in form.colorList" :value="item.colorId" :label="item.colorName + '-' + item.colorCode" :key="item.colorId"/>
                    <el-option v-for="item in searchText.optionColor" :value="item.id" :label="item.name+'-'+item.code"/>
                  </el-select>
                </el-form-item>

              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="吊牌价1" prop="tagPrice1">
                  <el-input v-model.number="form.tagPrice1" @keyup.enter.native="saveData" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="分类信息" name="CLASS">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="品牌" prop="brandId">
                  <el-select :disabled="isDetail" v-model="form.brandId" filterable clearable remote default-first-option placeholder="请输入关键词" :remote-method="searchBrand" :loading="searchText.loadingBrand" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="!searchText.searchedBrand && form.brandId != '' && form.brandId != null" :value="form.brandId" :label="form.brandName"/>
                    <el-option v-for="item in searchText.optionBrand" :value="item.id" :label="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="类别" prop="categoryId">
                  <el-select :disabled="isDetail" v-model="form.categoryId" filterable clearable remote default-first-option placeholder="请输入关键词" :remote-method="searchCategory" :loading="searchText.loadingCategory" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="!searchText.searchedCategory && form.categoryId != '' && form.categoryId != null" :value="form.categoryId" :label="form.categoryName"/>
                    <el-option v-for="item in searchText.optionCategory" :value="item.id" :label="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="二级类别" prop="category2Id">
                  <el-select :disabled="isDetail" v-model="form.category2Id" filterable clearable remote default-first-option placeholder="请输入关键词" :remote-method="searchCategory2" :loading="searchText.loadingCategory2" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="!searchText.searchedCategory2 && form.category2Id != '' && form.category2Id != null" :value="form.category2Id" :label="form.category2Name"/>
                    <el-option v-for="item in searchText.optionCategory2" :value="item.id" :label="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="系列" prop="seriesId">
                  <el-select :disabled="isDetail" v-model="form.seriesId" filterable clearable remote default-first-option placeholder="请输入关键词" :remote-method="searchSeries" :loading="searchText.loadingSeries" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="!searchText.searchedSeries && form.seriesId != '' && form.seriesId != null" :value="form.seriesId" :label="form.seriesName"/>
                    <el-option v-for="item in searchText.optionSeries" :value="item.id" :label="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="款型" prop="patternId">
                  <el-select :disabled="isDetail" v-model="form.patternId" filterable clearable remote default-first-option placeholder="请输入关键词" :remote-method="searchPattern" :loading="searchText.loadingPattern" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="!searchText.searchedPattern && form.patternId != '' && form.patternId != null" :value="form.patternId" :label="form.patternName"/>
                    <el-option v-for="item in searchText.optionPattern" :value="item.id" :label="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="风格" prop="styleId">
                  <el-select :disabled="isDetail" v-model="form.styleId" filterable clearable remote default-first-option placeholder="请输入关键词" :remote-method="searchStyle" :loading="searchText.loadingStyle" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="!searchText.searchedStyle && form.styleId != '' && form.styleId != null" :value="form.styleId" :label="form.styleName"/>
                    <el-option v-for="item in searchText.optionStyle" :value="item.id" :label="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="季节" prop="seasonId">
                  <el-select :disabled="isDetail" v-model="form.seasonId" filterable clearable remote default-first-option placeholder="请输入关键词" :remote-method="searchSeason" :loading="searchText.loadingSeason" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="!searchText.searchedSeason && form.seasonId != '' && form.seasonId != null" :value="form.seasonId" :label="form.seasonName"/>
                    <el-option v-for="item in searchText.optionSeason" :value="item.id" :label="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="年份" prop="yearId">
                  <el-select :disabled="isDetail" v-model="form.yearId" filterable clearable remote default-first-option placeholder="请输入关键词" :remote-method="searchYear" :loading="searchText.loadingYear" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="!searchText.searchedYear && form.yearId != '' && form.yearId != null" :value="form.yearId" :label="form.yearName"/>
                    <el-option v-for="item in searchText.optionYear" :value="item.id" :label="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="性别" prop="sexId">
                  <el-select :disabled="isDetail" v-model="form.sexId" filterable clearable remote default-first-option placeholder="请输入关键词" :remote-method="searchSex" :loading="searchText.loadingSex" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="!searchText.searchedSex && form.sexId != '' && form.sexId != null" :value="form.sexId" :label="form.sexName"/>
                    <el-option v-for="item in searchText.optionSex" :value="item.id" :label="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="供应商" prop="supplierId">
                  <el-select :disabled="isDetail" v-model="form.supplierId" filterable clearable remote default-first-option placeholder="请输入关键词" :remote-method="searchSupplier" :loading="searchText.loadingSupplier" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="!searchText.searchedSupplier && form.supplierId != '' && form.supplierId != null" :value="form.supplierId" :label="form.supplierName + '-' + form.supplierCode"/>
                    <el-option v-for="item in searchText.optionSupplier" :value="item.id" :label="item.name + '-' + item.code"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="组" prop="goodsGroupId">
                  <el-select :disabled="isDetail" v-model="form.goodsGroupId" filterable clearable remote default-first-option placeholder="请输入关键词" :remote-method="searchGoodsGroup" :loading="searchText.loadingGoodsGroup" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-for="item in searchText.optionGoodsGroup" :value="item.id" :label="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!--<el-tab-pane label="价格设置" name="PRICE">-->
          <!--</el-tab-pane>-->
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {save, get} from '@/api/info/goods'
  import {getDictList} from '@/api/info/dict'
  import {getList} from '@/api/info/supplier'
  import Sticky from '@/components/Sticky'
  import {backUrl} from '@/z/common/commonMethod'

  export default {
    name: 'goods_detail',
    components: {Sticky},
    data() {
      return {
        form: {
          id: null,
          code: '',
          name: '',
          colorIdList: [],
          sizeGroupId: '',
          sizeGroupName: '',
          brandId: '',
          categoryId: '',
          category2Id: '',
          seriesId: '',
          patternId: '',
          styleId: '',
          seasonId: '',
          yearId: '',
          sexId: '',
          supplierId: '',
          goodsGroupId: '',
          tagPrice1: null
        },
        rules: {
          code: [{required: true, message: '必填字段', trigger: 'blur'}],
          name: [{required: true, message: '必填字段', trigger: 'blur'}],
          sizeGroupId: [{required: true, message: '必填字段', trigger: 'blur'}],
          colorIdList: [{required: true, message: '必填字段', trigger: 'blur'}],
          tagPrice1: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
        loading: false,
        activeName: 'BASE',
        isDetail: false,
        //搜索框
        searchText: {
          loadingSizeGroup: false,
          optionSizeGroup: [],
          searchedSizeGroup: false,
          loadingColor: false,
          optionColor: [],
          searchedColor: false,
          loadingInSize: false,
          optionInSize: [],
          searchedInSize: false,
          loadingBrand: false,
          optionBrand: [],
          searchedBrand: false,
          loadingCategory: false,
          optionCategory: [],
          searchedCategory: false,
          loadingCategory2: false,
          optionCategory2: [],
          searchedCategory2: false,
          loadingSeries: false,
          optionSeries: [],
          searchedSeries: false,
          loadingPattern: false,
          optionPattern: [],
          searchedPattern: false,
          loadingStyle: false,
          optionStyle: [],
          searchedStyle: false,
          loadingSeason: false,
          optionSeason: [],
          searchedSeason: false,
          loadingYear: false,
          optionYear: [],
          searchedYear: false,
          loadingSex: false,
          optionSex: [],
          searchedSex: false,
          loadingSupplier: false,
          optionSupplier: [],
          searchedSupplier: false,
          loadingGoodsGroup: false,
          optionGoodsGroup: [],
          searchedGoodsGroup: false
        }
      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      this.isDetail = this.$route.name.indexOf("_detail") > -1;
      if (id != null) {
        this.loading = true
        get({id: id}).then(response => {
          this.form = response.data
          this.form.colorIdList = response.data.colorList.map(c => c.colorId)
          if (this.form.goodsGroupId != null) {
            this.searchText.optionGoodsGroup.push({id: this.form.goodsGroupId, name: this.form.goodsGroupName});
          }
        }).finally(() => this.loading = false)
      }
    },
    methods: {
      //保存
      saveData() {
        this.$refs['goodsForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            save(this.form).then(response => {
              this.loading = false
              this.$message({message: response.message, type: 'success'})
              backUrl(this, '/info/goods')
            }).catch((err) => this.loading = false)
          } else {
            this.activeName = 'BASE'
          }
        })
      },
      //查询
      search(query, type1, type2, typeCode) {
        if (query !== '') {
          this.searchText['loading' + typeCode] = true
          getDictList({type1: type1, type2: type2, pageIndex: 1, pageSize: 10, searchKey: query}).then(response => {
            this.searchText['loading' + typeCode] = false
            this.searchText['option' + typeCode] = response.data.content
            this.searchText['searched' + typeCode] = true
          })
        } else {
          this.searchText[options] = []
        }
      },
      searchSizeGroup(query) {
        this.search(query, 'GOODS', 'SIZE_GROUP', 'SizeGroup')
      },
      searchColor(query) {
        this.search(query, 'GOODS', 'COLOR', 'Color')
      },
      searchInSize(query) {
        this.search(query, 'GOODS', 'IN_SIZE', 'InSize')
      },
      searchBrand(query) {
        this.search(query, 'GOODS', 'BRAND', 'Brand')
      },
      searchCategory(query) {
        this.search(query, 'GOODS', 'CATEGORY', 'Category')
      },
      searchCategory2(query) {
        this.search(query, 'GOODS', 'CATEGORY_2', 'Category2')
      },
      searchSeries(query) {
        this.search(query, 'GOODS', 'SERIES', 'Series')
      },
      searchPattern(query) {
        this.search(query, 'GOODS', 'PATTERN', 'Pattern')
      },
      searchStyle(query) {
        this.search(query, 'GOODS', 'STYLE', 'Style')
      },
      searchSeason(query) {
        this.search(query, 'GOODS', 'SEASON', 'Season')
      },
      searchYear(query) {
        this.search(query, 'GOODS', 'YEAR', 'Year')
      },
      searchSex(query) {
        this.search(query, 'GOODS', 'SEX', 'Sex')
      },
      searchGoodsGroup(query) {
        this.search(query, 'GOODS', 'GOODS_GROUP', 'GoodsGroup')
      },
      searchSupplier(query) {
        if (query !== '') {
          this.searchText.loadingSupplier = true
          getList({pageIndex: 1, pageSize: 10, searchKey: query}).then(response => {
            this.searchText.loadingSupplier = false
            this.searchText.optionSupplier = response.data.content
            this.searchText.searchedSupplier = true
          })
        } else {
          this.searchText.optionSupplier = []
        }
      }
    }
  }
</script>

<style lang="css" scoped>
  .tab-container {
    margin: 10px;
  }

  .is-disabled > > > .el-input__inner {
    color: #606266 !important;
  }

  .el-select > > > .el-input__inner {
    color: #606266 !important;
  }

  .el-select > > > .el-select__tags-text {
    color: #606266 !important;
  }

</style>
