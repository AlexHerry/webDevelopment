<template>
  <div>
    <el-row class="page_brand">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 40px">
        <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row style="padding-left:20px" type="flex">
      <el-col :span="5">
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchKeyword"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2" style="margin-left:10px">
        <el-button type="success" @click="addUserDialog = true">添加用户</el-button>
      </el-col>
    </el-row>
    <el-row style="padding-left: 20px">
      <el-table :data="userData" border style="width: 80%;">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-row slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain size="small" @click="editUser(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" plain size="small" @click="delUser(scope.row)"></el-button>
            <el-button type="warning" icon="el-icon-check" plain size="small" @click="alterUser(scope.row)"></el-button>
          </el-row>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row style="padding-left: 20px">
      <el-pagination
        @size-change="getsize"
        @current-change="getpage"
        :current-page="pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-row>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialog">
      <el-form ref="addUser" :model="addUserForm" :rules="rule">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUserData">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editUserDialog">
      <el-form :model="editUserForm" required>
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="editUserForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="editUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUserData">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改权限 -->
    <el-dialog title="分配角色" :visible.sync="alterUserDialog">
      <el-form :model="editUserForm" required>
        <el-form-item label="用户名" label-width="100px">
          <span>{{ editUserForm.username }}</span>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-select v-model="editUserForm.role_name" placeholder="请选择">
            <el-option label="请选择角色" value='请选择角色' disabled></el-option>
            <el-option v-for="item in authList" :key="item.id" :label="item.roleName" :value="item.roleName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="alterUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUserData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: [],
      query: '',
      pagenum: 1,
      pagesize: 10,
      total: 0,
      addUserDialog: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      rule: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
      },
      editUserDialog: false,
      editUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: '',
        rid: '',
        role_name: '',
      },
      alterUserDialog: false,
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
    changeUserState(role) {
      this.getData(`/users/${role.id}/state/${role.mg_state}`, 'PUT', '', (bak) => {
        if (bak.meta.status == 200) {
          this.$message({message: '更新状态成功', type: 'success'});
        } else {
          this.$message({message: '更新状态失败', type: 'error'});
        }
      });
    },
    getpage(val) {
      this.pagenum = val;
      this.getData(`/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
        this.userData = bak.data.users;
      });
    },
    getsize(val) {
      this.pagesize = val;
      this.getData(`/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
        this.userData = bak.data.users;
      });
    },
    searchKeyword() {
      this.getData(`/users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
        this.userData = bak.data.users;
      });
    },
    delUser(role) {
      this.$confirm('你是否要删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.getData(`/users/${role.id}`, 'DELETE', '', (bak) => {
          if (bak.meta.status == 200) {
            this.$message({message: '删除成功', type: 'success'});
            this.getData(`/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
              this.userData = bak.data.users;
            });
          } else {
            this.$message({message: '删除失败', type: 'error'});
          }
        });
      })
          .catch(() => {});
    },
    addUserData() {
      this.$refs.addUser.validate((valid) => {
        if (valid) {
          this.getData('/users', 'POST', this.addUserForm, (bak) => {
            if (bak.meta.status == 201) {
              this.$message({message: '创建成功', type: 'success'});
              this.addUserDialog = false;
              this.getData(`/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
                this.userData = bak.data.users;
              });
            } else {
              this.$message({message: '创建失败', type: 'error'});
            }
            this.addUserForm.username = '';
            this.addUserForm.password = '';
            this.addUserForm.email = '';
            this.addUserForm.password = '';
          });
        } else {
        }
      });
    },
    editUser(role) {
      this.editUserDialog = true;
      this.editUserForm.username = role.username;
      this.editUserForm.email = role.email;
      this.editUserForm.mobile = role.mobile;
      this.editUserForm.id = role.id;
    },
    editUserData() {
      this.getData(`/users/${this.editUserForm.id}`, 'PUT', {email: this.editUserForm.email, mobile: this.editUserForm.mobile}, (bak) => {
        if (bak.meta.status == 200) {
          this.$message({message: '更新成功', type: 'success'});
          this.editUserDialog = false;
          this.getData(`/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
            this.userData = bak.data.users;
          });
        } else {
          this.$message({message: '更新失败', type: 'error'});
        }
      });
    },
    alterUser(role) {
      console.log(role);
      if (role.role_name == '超级管理员' && role.id == 500) {
        this.editUserForm.role_name = 0;
      } else if (role.role_name == '超级管理员') {
        this.editUserForm.role_name = '请选择角色';
      } else {
        this.editUserForm.role_name = role.role_name;
      }
      this.alterUserDialog = true;
      this.editUserForm.username = role.username;
      this.editUserForm.id = role.id;
      this.getData(`/roles`, 'GET', '', (bak) => {
        this.authList = bak.data;
      });
    },
  },
  mounted() {
    this.getData(`/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
      this.userData = bak.data.users;
      this.total = bak.data.total;
    });
  },
};
</script>

<style>
.page_brand {
  background: #d3dce6;
  width: 100%;
  height: 40px;
  padding-left: 30px;
}
</style>
