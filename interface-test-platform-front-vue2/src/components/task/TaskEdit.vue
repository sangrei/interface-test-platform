<template>
  <div class="task-edit">
    <el-form :model="task" ref="createRef">
      <el-form-item label="任务名称" label-width="80px">
        <el-input v-model="task.name" autocomplete="off" placeholder="请输入任务名称" style="width:97%;"></el-input>
      </el-form-item>
      <el-form-item label="关联模块" label-width="80px">
        <el-select
          multiple
          v-model="task.moduleIds"
          placeholder="请选择模块"
          style="width: 97%"
        >
          <el-option
            v-for="item in modules"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-tooltip
          content="只能添加新模块，不能删除；因为任务已关联模块可能已经在测试套件中添加接口和测试用例。"
          placement="right"
          effect="dark"
        >
          <i data-v-c52092f4="" class="header-icon el-icon-info"></i>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </div>
</template>

<script>
import * as moduleApi from '@/api/module'
import * as taskApi from '@/api/task'

export default {
  name: 'TaskEdit',
  props: {
    id: Number,
  },
  data() {
    return {
      modules: [],
      task: {},
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
      //获取所有模块
      await moduleApi.queryByProjectId(this.project.id).then((response) => {
        let result = response.data
        this.modules = result.data
      })
      //如果参数id不为空，则获取需要修改的数据
      if (this.id) {
        await taskApi.getById(this.id).then((response) => {
          let result = response.data
          this.task = result.data
        })
      }
    },
    //保存
    save() {
      //设置项目id
      this.task.projectId = this.project.id
      //如果id为空，新增；如果不为空，则为更新
      let operation = null
      if (!this.task.id) {
        operation = taskApi.create(this.task)
      } else {
        operation = taskApi.modify(this.task)
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