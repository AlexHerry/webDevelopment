<template>
  <div>
    <el-row class="page_brand">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 40px">
        <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row style="padding-left:20px" type="flex">
      <el-col :span="5">
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchKeyword"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2" style="margin-left:10px">
        <el-button type="success" @click="jumpAddGoods" plain>添加商品</el-button>
      </el-col>
    </el-row>

    <el-row style="padding-left: 20px">
      <el-table :data="goodsList" stripe style="width: 100%" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="180"></el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            <span>{{getTime(scope.row.add_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <el-row slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain size="small" @click="editGoods(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" plain size="small" @click="delGoods(scope.row)"></el-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      pagenum: 1,
      pagesize: 10,
      total: 0,
      goodsList: [],
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
    searchKeyword() {
      this.getData(`/goods?query=${this.query}&pagenum=1&pagesize=10`, 'GET', '', (bak) => {
        this.goodsList = bak.data.goods;
        this.total = bak.data.total;
      });
    },
    getsize(val) {
      this.pagesize = val;
      this.getData(`/goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
        this.goodsList = bak.data.goods;
        this.total = bak.data.total;
      });
    },
    getpage(val) {
      this.pagenum = val;
      this.getData(`/goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
        this.goodsList = bak.data.goods;
        this.total = bak.data.total;
      });
    },
    getTime(date = 0, fmt = 'yyyy-MM-dd hh:mm:ss') {
      date = new Date(+date);
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
      };
      for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          const str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
        }
      }
      return fmt;
    },
    delGoods(role) {
      this.$confirm('你是否要删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.getData(`/goods/${role.goods_id}`, 'DELETE', '', (bak) => {
          console.log(bak);
          if (bak.meta.status == 200) {
            this.$message({message: '删除成功', type: 'success'});
            this.getData(`/goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
              this.goodsList = bak.data.goods;
              this.total = bak.data.total;
            });
          } else {
            this.$message({message: '删除失败', type: 'error'});
          }
        });
      }).catch(() => {});
    },
    jumpAddGoods() {
      this.$router.push({path: '/goods/addGoods'});
    },
    editGoods(role) {
      this.$router.push({path: `/goods/editGoods/${role.goods_id}`});
    },
  },
  mounted() {
    this.getData(`/goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
      this.goodsList = bak.data.goods;
      this.total = bak.data.total;
    });
  },
};
</script>

<style></style>
