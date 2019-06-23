<template>
  <planList table-type="bill_in_channel" :reportDic="reportDic"/>
</template>

<script>
  import planList from '@/z/report/components/planList'

  export default {
    name: 'inchannel_report',
    components: {
      planList
    },
    directives: {},
    filters: {},
    data() {
      return {
        reportDic: {
          tableName:'bill_in_channel',
          keyList: ['DIM_BILL_PARENT_BILL_CODE'],
          renameKeys: ['DIM_BILL_PARENT_BILL_CODE'],
          renameKeyNames: ['仓库出货单号']
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
