<!--最近的测试记录图表-->
<template>
  <div id="lastest-test-record">
    <div class="left_box">
      <div class="title">最近一次运行</div>
      <div style="width: 100%; height: 260px" ref="chart"></div>
    </div>
  </div>
</template>
<script>
//导入echarts，需要先npm install echarts安装
import * as echarts from 'echarts'
export default {
  name: 'LatestTestRecord',
  props: {
      result:Object
  },
  watch:{
      //监听传递参数，重绘图表
      result(){
          this.draw()
      }
  },
  mounted() {
      //绘制图形
      this.draw()
  },
  methods: {
    draw() {
      this.chart = echarts.init(this.$refs.chart)
      let option = {
        color: ['#00FE65', '#E6A23C', '#F56C6C'],

        tooltip: {
          trigger: 'item',
        },
        grid: {
          top: 10,
          bottom: 10,
          left: 30,
          right: 30,
          containLabel: true,
        },
        legend: {
          top: 'center',
          right: '5%',
          textStyle: {
            color: '#7ec7ff',
          },
          orient: 'vertical',
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                fontWeight: 'bold',
                formatter: '{b}率:{d}%',
                color: '#fff',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: this.result.totalOfTestCaseForSuccess,
                name: '通过',
              },
              {
                value: this.result.totalOfTestCaseForFailure,
                name: '失败',
              },
              {
                value: this.result.totalOfTestCaseForError,
                name: '错误',
              },
            ],
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