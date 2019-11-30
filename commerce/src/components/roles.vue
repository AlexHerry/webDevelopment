<template>
  <div>
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="user_n">
        <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row type="flex">
      <el-col :span="2">
        <el-button plain @click="add = true">添加角色</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" style="width: 100%:" border>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <div v-if="props.row.children[0] != undefined">
              <el-row v-for="(val, id) in props.row.children" :key="id">
                <el-col :span="6">
                  <el-tag :key="val.authName" closable :type="''" :disable-transitions="false">
                    {{ val.authName }}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-row v-for="(second, index) in val.children" :key="index">
                    <el-col :span="6">
                      <el-tag :key="second.authName" closable :type="'success'" disable-transitions>
                        {{ second.authName }}
                      </el-tag>
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-row>
                        <el-tag v-for="third in second.children" :key="third.authName" closable :type="'warning'" @close="closeTag(props.row, third.id)">
                          {{ third.authName }}
                        </el-tag>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <div v-else>没有分配权限</div>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <el-row class="user_edit" type="flex" justify="left" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain @click="editAuthFun(scope.row)">修改</el-button>

          <el-button type="danger" icon="el-icon-delete" plain @click="delAuth(scope.row.id)">删除</el-button>

          <el-button type="success" icon="el-icon-check" plain @click="openAuthDia(scope.row)">分配权限</el-button>
        </el-row>
      </el-table-column>
    </el-table>
    <!-- 分配权限 -->
    <el-dialog title="提示" :visible.sync="AuthDialog" width="30%">
      <el-tree :data="authList" default-expand-all show-checkbox node-key="id" :default-checked-keys="defaultChecked" :props="defaultProps" ref="auth"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AuthDialog = false">取 消</el-button>
        <el-button type="primary" @click="commitAuth">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色 -->
      <el-dialog title="添加角色" :visible.sync="add">
      <el-form ref="newAuth" :model="newAuth" :rules="rule">
        <el-form-item label="角色名称" label-width="150px" prop="newAuthName">
          <el-input v-model="newAuth.newAuthName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="150px" prop="newAuthDesc">
          <el-input v-model="newAuth.newAuthDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add = false">取 消</el-button>
        <el-button type="primary" @click="commitAdd('newAuth')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改角色 -->
    <el-dialog title="修改角色" :visible.sync="edit">
      <el-form ref="editAuth" :model="editAuth" :rules="ruleEdit">
        <el-form-item label="角色名称" label-width="150px" prop="editAuthName">
          <el-input v-model="editAuth.editAuthName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="150px" prop="editAuthDesc">
          <el-input v-model="editAuth.editAuthDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="edit = false">取 消</el-button>
        <el-button type="primary" @click="commitEdit('editAuth')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      AuthDialog: false,
      authList: [],
      defaultChecked: [],
      roleid: 0,
      defaultProps: {
        children: 'children',
        label: 'authName',
      },
      rule: {
        newAuthName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
        newAuthDesc: [{required: true, message: '请输入角色描述', trigger: 'blur'}],
      },
      ruleEdit: {
        editAuthName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
        editAuthDesc: [{required: true, message: '请输入角色描述', trigger: 'blur'}],
      },
      newAuth: {
        newAuthName: '',
        newAuthDesc: '',
      },
      editAuth: {
        editAuthName: '',
        editAuthDesc: '',
      },
      add: false,
      edit: false,
      editId: 0,
    };
  },
  methods: {
    get_data(url, method, data, fun) {
      this.axios({
        url,
        method,
        data,
      }).then((bak) => {
        fun(bak.data);
      });
    },
    closeTag(role, rightid) {
      this.get_data(`roles/${role.id}/rights/${rightid}`, 'DELETE', '', (bak) => {
        if (bak.meta.status == 200) {
          this.$message({message: '删除成功', type: 'success'});
          console.log(this.tableData);
          role.children = bak.data;
        } else {
          this.$message({message: '删除失败', type: 'error'});
        }
      });
    },
    openAuthDia(role) {
      this.get_data('rights/tree', 'GET', '', (bak) => {
        const a = [];
        role.children.forEach((v1) => {
          v1.children.forEach((v2) => {
            v2.children.forEach((v3) => {
              a.push(v3.id);
            });
          });
        });
        this.roleid = role.id;
        this.defaultChecked = a;
        this.authList = bak.data;
        this.AuthDialog = true;
      });
    },
    commitAuth() {
      const newAuth = this.$refs.auth.getCheckedKeys().concat(this.$refs.auth.getHalfCheckedKeys()).join();
      this.get_data(`roles/${this.roleid}/rights`, 'POST', {rids: newAuth}, (bak) => {
        if (bak.meta.status == 200) {
          this.$message({message: '更新成功', type: 'success'});
          this.get_data('/roles', 'GET', '', (bak) => {
            this.tableData = bak.data;
          });
          this.AuthDialog = false;
        } else {
          this.$message({message: '更新失败', type: 'error'});
        }
      });
    },
    commitEdit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.get_data(`/roles/${this.editId}`, 'PUT', {roleName: this.editAuth.editAuthName, roleDesc: this.editAuth.editAuthDesc}, (bak) => {
            this.add = false;
            if (bak.meta.status == 200) {
              this.$message({message: '更新成功', type: 'success'});
              this.get_data('/roles', 'GET', '', (bak) => {
                this.tableData = bak.data;
              });
              this.newAuth.newAuthName = '';
              this.newAuth.newAuthDesc = '';
            } else {
              this.$message({message: '更新失败', type: 'error'});
            }
          });
        } else {
          this.$message({message: '更新角色失败', type: 'error'});
        }
      });
    },
    editAuthFun(sole) {
      console.log(sole);
      this.editId = sole.id;
      this.editAuth.editAuthName = sole.roleName;
      this.editAuth.editAuthDesc = sole.roleDesc;
      this.edit = true;
    },
    commitAdd(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.get_data('/roles', 'POST', {roleName: this.newAuth.newAuthName, roleDesc: this.newAuth.newAuthDesc}, (bak) => {
            this.add = false;
            if (bak.meta.status == 201) {
              this.$message({message: '添加成功', type: 'success'});
              this.get_data('/roles', 'GET', '', (bak) => {
                this.tableData = bak.data;
              });
              this.newAuth.newAuthName = '';
              this.newAuth.newAuthDesc = '';
            } else {
              this.$message({message: '添加失败', type: 'error'});
            }
          });
        } else {
          this.$message({message: '添加角色失败', type: 'error'});
        }
      });
    },
    delAuth(id) {
      this.$confirm('你确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then((bak) => {
        this.get_data(`roles/${id}`, 'DELETE', '', (bak) => {
          if (bak.meta.status == 200) {
            this.$message({message: '删除成功', type: 'success'});
            this.get_data('/roles', 'GET', '', (bak) => {
              this.tableData = bak.data;
            });
          } else {
            this.$message({message: '删除失败', type: 'error'});
          }
        });
      }).catch((bak) => {});
    },
  },
  mounted() {
    this.get_data('/roles', 'GET', '', (bak) => {
      this.tableData = bak.data;
    });
  },
};
</script>

<style scoped>
.el-tag {
  margin: 5px;
}
.user {
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
