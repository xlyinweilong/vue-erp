<template>
  <el-dialog
    title="日结"
    :visible.sync="show"
    width="45%"
    @open="onOpen"
    @close="onClose">
    <el-form v-loading="loading">
      <span>日结时间</span>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose" :loading="loading">取消</el-button>
      <el-button type="primary" @click="onOk" :loading="loading">日结</el-button>
      <el-button type="primary" @click="onOk" :loading="loading" plain>取消日结</el-button>
      <el-button type="primary" @click="onOk" :loading="loading">日结</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {putUpIn, putUpList, putUpOut} from '@/api/pos/putUp'

  export default {
    computed: {},
    components: {},
    data() {
      return {
        loading: false,
        list: []
      };
    },
    props: {
      show: {default: false}
    },
    watch: {},
    methods: {
      onClose() {
        this.$emit('update:show', false)
      },
      onOpen(){
      },
      onOk() {
      }
    },
  }
</script>
