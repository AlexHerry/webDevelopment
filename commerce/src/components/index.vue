<template>
  <el-container>
    <el-header :span="24" class="home_header">
      <el-row class="header">
        <el-col :span="4">
          <div class="grid-content bg-purple"><img src="static/logo.png" style="margin-top:5px" /></div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple-light"><h1>电商后台管理系统</h1></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple"><el-button type="primary" @click="logout" class="index_button">退出</el-button></div>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="h">
      <el-aside :span="4">
        <el-menu default-active="2" class="el-menu-vertical-demo" router>
          <el-submenu :index="val.path" v-for="val in list" :key="val.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ val.authName }}</span>
            </template>
            <el-menu-item :index="'/'+small.path" v-for="small in val.children" :key="small.id">
              <i class="el-icon-menu"></i>
              {{ small.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="home_main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    if (!sessionStorage.getItem('token')) {
      this.$message({message: '请先登录', type: 'error'});
      this.$router.push({path: '/login'});
    }
    const a = sessionStorage.getItem('token');
    if (!a) {
      this.$router.push({path: '/login'});
      return;
    }
    this.axios({method: 'GET', url: '/rights/tree'}).then((bak) => {
      this.list = bak.data.data;
    });
  },
  methods: {
    logout() {
      this.$confirm('你确认要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        sessionStorage.removeItem('token');
        this.$router.push({path: '/login'});
        this.$message({
          type: 'success',
          message: '退出成功',
        });
      }).catch(()=>{});
    },
  },
};
</script>

<style>
.h {
  margin-top: 8px;
}
.header {
  text-align: center;
  background: #b3c0d1;
}
.index_button {
  float: right;
  margin-top: 15px;
  margin-right: 10px;
}
.el-aside {
  height: 100%;
}
.el-container {
  height: 100%;
}
.home_main {
  background: #e9eef3;
  width: 100%;
  height: 100%;
}
.home_header {
  margin: 0;
  padding: 0;
}
</style>
