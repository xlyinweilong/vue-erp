<template>
  <div>
    <sticky class-name="sub-navbar draft" v-if="!isDetail">
      <el-button style="margin-left: 10px;" type="success" @click="saveData" :loading="loading">保存</el-button>
    </sticky>

    <div class="tab-container">
      <el-form ref="channelForm" :model="form" :rules="rules" v-loading="loading">
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
              <el-col :span="6">
                <el-form-item label="组" prop="groupId">
                  <el-select :disabled="isDetail" v-model="form.groupId" filterable clearable remote default-first-option placeholder="请输入关键词" :remote-method="searchGroup" :loading="searchTextLoading" style="width: 100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <el-option v-for="item in searchText.optionGroup" :value="item.id" :label="item.name"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="渠道配置" name="CONF">
            <el-table
              :data="channelConfigList"
              tooltip-effect="dark"
              style="width: 100%"
              fit
              border
            >
              <el-table-column label="控制名称" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="参数" align="center">
                <template slot-scope="scope">
                  <span>
                    <el-select v-if="scope.row.valueType === 0" v-model="scope.row.defaultValue" placeholder="请选择">
                      <el-option :value="-1" label="默认的"></el-option>
                      <el-option v-for="(ele,index) in scope.row.valueSelect.split(',')" :value="index" :label="ele"></el-option>
                    </el-select>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {save, get} from '@/api/info/channel'
  import Sticky from '@/components/Sticky'
  import {getDictList} from '@/api/info/dict'
  import {getAll} from '@/api/config/config'
  import {backUrl} from '@/z/common/commonMethod'

  export default {
    name: 'channel_detail',
    components: {Sticky},
    data() {
      return {
        form: {
          id: null,
          code: '',
          name: '',
          groupId: '',
          //配置
          channelConfigList: [],
          channelConfigChannelList:[]
        },
        rules: {
          code: [{required: true, message: '必填字段', trigger: 'blur'}],
          name: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
        loading: false,
        activeName: 'BASE',
        isDetail: false,
        searchTextLoading: false,
        searchText: {
          optionGroup: []
        },
        channelConfigList: []
      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      this.isDetail = this.$route.name.indexOf("_detail") > -1;
      this.loading = true
      getAll().then(response => {
        response.data.forEach(r => r.defaultValue = -1)
        this.channelConfigList = response.data.filter(r => r.type === 'channel')
        if (id != null) {
          this.loading = true
          get({id: id}).then(response => {
            this.form = response.data
            this.channelConfigList.forEach(r => {
              let channelConfig = this.form.channelConfigChannelList.find(c => c.configId === r.id)
              if(channelConfig != null){
                r.defaultValue = channelConfig.defaultValue
              }
            })
            if (this.form.groupName != null) {
              this.searchText.optionGroup.push({id: this.form.groupId, name: this.form.groupName})
            }
          }).finally(() => this.loading = false)
        }
      }).finally(() => this.loading = false)
    },
    methods: {
      saveData() {
        this.$refs['channelForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.form.channelConfigList = this.channelConfigList.filter(r => r.defaultValue !== -1)
            save(this.form).then(response => {
              this.$message({message: response.message, type: 'success'})
              backUrl(this, '/info/channel')
            }).finally(() => this.loading = false)
          } else {
            this.activeName = 'BASE'
          }
        })
      },
      //查询
      search(query, type1, type2, typeCode) {
        if (query !== '') {
          this.searchTextLoading = true
          getDictList({type1: type1, type2: type2, pageIndex: 1, pageSize: 10, searchKey: query}).then(response => {
            this.searchText['option' + typeCode] = response.data.content
          }).finally(() => this.searchTextLoading = false)
        } else {
          this.searchText[options] = []
        }
      },
      searchGroup(query) {
        this.search(query, 'CHANNEL', 'CHANNEL_GROUP', 'Group')
      }
    }
  }
</script>

<style scoped>
  .tab-container {
    margin: 10px;
  }

  .is-disabled > > > .el-input__inner {
    color: #606266 !important;
  }

  .el-select > > > .el-input__inner {
    color: #606266 !important;
  }

  .el-select > > > .el-select__tags-text {
    color: #606266 !important;
  }
</style>
