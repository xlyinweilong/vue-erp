<template>
  <div>
    <sticky class-name="sub-navbar draft" v-if="!isDetail">
      <el-button style="margin-left: 10px;" type="success" @click="saveData" :loading="loading">保存</el-button>
    </sticky>

    <div class="tab-container">
      <el-form ref="barCodeForm" :model="form" :rules="rules" v-loading="loading">
        <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
          <el-tab-pane label="基本资料" name="BASE">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="条形码" prop="code">
                  <el-input v-model.trim="form.code" @keyup.enter.native="saveData" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="'货号' + (form.goodsName != '' ? ('(名称:'+form.goodsName+')'):'')" prop="goodsId">
                  <el-select :disabled="isDetail" v-model="form.goodsId" filterable clearable remote default-first-option placeholder="请输入货号" :remote-method="searchGoods" @change="changeGoods" :loading="loadingGoods" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-if="form.goodsId != '' && form.goodsId != null && !searchedGoods" :value="form.goodsId" :label="form.goodsCode"/>
                    <el-option v-for="item in optionGoods" :value="item.id" :label="item.code"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="颜色" prop="goodsColorId">
                  <el-select :disabled="isDetail || form.goodsId == ''" v-model="form.goodsColorId" filterable clearable default-first-option placeholder="请输入颜色" :loading="loadingGoodsColorAndInSizeAndSize" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-for="item in optionGoodsColor" :value="item.colorId" :label="item.colorName +'-'+item.colorCode"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="尺码" prop="goodsSizeId">
                  <el-select :disabled="isDetail || form.goodsId == ''" v-model="form.goodsSizeId" filterable clearable default-first-option placeholder="请输入颜色" :loading="loadingGoodsColorAndInSizeAndSize" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-for="item in optionGoodsSize" :value="item.id" :label="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!--<el-tab-pane label="设置" name="CONF">-->

          <!--</el-tab-pane>-->
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {save, get} from '@/api/info/barCode'
  import {getList, getGoodsColorAndSizeList} from '@/api/info/goods'
  import Sticky from '@/components/Sticky'
  import {backUrl} from '@/z/common/commonMethod'

  export default {
    name: 'barCode_detail',
    components: {Sticky},
    data() {
      return {
        form: {
          id: null,
          code: '',
          name: '',
          goodsId: '',
          goodsCode: '',
          goodsName: '',
          goodsColorId: '',
          goodsColorCode:'',
          goodsColorName:'',
          goodsInSizeId: '',
          goodsInSizeName: '',
          goodsSizeId: '',
          goodsSizeName: ''
        },
        rules: {
          code: [{required: true, message: '必填字段', trigger: 'blur'}],
          goodsId: [{required: true, message: '必填字段', trigger: 'blur'}],
          goodsColorId: [{required: true, message: '必填字段', trigger: 'blur'}],
          goodsInSizeId: [{required: true, message: '必填字段', trigger: 'blur'}],
          goodsSizeId: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
        loading: false,
        activeName: 'BASE',
        isDetail: false,
        //搜索货品
        loadingGoods: false,
        optionGoods: [],
        searchedGoods: false,
        //颜色\内长\尺码
        optionGoodsColor: [],
        optionGoodsInSize: [],
        optionGoodsSize: [],
        loadingGoodsColorAndInSizeAndSize: false,
      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      this.isDetail = this.$route.name.indexOf("_detail") > -1;
      if (id != null) {
        this.loading = true
        get({id: id}).then(response => {
          this.loading = false
          this.form = response.data
          this.searchGoodsColorList(this.form.goodsId,true);
        }).catch(() => this.loading = false)
      }
    },
    methods: {
      saveData() {
        this.$refs['barCodeForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            save(this.form).then(response => {
              this.loading = false
              this.$message({message: response.message, type: 'success'})
              backUrl(this, '/info/barCode')
            }).catch((err) => this.loading = false)
          }
        })
      },
      //搜索货品
      searchGoods(query) {
        if (query !== '') {
          this.loadingGoods = true
          getList({pageIndex: 1, pageSize: 10, searchKey: query}).then(response => {
            this.loadingGoods = false
            this.optionGoods = response.data.content
            this.searchedGoods = true
          })
        } else {
          this.optionGoods = []
        }
      },
      changeGoods(goodsId) {
        let goods = this.optionGoods.find(g => g.id == goodsId)
        this.form.goodsName = (goods == null ? '' : goods.name)
        this.searchGoodsColorList(goodsId);
      },
      //货品颜色
      searchGoodsColorList(goodsId,init) {
        if (goodsId !== '' && goodsId != null) {
          this.loadingGoodsColorAndInSizeAndSize = true
          if(!init){
            this.form.goodsSizeId = this.form.goodsInSizeId = this.form.goodsColorId = ''
          }
          getGoodsColorAndSizeList({id: goodsId}).then(response => {
            this.loadingGoodsColorAndInSizeAndSize = false
            this.optionGoodsColor = response.data.colorList
            if(this.optionGoodsColor.length == 1){
              this.form.goodsColorId = this.optionGoodsColor[0].colorId
            }
            this.optionGoodsSize = response.data.sizeList
            if(this.optionGoodsSize.length == 1){
              this.form.goodsSizeId = this.optionGoodsSize[0].id
            }
            // this.searchedGoods = true
          })
        } else {
          this.form.goodsSizeId = this.form.goodsInSizeId = this.form.goodsColorId = ''
          this.optionGoodsSize = this.optionGoodsInSize = this.optionGoodsColor = []
        }
      }

    }
  }
</script>

<style scoped>
  .tab-container {
    margin: 10px;
  }
  .is-disabled >>> .el-input__inner{
    color:#606266 !important;
  }

  .el-select>>>.el-input__inner{
    color:#606266 !important;
  }

  .el-select>>>.el-select__tags-text{
    color:#606266 !important;
  }
</style>
