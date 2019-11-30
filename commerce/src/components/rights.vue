<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="user_n" style="margin-bottom:10px;">
      <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table :data="tableData" style="width: 40%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级">
          <template slot-scope="scope">
              <span v-if="scope.row.level == 0">一级</span>
              <span v-if="scope.row.level == 1">二级</span>
              <span v-if="scope.row.level == 2">三级</span>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.axios({
      url: '/rights/list',
      method: 'GET',
    }).then((bak) => {
      this.tableData = bak.data.data;
    });
  },
};
</script>

<style>
.user_n {
  height: 50px;
  width: 100%;
  background: #d3dce6;
  margin: -20px -20px;
  line-height: 50px;
  padding: 0 10px 0 30px;
}
</style>
