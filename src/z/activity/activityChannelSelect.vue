<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addOneRow" :loading="listLoading">增加一行
      </el-button>
    </div>

    <el-row :gutter="20">
      <el-table
        v-loading="listLoading"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        fit
        border
      >
        <el-table-column label="渠道编号" align="center" min-width="250">
          <template slot-scope="scope">
            <el-select style="width: 100%" v-model="scope.row.channelId" filterable clearable remote
                       default-first-option placeholder="请输入渠道编号" :remote-method="searchChannel" @change="changeSelect"
                       :loading="loadingChannel" @focus="focusSelect(scope.row)">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
              <el-option v-if="scope.row.channelId != '' && scope.row.optionChannel == null" :value="scope.row.channelId" :label="scope.row.channelName +'-'+scope.row.channelCode"/>
              <el-option v-for="item in scope.row.optionChannel" :value="item.id" :label="item.name +'-'+item.code"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" circle @click="list.splice(scope.$index,1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import {getList as getChannelList} from '@/api/info/channel'


  export default {
    name: 'activity_channel_select',
    components: {
    },
    props: {
      list: {default: []},
      isDisabled: {default: false}
    },
    data() {
      return {
        listLoading: false,
        loadingChannel: false,
        focusedSelect: null
      }
    },
    created() {
    },
    methods: {
      addOneRow() {
        this.list.push({channelId: '', channelName: '', channelCode: '', optionChannel: []})
      },
      searchChannel(query) {
        if (query !== '') {
          this.loadingChannel = true
          getChannelList({pageIndex: 1, pageSize: 10, searchKey: query}).then(response => {
            this.focusedSelect.optionChannel = response.data.content.filter(r => this.list.every(d => d.channelId != r.id))
          }).finally(() => this.loadingChannel = false)
        } else {
          this.focusedSelect.optionChannel = []
        }
      },
      changeSelect() {
        if (this.focusedSelect.channelId != '' && this.list.some(r => r.channelId == this.focusedSelect.channelId)) {
          return false
        }
      },
      focusSelect(row) {
        this.focusedSelect = row
        if( this.focusedSelect.optionChannel != null){
          this.focusedSelect.optionChannel = this.focusedSelect.optionChannel.filter(r => r.id == this.focusedSelect.channelId)
        }
      }

    }
  }
</script>


