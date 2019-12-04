<template>
  <div>
    <el-row class="page_brand">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 40px">
        <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row>
      <div ref="main" style="width: 800px;height:600px;"></div>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  data() {
    return {
      option: {
        title: {
          text: '堆叠区域图',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {},
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [],
        yAxis: [],
        series: [],
      },
    };
  },
  mounted() {
    console.log(this.$refs.main);
    const myChart = echarts.init(this.$refs.main);
    this.axios({
      url: `reports/type/1`,
      method: 'GET',
    }).then((bak) => {
      this.option.legend = bak.data.data.legend;
      this.option.yAxis = bak.data.data.yAxis;
      this.option.xAxis = bak.data.data.xAxis;
      this.option.xAxis[0].boundaryGap = false;
      this.option.series = bak.data.data.series;
      console.log(this.option);
      myChart.setOption(this.option);
    });
  },
};
</script>

<style></style>
