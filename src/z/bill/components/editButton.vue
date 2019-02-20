<template>
  <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="listLoading || selectedIds.length != 1 || selectedIds.filter(r => r.status != 'DRAFT' && r.status != 'AUDIT_FAILURE').length > 0" @click="updateElement">修改</el-button>
</template>

<script>
  export default {
    computed: {},
    data() {
      return {};
    },
    props: {
      listLoading: {default: false},
      selectedIds: {default: []},
      billType: {default: ''},
      parentType: {default: 'channel'}
    },
    methods: {
      //修改
      updateElement() {
        let id = this.selectedIds[0].id
        this.$router.push({path: '/bill/'+this.parentType+'/' + this.billType + '_update/' + id});
      }
    }
  }
</script>
