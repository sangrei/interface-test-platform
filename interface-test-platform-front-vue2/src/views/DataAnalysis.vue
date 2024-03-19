<template>
  <div id="test-analysis" class="content">
    <el-row :gutter="10">
      <el-col :span="7">
        <div class="left_box">
        <latest-test-record :result="JSON.parse(latestTestRecord.testReport.result)"  v-if="latestTestRecord"></latest-test-record>
        </div>
        <div class="left_box">
        <failure-test-case-trend  :testRecords="testRecords"  v-if="testRecords&&testRecords.length>0"></failure-test-case-trend>
        </div>
      </el-col>

      <el-col :span="10">
        <!-- 项目基本信息 -->
        <div
          style="
            color: #7ec7ff;
            background: rgba(10, 0, 45, 0.2);
            height: 200px;
            margin: 10px 0;
          "
        >
          <div style="text-align: center">
            <div style="width: 60%">
              <el-row :gutter="0">
                <el-col :span="4">
                  <div
                    style="height: 40px; font: bold 16px/40px 'microsoft yahei'"
                  >
                    任务
                  </div>
                </el-col>
                <el-col :span="20">
                  <el-select
                    v-model="search.taskId"
                    value-key="id"
                    placeholder="请选择任务"
                  >
                    <el-option
                      v-for="item in tasks"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </div>
          </div>
          <div>
            <div class="pro">
              最近一次运行时间:
              <span v-if="latestTestRecord">{{
                latestTestRecord.testReport ? latestTestRecord.createTime : ''
              }}</span>
            </div>
          </div>
          <div>
            <div class="pro">
              运行环境:
              <span style="text-indent: 2rem" v-if="latestTestRecord">
                {{
                  JSON.parse(latestTestRecord.testReport.result).environment
                    .name
                }}
              </span>
            </div>
          </div>
          <div>
            <div class="pro">
              用例总数:<span style="text-indent: 2rem" v-if="latestTestRecord">
                {{
                  JSON.parse(latestTestRecord.testReport.result).totalOfTestCase
                }}
              </span>
            </div>
          </div>
          <div class="pro">
            <el-row>
              <el-col :span="4"> 用例通过率:</el-col>
              <el-col :span="18">
                <el-progress
                  :text-inside="true"
                  :stroke-width="16"
                  :percentage="percent"
                  status="success"
                >
                </el-progress>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="center-box">
          <success-test-case-percent :testRecords="testRecords"  v-if="testRecords&&testRecords.length>0"></success-test-case-percent>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="right-box">
          <test-record-list :testRecords="testRecords"  v-if="testRecords&&testRecords.length>0"></test-record-list>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as testrecordApi from '@/api/testrecord'
import * as taskApi from '@/api/task'
import LatestTestRecord from '../components/dataanalysis/LatestTestRecord.vue'
import FailureTestCaseTrend from '../components/dataanalysis/FailureTestCaseTrend.vue'
import SuccessTestCasePercent from '../components/dataanalysis/SuccessTestCasePercent.vue'
import TestRecordList from '../components/dataanalysis/TestRecordList.vue'

export default {
  components: { LatestTestRecord, FailureTestCaseTrend, SuccessTestCasePercent, TestRecordList },
  name: 'DataAnalysis',
  data() {
    return {
      tasks: [],
      testRecords: [],
      search: {
        taskId: null,
      },
      latestTestRecord: null, //最近一次构建
    }
  },
  computed: {
    project() {
      return this.$store.getters.getCurrentUserProject
    },
    percent() {
      let percent = 0

      if (
        this.latestTestRecord &&
        this.latestTestRecord.testReport &&
        this.latestTestRecord.testReport.result
      ) {
        let result = JSON.parse(this.latestTestRecord.testReport.result)
        if (result) {
          let value = Math.round(
            (result.totalOfTestCaseForSuccess / result.totalOfTestCase) * 10000
          )
          percent = value / 100
        }
      }

      return percent
    },
  },
  watch: {
    //监听查询条件，如果选择的测试任务变化，相应的测试记录也重新加载
    'search.taskId': {
      handler: function () {
        this.getTestRecords()
      },
      deep: true,
    },
  },
  created() {
    //获取初始化数据
    this.getInitData()
  },
  methods: {
    //获取初始化数据
    async getInitData() {
      //获取所有任务
      await taskApi.queryByProjectId(this.project.id).then((response) => {
        let result = response.data
        this.tasks = result.data
        //如果url有传递任务id，使用url参数中的；没有，则使用当前返回的第1 个
        if (this.$route.params.id) {
          this.search.taskId = parseInt(this.$route.params.id)
        } else {
          if (this.tasks.length > 0) {
            this.search.taskId = this.tasks[0].id
          }
        }
      })
    },
    //查询测试记录列表
    getTestRecords() {
      this.search.projectId = this.project.id
      testrecordApi.queryByProjectId(this.search).then((response) => {
        let result = response.data
        this.testRecords = result.data

        this.latestTestRecord = null //获取最近一次的测试记录，先清空，多次选择任务时清空旧数据
        if (this.testRecords.length > 0) {
          //this.latestTestRecord = this.testRecords[0]
            this.getLatestTestRcord(this.testRecords[0].id)
        }
      })
    },
    //获取最近条记录
    getLatestTestRcord(id){
      testrecordApi.getById(id).then((response)=>{
        let result = response.data
        this.latestTestRecord = result.data
      })
    }
  },
}
</script>

<style scoped>
.content {
  background: #050051;
  width: 100%;
  overflow: auto;
  padding: 0;
}

.left_box {
  background: rgba(10, 0, 45, 0.2);
  height: 310px;
  margin: 10px 0;
}

.center-box {
  background-color: rgba(10, 0, 45, 0.2);
  height: 420px;
  margin: 10px 0;
}

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

.charts-box-f {
  height: 160px;
}

.pro {
  margin: 10px;
  font: normal 12px/20px 'microsoft yahei';
}

.el-select {
  background-color: rgba(255, 255, 255, 0.247);
}
</style>