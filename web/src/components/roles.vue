<template>
  <div>
    <el-row class="page_brand">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 40px">
        <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-row style="padding-left: 20px">
      <el-button type="" @click="addRoleDialog = true">添加角色</el-button>
    </el-row>

    <el-row style="padding-left: 20px">
      <el-table :data="roleList" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div v-if="scope.row.children.length != 0">
              <el-row v-for="one in scope.row.children" :key="one.id">
                <el-col :span="4">
                  <el-tag closable type="">{{ one.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-row v-for="two in one.children" :key="two.id">
                    <el-col :span="6">
                      <el-tag closable type="success">{{ two.authName }}</el-tag>
                      <i class="el-icon-arrow-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag closable type="warning" v-for="three in two.children" :key="three.id" @close="delAuth(scope.row, three.id)">{{ three.authName }}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <div v-else>没有分配角色权限</div>
          </template>
        </el-table-column>
        <el-table-column label="" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <el-row slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain size="small" @click="editRole(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" plain size="small" @click="delRole(scope.row)"></el-button>
            <el-button type="warning" icon="el-icon-check" plain size="small" @click="alterRole(scope.row)"></el-button>
          </el-row>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialog">
      <el-form ref="addRoleFm" :model="addRoleForm" :rules="rule">
        <el-form-item label="角色名称" label-width="100px" prop="roleName">
          <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            cancelEdit();
            addRoleDialog = false;
          "
        >
          取 消
        </el-button>
        <el-button type="primary" @click="addRoleData">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改角色 -->
    <el-dialog title="修改角色" :visible.sync="editRoleDialog">
      <el-form ref="editRoleFm" :model="addRoleForm" :rules="rule">
        <el-form-item label="角色名称" label-width="100px" prop="roleName">
          <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit();editRoleDialog = false;">取 消</el-button>
        <el-button type="primary" @click="editRoleData">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="修改角色" :visible.sync="alterRoleDialog">
      <el-tree :data="authList" show-checkbox node-key="id" :default-checked-keys="defaultChecked" :props="defaultProps" default-expand-all ref="tree"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="alterRoleDialog = false;">取 消</el-button>
        <el-button type="primary" @click="alterRoleData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      addRoleDialog: false,
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      rule: {
        roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
        roleDesc: [{required: true, message: '请输入角色描述', trigger: 'blur'}],
      },
      editRoleDialog: false,
      roleId: 0,
      defaultChecked: [],
      defaultProps: {
        label: 'authName',
        children: 'children',
      },
      authList: [],
      alterRoleDialog: false,
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
    addRoleData() {
      this.$refs.addRoleFm.validate((valid) => {
        if (valid) {
          this.getData('/roles', 'POST', this.addRoleForm, (bak) => {
            this.addRoleForm.roleName = '';
            this.addRoleForm.roleDesc = '';
            this.addRoleDialog = false;
            if (bak.meta.status == 201) {
              this.$message({message: '创建成功', type: 'success'});
              this.getData('/roles', 'GET', '', (bak) => {
                this.roleList = bak.data;
              });
            } else {
              this.$message({message: '创建失败', type: 'error'});
            }
          });
        }
      });
    },
    delRole(role) {
      this.$confirm('你是否要删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.getData(`/roles/${role.id}`, 'DELETE', '', (bak) => {
          if (bak.meta.status == 200) {
            this.$message({message: '删除成功', type: 'success'});
            this.getData('/roles', 'GET', '', (bak) => {
              this.roleList = bak.data;
            });
          } else {
            this.$message({message: '删除失败', type: 'error'});
          }
        });
      }).catch(() => {});
    },
    cancelEdit() {
      this.addRoleForm.roleName = '';
      this.addRoleForm.roleDesc = '';
    },
    editRole(role) {
      this.addRoleForm.roleName = role.roleName;
      this.addRoleForm.roleDesc = role.roleDesc;
      this.editRoleDialog = true;
      this.roleId = role.id;
    },
    editRoleData() {
      this.getData(`/roles/${this.roleId}`, 'PUT', this.addRoleForm, (bak) => {
        this.editRoleDialog = false;
        if (bak.meta.status == 200) {
          this.$message({message: '更新成功', type: 'success'});
          this.getData('/roles', 'GET', '', (bak) => {
            this.roleList = bak.data;
          });
        } else {
          this.$message({message: '更新失败', type: 'error'});
        }
      });
    },
    alterRole(role) {
      this.roleId = role.id;
      const arr = [];
      role.children.forEach((one) => {
        one.children.forEach((two) => {
          two.children.forEach((three) => {
            arr.push(three.id);
          });
        });
      });
      this.defaultChecked = arr;
      this.alterRoleDialog = true;
      this.getData('rights/tree', 'GET', '', (bak) => {
        this.authList = bak.data;
      });
    },
    alterRoleData() {
      const rids = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()).join();
      this.getData(`roles/${this.roleId}/rights`, 'POST', {rids: rids}, (bak) => {
        this.alterRoleDialog = false;
        if (bak.meta.status == 200) {
          this.$message({message: '更新成功', type: 'success'});
          this.getData('/roles', 'GET', '', (bak) => {
            this.roleList = bak.data;
          });
        } else {
          this.$message({message: '更新失败', type: 'error'});
        }
      });
    },
    delAuth(role, rightid) {
      this.getData(`/roles/${role.id}/rights/${rightid}`, 'DELETE', '', (bak) => {
        console.log(bak);
        if (bak.meta.status == 200) {
          this.$message({message: '删除成功', type: 'success'});
          role.children = bak.data;
        } else {
          this.$message({message: '删除失败', type: 'error'});
        }
      });
    },
  },
  mounted() {
    this.getData('/roles', 'GET', '', (bak) => {
      this.roleList = bak.data;
    });
  },
};
</script>

<style>
.el-tag {
  margin: 5px;
}
</style>
