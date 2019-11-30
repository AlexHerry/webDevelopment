<template>
  <div class="login" ref="n">
    <el-form ref="form" class="try" :model="form" :rules="rules">
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login_btn" @click="login(form)">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
      },
    };
  },
  methods: {
    login(form) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.axios.post('/login', this.form).then((bak) => {
            if (bak.data.meta.status == 200) {
              sessionStorage.setItem('token', bak.data.data.token);
              this.$message({message: '登陆成功', type: 'success'});
              this.$router.push({path: '/'});
            } else {
              this.$message.error('账号或密码错误');
              this.form = {};
            }
          });
        } else {
          this.$message.error('错误数据');
          return false;
        }
      });
    },
  },
};
</script>

<style>
.login {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
h2 {
  margin-bottom: 30px;
}
.try {
  background: #fff;
  padding: 50px 40px 40px;
  border-radius: 10px;
  width: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login_btn {
  width: 100%;
}
</style>
