<template>
  <planList table-type="bill_warehouse_2_channel" :reportDic="reportDic"/>
</template>

<script>
  import planList from '@/z/report/components/planList'

  export default {
    name: 'warehouse2channel_report',
    components: {
      planList
    },
    directives: {},
    filters: {},
    data() {
      return {
        reportDic: {
          tableName: 'bill_warehouse_2_channel',
          keyList: ['DIM_BILL_PARENT_BILL_CODE', 'DIM_BILL_GRAND_PARENT_BILL_CODE'],
          renameKeys: ['DIM_BILL_PARENT_BILL_CODE', 'DIM_BILL_GRAND_PARENT_BILL_CODE'],
          renameKeyNames: ['订货单号', '配货单号']
        }
      }
    },
    created() {
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
