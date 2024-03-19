<template>
  <div class="test-record">
    <el-card class="box-card" style="height: 700px">
      <el-card
        shadow="hover"
        :body-style="{ padding: '0px' }"
        style="border-bottom: solid #eff7ff 3px"
      >
        <div class="grid-content grid-con-1">
          <span class="grid-con-icon">运行记录</span>
          <div class="grid-cont-right">
            <el-row :gutter="20">
              <el-col :span="3">
                <div style="line-height: 2.5rem">测试任务</div>
              </el-col>
              <el-col :span="7">
                <el-select v-model="search.taskId" placeholder="测试任务">
                  <el-option label="全部" value=""></el-option>
                  <el-option
                    v-for="item in tasks"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="3">
                <div style="line-height: 2.5rem">执行环境</div>
              </el-col>
              <el-col :span="7">
                <el-select
                  v-model="search.environmentId"
                  placeholder="运行环境"
                >
                <el-option label="全部" value=""></el-option>
                  <el-option
                    v-for="item in environments"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <div class="grid-cont-right">
                  <!-- 添加项目的按钮 -->
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="getTestRecords"
                    plain
                  >
                    查询
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-card>

      <!--  记录列表 -->
      <el-card style="margin-top: 20px">
        <el-table
          :data="testRecords"
          style="width: 100%; margin-top: 20px"
          size="mini"
        >
          <el-table-column prop="id" label="ID" width="60"> </el-table-column>
          <el-table-column prop="createTime" label="运行时间" min-width="120" align="center">
          </el-table-column>
          <el-table-column prop="task.name" label="测试任务" min-width="150" align="center">
          </el-table-column>
          <el-table-column prop="environment.name" label="运行环境" min-width="150" align="center">
          </el-table-column>
          <el-table-column prop="name" label="运行记录名称" min-width="150" align="center">
          </el-table-column>
          <el-table-column label="运行状态" min-width="100" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.status==0?'运行完成':'运行中...'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createByName"
            label="运行人"
            min-width="100"
          >
          </el-table-column>
          <el-table-column label="用例总数" min-width="80"  align="center">
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.testReport ? scope.row.testReport.totalOfTestCase : 0
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="通过率" min-width="80"  align="center">
            <template slot-scope="scope">
              <span>
                {{
                  (scope.row.testReport ? scope.row.testReport.totalOfTestCaseForSuccess : 0) /
                    (scope.row.testReport ? scope.row.testReport.totalOfTestCase : 0)
                    | percent
                }}</span
              >
            </template>
          </el-table-column>

          <el-table-column label="测试报告" min-width="100" align="center">
            <template slot-scope="scope">
              <el-button
                type="success"
                icon="el-icon-view"
                plain
                size="mini"
                v-if="scope.row.status==0"
                @click="
                  $router.push({
                    path: '/testReport',
                    query: { testReportId: scope.row.testReport.id },
                  })
                "
                >查看报告</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          style="margin-top: 10px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="search.pageIndex"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="search.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import * as testrecordApi from '@/api/testrecord'
import * as taskApi from '@/api/task'
import * as environmentApi from '@/api/environment'

export default {
  name: 'TestRecord',
  data() {
    return {
      tasks: [],
      environments: [],
      search: {
        pageIndex: 1,
        pageSize: 10,
        taskId: '',
        environmentId: '',
      },
      testRecords: [],
      total: 0,
    }
  },
  computed: {
    project() {
      return this.$store.getters.getCurrentUserProject
    },
  },
  created() {
    //获取初始化数据
    this.getInitData()
  },
  methods: {
    //获取初始化数据
    getInitData() {
      //获取所有任务
      taskApi.queryByProjectId(this.project.id).then((response) => {
        let result = response.data
        this.tasks = result.data
      })
      //获取所有项目环境
      environmentApi.queryByProjectId(this.project.id).then((response) => {
        let result = response.data
        this.environments = result.data
      })
      //查询测试记录
      this.getTestRecords()
    },
    //查询测试记录
    getTestRecords() {
      this.search.projectId = this.project.id
      testrecordApi.query(this.search).then((response) => {
        let result = response.data
        this.testRecords = result.data
        this.total = result.total
      })
    },
    handleSizeChange(val) {
      this.search.pageSize = val
      this.getTestRecords()
    },
    handleCurrentChange(val) {
      this.search.pageIndex = val
      this.getTestRecords()
    },
  },
}
</script>

<style scoped>
.grid-content {
  display: flex;
  align-items: center;
  height: 80px;
}

.grid-cont-right {
  flex: 1;
  font-size: 16px;
  color: #000;
  font-weight: bold;
  text-align: right;
  margin-right: 20px;
}

.grid-con-icon {
  font-size: 24px;
  width: 400px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  color: #409eff;
  font-weight: bold;
}

.grid-con-1 .grid-con-icon {
  background: #eff7ff;
}
</style>