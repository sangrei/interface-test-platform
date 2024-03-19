<!--运行记录图表-->
<template>
  <div id="failure-test-case-trend">
    <div class="title">运行记录</div>
    <div style="width: 100%; height: 600px" ref="chart"></div>
  </div>
</template>
<script>
//导入echarts，需要先npm install echarts安装
import * as echarts from "echarts";
export default {
  name: "FailureTestCaseTrend",
  props: {
    testRecords: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    //计算所有执行记录的通过率
    chartData() {
      const chartDatas = {
        createTimes: [],
        successes: [],
        failures: [],
        errors: [],
      };
      this.testRecords.forEach((item) => {
        //时间
        chartDatas.createTimes.push(item.createTime);
        let totalOfTestCaseForSuccess = item.testReport
          ? item.testReport.totalOfTestCaseForSuccess
          : 0;
        let totalOfTestCaseForFailure = item.testReport
          ? item.testReport.totalOfTestCaseForFailure
          : 0;
        let totalOfTestCaseForError = item.testReport
          ? item.testReport.totalOfTestCaseForError
          : 0;
        //成功用例
        chartDatas.successes.push(totalOfTestCaseForSuccess);
        //失败用例
        chartDatas.failures.push(totalOfTestCaseForFailure);
        //错误用例
        chartDatas.errors.push(totalOfTestCaseForError);
      });
      return chartDatas;
    },
  },
  watch: {
    //监听传递参数，重绘图表
    testRecords() {
      this.draw();
    },
  },
  mounted() {
    //绘制图形
    this.draw()
  },
  methods: {
    draw() {
      this.chart = echarts.init(this.$refs.chart);
      let option = {
        color: ["#F56C6C", "#E6A23C", "#67C23A"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["通过", "失败", "错误"],
          textStyle: {
            color: "#7ec7ff",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
          },

          data: this.chartData.createTimes.reverse(),
        },
        series: [
          {
            name: "错误",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            barCategoryGap: 30,
            //柱子的宽度
            barWidth: 15,
            // 柱子设为圆角
            itemStyle: {
              barBorderRadius: 20,
            },
            data: this.chartData.errors.reverse(),
          },
          {
            name: "失败",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            barCategoryGap: 30,
            //柱子的宽度
            barWidth: 15,
            // 柱子设为圆角
            itemStyle: {
              barBorderRadius: 20,
            },
            data: this.chartData.failures.reverse(),
          },
          {
            name: "通过",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            // 柱子间距
            barCategoryGap: 30,
            //柱子的宽度
            barWidth: 15,
            // 柱子设为圆角
            itemStyle: {
              barBorderRadius: 20,
            },
            data: this.chartData.successes.reverse(),
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>
<style scoped>
.right-box {
  background: rgba(10, 0, 45, 0.2);
  height: 620px;
  margin: 10px 0;
}

.title {
  height: 40px;
  text-align: center;
  color: #00aaff;
  font: bold 16px/40px "microsoft sans serif";
}
</style>