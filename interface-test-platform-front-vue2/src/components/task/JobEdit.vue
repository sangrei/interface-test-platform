<template>
  <div class="job-edit">
    <el-form :model="job" ref="createRef">
      <el-form-item label="定时执行名称" label-width="120px">
        <el-input
          v-model="job.name"
          autocomplete="off"
          placeholder="请输入定时执行名称"
          style="width: 100%"
        ></el-input>
      </el-form-item>
      <el-form-item label="CRON表达式" label-width="120px">
        <el-input
          v-model="job.cron"
          autocomplete="off"
          placeholder="请输入CRON表达式"
          style="width: 100%"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目环境" label-width="120px">
        <el-select
          v-model="job.environmentId"
          placeholder="请选择项目环境"
          style="width: 100%"
        >
          <el-option
            v-for="item in environments"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="24">
        <h4>CRON表达式配置规则</h4>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="14">
        <h5>规则说明:</h5>
        <div style="font-size: 12px; line-height: 16px">
          * * * * * * *
          <span style="color: #909399"
            >分别表示：秒 分钟 小时 日期 月份 星期 年(可选)
          </span>
        </div>
        <div style="font-size: 12px; line-height: 16px">
          秒：
          <span style="color: #909399"
            >可以是从0到59之间的任何整数。</span
          >
        </div>
        <div style="font-size: 12px; line-height: 16px">
          分钟：
          <span style="color: #909399"
            >可以是从0到59之间的任何整数。</span
          >
        </div>
        <div style="font-size: 12px; line-height: 16px">
          小时：<span style="color: #909399"
            >可以是从0到23之间的任何整数。</span
          >
        </div>
        <div style="font-size: 12px; line-height: 16px">
          日期：<span style="color: #909399"
            >可以是从1到31之间的任何整数。</span
          >
        </div>
        <div style="font-size: 12px; line-height: 16px">
          月份：<span style="color: #909399"
            >可以是从1到12之间的任何整数。</span
          >
        </div>
        <div style="font-size: 12px; line-height: 16px">
          星期：<span style="color: #909399"
            >可以是从1到7之间的任何整数，1代表星期日。</span
          >
        </div>
        <div style="font-size: 12px; line-height: 16px">
          年份(可选)：<span style="color: #909399"
            >正常年份即可。</span
          >
        </div>
      </el-col>
      <el-col :span="10">
        <h5>配置案例：</h5>
        <div style="font-size: 12px; line-height: 16px">
          0 0 12 * * ?:
          <span style="color: #909399">每天12点触发1次</span>
        </div>
        <div style="font-size: 12px; line-height: 16px">
          0 0/30 * * * ?:
          <span style="color: #909399">每30分钟触发1次</span>
        </div>
        <div style="font-size: 12px; line-height: 16px">
          0 0 12 ? * 2-6:
          <span style="color: #909399">周一至周五的12点触发1次 </span>
        </div>
        <div style="font-size: 12px; line-height: 16px">
          3 25 19 26 8 ? 2021:
          <span style="color: #909399">指定时间2021年8月26日19点25分3秒执行1次</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as jobApi from '@/api/job'
import * as environmentApi from '@/api/environment'

export default {
  name: 'JobEdit',
  props: {
    id: Number,
    taskId: Number,
  },
  data() {
    return {
      environments: [],
      job: {},
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
    async getInitData() {
      //获取所有项目环境
      await environmentApi
        .queryByProjectId(this.project.id)
        .then((response) => {
          let result = response.data
          this.environments = result.data
        })
      //如果参数id不为空，则获取需要修改的数据
      if (this.id) {
        await jobApi.getById(this.id).then((response) => {
          let result = response.data
          this.job = result.data
        })
      }
    },
    //保存
    save() {
      this.job.taskId = this.taskId
      //设置项目id
      this.job.projectId = this.project.id
      //如果id为空，新增；如果不为空，则为更新
      let operation = null
      if (!this.job.id) {
        operation = jobApi.create(this.job)
      } else {
        operation = jobApi.modify(this.job)
      }
      operation.then((response) => {
        if (response.data.code === 0) {
          //成功提示
          this.$message({
            message: '保存成功。',
            type: 'success',
          })
          //触发父组件的保存成功事件
          this.$emit('callbackForSave')
        } else {
          //错误提示
          this.$message({
            message: response.data.message,
            type: 'error',
          })
        }
      })
    },
    //取消
    cancel() {
      //触发父组件的取消事件
      this.$emit('callbackForCancel')
    },
  },
}
</script>

<style scoped>
</style>