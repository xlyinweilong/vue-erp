<template>
  <div>
    <sticky class-name="sub-navbar draft">
      <el-button style="margin-left: 10px;" type="success" @click="saveData" :loading="loading">保存</el-button>
    </sticky>
    <el-table
      v-loading="loading"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%"
      highlight-current-row
      fit
      border
    >
      <el-table-column label="等级升级" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.gradeName }}</el-tag>
          <i class="el-icon-d-arrow-right"></i>
          <el-tag type="success">{{scope.row.toGradeName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="等级经验" align="center">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.lowestXpValue" :min="1" :max="99999999999" label="输入正整数" :precision="0" :step="100"></el-input-number>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {getList, setGradeUpRule} from '@/api/vip/grade'
  import Sticky from '@/components/Sticky'
  import {backUrl} from '@/z/common/commonMethod'

  export default {
    name: 'set_grade',
    components: {
      Sticky
    },
    data() {
      return {
        list: [],
        dataList: [],
        loading: false
      }
    },
    created() {
      this.loading = true
      getList({}).then(response => {
        this.list = response.data.filter(r => r.indexDepth != null).sort((a, b) => a.indexDepth > b.indexDepth)
        let i = 1
        this.list.forEach(r => {
          let next = this.list.find(d => d.indexDepth === r.indexDepth + 1)
          if (next != null) {
            let xpValue = 1000
            if (next.lowestXpValue != null) {
              xpValue = next.lowestXpValue
            }
            this.dataList.push({id: next.id, gradeName: r.name, toGradeName: next.name, lowestXpValue: xpValue, indexDepth: i})
            i++
          }
        })
      }).finally(() => this.loading = false)
    },
    methods: {
      saveData() {
        //校验是否值是否递增
        let errorEle = this.dataList.find(d => d.lowestXpValue == null)
        if (errorEle != null) {
          this.$message.error(errorEle.gradeName + ' 升级至 ' + errorEle.toGradeName + '，经验值不能为空')
          return
        }
        errorEle = this.dataList.find(d => d.indexDepth > 1 && this.dataList.find(r => r.indexDepth == d.indexDepth - 1).lowestXpValue >= d.lowestXpValue)
        if (errorEle != null) {
          this.$message.error(errorEle.gradeName + ' 升级至 ' + errorEle.toGradeName + '，经验值似乎少了点')
          return
        }
        this.loading = true
        let postDate = this.dataList.filter(r => true)
        let firstEle = this.list.find(d => d.indexDepth === 1)
        postDate.push({id: firstEle.id, lowestXpValue: 0})
        setGradeUpRule(postDate).then(response => {
          this.$message({message: response.message, type: 'success'})
          backUrl(this, '/vip/grade/list')
        }).finally(() => this.loading = false)
      }
    }
  }
</script>
<style lang="scss">
</style>

