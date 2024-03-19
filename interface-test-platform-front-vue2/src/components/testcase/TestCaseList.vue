<!--测试用例列表，用于在用例管理呈现左侧菜单-->
<template>
  <div class="test-case-list">
    <div id="inter_list">
      <div
        style="
          height: 50px;
          font: bold 24px/50px 'microsoft yahei';
          color: #000;
          text-align: center;
        "
      >
        <i class="el-icon-s-management">用例管理</i>
      </div>
      <div style="background: #f0f0f0; height: 5px"></div>
      <!--树形菜单组件呈现[测试任务->测试套件->测试用例]，其中default-active表示当前选中的菜单，背景颜色不同-->
      <el-menu
        class="el-menu-vertical-demo"
        style="height: calc(100vh - 170px); overflow-y: auto"
        :default-active="defaultActive"
      >
      <!--外层菜单，呈现当前项目的所有未归档[测试任务]-->
        <el-submenu
          :index="task.id + ''"
          v-for="task in taskDetails"
          :key="task.id"
        >
          <template slot="title" style="font-weight: bold">
            <i class="el-icon-folder-opened"></i>
            <span slot="title">{{ task.name }}</span>
          </template>
          <!--中间层测试套件，呈现菜单下的所有[测试套件]-->
          <el-submenu
            :index="task.id + '_' + testSuit.id"
            v-for="testSuit in task.testSuits"
            :key="testSuit.id"
          >
            <template slot="title">
              <i class="el-icon-folder"></i>
              <span
                >{{ testSuit.name }}
                <el-tooltip
                  content="删除测试套件"
                  placement="right"
                  effect="light"
                >
                  <i class="el-icon-document"></i>
                  <span>
                    <el-button
                      type="text"
                      icon="el-icon-delete"
                      @click.stop="removeTestSuit(testSuit)"
                      style="margin-bottom: 5px"
                    ></el-button>
                  </span>
                </el-tooltip>
              </span>
            </template>
            <!--里层测试用例，呈现测试套件下的所有测试用例，注意index的定义，才能保证被选中-->
            <el-menu-item
              :index="task.id + '_' + testSuit.id + '_' + testCase.id"
              v-for="testCase in testSuit.testCases.slice().sort((x,y)=>{ return x.orderIndex>y.orderIndex?1:-1})"
              :key="testCase.id"
              @click="selectTestCase(testCase, testSuit, task)"
              :ref="task.id + '_' + testSuit.id + '_' + testCase.id"
            >
              <template slot="title">
                <el-tooltip v-if="testCase.name.length > 17"
                  :content="testCase.name"
                  placement="right"
                  effect="light"
                >
                  <i class="el-icon-document"></i>
                  <span>{{
                    testCase.name.length > 17
                      ? testCase.name.substr(0, 17) + '...'
                      : testCase.name
                  }}</span>
                </el-tooltip>
                <span v-else>{{
                    testCase.name
                  }}</span>
                <el-tooltip content="拷贝用例" placement="right" effect="light">
                  <i class="el-icon-document"></i>
                  <span>
                    <el-button
                      type="text"
                      icon="el-icon-document-copy"
                      @click.stop="setCopyTestCase(testCase)"
                      style="margin-bottom: 5px"
                    ></el-button>
                  </span>
                </el-tooltip>
              </template>
            </el-menu-item>
            <!-- 添加用例 -->
            <el-menu-item>
              <template>
                <el-button
                  type="text"
                  @click.stop="showAddForTestCase(testSuit.id, task.id)"
                >
                  <i
                    class="el-icon-folder-add"
                    style="color: #67c23a; font-size: 14px"
                  >
                    添加用例
                  </i>
                </el-button>
                <el-button
                  type="text"
                  @click.stop="pasteTestCase(testSuit, task)"
                  v-if="copyTestCase"
                  style="margin-left: 60px"
                >
                  <i
                    class="el-icon-printer"
                    style="color: #67c23a; font-size: 14px"
                  >
                    粘贴用例
                  </i>
                </el-button>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 添加测试套件 -->
          <el-menu-item @click="showEditForTestSuit(null, task.id)">
            <template slot="title">
              <div>
                <i
                  class="el-icon-folder-add"
                  style="color: #67c23a; font-size: 18px"
                >
                  <span style="font-size: 14px"> 添加套件</span></i
                >
              </div>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <!--编辑测试套件对话框-->
    <el-dialog
      :visible.sync="editVisibleForTestSuit"
      :title="currentTestSuitId ? '编辑测试套件' : '添加测试套件'"
      center
      append-to-body
    >
      <test-suit-edit
        :id="currentTestSuitId"
        :taskId="currentTaskId"
        @callbackForSave="callbackForSaveForTestSuit"
        @callbackForCancel="callbackForCancelForTestSuit"
        v-if="editVisibleForTestSuit"
      ></test-suit-edit>
    </el-dialog>
    <!--编辑测试用例对话框-->
    <el-dialog
      :visible.sync="editVisibleForTestCase"
      title="添加测试用例"
      center
      append-to-body
    >
      <test-case-add
        :testSuitId="currentTestSuitId"
        :taskId="currentTaskId"
        @callbackForSave="callbackForSaveForTestCase"
        @callbackForCancel="callbackForCancelForTestCase"
        v-if="editVisibleForTestCase"
      ></test-case-add>
    </el-dialog>
  </div>
