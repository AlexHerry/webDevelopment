<template>
  <div ref="main" style="width: 600px;height:600px;"></div>
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
    const myChart = echarts.init(this.$refs.main);
    this.axios({
      url: 'reports/type/1',
      method: 'GET',
    }).then((bak) => {
      this.option.legend = bak.data.data.legend;
      this.option.series = bak.data.data.series;
      this.option.xAxis = bak.data.data.xAxis;
      this.option.yAxis = bak.data.data.yAxis;
      this.option.xAxis[0].boundaryGap = false;
      console.log(this.option);
      myChart.setOption(this.option);
    });
  },
};
</script>

<style></style>
