<template>
  <div>
    <el-row class="page_brand">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 40px">
        <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-row style="padding-left: 20px">
      <el-table :data="orderList" stripe style="width: 100%" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_status == 1"><el-tag type="success">已付款</el-tag></span>
            <span v-else><el-tag type="danger">未付款</el-tag></span>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            <span>{{ getTime(scope.row.create_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" plain size="small" @click="editAddrDialog = true"></el-button>
          </el-row>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChange"
        @current-change="pageChange"
        :current-page="pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-row>

    <!-- 修改订单地址 -->
    <el-dialog title="修改订单地址" :visible.sync="editAddrDialog">
      <el-form ref="editAddrFm" :model="editAddrForm">
        <el-form-item label="省市区/县" label-width="100px">
          <el-cascader size="large" :options="options" v-model="editAddrForm.selectAddr" expand-trigger="hover"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="100px">
          <el-input v-model="editAddrForm.addrName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAddrDialog = false">取 消</el-button>
        <el-button type="primary" @click="editAddrDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {regionData} from 'element-china-area-data';
export default {
  data() {
    return {
      orderList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      editAddrForm: {
        addrName: '',
        selectAddr: [],
      },
      options: regionData,
      editAddrDialog: false,
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
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length));
        }
      }
      return fmt;
    },
    sizeChange(val) {
      this.pagesize = val;
      this.getData(`/orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
        this.orderList = bak.data.goods;
      });
    },
    pageChange(val) {
      this.pagenum = val;
      this.getData(`/orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
        this.orderList = bak.data.goods;
        console.log(this.orderList);
      });
    },
  },
  mounted() {
    this.getData(`/orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`, 'GET', '', (bak) => {
      this.orderList = bak.data.goods;
      this.total = bak.data.total;
    });
  },
};
</script>

<style></style>