</template>

<script>
import TestSuitEdit from '@/components/testsuit/TestSuitEdit'
import TestCaseAdd from '@/components/testcase/TestCaseAdd'
import * as taskApi from '@/api/task'
import * as testcaseApi from '@/api/testcase'
import * as testsuitApi from '@/api/testsuit'

export default {
  name: 'TestCaseList',
  components: {
    TestSuitEdit,
    TestCaseAdd,
  },
  data() {
    return {
      //新增/修改测试套件弹窗是否可见
      editVisibleForTestSuit: false,
      //新增/修改测试用例弹窗是否可见
      editVisibleForTestCase: false,
      //当前测试套件ID，用于编辑测试套件，当前未提供此功能
      currentTestSuitId: null,
      //当前测试任务ID，用于新增/编辑测试套件时，一起传递给子组件
      currentTaskId: null,
      //当前选中项
      defaultActive : "-1"
    }
  },
  computed: {
    //获取当前项目
    project() {
      return this.$store.getters.getCurrentUserProject
    },
    //获取当前任务详情列表，下面包括测试套件，测试套件下又包含测试用例
    taskDetails() {
      return this.$store.getters.getTaskDetails
    },
    //获取拷贝的测试用例，用于粘贴的时候
    copyTestCase() {
      return this.$store.getters.getCopyTestCase
    },
  },
  created() {
    //获取初始化数据
    this.getInitData()
  },
  methods: {
    //获取初始化数据
    getInitData() {
      //获取任务详情列表
      this.getTaskDetails()
    },
    //获取任务详情列表，下面包括测试套件，测试套件下又包含测试用例
    getTaskDetails() {
      taskApi.queryDetailByProjectId(this.project.id).then((response) => {
        let result = response.data
        //将数据存入到vuex
        this.$store.commit('setTaskDetails', result.data)
      })
    },

    //【测试套件相关】
    //显示测试套件弹窗
    showEditForTestSuit(testSuitId, taskId) {
      //设置传递的id
      this.currentTestSuitId = testSuitId
      this.currentTaskId = taskId
      //显示弹出对话框
      this.editVisibleForTestSuit = true
    },
    //隐藏测试套件弹窗
    hideEditForTestSuit() {
      this.editVisibleForTestSuit = false
    },
    //测试套件保存成功回调
    callbackForSaveForTestSuit() {
      //隐藏弹窗
      this.hideEditForTestSuit()
      //重新获取前任务详情列表
      this.getInitData()
    },
    //测试套件取消回调
    callbackForCancelForTestSuit() {
      //隐藏弹窗
      this.hideEditForTestSuit()
    },

    //【测试用例相关】
    //显示测试用例弹窗
    showAddForTestCase(testSuitId, taskId) {
      //设置传递的id
      this.currentTestSuitId = testSuitId
      this.currentTaskId = taskId
      //显示弹出对话框
      this.editVisibleForTestCase = true
    },
    //隐藏测试用例弹窗
    hideAddForTestCase() {
      this.editVisibleForTestCase = false
    },
    //测试用例保存成功回调
    callbackForSaveForTestCase(testCaseId, testSuitId, taskId) {
      //隐藏弹窗
      this.hideAddForTestCase()
      //重新获取前任务详情列表
      this.getInitData()
      //由于捕获不到el-menu重新绑定数据后，新增的组件，所以，使用setTimout滞后100毫秒，通过refs取到指定组件，触发点击事件
      let _refs = this.$refs
      setTimeout(function () {
        let item = _refs[taskId + '_' + testSuitId + '_' + testCaseId][0]
        item.$emit('click')
      }, 500)
    },
    //测试用例取消回调
    callbackForCancelForTestCase() {
      //隐藏弹窗
      this.hideAddForTestCase()
    },


    //选择测试用例，此时需要切换菜单选中项，并设置当前测试用例
    selectTestCase(testCase, testSuit, task) {
      //设置当前激活测试用例菜单
      this.defaultActive = task.id + '_' + testSuit.id + '_' + testCase.id
      //设置当前测试用例
      this.$store.commit('setCurrentTestCase',testCase)
    },
    //删除测试套件
    removeTestSuit(testSuit) {
      this.$confirm('确定删除测试套件[' + testSuit.name + ']吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          testsuitApi.remove(testSuit.id).then((response) => {
            if (response.data.code === 0) {
              //重新获取前任务详情列表
              this.getInitData()
              //成功提示
              this.$message({
                message: '删除成功。',
                type: 'success',
              })
            } else {
              //错误提示
              this.$message({
                message: response.data.message,
                type: 'warning',
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //拷贝测试用例
    setCopyTestCase(testCase) {
      this.$store.commit('setCopyTestCase', testCase)
      //成功提示
      this.$message({
        message: '拷贝成功。',
        type: 'success',
      })
    },
    //粘贴测试用例
    pasteTestCase(testSuit, task) {
      //深拷贝数据
      let copyTestCase = JSON.parse(JSON.stringify(this.copyTestCase))
      //拷贝时，需要将响应提取、断言、数据库断言转换成字符串提交给后端
      if(typeof copyTestCase.extract == 'object') {
        copyTestCase.extract = JSON.stringify(copyTestCase.extract)
      }
      if(typeof copyTestCase.assertion == 'object') {
        copyTestCase.assertion = JSON.stringify(copyTestCase.assertion)
      }
      if(typeof copyTestCase.dbAssertion == 'object') {
        copyTestCase.dbAssertion = JSON.stringify(copyTestCase.dbAssertion)
      }
      //根据当前粘贴按钮所在的测试套件，重新设置测试任务id和测试套件id
      copyTestCase.testSuitId = testSuit.id
      copyTestCase.taskId = task.id
      //调用后端拷贝接口，实现拷贝
      testcaseApi.copy(copyTestCase).then((response) => {
        if (response.data.code === 0) {
          //重新获取数据列表
          this.getInitData()
          //由于捕获不到el-menu重新绑定数据后，新增的组件，所以，使用setTimout滞后100毫秒，通过refs取到指定组件，触发点击事件
          let _refs = this.$refs
          setTimeout(function () {
            console.log(_refs)
            _refs[
              task.id + '_' + testSuit.id + '_' + response.data.data.id
            ][0].$emit('click')
          }, 500)
          //成功提示
          this.$message({
            message: '粘贴成功。',
            type: 'success',
          })
        } else {
          //错误提示
          this.$message({
            message: response.data.message,
            type: 'warning',
          })
        }
      })
    },
  },
}
</script>

<style scoped>
</style>