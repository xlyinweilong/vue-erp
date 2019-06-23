<template>
  <el-dialog title="查询" :visible="show" width="65%" @close="onClose" @open="onOpen" append-to-body>
    <el-row :gutter="20" v-loading="loading">
      <el-col :span="24" style="margin-bottom: 10px;">
        <el-input v-model.trim="name" placeholder="请输入名称" @keyup.enter.native="save"/>
      </el-col>
      <el-col :span="24">
        <el-switch
          v-model="isFact"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="度量"
          inactive-text="维度"
          @change="changeShowType">
        </el-switch>
        <el-radio-group v-show="!isFact" v-model="showType" @change="changeShowType">
          <el-radio v-for="title in titleList" :label="title.tableTitle" border>{{title.tableTitle}}</el-radio>
          <el-radio label="bill" border>单据</el-radio>
          <el-radio label="i_goods" border>货品</el-radio>
          <el-radio label="i_channel" v-show="joinList.some(j => j.joinTableAsName === 'c')" border>渠道</el-radio>
          <el-radio label="i_warehouse" v-show="joinList.some(j => j.joinTableAsName === 'w')" border>仓库</el-radio>
          <el-radio label="i_supplier" v-show="joinList.some(j => j.joinTableAsName === 's')" border>供应商</el-radio>
          <el-radio label="i_to_channel" v-show="joinList.some(j => j.joinTableAsName === 'tc')" border>调入渠道</el-radio>
          <el-radio label="i_to_warehouse" v-show="joinList.some(j => j.joinTableAsName === 'tw')" border>调入仓库</el-radio>
          <el-radio label="vip" v-show="joinList.some(j => j.joinTableAsName === 'vip')" border>会员</el-radio>
          <el-radio label="i_employ" v-show="joinList.some(j => j.joinTableAsName === 'e')" border>营业员</el-radio>
        </el-radio-group>
        <dnd-list :list1="checkedList" :list2="poolList" list1-title="已选择" list2-title="待选择"/>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="save()" :loading="loading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import DndList from '@/components/DndList'
  import {dictTableFieldList} from '@/api/report/bill'
  import {save, info} from '@/api/report/plan'


  export default {
    computed: {},
    components: {DndList},
    data() {
      return {
        titleList: [],
        isFact: false,
        loading: false,
        list: [],
        checkedList: [],
        poolList: [],
        showType: '',
        name: '',
        joinList: []
      };
    },
    props: {
      planId: {default: ''},
      show: {default: false},
      keyType: {default: ''}
    },
    methods: {
      changeShowType() {
        let type = this.isFact ? 'FACT' : 'DIM'
        this.saveListData()
        // if (this.isFact) {
        //   this.checkedList = this.list.filter(d => d.type === type && d.checked)
        //   this.poolList = this.list.filter(d => d.type === type && !d.checked)
        // } else {
          this.checkedList = this.list.filter(d => d.tableTitle === this.showType && d.checked)
          this.poolList = this.list.filter(d => d.tableTitle === this.showType && !d.checked)
        this.checkedList.forEach(d => {
          d.key = d.id
          d.title = d.fieldTitle
        })
        this.poolList.forEach(d => {
          d.key = d.id
          d.title = d.fieldTitle
        })
        // }
      },
      saveListData() {
        this.list.filter(d => this.poolList.some(c => c.key === d.key)).forEach(d => d.checked = false)
        this.list.filter(d => this.checkedList.some(c => c.key === d.key)).forEach(d => d.checked = true)
        console.log(this.poolList)
      },
      onClose() {
        this.$emit('update:show', false)
      },
      onOpen() {
        this.loading = true
        dictTableFieldList({key: this.keyType}).then(response => {
          response.data.forEach(d => d.checked = false)
          this.list = response.data
          this.titleList =[]
          this.list.forEach(d => {
            if (this.titleList.every(t => t.tableTitle != d.tableTitle)) {
              this.titleList.push(d)
            }
          })
          if(this.titleList.length > 0){
            this.showType = this.titleList[0].tableTitle
          }

          // this.joinList = response.data.join
          // this.name = ''
          // if (this.planId != '') {
          //   this.loading = true
          //   info({id: this.planId}).then(response => {
          //     this.name = response.data.name
          //     this.list.filter(c => response.data.detailList.some(d => d.key === c.key)).forEach(c => c.checked = true)
          //     this.changeShowType()
          //   }).finally(() => this.loading = false)
          // }
          this.changeShowType()
        }).finally(() => this.loading = false)
      },
      save() {
        this.saveListData()
        if (this.name == '') {
          this.$message.error('请输入名称');
          return
        }
        if (this.list.filter(d => d.checked).length === 0) {
          this.$message.error('请至少选择一个查询');
          return
        }
        this.loading = true
        save({detailList: this.list.filter(d => d.checked), table: this.tableType, name: this.name}).then(response => {
          this.$message({message: '保存成功', type: 'success'});
          this.$emit('getList', {})
          this.onClose()
        }).finally(() => this.loading = false)

      }
    }
  }
</script>
