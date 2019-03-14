<template>
  <el-dialog
    title="挂单"
    :visible.sync="show"
    width="45%"
    @open="onOpen"
    @close="onClose">
    <el-form v-loading="loading">
      <el-form-item label="类型">
        <el-select style="width: 100%" v-model="type" placeholder="请选择" @change="changeSelect">
          <el-option value="IN" label="挂入"/>
          <el-option value="OUT" label="挂出"/>
        </el-select>
      </el-form-item>
      <el-form-item v-show="type == 'IN'" label="挂单号">
        <el-input v-model="putUpCode" placeholder="请输入挂单号" @keyup.enter.native="onOk"></el-input>
      </el-form-item>
      <el-form-item v-show="type == 'OUT'" label="选择挂出单">
        <el-select style="width: 100%" v-model="outId" placeholder="请选择挂出单">
          <el-option v-for="ele in list" :value="ele.id" :label="ele.code"/>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose" :loading="loading">取消</el-button>
      <el-button type="primary" @click="onOk" :loading="loading">确定</el-button>
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
        type: 'IN',
        putUpCode: '',
        loading: false,
        list: [],
        outId: ''
      };
    },
    props: {
      show: {default: false},
      goodsList: {default: []},
      vip: {default: {}},
    },
    watch: {},
    methods: {
      onClose() {
        this.$emit('update:show', false)
      },
      onOpen(){
        this.type = 'IN'
        this.list = []
        this.putUpCode = ''
        this.outId = ''
      },
      onOk() {
        if (this.type === 'IN') {
          if (this.goodsList.length === 0) {
            this.$message.error('没有货品')
            return
          }
          this.putIn()
        } else {
          this.putOut()
        }
      },
      //挂单
      putIn() {
        this.loading = true
        let json = JSON.stringify({goodsList: this.goodsList, vip: this.vip})
        putUpIn({code: this.putUpCode, json: json}).then(response => {
          this.$message({message: response.message, type: 'success'})
          this.putUpCode = ''
          this.onClose()
          this.$emit('callBack', {})
        }).finally(() => this.loading = false)
      },
      //挂出
      putOut() {
        if (this.outId == '' || this.outId == null) {
          this.$message.error('请选择挂出单')
          return
        }
        let out = this.list.find(s => s.id === this.outId)
        let json = JSON.parse(out.json)
        this.$emit('callBack', json)
        this.type = 'IN'
        this.onClose()
        putUpOut({id: this.outId})
      },
      //挂单列表
      putList() {
        this.loading = true
        putUpList({}).then(response => {
          this.list = response.data.content
          if (this.list.length > 0) {
            this.outId = this.list[0].id
          }
        }).finally(() => this.loading = false)
      },
      changeSelect() {
        if (this.type === 'OUT') {
          this.putList()
        }
      }
    },
  }
</script>
