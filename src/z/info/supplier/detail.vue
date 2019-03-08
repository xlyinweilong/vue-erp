<template>
  <div>
    <sticky class-name="sub-navbar draft" v-if="!isDetail">
      <el-button style="margin-left: 10px;" type="success" @click="saveData" :loading="loading">保存</el-button>
    </sticky>

    <div class="tab-container">
      <el-form ref="supplierForm" :model="form" :rules="rules"  v-loading="loading">
        <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
          <el-tab-pane label="基本资料" name="BASE">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="编号" prop="code">
                  <el-input v-model.trim="form.code" @keyup.enter.native="saveData" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="名称" prop="name">
                  <el-input v-model.trim="form.name" @keyup.enter.native="saveData" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="组" prop="groupId">
                  <el-select :disabled="isDetail" v-model="form.groupId" filterable clearable remote default-first-option placeholder="请输入关键词" :remote-method="searchGroup" :loading="searchTextLoading" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-for="item in searchText.optionGroup" :value="item.id" :label="item.name"/>
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
  import {save, get} from '@/api/info/supplier'
  import Sticky from '@/components/Sticky'
  import {getDictList} from '@/api/info/dict'
  import {backUrl} from '@/z/common/commonMethod'

  export default {
    name: 'supplier_detail',
    components: {Sticky},
    data() {
      return {
        form: {
          id: null,
          code: '',
          name: '',
          groupId: '',
        },
        rules: {
          code: [{required: true, message: '必填字段', trigger: 'blur'}],
          name: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
        loading: false,
        activeName: 'BASE',
        isDetail:false,
        searchTextLoading: false,
        searchText: {
          optionGroup: []
        }
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
          if (this.form.groupName != null) {
            this.searchText.optionGroup.push({id: this.form.groupId, name: this.form.groupName})
          }
        }).catch(() => this.loading = false)
      }
    },
    methods: {
      saveData() {
        this.$refs['supplierForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            save(this.form).then(response => {
              this.loading = false
              this.$message({message: response.message, type: 'success'})
              backUrl(this, '/info/supplier')
            }).catch((err) => this.loading = false)
          }
        })
      },
      //查询
      search(query, type1, type2, typeCode) {
        if (query !== '') {
          this.searchTextLoading = true
          getDictList({type1: type1, type2: type2, pageIndex: 1, pageSize: 10, searchKey: query}).then(response => {
            this.searchText['option' + typeCode] = response.data.content
          }).finally(() => this.searchTextLoading = false)
        } else {
          this.searchText[options] = []
        }
      },
      searchGroup(query) {
        this.search(query, 'SUPPLIER', 'SUPPLIER_GROUP', 'Group')
      }
    }
  }
</script>

<style scoped>
  .tab-container {
    margin: 10px;
  }
</style>
