<template>
  <div>
    <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="user_n">
        <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row type="flex">
      <el-col :span="4">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="sear"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button plain @click="jumpgoodsadd">添加商品</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="goodsList" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>

        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ new Date(scope.row.upd_time).toLocaleDateString().replace(/\//g, '-') + ' ' + new Date(scope.row.upd_time).toTimeString().substr(0, 8) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <el-row class="user_edit" type="flex" justify="left" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain></el-button>

            <el-button type="danger" icon="el-icon-delete" plain @click="del_goods(scope.row.goods_id)"></el-button>
          </el-row>
        </el-table-column>
      </el-table>
    </el-row>
     <el-pagination
      @size-change="get_newsize"
      @current-change="get_newpage"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pagenum: 1,
      pagesize: 10,
      total: 0,
      goodsList: [],
      search: '',
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
    jumpgoodsadd() {
      this.$router.push({path: '/goods/add'});
    },
    del_goods(id) {
      this.get_data(`/goods/${id}`, 'DELETE', '', (bak) => {
        if (bak.meta.status == 200) {
          this.$message({message: '删除成功', type: 'success'});
          this.get_data(`/goods?&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
            this.total = bak.data.total;
            this.goodsList = bak.data.goods;
          });
        } else {
          this.$message({message: '删除失败', type: 'error'});
        }
      });
    },
    get_newsize(val) {
      this.pagesize = val;
      this.get_data(`/goods?&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
        this.total = bak.data.total;
        this.goodsList = bak.data.goods;
      });
    },
    get_newpage(val) {
      this.pagenum = val;
      this.get_data(`/goods?&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
        this.total = bak.data.total;
        this.goodsList = bak.data.goods;
      });
    },
    sear() {
      this.get_data(`/goods?query=${this.search}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
        this.total = bak.data.total;
        this.goodsList = bak.data.goods;
      });
    },
  },
  mounted() {
    this.get_data(`/goods?&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
      this.total = bak.data.total;
      this.goodsList = bak.data.goods;
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
</style>
