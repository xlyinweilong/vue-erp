<template>
  <planList table-type="bill_warehouse_loss" :reportDic="reportDic"/>
</template>

<script>
  import planList from '@/z/report/components/planList'

  export default {
    name: 'warehouse_loss_report',
    components: {
      planList
    },
    directives: {},
    filters: {},
    data() {
      return {
        reportDic: {
          tableName: 'bill_warehouse_loss'
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
