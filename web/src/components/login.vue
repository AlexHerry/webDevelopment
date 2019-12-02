<template>
  <div class="login_bk">
    <el-form ref="login_Form" :model="loginForm" class="login_Fm" :rules="rule">
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login_btn" @click="logins">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      rule: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
      },
    };
  },
  methods: {
    logins() {
      this.$refs.login_Form.validate((valid) => {
        if (valid) {
          this.axios({
            url: '/login',
            method: 'POST',
            data: this.loginForm,
          }).then((bak) => {
            sessionStorage.setItem('token', bak.data.data.token);
            this.$message({message: '登陆成功', type: 'success'});
            this.$router.push({path: '/'});
          });
        } else {
        }
      });
    },
  },
};
</script>

<style>
.login_bk {
  height: 100%;
  width: 100%;
  background: #324152;
}
.login_Fm {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  transform: translate(-50%, -50%);
  padding: 40px;
  background: #fff;
  border-radius: 10px;
}
.login_btn {
  width: 100%;
}
</style>
