<template>
  <div>
    <el-row class="page_brand">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 40px">
        <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row style="padding:0 20px;margin-top:20px">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
    </el-row>

    <el-row style="padding:0 20px;margin-top:20px">
      <el-col>
        <span style="font-size: 20px">请选择商品分类：</span>
        <el-cascader v-model="checkedGoods" :options="goodsList" :props="defaultProps" placeholder="请选择商品类型" :show-all-levels="false" @change="getGoodsAttr"></el-cascader>
      </el-col>
    </el-row>

    <el-row style="padding:0 20px;margin-top:20px">
      <el-tabs>
        <el-tab-pane label="动态参数">
          <el-button type="primary" size="small" :disabled="isDisable" @click="dynaDialog = true">添加动态参数</el-button>

          <el-table :data="goodsManyList" style="width: 100%;margin-top:20px" border>
            <el-table-column type="expand">
              <el-row slot-scope="scope">
                <span :key="index" v-for="(tag, index) in scope.row.attr_vals.split(',')">
                <el-tag closable v-if="tag != ''" @close="delMany(scope.row, index)">
                  {{ tag }}
                </el-tag>
                </span>
                <el-input
                  class="input-new-tag"
                  v-if="inputDisabled"
                  v-model="inputValue"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  :ref="scope.row.attr_name"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="
                    inputDisabled = true;
                    showInput(scope.row);
                  "
                >
                  + New Tag
                </el-button>
              </el-row>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="商品参数" prop="attr_name" width="280px"></el-table-column>
            <el-table-column label="操作">
              <el-row slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" plain size="small" @click="editManyAttr(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" plain size="small" @click="delManyAttr(scope.row)"></el-button>
              </el-row>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数">
          <el-button type="primary" size="small" :disabled="isDisable" @click="addStatDialog = true">添加静态参数</el-button>

          <el-table :data="goodsOnlyList" style="width: 100%;margin-top:20px" border stripe>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="180"></el-table-column>
            <el-table-column prop="attr_vals" label="属性值" width="180"></el-table-column>
            <el-table-column label="操作">
              <el-row slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" plain size="small" @click="editStat(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" plain size="small" @click="delStat(scope.row)"></el-button>
              </el-row>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <!-- 添加动态权限 -->
    <el-dialog title="修改角色" :visible.sync="dynaDialog">
      <el-form ref="dynaFm" :model="dynaForm" :rules="rule">
        <el-form-item label="动态参数" label-width="100px" prop="attr_name">
          <el-input v-model="dynaForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dynaDialog = false;cancelWrite()">取 消</el-button>
        <el-button type="primary" @click="dynaFormData">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改动态权限 -->
    <el-dialog title="修改角色" :visible.sync="editDynaDialog">
      <el-form ref="editDynaFm" :model="dynaForm" :rules="rule">
        <el-form-item label="动态参数" label-width="100px" prop="attr_name">
          <el-input v-model="dynaForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDynaDialog = false;cancelWrite()">取 消</el-button>
        <el-button type="primary" @click="editDynaFormData">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加静态参数 -->
    <el-dialog title="修改角色" :visible.sync="addStatDialog">
      <el-form ref="addStatFm" :model="addStatForm" :rules="second_rule">
        <el-form-item label="静态参数" label-width="100px" prop="attr_name">
          <el-input v-model="addStatForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="静态参数值" label-width="100px" prop="attr_vals">
          <el-input v-model="addStatForm.attr_vals" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStatDialog = false;cancelAdd()">取 消</el-button>
        <el-button type="primary" @click="addStatFormData">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改静态参数 -->
    <el-dialog title="修改角色" :visible.sync="editStatDialog">
      <el-form ref="editStatFm" :model="addStatForm" :rules="second_rule">
        <el-form-item label="静态参数" label-width="100px" prop="attr_name">
          <el-input v-model="addStatForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="静态参数值" label-width="100px" prop="attr_vals">
          <el-input v-model="addStatForm.attr_vals" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editStatDialog = false;cancelAdd()">取 消</el-button>
        <el-button type="primary" @click="editStatFormData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: '',
      checkedGoods: [],
      inputDisabled: false,
      goodsList: [],
      goodsManyList: [],
      goodsOnlyList: [],
      defaultProps: {
        label: 'cat_name',
        children: 'children',
        value: 'cat_id',
        expandTrigger: 'hover',
      },
      isDisable: true,
      dynaDialog: false,
      dynaForm: {
        attr_sel: 'many',
        attr_name: '',
      },
      attr_vals: '',
      attr_id: 0,
      rule: {
        attr_name: [{required: true, message: '动态参数不能为空', trigger: 'blur'}],
      },
      second_rule: {
        attr_name: [{required: true, message: '静态参数不能为空', trigger: 'blur'}],
        attr_vals: [{required: true, message: '静态参数值不能为空', trigger: 'blur'}],
      },
      editDynaDialog: false,
      addStatDialog: false,
      addStatForm: {
        attr_name: '',
        attr_vals: '',
        attr_sel: 'only',
      },
      editStatDialog: false,
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
    getGoodsAttr() {
      if (this.checkedGoods.length == 3) {
        this.isDisable = false;
        this.getData(`categories/${this.checkedGoods[this.checkedGoods.length - 1]}/attributes?sel=many`, 'GET', '', (bak) => {
          this.goodsManyList = bak.data;
        });
        this.getData(`categories/${this.checkedGoods[this.checkedGoods.length - 1]}/attributes?sel=only`, 'GET', '', (bak) => {
          this.goodsOnlyList = bak.data;
        });
      } else {
        this.isDisable = true;
        this.goodsManyList = [];
        this.goodsOnlyList = [];
      }
    },
    showInput(attr) {
      this.$nextTick((_) => {
        this.$refs[attr.attr_name].$refs.input.focus();
      });
    },
    handleInputConfirm(attr) {
      if (this.inputValue) {
        const arr = attr.attr_vals.split(',');
        arr.push(this.inputValue);
        console.log(arr);
        const editForm = {
          attr_name: attr.attr_name,
          attr_sel: 'many',
          attr_vals: arr.join(),
        };
        this.getData(`categories/${attr.cat_id}/attributes/${attr.attr_id}`, 'PUT', editForm, (bak) => {
          if (bak.meta.status == 200) {
            attr.attr_vals = arr.join();
            this.$message({message: '更新成功', type: 'success'});
          } else {
            this.$message({message: '更新失败', type: 'error'});
          }
        });
      }
      this.inputDisabled = false;
      this.inputValue = '';
    },
    cancelWrite() {
      this.dynaForm.attr_name = '';
    },
    dynaFormData() {
      this.$refs.dynaFm.validate((valid) => {
        if (valid) {
          this.getData(`categories/${this.checkedGoods[this.checkedGoods.length - 1]}/attributes`, 'POST', this.dynaForm, (bak) => {
            if (bak.meta.status == 201) {
              this.goodsManyList.push(bak.data);
              this.$message({message: '添加成功', type: 'success'});
            } else {
              this.$message({message: '添加失败', type: 'error'});
            }
            this.dynaDialog = false;
          });
        }
      });
    },
    delManyAttr(role) {
      this.$confirm('你是否要删除该参数?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.getData(`categories/${role.cat_id}/attributes/${role.attr_id}`, 'DELETE', '', (bak) => {
          if (bak.meta.status == 200) {
            this.$message({message: '删除成功', type: 'success'});
            this.getData(`categories/${this.checkedGoods[this.checkedGoods.length - 1]}/attributes?sel=many`, 'GET', '', (bak) => {
              this.goodsManyList = bak.data;
            });
          } else {
            this.$message({message: '删除失败', type: 'error'});
          }
        });
      }).catch(() => {});
    },
    delMany(attr, id) {
      const arr = attr.attr_vals.split(',');
      arr.splice(id, 1);
      const editForm = {
        attr_name: attr.attr_name,
        attr_sel: 'many',
        attr_vals: arr.join(),
      };
      this.getData(`categories/${attr.attr_id}/attributes`, 'PUT', editForm, (bak) => {
        if (bak.meta.status == 201) {
          attr.attr_vals = arr.join();
          this.$message({message: '更新成功', type: 'success'});
        } else {
          this.$message({message: '更新失败', type: 'error'});
        }
      });
    },
    editManyAttr(attr) {
      this.dynaForm.attr_name = attr.attr_name;
      this.attr_vals = attr.attr_vals;
      this.attr_id = attr.attr_id;
      this.editDynaDialog = true;
    },
    editDynaFormData() {
      this.$refs.editDynaFm.validate((valid) => {
        if (valid) {
          const editForm = {
            attr_name: this.dynaForm.attr_name,
            attr_sel: 'many',
            attr_vals: this.attr_vals,
          };
          this.getData(`categories/${this.checkedGoods[this.checkedGoods.length - 1]}/attributes/${this.attr_id}`, 'PUT', editForm, (bak) => {
            if (bak.meta.status == 200) {
              this.$message({message: '修改成功', type: 'success'});
              this.getData(`categories/${this.checkedGoods[this.checkedGoods.length - 1]}/attributes?sel=many`, 'GET', '', (bak) => {
                this.goodsManyList = bak.data;
              });
            } else {
              this.$message({message: '修改失败', type: 'error'});
            }
            this.editDynaDialog = false;
          });
        }
      });
    },
    cancelAdd() {
      this.addStatForm.attr_name = '';
      this.addStatForm.attr_vals = '';
    },
    addStatFormData() {
      this.$refs.addStatFm.validate((valid) => {
        if (valid) {
          this.getData(`categories/${this.checkedGoods[this.checkedGoods.length - 1]}/attributes`, 'POST', this.addStatForm, (bak) => {
            if (bak.meta.status == 201) {
              this.$message({message: '添加成功', type: 'success'});
              this.goodsOnlyList.push(bak.data);
            } else {
              this.$message({message: '添加失败', type: 'error'});
            }
            this.addStatDialog = false;
          });
        }
      });
    },
    delStat(attr) {
      this.$confirm('你是否要删除该参数?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.getData(`categories/${attr.cat_id}/attributes/${attr.attr_id}`, 'DELETE', '', (bak) => {
          if (bak.meta.status == 200) {
            this.$message({message: '删除成功', type: 'success'});
            this.getData(`categories/${this.checkedGoods[this.checkedGoods.length - 1]}/attributes?sel=only`, 'GET', '', (bak) => {
              this.goodsOnlyList = bak.data;
            });
          } else {
            this.$message({message: '删除失败', type: 'error'});
          }
        });
      }).catch(() => {});
    },
    editStat(attr) {
      this.addStatForm.attr_name = attr.attr_name;
      this.addStatForm.attr_vals = attr.attr_vals;
      this.attr_id = attr.attr_id;
      this.editStatDialog = true;
    },
    editStatFormData() {
      this.$refs.editStatFm.validate((valid) => {
        if (valid) {
          const editForm = this.addStatForm;
          editForm.attr_id = this.attr_id;
          console.log(editForm);
          this.getData(`categories/${this.checkedGoods[this.checkedGoods.length - 1]}/attributes/${this.attr_id}`, 'PUT', editForm, (bak) => {
            if (bak.meta.status == 200) {
              this.$message({message: '修改成功', type: 'success'});
              this.getData(`categories/${this.checkedGoods[this.checkedGoods.length - 1]}/attributes?sel=only`, 'GET', '', (bak) => {
                this.goodsOnlyList = bak.data;
              });
              this.addStatForm.attr_name = '';
              this.addStatForm.attr_vals = '';
            } else {
              this.$message({message: '修改失败', type: 'error'});
            }
            this.editStatDialog = false;
          });
        }
      });
    },
  },
  mounted() {
    this.getData('/categories', 'GET', '', (bak) => {
      this.goodsList = bak.data;
    });
  },
};
</script>

<style>
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-tag {
  margin: 0 5px;
}
</style>
