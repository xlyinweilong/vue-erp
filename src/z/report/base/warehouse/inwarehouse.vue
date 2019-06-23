<template>
  <planList table-type="bill_in_warehouse" :reportDic="reportDic"/>
</template>

<script>
  import planList from '@/z/report/components/planList'

  export default {
    name: 'inwarehouse_report',
    components: {
      planList
    },
    directives: {},
    filters: {},
    data() {
      return {
        reportDic: {
          tableName:'bill_in_warehouse',
          keyList: ['DIM_BILL_PARENT_BILL_CODE'],
          renameKeys: ['DIM_BILL_PARENT_BILL_CODE'],
          renameKeyNames: ['渠道退货单号']
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
