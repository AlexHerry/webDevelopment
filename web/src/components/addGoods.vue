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
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
    </el-row>

    <el-row style="padding:0 20px;margin-top:20px">
      <el-steps :space="200" align-center :active="Number(active)" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
    </el-row>

    <el-row style="padding:0 20px;margin-top:20px">
      <el-tabs tab-position="left" stretch v-model="active" @tab-click="changePage">
        <el-tab-pane label="基本信息">
          <el-form ref="addGoodsFm" :model="addGoodsForm" class="demo-form-inline" :rules="rule">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <br />
              <el-cascader v-model="addGoodsForm.goods_cat" :options="productList" :props="defaultProps"></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数">
            {{paramName}}
          <el-checkbox-group v-model="paramList" size="small" style="margin-top: 10px">
            <el-checkbox v-for="item in paramList" :key="item" :label="item" border style="margin: 0 5px"></el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
        <el-tab-pane label="商品属性">
          <el-form>
            <el-form-item v-for="item in addGoodsForm.attrs" :label="item.attr_name" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片">
          <el-upload class="upload-demo" action="http://localhost:8888/api/private/v1/upload" :file-list="fileList" list-type="picture" :headers="token" :on-success="uploadSuccess"
          :on-error="uploadError">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容">
          <quillEditor style="height: 200px;margin-bottom: 50px" v-model="addGoodsForm.goods_introduce">
          </quillEditor>
          <el-button type="primary" @click="addGoodsData">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import {quillEditor} from 'vue-quill-editor';
export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      paramName: '',
      paramList: [],
      fileList: [],
      token: {Authorization: sessionStorage.getItem('token')},
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        attrs: '',
        pics: [],
        goods_introduce: '',
      },
      rule: {
        goods_name: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
        goods_price: [{required: true, message: '请输入商品价格', trigger: 'blur'}],
        goods_weight: [{required: true, message: '请输入商品重量', trigger: 'blur'}],
        goods_number: [{required: true, message: '请输入商品数量', trigger: 'blur'}],
        goods_cat: [{required: true, message: '请输入商品分类', trigger: 'blur'}],
      },
      active: 0,
      defaultProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
      },
      productList: [],
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
    changePage() {
      if (this.active == 1) {
        if (this.addGoodsForm.goods_cat[2] != undefined) {
          this.getData(`categories/${this.addGoodsForm.goods_cat[2]}/attributes?sel=many`, 'GET', '', (bak) => {
            this.paramList = bak.data[0].attr_vals.split(',');
            this.paramName = bak.data[0].attr_name;
          });
        } else {
          this.$message({message: '请选择商品分类', type: 'error'});
        }
      } else if (this.active == 2) {
        if (this.addGoodsForm.goods_cat[2] != undefined) {
          this.getData(`categories/${this.addGoodsForm.goods_cat[2]}/attributes?sel=only`, 'GET', '', (bak) => {
            this.addGoodsForm.attrs = bak.data;
          });
        } else {
          this.$message({message: '请选择商品分类', type: 'error'});
        }
      }
    },
    uploadSuccess(res, file, fileList) {
      this.$message({message: '上传成功', type: 'success'});
      this.addGoodsForm.pics.push({pic: res});
    },
    uploadError() {
      this.$message({message: '上传失败', type: 'error'});
    },
    addGoodsData() {
      this.$refs.addGoodsFm.validate((valid) => {
        if (valid) {
          this.addGoodsForm.goods_cat = this.addGoodsForm.goods_cat.join();
          this.getData('/goods', 'POST', this.addGoodsForm, (bak) => {
            if (bak.meta.status == 201) {
              this.$message({message: '添加成功', type: 'success'});
            } else {
              this.$message({message: '添加失败', type: 'error'});
            }
            this.$router.push({path: '/goods'});
          });
        } else {
          this.$message({message: '请输入必要的参数', type: 'error'});
          this.active = '0';
        }
      });
    },
  },

  mounted() {
    this.getData('/categories', 'GET', '', (bak) => {
      this.productList = bak.data;
    });
  },
};
</script>

<style></style>
