<template>
  <planList table-type="bill_notice_channel_2_channel_out" :reportDic="reportDic"/>
</template>

<script>
  import planList from '@/z/report/components/planList'

  export default {
    name: 'notice_channel2channel_out_report',
    components: {
      planList
    },
    directives: {},
    filters: {},
    data() {
      return {
        reportDic: {
          tableName: 'bill_notice_channel_2_channel_out'
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
