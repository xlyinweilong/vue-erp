<template>
  <planList table-type="bill_channel_inventory" :reportDic="reportDic"/>
</template>

<script>
  import planList from '@/z/report/components/planList'

  export default {
    name: 'channel_inventory_report',
    components: {
      planList
    },
    directives: {},
    filters: {},
    data() {
      return {
        reportDic: {
          tableName: 'bill_channel_inventory'
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
