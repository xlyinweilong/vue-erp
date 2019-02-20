<template>
  <div class="filter-container">
    <el-input clearable style="width: 210px;" v-model.trim="code" placeholder="请输入会员编号/手机号" @keyup.enter.native="searchVip"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
    <el-button type="primary" plain @click="searchVip" :loading="loading" :disabled="code == ''">确定</el-button>
    <span v-show="vip.id != ''"><el-tag closable type="success" @close="clearVip">{{vip.name}}</el-tag></span>
  </div>
</template>

<script>
  import {searchVip} from '@/api/pos/pos'

  export default {
    computed: {},
    components: {},
    data() {
      return {
        loading: false,
        code: ''
      }
    },
    props: {
      vip: {default: {id: '', name: '', code: ''}}
    },
    methods: {
      init(){
        this.clearVip()
      },
      searchVip() {
        if (!this.loading && this.code != '') {
          this.loading = true
          searchVip({code: this.code}).then(response => {
            this.$emit("changeVip", response.data)
            this.code = ''
          }).finally(() => this.loading = false)
        }
      },
      clearVip() {
        this.$emit("changeVip", {id: '', name: '', code: ''})
      }
    }
  }
</script>
