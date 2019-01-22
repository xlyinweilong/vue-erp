<template>
  <el-dialog title="导出" :visible="show" width="35%" @close="onClose">
    <el-form>
      <el-form-item label="导出类型">
        <el-select v-model="exportDialogType" placeholder="请选择">
          <el-option value="BILL" label="单据概要"/>
          <el-option value="BILL_GOODS" label="单据货品"/>
          <el-option value="BILL_DETAIL" label="单据详情"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="exportElement">导出</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import {param, urlEncode} from '@/utils'
  import {getToken} from '@/utils/auth'

  export default {
    computed: {},
    data() {
      return {
        exportDialogType: 'BILL',
      };
    },
    props: {
      show: {default: false},
      billType: {default: ''},
    },
    methods: {
      //导出
      exportElement() {
        window.open(process.env.BASE_API + "/api/bill/" + this.billType + "/export?token=" + getToken() + urlEncode({type: this.exportDialogType}))
      },
      onClose() {
        this.$emit('update:show', false)
      }
    }
  }
</script>
