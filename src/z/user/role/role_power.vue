<template>
  <div>
    <sticky class-name="sub-navbar draft">
      <el-button style="margin-left: 10px;" type="success" @click="saveData" :loading="loading">保存</el-button>
    </sticky>

    <div class="tab-container">
      <el-form ref="powerForm" :model="form" :rules="rules" v-loading="loading">
        <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card" @tab-click="handleTagPaneClick">
          <el-tab-pane label="基本权力" name="BASE_POWER">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="角色名称" prop="billCode">
                  <el-input :value="form.roleName" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="POS最小折扣" prop="billDate">
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="菜单可见和操作权力" name="MENU_POWER">
            <div class="filter-container">
              <el-button class="filter-item" type="primary" plain @click="selectAllShow">选中所有查看</el-button>
              <el-button class="filter-item" type="success" plain @click="selectAll">选中全部</el-button>
              <el-button class="filter-item" type="success" plain @click="unSelectAll">清除全部的选中</el-button>
            </div>
            <div class="filter-container">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
              </el-input>
            </div>
            <div class="container">
              <el-tree node-key="id" ref="tree" show-checkbox :data="treeList" :props="defaultProps" @check="handleNodeCheck" :filter-node-method="filterNode"></el-tree>
            </div>
          </el-tab-pane>
          <el-tab-pane label="货品范围" name="GOODS_POWER">
            <div style="text-align: center">
              <el-transfer :titles="['所有的权限', '拥有的权限']" style="text-align: left; display: inline-block" filterable v-model="form.selectGoodsGroupIds" :data="goodsGroupList" :props="dictProps"></el-transfer>
            </div>
          </el-tab-pane>
          <el-tab-pane label="供应商范围" name="SUPPLIER_POWER">
            <div style="text-align: center">
              <el-transfer :titles="['所有的权限', '拥有的权限']" style="text-align: left; display: inline-block" filterable v-model="form.selectSupplierGroupIds" :data="supplierGroupList" :props="dictProps"></el-transfer>
            </div>
          </el-tab-pane>
          <el-tab-pane label="仓库范围" name="WAREHOUSE_POWER">
            <div style="text-align: center">
              <el-transfer :titles="['所有的权限', '拥有的权限']" style="text-align: left; display: inline-block" filterable v-model="form.selectWarehouseGroupIds" :data="warehouseGroupList" :props="dictProps"></el-transfer>
            </div>
          </el-tab-pane>
          <el-tab-pane label="渠道范围" name="CHANNEL_POWER">
            <div style="text-align: center">
              <el-transfer :titles="['所有的权限', '拥有的权限']" style="text-align: left; display: inline-block" filterable v-model="form.selectChannelGroupIds" :data="channelGroupList" :props="dictProps"></el-transfer>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </div>

  </div>
</template>

