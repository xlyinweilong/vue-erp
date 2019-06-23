<template>
  <planList table-type="bill_warehouse_inventory" :reportDic="reportDic"/>
</template>

<script>
  import planList from '@/z/report/components/planList'

  export default {
    name: 'warehouse_inventory_report',
    components: {
      planList
    },
    directives: {},
    filters: {},
    data() {
      return {
        reportDic: {
          tableName: 'bill_warehouse_inventory'
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
