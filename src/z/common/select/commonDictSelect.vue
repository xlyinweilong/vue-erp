<template>
  <el-select :disable="isDisabled" v-model="tempId" filterable clearable remote default-first-option placeholder="请输入编号" :remote-method="searchEle" :loading="loading" @change="changeSelect">
    <i slot="prefix" class="el-input__icon el-icon-search"></i>
    <el-option v-for="item in optionList" :value="item.id" :label="item.name"/>
  </el-select>
</template>

<script>
  import {getDictList as getList} from '@/api/info/dict'

  export default {
    computed: {},
    name: "seasonSelect",
    data() {
      return {
        loading: false,
        optionList: [],
        tempId: ''
      };
    },
    props: {
      type1: {default: ''},
      type2: {default: ''},
      eleId: {default: ''},
      eleName: {default: ''},
      isDisabled: {default: false}
    },
    watch: {
      eleId: 'initEle'
    },
    created() {
      this.initEle()
    },
    methods: {
      initEle() {
        this.tempId = this.eleId
        this.optionList = []
        if (this.tempId != null && this.tempId != '') {
          this.optionList.push({id: this.eleId, name: this.eleName})
        }
      },
      searchEle(query) {
        if (query !== '') {
          this.loading = true
          getList({type1: this.type1, type2: this.type2, pageIndex: 1, pageSize: 10, searchKey: query}).then(response => {
            this.optionList = response.data.content
          }).finally(() => this.loading = false)
        } else {
          this.optionList = []
        }
      },
      changeSelect() {
        this.$emit("update:eleId", this.tempId)
      }
    }
  }
</script>
