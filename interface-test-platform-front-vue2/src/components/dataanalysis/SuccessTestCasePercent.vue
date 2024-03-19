<!--用例通过率图表-->
<template>
  <div id="failure-test-case-trend">
    <div class="title">质量曲线(用例通过率)</div>
    <div style="width: 100%; height: 260px" ref="chart"></div>
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
      default: () => [],
    },
  },
  computed: {
    //计算所有执行记录的通过率
    chartData() {
      const chartDatas = {
        createTimes: [],
        percents: [],
      }
      this.testRecords.forEach((item) => {
        // 时间
        chartDatas.createTimes.push(item.createTime)
        // 成功用例
        let totalOfTestCaseForSuccess = item.testReport?item.testReport.totalOfTestCaseForSuccess:0
        let totalOfTestCase = item.testReport?item.testReport.totalOfTestCase:0
        let percent =
          Math.round(
            (totalOfTestCaseForSuccess / totalOfTestCase) * 10000
          ) / 100
        chartDatas.percents.push(percent)
      })
      return chartDatas
    },
  },
  watch:{
      //监听传递参数，重绘图表
      testRecords(){
          this.draw()
      }
  },
  mounted() {
    //绘制图形
    this.draw()
  },
  methods: {
    draw() {
      //1.初始化chart01
      this.chart = echarts.init(this.$refs.chart)
      //2.配置数据
      let value = this.chartData.percents.reverse()
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
          formatter: '{b} : {c}%',
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
                    color: 'rgba(255,255,255,0)', // 0% 处的颜色
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(255,255,255,1)', // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(255,255,255,0)', // 100% 处的颜色
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
              fontSize: 14,
              margin: 20,
              textStyle: {
                color: '#7ec7ff',
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
            symbolSize: 8,
            zlevel: 3,
            itemStyle: {
              color: '#19a3df',
              borderColor: '#a3c8d8',
            },
            lineStyle: {
              width: 6,
              color: '#19a3df',
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
                    color: 'rgba(88,255,255,0.2)',
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(88,255,255,0)',
                  },
                ],
                false
              ),
            },
            data: value,
          },
        ],
      }
      //3.传入数据
      this.chart.setOption(option)
    },
  },
}
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
  font: bold 16px/40px 'microsoft sans serif';
}
</style>