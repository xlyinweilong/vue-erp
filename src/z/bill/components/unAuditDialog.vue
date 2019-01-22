<template>
  <el-dialog title="反审核" :visible="show" width="35%" @close="onClose">
    <span>确认要反审核选中的数据的结果吗？</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="onClose" :loading="unAuditing">取消</el-button>
        <el-button type="primary" @click="unAuditElement()" :loading="unAuditing">确定</el-button>
      </span>
  </el-dialog>
</template>

<script>
  import {unAuditEle} from '@/api/bill/bill'

  export default {
    computed: {},
    data() {
      return {
        unAuditing: false
      };
    },
    props: {
      show: {default: false},
      selectedIds: {default: []},
      billType: {default: ''}
    },
    methods: {
      //反审核
      unAuditElement() {
        this.unAuditing = true
        unAuditEle(this.billType, {ids: this.selectedIds.map(s => s.id)}).then(response => {
          this.$message({message: response.message, type: 'success'});
          this.$emit('get-list', {})
        }).finally(() => {
          this.unAuditing = false
          this.$emit('update:show', false)
        })
      },
      onClose() {
        if (!this.unAuditing) {
          this.$emit('update:show', false)
        }
      }
    }
  }
</script>
