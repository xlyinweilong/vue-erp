<template>
  <el-dialog title="打印" :visible="show" width="35%" @close="onClose">
    <el-form>
      <el-form-item label="纸张类型">
        <el-select v-model="printDialogType" placeholder="请选择">
          <el-option value="58" label="58"/>
          <el-option value="80" label="80"/>
          <el-option value="A4" label="A4"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="printElement">打印</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import {param, urlEncode} from '@/utils'
  import {getToken} from '@/utils/auth'
  import PrintJs from 'print-js'

  export default {
    computed: {},
    data() {
      return {
        printDialogType: '58',
      };
    },
    props: {
      show: {default: false},
      billType: {default: ''},
      selectedIds: {default: []}
    },
    methods: {
      //打印
      printElement() {
        PrintJs({printable: process.env.BASE_API + '/api/bill/print/print?type=' + this.billType + '&paperType=' + this.printDialogType + '&code=' + this.selectedIds[0].code, type: 'pdf', header: '', maxWidth: 800, headerStyle: 'font-weight: 300;', targetStyles: ['*']})
      },
      onClose() {
        this.$emit('update:show', false)
      }
    }
  }
</script>
