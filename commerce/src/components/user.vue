<template>
  <div class="user">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="user_n">
      <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row type="flex" class="user_s" justify="left">
      <el-col :span="5">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="sear"></el-button>
        </el-input>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain style="margin-top: 0px;margin-left:10px;" @click="add = true">添加用户</el-button>
      </el-col>
    </el-row>

    <el-table border :data="list" style="width: 100%">
      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="change_state(scope.row.id, scope.row.mg_state)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-row class="user_edit" type="flex" justify="left" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain @click="edit_user(scope.row)"></el-button>

          <el-button type="danger" icon="el-icon-delete" plain @click="del_user(scope.row.id)"></el-button>

          <el-button type="success" icon="el-icon-check" plain @click="select_role(scope.row)"></el-button>
        </el-row>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="get_new"
      @current-change="newpage"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog title="修改用户" :visible.sync="edit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="edit = false">取 消</el-button>
        <el-button type="primary" @click="commit_user_edit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加用户" :visible.sync="add">
      <el-form ref="form" :model="new_list" :rules="rule">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="new_list.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="new_list.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="new_list.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="new_list.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add = false">取 消</el-button>
        <el-button type="primary" @click="add_user(form)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="selectrole">
      <el-form :model="form">
        <el-form-item label="当前用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="请选择角色" :label-width="formLabelWidth">
          <template>
            <el-select v-model="form.role_name" placeholder="请选择">
              <el-option v-for="item in role_lis" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectrole = false">取 消</el-button>
        <el-button type="primary" @click="select_commit_user">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      pagenum: 1,
      total: 0,
      pagesize: 10,
      search: '',
      edit: false,
      form: {},
      new_list: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      rule: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
      },
      add: false,
      formLabelWidth: '120px',
      selectrole: false,
      role_lis: [],
      role_id: [],
      role_all: {},
    };
  },
  mounted() {
    const a = sessionStorage.getItem('token');
    if (!a) {
      this.$router.push({path: '/login'});
      return;
    }
    this.get_data(`/users?${this.search ? `query=${this.search}` : ''}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
      this.pagenum = bak.data.pagenum;
      this.total = bak.data.total;
    });
  },
  methods: {
    get_data(url, method, data, func) {
      this.axios({
        url,
        method,
        data,
      }).then((bak) => {
        if (bak.data.data != null && bak.data.data.users != undefined) {
          this.list = bak.data.data.users;
        }
        func(bak.data);
      });
    },
    change_state(id, state) {
      this.get_data(`/users/${id}/state/${state}`, 'PUT', '', (bak) => {
        if (bak.meta.status == 200) {
          this.$message({message: '更改成功', type: 'success'});
        } else {
          this.$message({message: '更改失败', type: 'error'});
        }
      });
    },
    get_new(val) {
      this.pagesize = val;
      this.get_data(`/users?${this.search ? `query=${this.search}` : ''}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {});
    },
    newpage(val) {
      this.pagenum = val;
      this.get_data(`/users?${this.search ? `query=${this.search}` : ''}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {});
    },
    sear() {
      this.get_data(`/users?${this.search ? `query=${this.search}` : ''}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
        this.search = '';
      });
    },
    edit_user(val) {
      this.edit = true;
      this.form = val;
    },
    add_user(form) {
      this.add = false;
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {};
          data.username = this.new_list.username;
          data.password = this.new_list.password;
          if (this.new_list.email) {
            data.email = this.new_list.email;
          }
          if (this.new_list.mobile) {
            data.mobile = this.new_list.mobile;
          }
          this.get_data('/users', 'POST', data, (bak) => {
            if (bak.meta.status == 201) {
              this.get_data(`/users?${this.search ? `query=${this.search}` : ''}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
                this.pagenum = bak.data.pagenum;
                this.total = bak.data.total;
              });
              this.$message({message: '添加用户成功', type: 'success'});
            } else {
              this.$message({message: '添加用户失败', type: 'error'});
            }
          });
        } else {
          this.$message.error('错误数据');
          return false;
        }
      });
    },
    del_user(id) {
      this.$confirm('你确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.get_data(`/users/${id}`, 'DELETE', '', (bak) => {
          if (bak.meta.status == 200) {
            this.get_data(`/users?${this.search ? `query=${this.search}` : ''}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
              this.pagenum = bak.data.pagenum;
              this.total = bak.data.total;
            });
            this.$message({message: '删除成功', type: 'success'});
          } else {
            this.$message({message: '删除失败', type: 'error'});
          }
        });
      })
          .catch(() => {});
    },
    commit_user_edit() {
      this.edit = false;
      const data = {};
      if (this.form.email) {
        data.email = this.form.email;
      }
      if (this.form.mobile) {
        data.mobile = this.form.mobile;
      }
      this.get_data(`/users/${this.form.id}`, 'PUT', data, (bak) => {
        if (bak.meta.status == 200) {
          this.get_data(`/users?${this.search ? `query=${this.search}` : ''}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {});
          this.$message({message: '更新成功', type: 'success'});
        } else {
          this.$message({message: '更新失败', type: 'error'});
        }
      });
    },
    select_role(val) {
      this.get_data('/roles', 'GET', '', (bak) => {
        this.role_lis = bak.data;
        for (let i=0; i<bak.data.length; i++) {
          // console.log(bak.data);
          this.role_id.push(bak.data[i].id);
          this.role_all[bak.data[i].roleName] = bak.data[i].id;
        }
        // console.log(this.form);
      });
      this.selectrole = true;
      this.form = val;
    },
    select_commit_user() {
      if (this.role_id.includes(this.form.role_name)) {
        this.get_data(`users/${this.form.id}/role`, 'PUT', {rid: this.form.role_name}, (bak) => {
          this.get_data(`/users?${this.search ? `query=${this.search}` : ''}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {});
          this.$message({message: '修改成功', type: 'success'});
          this.selectrole=false;
        });
      } else if (this.form.role_name in this.role_all) {
        this.get_data(`users/${this.form.id}/role`, 'PUT', {rid: this.role_all[this.form.role_name]}, (bak) => {
          this.get_data(`/users?${this.search ? `query=${this.search}` : ''}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {});
          this.$message({message: '修改成功', type: 'success'});
          this.selectrole=false;
        });
      } else {
        this.$message({message: '错误数据', type: 'error'});
      }
    },
  },
};
</script>

<style>
.user {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.user_n {
  height: 50px;
  width: 100%;
  background: #d3dce6;
  margin: -20px -20px;
  line-height: 50px;
  padding: 0 10px 0 30px;
}

.user_s {
  background: #e9eef3;
  width: 100%;
  height: 40px;
}
</style>
