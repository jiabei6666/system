<template>
  <el-card>
    <!-- 1， 导航栏 -->
    <div slot="header" class="clearfix">
      <Mylist listname1="数据统计" listname2="数据报表" />
    </div>
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width: 800px;height:400px;"></div>
  </el-card>
</template>

<script>
var echarts = require("echarts");
export default {
  data() {
    return {};
  },
  methods: {
    async getreports() {
      const res = await this.$http.get("reports/type/1");
      console.log(res);
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main"));
      let option = {
        title: {
          text: "堆叠区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        }
      };
      // 绘制图表
      let option3 = { ...option, ...res.data.data };
      myChart.setOption(option3);
    }
  },
  created() {},
  mounted() {
    this.getreports();
  }
};
</script>

<style>
</style>