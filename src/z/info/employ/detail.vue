<template>
  <div>
    <sticky class-name="sub-navbar draft" v-if="!isDetail">
      <el-button style="margin-left: 10px;" type="success" @click="saveData" :loading="loading">保存</el-button>
    </sticky>

    <div class="tab-container">
      <el-form ref="employForm" :model="form" :rules="rules"  v-loading="loading">
        <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
          <el-tab-pane label="基本资料" name="BASE">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="编号" prop="code">
                  <el-input v-model.trim="form.code" @keyup.enter.native="saveData" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="名称" prop="name">
                  <el-input v-model.trim="form.name" @keyup.enter.native="saveData" :disabled="isDetail"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!--<el-tab-pane label="设置" name="CONF">-->

          <!--</el-tab-pane>-->
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {save, get} from '@/api/info/employ'
  import Sticky from '@/components/Sticky'
  import {backUrl} from '@/z/common/commonMethod'

  export default {
    name: 'employ_detail',
    components: {Sticky},
    data() {
      return {
        form: {
          id: null,
          code: '',
          name: '',
        },
        rules: {
          code: [{required: true, message: '必填字段', trigger: 'blur'}],
          name: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
        loading: false,
        activeName: 'BASE',
        isDetail:false
      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      this.isDetail = this.$route.name.indexOf("_detail") > -1;
      if (id != null) {
        this.loading = true
        get({id: id}).then(response => {
          this.loading = false
          this.form = response.data
        }).catch(() => this.loading = false)
      }
    },
    methods: {
      saveData() {
        this.$refs['employForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            save(this.form).then(response => {
              this.loading = false
              this.$message({message: response.message, type: 'success'})
              backUrl(this, '/info/employ')
            }).catch((err) => this.loading = false)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .tab-container {
    margin: 10px;
  }
  .is-disabled >>> .el-input__inner{
    color:#606266 !important;
  }

  .el-select>>>.el-input__inner{
    color:#606266 !important;
  }

  .el-select>>>.el-select__tags-text{
    color:#606266 !important;
  }
</style>
