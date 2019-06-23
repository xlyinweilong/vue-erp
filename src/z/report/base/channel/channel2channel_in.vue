<template>
  <planList table-type="bill_channel_2_channel_in" :reportDic="reportDic"/>
</template>

<script>
  import planList from '@/z/report/components/planList'

  export default {
    name: 'channel2channel_in_report',
    components: {
      planList
    },
    directives: {},
    filters: {},
    data() {
      return {
        reportDic: {
          tableName:'bill_channel_2_channel_in',
          keyList: ['DIM_BILL_PARENT_BILL_CODE'],
          renameKeys: ['DIM_BILL_PARENT_BILL_CODE'],
          renameKeyNames: ['调出单号']
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
