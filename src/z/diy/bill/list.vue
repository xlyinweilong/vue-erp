<template>
  <div>
    <sticky class-name="sub-navbar draft">
      <el-button style="margin-left: 10px;" type="success" @click="saveData" :loading="loading">保存</el-button>
    </sticky>
    <div style="text-align: center;margin-top: 10px;">
      <el-transfer v-loading="loading" :titles="['不显示的标题', '显示的标题']" v-model="diyValues" :data="diyList" style="text-align: left; display: inline-block;"></el-transfer>
    </div>
  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {save, getList} from '@/api/user/diy'

  export default {
    name: 'diy_bill_list',
    components: {Sticky},
    data() {
      return {
        loading: false,
        diyList: [{key: 'bill_code', label: '单据编号'}, {key: 'bill_date', label: '单据时间'}, {key: 'grand_parent_code', label: '上上游单据编号'}, {key: 'parent_code', label: '上游单据编号'}, {key: 'create_date', label: '创建时间'}, {key: 'update_date', label: '更新时间'}
          , {key: 'supplier_code', label: '供应商编号'}, {key: 'supplier_name', label: '供应商名称'}, {key: 'warehouse_code', label: '仓库编号'}, {key: 'warehouse_name', label: '仓库名称'}, {key: 'goods_pattern', label: '款型'}
          , {key: 'to_warehouse_code', label: '入仓库编号'}, {key: 'to_warehouse_name', label: '入仓库名称'}, {key: 'channel_code', label: '渠道编号'}, {key: 'channel_name', label: '渠道名称'}, {key: 'to_channel_code', label: '入渠道编号'}, {key: 'to_channel_name', label: '入渠道名称'}
          , {key: 'total_count', label: '总数量'}, {key: 'total_quote_count', label: '被引用数量'}, {key: 'total_amount', label: '总金额'}, {key: 'total_tag_amount', label: '总吊牌额'}, {key: 'create_user_name', label: '创建人姓名'}, {key: 'audit_user_name', label: '审核人姓名'}, {key: 'status', label: '状态'}
        ],
        diyValues: [],
        type: 'BILL_LIST'
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.loading = true
        getList({type: this.type}).then(response => {
          this.diyValues = response.data
        }).finally(() => this.loading = false)
      },
      //偏好设置
      saveData() {
        this.loading = true
        save({keys: this.diyValues, type: this.type}).then(response => {
          this.$message({message: '保存成功', type: 'success'});
        }).finally(() => this.loading = false)
      }
    }
  }
</script>
