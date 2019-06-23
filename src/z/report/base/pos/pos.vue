<template>
  <planList table-type="bill_pos_cash" :reportDic="reportDic"/>
</template>

<script>
  import planList from '@/z/report/components/planList'

  export default {
    name: 'bill_pos_cash',
    components: {
      planList
    },
    directives: {},
    filters: {},
    data() {
      return {
        reportDic: {
          tableName:'bill_pos_cash',
          keyList: [],
          renameKeys: [],
          renameKeyNames: []
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
