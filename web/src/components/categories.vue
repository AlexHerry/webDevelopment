<template>
  <div>
    <el-row class="page_brand">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 40px">
        <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-row style="padding-left: 20px">
      <el-button type="success" plain @click="addCate">添加分类</el-button>
    </el-row>

    <el-row style="padding-left: 20px;margin-bottom: 20px;">
      <el-table :data="cateList" style="width: 100%;" row-key="cat_id" border :tree-props="{children: 'children'}">
        <el-table-column prop="cat_name" label="分类名称" width="280"></el-table-column>
        <el-table-column label="级别" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.cat_level == 0">一级</span>
            <span v-if="scope.row.cat_level == 1">二级</span>
            <span v-if="scope.row.cat_level == 2">三级</span>
          </template>
        </el-table-column>
        <el-table-column label="是否有效" width="180">
          <template slot-scope="scope">
            <span v-if="!scope.row.cat_deleted">有效</span>
            <span v-else>无效</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <el-row slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain size="small" @click="editCase(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" plain size="small" @click="delCate(scope.row)"></el-button>
          </el-row>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row style="padding:0 20px;margin-top:-20px">
      <el-pagination
      @current-change="pageChange"
      :current-page="pagenum"
      :page-size="5"
      layout="total, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-row>

    <!-- 添加分类 -->
    <el-dialog title="添加商品分类" :visible.sync="addCateDialog">
      <el-form ref="addCateFm" :model="addCateForm" :rules="rule">
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="addCateForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="默认分类类别" label-width="100px">
          <el-cascader :options="addCateReq" :props="defaultProps" v-model="cat_pid" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCateFormData">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改分类 -->
    <el-dialog title="修改商品分类" :visible.sync="editCateDialog">
      <el-form ref="editCateFm" :model="addCateForm" :rules="rule">
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="addCateForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCateFormData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      cat_pid: [],
      addCateForm: {
        cat_pid: '',
        cat_name: '',
        cat_level: '',
      },
      addCateReq: [],
      defaultProps: {
        value: 'cat_id',
        children: 'children',
        label: 'cat_name',
        checkStrictly: true,
        expandTrigger: 'hover',
      },
      pagenum: 1,
      total: 0,
      rule: {
        cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
      },
      addCateDialog: false,
      editCateDialog: false,
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
    addCate() {
      this.addCateDialog = true;
      this.getData('categories?type=2', 'GET', '', (bak) => {
        this.addCateReq = bak.data;
      });
    },
    addCateFormData() {
      this.$refs.addCateFm.validate((valid) => {
        if (valid) {
          const addForm = this.addCateForm;
          addForm.cat_level = this.cat_pid.length;
          if (this.cat_pid.length > 0) {
            addForm.cat_pid = this.cat_pid[this.cat_pid.length - 1];
          } else {
            addForm.cat_pid = 0;
          }
          this.getData('/categories', 'POST', addForm, (bak) => {
            console.log(bak);
            if (bak.meta.status == 201) {
              this.$message({message: '添加成功', type: 'success'});
              this.getData(`categories?type=3&pagenum=${this.pagenum}&pagesize=5`, 'GET', '', (bak) => {
                this.cateList = bak.data.result;
                this.total = bak.data.result;
              });
            } else {
              this.$message({message: '添加失败', type: 'error'});
            }
            this.addCateDialog = false;
          });
        }
      });
    },
    pageChange(val) {
      this.pagenum = val;
      this.getData(`categories?type=3&pagenum=${this.pagenum}&pagesize=5`, 'GET', '', (bak) => {
        this.cateList = bak.data.result;
      });
    },
    delCate(attr) {
      this.$confirm('你是否要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.getData(`/categories/${attr.cat_id}`, 'DELETE', '', (bak) => {
          if (bak.meta.status == 200) {
            this.$message({message: '删除成功', type: 'success'});
            this.getData(`categories?type=3&pagenum=${this.pagenum}&pagesize=5`, 'GET', '', (bak) => {
              this.cateList = bak.data.result;
              this.total = bak.data.total;
            });
          } else {
            this.$message({message: '删除失败', type: 'error'});
          }
        });
      }).catch(() => {});
    },
    editCase(attr) {
      this.cat_id = attr.cat_id;
      this.addCateForm.cat_name = attr.cat_name;
      this.editCateDialog = true;
    },
    editCateFormData() {
      this.$refs.editCateFm.validate((valid) => {
        if (valid) {
          this.getData(`/categories/${this.cat_id}`, 'PUT', {cat_name: this.addCateForm.cat_name}, (bak) => {
            console.log(bak);
            if (bak.meta.status == 200) {
              this.$message({message: '修改成功', type: 'success'});
              this.getData(`categories?type=3&pagenum=${this.pagenum}&pagesize=5`, 'GET', '', (bak) => {
                this.cateList = bak.data.result;
              });
            } else {
              this.$message({message: '修改失败', type: 'error'});
            }
            this.editCateDialog = false;
          });
        }
      });
    },
  },
  mounted() {
    this.getData(`categories?type=3&pagenum=${this.pagenum}&pagesize=5`, 'GET', '', (bak) => {
      this.cateList = bak.data.result;
      this.total = bak.data.total;
    });
  },
};
</script>

<style></style>
