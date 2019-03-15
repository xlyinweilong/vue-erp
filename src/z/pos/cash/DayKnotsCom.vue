<template>
  <el-dialog
    title="日结"
    :visible.sync="show"
    width="45%"
    @open="onOpen"
    @close="onClose">
    <el-form v-loading="loading">
      <span v-show="lastDay.id != null">上次日结日期：<b>{{lastDay.billDate}}</b></span>
      <span v-show="lastDay.id == null">还没有日结过</span>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose" :loading="loading">取消</el-button>
      <el-button type="warning" @click="cancelDayKnots" :loading="loading" plain>取消日结</el-button>
      <el-button type="primary" @click="onOk" :loading="loading" plain>打印</el-button>
      <el-button type="primary" @click="doDayKnots" :loading="loading">日结</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {getLast, doDayKnots,cancelDayKnots} from '@/api/pos/dayKnots'

  export default {
    computed: {},
    components: {},
    data() {
      return {
        loading: false,
        list: [],
        lastDay: {id: null}
      };
    },
    props: {
      show: {default: false},
      channelId: {default: ''}
    },
    watch: {},
    methods: {
      onClose() {
        this.$emit('update:show', false)
      },
      onOpen() {
        this.loading = true
        this.lastDay = {id: null}
        getLast({channelId: this.channelId}).then((response) => {
          if (response.data != null) {
            this.lastDay = response.data
          }
        }).finally(() => this.loading = false)
      },
      onOk() {
      },
      doDayKnots() {
        this.loading = true
        doDayKnots({channelId: this.channelId}).then((response) => {
          this.$message({message: response.message, type: 'success'})
          this.onOpen()
        }).catch(() => this.loading = false)
      },
      cancelDayKnots(){
        cancelDayKnots({channelId: this.channelId}).then((response) => {
          this.$message({message: response.message, type: 'success'})
          this.onOpen()
        }).catch(() => this.loading = false)
      }
    },
  }
</script>
