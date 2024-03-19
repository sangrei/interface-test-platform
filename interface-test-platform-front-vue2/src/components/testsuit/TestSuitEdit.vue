<template>
  <div class="test-suit">
    <el-form :model="testsuit">
      <el-form-item>
        <el-input v-model="testsuit.name">
          <template slot="prepend">套件名</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="mini"
        >取 消</el-button
      >
      <el-button type="primary" @click="save" size="mini">确 定</el-button>
    </div>
  </div>
</template>

<script>
import * as testsuitApi from '@/api/testsuit'

export default {
  name: 'TestSuit',
  props: {
    id: Number,
    taskId:Number
  },
  data() {
    return {
      testsuit: {},
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
      //如果参数id不为空，则获取需要修改的数据
      if (this.id) {
        testsuitApi.getById(this.id).then((response) => {
          let result = response.data
          this.testsuit = result.data
        })
      }
    },
    //保存
    save() {
        this.testsuit.projectId=this.project.id
        this.testsuit.taskId=this.taskId
      //如果id为空，新增；如果不为空，则为更新
      let operation = null
      if (!this.testsuit.id) {
        operation = testsuitApi.create(this.testsuit)
      } else {
        operation = testsuitApi.modify(this.testsuit)
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
            type: 'warning',
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