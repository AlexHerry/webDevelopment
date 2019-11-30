<template>
  <div>
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="user_n">
        <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="alert-title">
      <el-alert title="消息提示的文案" type="info" center show-icon></el-alert>
    </el-row>
    <el-row>
      <el-col :span="14">
        <el-steps :active="Number(active)" finish-status="success" align-center :space="200">
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-form :model="goodsAdd" :rules="rule">
        <el-tabs tab-position="left" v-model="active" @tab-click="tab_change">
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsAdd.goods_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsAdd.goods_price" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodsAdd.goods_weight" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodsAdd.goods_number" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_attrs">
              <br />
              <div class="block">
                <el-cascader v-model="goods_attrs" :options="attrList" :props="attrProps"></el-cascader>
              </div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item>
              <el-checkbox-group v-model="getAttrVal">
                <el-checkbox border v-for="(val, index) in getAttrVal" :key="index" style="margin:5px" :label="val"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item :label="val.name" prop="goods_name" v-for="(val, index) in attrs" :key="index">
              <el-input v-model="val.val" autocomplete="off"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              multiple
              :limit="1"
              :file-list="fileList"
               :on-success="uploadFile"
                auto-upload
                :headers="token"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <quillEditor v-model="goodsAdd.goods_introduce" style="height: 300px;margin-bottom:50px">
            </quillEditor>
            <el-button type="primary" @click="addNewGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
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
      token: {Authorization: sessionStorage.getItem('token')},
      attrList: [],
      getAttrName: '',
      getAttrVal: [],
      goods_attrs: [],
      fileList: [],
      attrs: [],
      goodsAdd: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_introduce: '',
        pics: [],
        attrs: [],
      },
      rule: {
        goods_name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
        goods_price: [{required: true, message: '价格不能为空', trigger: 'blur'}],
        goods_weight: [{required: true, message: '重量不能为空', trigger: 'blur'}],
        goods_number: [{required: true, message: '数量不能为空', trigger: 'blur'}],
        goods_attrs: [{required: true, message: '属性不能为空', trigger: 'blur'}],
      },
      attrProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
      },
      active: 0,
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
    tab_change() {
      if (this.active == 1) {
        if (this.goods_attrs[2] != undefined) {
          this.get_data(`categories/${this.goods_attrs[2]}/attributes?sel=many`, 'GET', '', (bak) => {
            console.log(bak);
            this.getAttrVal = bak.data[0].attr_vals.split(',');
            this.getAttrName = bak.data[0].attr_name;
          });
        } else {
          this.$message({message: '请选择商品参数', type: 'error'});
        }
      } else if (this.active == 2) {
        if (this.goods_attrs[2] != undefined) {
          this.get_data(`categories/${this.goods_attrs[2]}/attributes?sel=only`, 'GET', '', (bak) => {
            for (let i = 0; i < bak.data.length; i++) {
              this.attrs.push({name: bak.data[i].attr_name, val: bak.data[i].attr_vals, id: bak.data[i].attr_id});
              this.goodsAdd.attrs.push({attr_value: bak.data[i].attr_vals, attr_id: bak.data[i].attr_id});
            }
          });
        } else {
          this.$message({message: '请选择商品参数', type: 'error'});
          console.log(this.fileList);
        }
      }
    },
    addNewGoods() {
      this.goodsAdd.goods_cat = this.goods_attrs.join();
      // console.log(this.goodsAdd);
      this.get_data('/goods', 'POST', this.goodsAdd, (bak) => {
        if (bak.meta.status == 201) {
          this.$message({message: '添加成功', type: 'success'});
          this.$router.push({path: '/goods'});
        } else {
          this.$message({message: '添加失败', type: 'error'});
        }
      });
    },
    uploadFile(bak) {
      this.goodsAdd.pics = bak.data.tmp_path;
    },
  },
  mounted() {
    this.get_data('/categories', 'GET', '', (bak) => {
      this.attrList = bak.data;
      console.log(bak.data);
    });
  },
};
</script>

<style>
.user_n {
  height: 50px;
  width: 100%;
  background: #d3dce6;
  margin: -20px -20px;
  line-height: 50px;
  padding: 0 10px 0 30px;
}
.alert-title {
  margin: 20px 0px;
}
</style>
