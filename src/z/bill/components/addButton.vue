<template>
  <el-button class="filter-item" type="primary" icon="el-icon-plus" :disabled="listLoading" @click="$router.push({ path: '/bill/'+parentType+'/'+ billType +'_create/'})">新增</el-button>
</template>

<script>
  export default {
    computed: {},
    data() {
      return {};
    },
    props: {
      listLoading: {default: false},
      billType: {default: ''},
      parentType: {default: 'channel'}
    },
    methods: {}
  }
</script>
