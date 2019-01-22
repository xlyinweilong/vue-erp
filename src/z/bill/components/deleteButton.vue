<template>
  <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="deleteElement" :disabled="listLoading || selectedIds.length == 0 || selectedIds.filter(r => r.status != 'DRAFT' && r.status != 'AUDIT_FAILURE').length > 0">删除</el-button>
</template>

<script>
  import {deleteEle} from '@/api/bill/bill'

  export default {
    computed: {},
    data() {
      return {};
    },
    props: {
      listLoading: {default: false},
      selectedIds: {default: []},
      billType: {default: ''}
    },
    methods: {
      //删除
      deleteElement() {
        this.$confirm('确定要删除选中的数据吗?', '删除', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          this.$emit('update:list-loading', true)
          deleteEle(this.billType, {ids: this.selectedIds.map(s => s.id)}).then(response => {
            this.$message({message: response.message, type: 'success'});
            this.$emit('get-list', {})
          }).finally(() => this.$emit('update:list-loading', false))
        }).catch(() => {
          this.$emit('update:list-loading', false)
        })
      }
    }
  }
</script>
