<!--失败用例趋势图表-->
<template>
  <div id="failure-test-case-trend">
    <div class="left_box">
      <div class="title">失败用例趋势</div>
      <div style="width: 100%; height: 260px" ref="chart"></div>
    </div>
  </div>
</template>
<script>
//导入echarts，需要先npm install echarts安装
import * as echarts from 'echarts'

export default {
  name: 'FailureTestCaseTrend',
  props: {
    testRecords: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    //计算所有执行记录的通过率
    chartData() {
      const chartDatas = {
        createTimes: [],
        failures: [],
      }
      this.testRecords.forEach((item) => {
        // 时间
        chartDatas.createTimes.push(item.createTime)
        // 失败用例
        let totalOfTestCaseForFailure = item.testReport?item.testReport.totalOfTestCaseForFailure:0
        chartDatas.failures.push(totalOfTestCaseForFailure)
      })
      return chartDatas
    },
  },
  
  mounted() {
    //绘制图形
    this.draw()
  },
  methods: {
    draw() {
      this.chart = echarts.init(this.$refs.chart)
      let value = this.chartData.failures.reverse()
      let label = this.chartData.createTimes.reverse()
      let option = {
        grid: {
          top: 10,
          bottom: 10,
          left: 30,
          right: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          formatter: '失败用例数:{c}',
          axisPointer: {
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(85, 255, 255, 0.0)', // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(255,255,255,1)', // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(17, 0, 255, 0.0)', // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            show: false,
            axisLabel: {
              formatter: '{value}',
              fontSize: 8,
              margin: 20,
              textStyle: {
                color: '#2c9a93',
              },
            },
            axisLine: {
              lineStyle: {
                color: '#243753',
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#243753',
              },
            },
            axisTick: {
              show: false,
            },
            data: label,
          },
        ],
        yAxis: [
          {
            boundaryGap: false,
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#7ec7ff',
              },
            },
            nameTextStyle: {
              color: '#fff',
              fontSize: 12,
              lineHeight: 40,
            },
            splitLine: {
              lineStyle: {
                color: '#243753',
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#283352',
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: '通过率',
            type: 'line',
            smooth: true,
            showSymbol: true,
            symbolSize: 3,
            zlevel: 3,
            itemStyle: {
              color: '#ffffff',
              borderColor: '#a3c8d8',
            },
            lineStyle: {
              width: 3,
              color: '#E6A23C',
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(36, 104, 104, 0.2)',
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(25, 255, 0, 0.0)',
                  },
                ],
                false
              ),
            },
            data: value,
          },
        ],
      }
      this.chart.setOption(option)
    },
  },
}
</script>
<style scoped>
.title {
  height: 40px;
  text-align: center;
  color: #00aaff;
  font: bold 16px/40px 'microsoft sans serif';
}
</style>