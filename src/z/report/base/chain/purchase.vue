<template>
  <planList keyType="bill_purchase"/>
</template>

<script>
  import planList from '@/z/report/base/components/planList'

  export default {
    name: 'purchase_report',
    components: {
      planList
    },
    directives: {},
    filters: {},
    data() {
      return {
        reportDic: {
          tableName:'bill_purchase'
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
