<template>
  <planList table-type="bill_channel_2_warehouse" :reportDic="reportDic"/>
</template>

<script>
  import planList from '@/z/report/components/planList'

  export default {
    name: 'channel2warehouse_report',
    components: {
      planList
    },
    directives: {},
    filters: {},
    data() {
      return {
        reportDic: {
          tableName:'bill_channel_2_warehouse'
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
