<template>
  <div>
    <el-row class="page_brand">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 40px">
        <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row style="padding-left: 20px">
      <el-table :data="authList" style="width: 580px" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
        <el-table-column prop="path" label="路径" width="180"></el-table-column>
        <el-table-column label="地址" width="180">
        <el-col slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-else-if="scope.row.level == 1">二级</span>
          <span v-else-if="scope.row.level == 2">三级</span>
        </el-col>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      authList: [],
    };
  },
  methods: {
    getData(url, method, data, fun) {
      this.axios({
        url,
        method,
        data,
      }).then((bak) => {
        fun(bak.data);
      });
    },
  },
  mounted() {
    this.getData('/rights/list', 'GET', '', (bak) => {
      this.authList = bak.data;
    });
  },
};
</script>

<style></style>
