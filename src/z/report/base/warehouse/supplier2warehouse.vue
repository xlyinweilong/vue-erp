<template>
  <planList table-type="bill_supplier_2_warehouse" :reportDic="reportDic"/>
</template>

<script>
  import planList from '@/z/report/components/planList'

  export default {
    name: 'supplier2warehouse_report',
    components: {
      planList
    },
    directives: {},
    filters: {},
    data() {
      return {
        reportDic: {
          tableName: 'bill_supplier_2_warehouse',
          keyList: ['DIM_BILL_PARENT_BILL_CODE'],
          renameKeys: ['DIM_BILL_PARENT_BILL_CODE'],
          renameKeyNames: ['采购单号']
        }
      }
    },
    created() {
    },
    methods: {}
  }
</script>

<style scoped>

</style>
