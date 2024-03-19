<template>
  <div class="task-run">
    <el-form :model="task" ref="task" label-width="120px">
      <el-form-item label="任务名称">
					<label>{{task.name}}</label>
				</el-form-item>
				<el-form-item label="项目环境">
					<el-select v-model="taskRun.environmentId" placeholder="请选择项目环境" style="width: 100%;">
						<el-option v-for="item in environments" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="运行记录名称">
					<el-input v-model="taskRun.name" placeholder="请输入运行记录名称"></el-input>
				</el-form-item>
				<el-form-item label="描述">
					<el-input v-model="taskRun.description" placeholder="请输入描述"></el-input>
				</el-form-item>
			</el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="success"
                  plain @click="run" icon="el-icon-caret-right">运 行</el-button>
    </div>
  </div>
</template>

<script>
import * as taskApi from '@/api/task'
import * as environmentApi from '@/api/environment'

export default {
  name: 'TaskRun',
  props: {
    task: Object,
  },
  data() {
    return {
      environments:[],
      taskRun:{}
    }
  },
  computed: {
    project() {
      return this.$store.getters.getCurrentUserProject
    },
  },
  created() {
    //获取所有项目环境
      environmentApi.queryByProjectId(this.project.id).then((response) => {
        let result = response.data
        this.environments = result.data
      })
  },
  methods: {
    //保存
    run() {
      this.taskRun.taskId = this.task.id
      this.taskRun.projectId = this.project.id
      taskApi.run(this.taskRun).then((response) => {
        if (response.data.code === 0) {
          //成功提示
          this.$message({
            message: '运行成功。',
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