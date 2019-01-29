<template>
  <div>
    <sticky class-name="sub-navbar draft">
      <el-button style="margin-left: 10px;" type="success" @click="saveData" :loading="loading">保存</el-button>
    </sticky>

    <div class="app-container">
      <el-table
        v-loading="loading"
        :data="gradeList"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
        fit
        border
      >
        <el-table-column label="会员等级" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="多少积分为1元" align="center">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.integral " :min="1" :max="999999999" label="填写一个数字" :precision="0" :step="100"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {getList, save} from '@/api/vip/vipIntegralToAmount'
  import {getList as getGradeList} from '@/api/vip/grade'
  import Sticky from '@/components/Sticky'
  import permission from '@/directive/permission/index.js'

  export default {
    name: 'integral_to_amount',
    components: {Sticky},
    directives: {permission},
    data() {
      return {
        gradeList: [],
        integral: false,
        loading: false
      }
    },
    created() {
      this.loading = true
      getGradeList().then(response => {
        this.gradeList = response.data.filter(r => r.indexDepth != null).sort((a, b) => a.indexDepth > b.indexDepth)
        this.getList()
      }).catch(() => this.loading = false)
    },
    methods: {
      getList() {
        this.loading = true
        getList().then(response => {
          this.gradeList.forEach(r => {
            let e = response.data.find(d => d.gradeId === r.id)
            r.integral = null
            if (e != null) {
              r.integral = e.integral
            }
          })
        }).finally(() => this.loading = false)
      },
      saveData() {
        this.saving = true
        let list = []
        this.gradeList.forEach(g => {
          list.push({gradeId: g.id, integral: g.integral})
        })
        save(list).then(response => {
          this.$message({message: response.message, type: 'success'})
          this.getList()
        }).finally(() => this.saving = false)
      }
    }
  }
</script>

<style scoped>
</style>
