<template>
  <el-dialog title="审核" :visible="show" width="35%" @close="onClose">
    <span>请选择审核选中的数据的结果</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="onClose" :loading="auditing">取消</el-button>
        <el-button type="primary" @click="auditElement('AUDIT_FAILURE')" plain :loading="auditing">不通过</el-button>
        <el-button type="primary" @click="auditElement('AUDITED')" :loading="auditing">通过</el-button>
      </span>
  </el-dialog>
</template>

<script>
  import {auditEle} from '@/api/bill/bill'

  export default {
    computed: {},
    data() {
      return {
        auditing: false
      };
    },
    props: {
      show: {default: false},
      selectedIds: {default: []},
      billType: {default: ''}
    },
    methods: {
      //审核
      auditElement(status) {
        this.auditing = true
        auditEle(this.billType, {ids: this.selectedIds.map(s => s.id), status: status}).then(response => {
          this.$message({message: response.message, type: 'success'})
          this.$emit('get-list', {})
        }).finally(() => {
          this.auditing = false
          this.$emit('update:show', false)
        })
      },
      onClose() {
        if (!this.auditing) {
          this.$emit('update:show', false)
        }
      }
    }
  }
</script>
