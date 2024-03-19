<template>
  <div class="test-report">
    <el-card class="box-card">
      <!-- 报告标题 -->
      <div class="title">
        【<span style="font-weight: bold">{{ testResult.taskName }}</span
        >】测试报告
      </div>
      <!-- 统计信息 -->
      <div class="summary">
        <el-divider content-position="center" style="padding-top: 5px">
          <h4 style="font-size: 20px">测试结果</h4>
        </el-divider>
        <el-row type="flex" class="row-bg" style="padding: 0px">
          <el-col :span="12">
            <div class="grid-content">
              <el-tag effect="plain" type="info">执行用时</el-tag>
              <div class="grid-content">
                <span style="line-height: 35px"
                  >{{
                    Math.floor(testResult.totalDuration * 100) / 100
                  }}秒</span
                >
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content"></div>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col :span="12">
            <div class="grid-content">
              <el-tag effect="dark">用例总数</el-tag>
              <div class="grid-content">
                <span style="line-height: 35px">{{
                  testResult.totalOfTestCase
                }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-tag effect="dark" type="success">成功用例</el-tag>
              <div class="grid-content">
                <span style="line-height: 35px">{{
                  testResult.totalOfTestCaseForSuccess
                }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col :span="12">
            <div class="grid-content">
              <el-tag effect="dark" type="warning">失败用例</el-tag>
              <div class="grid-content">
                <span style="line-height: 35px">{{
                  testResult.totalOfTestCaseForFailure
                }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-tag effect="dark" type="danger">错误用例</el-tag>
              <div class="grid-content">
                <span style="line-height: 35px">{{
                  testResult.totalOfTestCaseForError
                }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="test_info">
        &nbsp;
        <el-divider content-position="center" style="padding-top: 5px">
          <h4 style="font-size: 20px">用例详细</h4>
        </el-divider>
        <el-card
          class="box-card"
          v-for="testSuit in testResult.testSuitResults"
          :key="testSuit.id"
        >
          <el-divider content-position="left">
            <h3>{{ testSuit.testSuitName }}</h3>
          </el-divider>
          <el-table
            :data="testSuit.testCaseResults"
            style="width: 100%"
            size="mini"
          >
            <el-table-column type="expand" min-width="40">
              <template slot-scope="props">
                <pre>{{ props.row.exception }}</pre>
              </template>
            </el-table-column>
            <el-table-column
              prop="testCase.name"
              label="用例名"
              min-width="180"
            >
            </el-table-column>
            <el-table-column prop="inf.path" label="接口地址" min-width="280">
            </el-table-column>
            <el-table-column
              prop="inf.requestMethod"
              label="请求方法"
              min-width="180"
            >
            </el-table-column>
            <el-table-column label="测试结果" min-width="80">
              <template slot-scope="scope">
                <el-tag
                  effect="dark"
                  type="success"
                  v-if="scope.row.status == 0"
                  >成功</el-tag
                >
                <el-tag
                  effect="dark"
                  type="warning"
                  v-if="scope.row.status == 1"
                  >失败</el-tag
                >
                <el-tag effect="dark" type="danger" v-if="scope.row.status == 2"
                  >异常</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <div class="test_info">
        <el-divider content-position="center" style="padding-top: 5px">
          <h4 style="font-size: 20px">执行日志</h4>
        </el-divider>
        <el-card class="box-card" style="text-align: left">
          <div
            v-for="testSuit in testResult.testSuitResults"
            :key="testSuit.testSuitId"
            style="font-size: 10px; font-family: monospace"
          >
            <span style="font-weight: bold"
              >测试套件【{{ testSuit.testSuitName }}】测试开始...</span
            >
            <div
              v-for="(testCaseResult, index) in testSuit.testCaseResults"
              :key="testCaseResult.testCase.id"
            >
              [{{ testCaseResult.startTime }}]测试用例【{{
                testCaseResult.testCase.name
              }}】测试开始...
              <pre
                v-if="testCaseResult.status == 0 || testCaseResult.status == 1"
                >{{ testCaseResult.responseData }}
              </pre>
              <pre v-if="testCaseResult.status == 2"
                >{{ testCaseResult.exception }}
              </pre>
              <div
                v-for="assert in testCaseResult.extracts"
                :key="assert.assertExpression"
              >
                [{{ testCaseResult.endTime }}]响应提取[{{
                  assert.assertExpression
                }}]，提取结果：{{ assert.result == true ? '成功' : '失败'
                }}<span v-if="assert.result == false"
                  >，实际结果：{{ assert.realValue }}。</span
                >
              </div>
              <div
                v-for="assert in testCaseResult.asserts"
                :key="assert.assertExpression"
              >
                [{{ testCaseResult.endTime }}]用例断言[{{
                  assert.assertExpression
                }}]，断言结果：{{ assert.result == true ? '成功' : '失败'
                }}<span v-if="assert.result == false"
                  >，实际结果：{{ assert.realValue }}。</span
                >
              </div>
              <div
                v-for="assert in testCaseResult.dbAsserts"
                :key="assert.assertExpression"
              >
                [{{ testCaseResult.endTime }}]数据库校验[{{
                  assert.assertExpression
                }}]，断言结果：{{ assert.result == true ? '成功' : '失败'
                }}<span v-if="assert.result == false"
                  >，实际结果：{{ assert.realValue }}。</span
                >
              </div>
              [{{ testCaseResult.endTime }}]测试用例【{{
                testCaseResult.testCase.name
              }}】测试结束，测试结果：<span
                style="color: #67c23a; font-weight: bold"
                v-if="testCaseResult.status == 0"
                >成功</span
              ><span
                style="color: #e6a23c; font-weight: bold"
                v-if="testCaseResult.status == 1"
                >失败</span
              >
              <span
                style="color: #f56c6c; font-weight: bold"
                v-if="testCaseResult.status == 2"
                >异常</span
              >
              <div v-if="index != testSuit.testCaseResults.length - 1">
                &nbsp;
              </div>
            </div>
            <span style="font-weight: bold"
              >测试套件【{{ testSuit.testSuitName }}】测试结束。</span
            >
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as testreportApi from '@/api/testreport'

export default {
  name: 'TestReport',
  data() {
    return {
      testReport: {},
      testResult: {},
    }
  },
  created() {
    //获取初始化数据
    this.getInitData()
  },
  watch: {
    //监听路由，主要解决快捷标签有多个时，不刷新问题
    $route() {
      this.getInitData()
    },
  },
  methods: {
    //获取初始数据
    async getInitData() {
      if (this.$route.query.testReportId) {
        let testReportId = this.$route.query.testReportId
        //根据测试记录id获取测试报告信息
        await testreportApi.getById(testReportId).then((response) => {
          let result = response.data
          this.testReport = result.data
          this.testResult = JSON.parse(this.testReport.result || '{}')
        })
      }
    },
  },
}
</script>

<style scoped>
/* 顶部样式 */
.title {
  height: 60px;
  width: 100%;
  text-align: center;
  font-size: 28px;
}

/* 数据统计 */
/*汇总信息样式*/
.summary {
  width: 90%;
  margin-left: 5%;
}

.text-left {
  color: #20a0ff;
  font: bolder 20px/30px 'Microsoft YaHei UI';
  margin-bottom: 10px;
}

.left {
  width: 50%;
  float: left;
}

.right {
  width: 50%;
  float: right;
}

.desc {
  float: left;
  width: 100%;
}

.list-group-item span {
  font: normal 16px/38px 'Microsoft YaHei UI';
  padding: 30px;
}

.list-group-item {
  position: relative;
  display: block;
  padding: 0.2rem 0.5rem;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
}

/* 详细信息 */
.el-submenu {
  border: 1px solid #e4e7ed;
}

/* 执行信息样式   */
.test_info {
  width: 90%;
  margin-left: 5%;
  color: #28a745 !important;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}

.el-row {
  margin-bottom: 5px;
}
.el-col {
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin-right: 5px;
}
.grid-content {
  min-height: 36px;
  padding: 3px 20px 3px 20px;
  text-align: left;
  font-weight: bold;
  display: inline-block;
  margin-right: 5px;
}
.row-bg {
  background-color: #f9fafc;
}
</style>