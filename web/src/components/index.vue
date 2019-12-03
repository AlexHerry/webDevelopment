<template>
  <el-container style="height: 100%">
    <el-header class="index_h" style="height:60px">
      <el-row>
        <el-col :span="8"><img src="static/logo.png" /></el-col>
        <el-col :span="8" style="text-align:center;"><h1>Alex的后台管理系统</h1></el-col>
        <el-col :span="8" style="text-align:right;"><el-button type="primary" @click="logout">退出</el-button></el-col>
      </el-row>
    </el-header>
    <el-container style="height: 100%">
      <el-aside class="index_aside">
        <el-menu default-active="2" class="el-menu-vertical-demo" router unique-opened>
          <el-submenu :index="val.path" v-for="val in asideList" :key="val.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ val.authName }}</span>
            </template>
            <el-menu-item :index="'/'+list.path" v-for="list in val.children" :key="list.id">
              <i class="el-icon-menu"></i>
              {{ list.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main class="index_m" style="padding: 0">
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      asideList: [],
    };
  },
  methods: {
    logout() {
      this.$confirm('你是否要退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        sessionStorage.removeItem('token');
        this.$router.push({path: '/login'});
        this.$message({message: '退出成功', type: 'success'});
      }).catch(() => {});
    },
  },
  mounted() {
    if (!sessionStorage.getItem('token')) {
      this.$message({message: '请先登录', type: 'error'});
      this.$router.push({path: '/login'});
      return;
    }
    this.axios({
      url: '/menus',
      method: 'GET',
    }).then((bak) => {
      this.asideList = bak.data.data;
    });
  },
};
</script>

<style>
.index_h {
  width: 100%;
  line-height: 60px;
  background: #b3c0d1;
}
.index_aside {
  width: 20%;
  height: 100%;
  background: #fff;
}
.index_m {
  width: 100%;
  height: 100%;
  background: #e9eef3;
}
</style>
