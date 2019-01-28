<template>
  <div>
    <sticky class-name="sub-navbar draft">
      <el-button style="margin-left: 10px;" type="success" @click="saveData" :loading="loading">保存</el-button>
    </sticky>
    <code>
      拖动到【已设置】，【已设置】区域上面表示低等级
    </code>
    <div class="components-container board" v-loading="loading">
      <Kanban :list="list1" :options="options" class="kanban todo" header-text="待设置"/>
      <Kanban :list="list2" :options="options" class="kanban done" header-text="已设置"/>
    </div>
  </div>
</template>
<script>
  import Kanban from '@/components/Kanban'
  import {getList,setGrade} from '@/api/vip/grade'
  import Sticky from '@/components/Sticky'

  export default {
    name: 'set_grade',
    components: {Kanban, Sticky},
    data() {
      return {
        options: {
          group: 'mission'
        },
        list1: [],
        list2: [],
        loading: false
      }
    },
    created() {
      this.loading = true
      getList({}).then(response => {
        this.list1 = response.data.filter(r => r.indexDepth == null)
        this.list2 = response.data.filter(r => r.indexDepth != null).sort((a, b) => a.indexDepth > b.indexDepth)
      }).finally(() => this.loading = false)
    },
    methods: {
      saveData() {
        this.loading = true
        setGrade(this.list2).then(response => {
          this.$message({message: response.message, type: 'success'})
          let thisView = this.$store.state.tagsView.visitedViews.find(r => r.fullPath == this.$route.fullPath)
          this.$store.dispatch('delView', thisView).then(() => {
            let backView = this.$store.state.tagsView.visitedViews.find(r => r.fullPath == "/vip/grade/list")
            if (backView != null) {
              this.$store.dispatch('delCachedView', backView).then(() => this.$nextTick(() => this.$router.replace({path: '/redirect' + backView.fullPath})))
            }
          })
        }).finally(() => this.loading = false)
      }
    }
  }
</script>
<style lang="scss">
  .board {
    width: 1000px;
    margin-left: 20px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: flex-start;
  }

  .kanban {
    &.todo {
      .board-column-header {
        background: #4A9FF9;
      }
    }
    &.done {
      .board-column-header {
        background: #2ac06d;
      }
    }
  }
</style>

