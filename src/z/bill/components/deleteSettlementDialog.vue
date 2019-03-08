<template>
  <el-dialog title="删除结存" :visible="show" width="35%" @close="onClose">
    <span v-show="!loading">确定要删除选中的结存吗？</span>
    <span v-show="loading">删除中，这可能要花一段时间，请稍等...</span>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose" v-loading="loading">取消</el-button>
      <el-button type="primary" @click="deleteEle" v-loading="loading">确定删除</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import {deleteEle} from '@/api/bill/settlement'

  export default {
    components: {},
    data() {
      return {
        loading: false
      };
    },
    props: {
      show: {default: false},
      selectedIds: {default: []},
    },
    methods: {
      onClose() {
        this.$emit('update:show', false)
      },
      deleteEle() {
        this.loading = true
        deleteEle({ids: this.selectedIds.map(s => s.id)}).then(response => {
          this.$message({message: '删除结存成功', type: 'success'})
          this.onClose()
          this.$emit('get-list', {})
        }).finally(() => this.loading = false)
      }
    }
  }
</script>
