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
            <p style="font-size: 20px">请选择商品分类：</p>
            <!-- <el-cascader v-model="addGoodsForm.goods_cat" :options="productList" :props="defaultProps"></el-cascader> -->
        </el-col>
    </el-row>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