<script>
  import Sticky from '@/components/Sticky'
  import {get, save, powerAndMenu, groupList} from '@/api/user/rolePower'

  export default {
    name: 'role_power',
    components: {
      Sticky
    },
    watch: {
      filterTreeText(val) {
        this.$refs.tree.filter(val);
      }
    },
    filters: {},
    data() {
      return {
        form: {
          roleId: '',
          roleName: '',
          selectPowerKeys: [],
          selectGoodsGroupIds: [],
          selectChannelGroupIds: [],
          selectWarehouseGroupIds: [],
          selectSupplierGroupIds: [],
        },
        activeName: 'BASE_POWER',
        loading: false,
        //新增修改
        saving: false,
        rules: {
          name: [{required: true, message: '必填字段', trigger: 'blur'}]
        },
        //菜单可见和操作权力
        menuList: [],
        powerList: [],
        treeList: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        filterText: '',
        dictProps: {
          key: 'id',
          label: 'name'
        },
        //货品组
        goodsGroupList: [],
        //货品组
        channelGroupList: [],
        //货品组
        warehouseGroupList: [],
        //货品组
        supplierGroupList: [],
      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      if (id != null) {
        this.loading = true
        get({id: id}).then(response => {
          this.form = response.data
        }).finally(() => this.loading = false)
      }
    },
    watch: {
      //菜单可见和操作权力
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      //修改tag pane
      handleTagPaneClick(tab, event) {
        if (tab.name === 'MENU_POWER') {
          if (this.treeList.length === 0) {
            this.loading = true
            powerAndMenu().then(response => {
              this.menuList = response.data.menuList
              this.powerList = response.data.powerList
              this.treeList = this.menuList.filter(m => m.grade === 1)
              this.treeList.forEach(m => this.loadMenuAndPower(m))
              //编辑时，选中数据已经有的
              this.$refs.tree.setCheckedKeys(this.form.selectPowerKeys)
            }).finally(() => this.loading = false)
          }
        } else if (tab.name === 'GOODS_POWER') {
          if (this.goodsGroupList.length === 0) {
            this.loading = true
            groupList({dictType1: 'GOODS', dictType2: 'GOODS_GROUP'}).then(response => {
              this.goodsGroupList = response.data.content
            }).finally(() => this.loading = false)
          }
        } else if (tab.name === 'SUPPLIER_POWER') {
          if (this.supplierGroupList.length === 0) {
            this.loading = true
            groupList({dictType1: 'SUPPLIER', dictType2: 'SUPPLIER_GROUP'}).then(response => {
              this.supplierGroupList = response.data.content
            }).finally(() => this.loading = false)
          }
        } else if (tab.name === 'WAREHOUSE_POWER') {
          if (this.warehouseGroupList.length === 0) {
            this.loading = true
            groupList({dictType1: 'WAREHOUSE', dictType2: 'WAREHOUSE_GROUP'}).then(response => {
              this.warehouseGroupList = response.data.content
            }).finally(() => this.loading = false)
          }
        } else if (tab.name === 'CHANNEL_POWER') {
          if (this.channelGroupList.length === 0) {
            this.loading = true
            groupList({dictType1: 'CHANNEL', dictType2: 'CHANNEL_GROUP'}).then(response => {
              this.channelGroupList = response.data.content
            }).finally(() => this.loading = false)
          }
        }
      },
      //保存
      saveData() {
        if (this.treeList.length != 0) {
          this.form.selectPowerKeys = this.$refs.tree.getCheckedKeys()
        }
        save(this.form).then(response => {
          this.$message({message: response.message, type: 'success'})
        }).finally(() => this.loading = false)
      },
      //菜单可见和操作权力
      //加载内容
      loadMenuAndPower(m) {
        if (m.dictionary) {
          m.children = this.menuList.filter(s => s.parentId === m.id)
          m.children.forEach(s => this.loadMenuAndPower(s))
        } else {
          m.children = this.powerList.filter(p => p.menuId === m.id)
          m.children.map(p => p.isPower = true)
        }
      },
      handleNodeCheck(node, attr) {
        if (node.isPower) {
          let checkedKeys = this.$refs.tree.getCheckedKeys()
          let checkedNodes = this.$refs.tree.getCheckedNodes()
          if (node.id !== node.menuId + "_show" && checkedKeys.indexOf(node.id) > -1) {
            checkedKeys.push(node.menuId + "_show")
            this.$refs.tree.setCheckedKeys(checkedKeys)
          }
          if (node.id === node.menuId + "_show" && checkedKeys.indexOf(node.id) < 0) {
            checkedKeys = []
            checkedNodes.filter(c => c.menuId !== node.menuId).forEach(c => checkedKeys.push(c.id))
            this.$refs.tree.setCheckedKeys(checkedKeys)
          }
        }
      },
      //过滤
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      //选中全部
      selectAll() {
        this.$refs.tree.setCheckedKeys(this.powerList.map(r => r.id));
      },
      //取消所有选中
      unSelectAll() {
        this.$refs.tree.setCheckedKeys([]);
      },
      //选中所有查看
      selectAllShow() {
        let selecteds = this.$refs.tree.getCheckedKeys()
        this.$refs.tree.setCheckedKeys(this.powerList.filter(r => r.id === r.menuId + "_show" || selecteds.indexOf(r.id) > -1).map(r => r.id))
      }
    }
  }
</script>

<style scoped>

  .el-select > > > .el-input__inner {
    color: #606266 !important;
  }

  .tab-container {
    margin: 10px;
  }

  .is-disabled /deep/ .el-input__inner {
    color: #606266 !important;
  }

  .is-disabled /deep/ input {
    color: #606266 !important;
  }

  .el-select /deep/ .el-input__inner {
    color: #606266 !important;
  }

  .el-select /deep/ .el-select__tags-text {
    color: #606266 !important;
  }

  .full_with_date {
    width: 100% !important;
  }

  .padding1 /deep/ input {
    padding-left: 1px;
    padding-right: 1px;
    /*border: 0;*/
  }

  .myt /deep/ .cell {
    padding-left: 5px;
    padding-right: 5px;
  }

</style>
