<template>
  <div class="module-edit">
    <el-form :model="module">
				<el-form-item>
					<el-input v-model="module.name" placeholder="请输入模块名">
						<template slot="prepend">模块名</template>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel" size="mini">取 消</el-button>
				<el-button type="primary" @click="save" size="mini">确 定</el-button>
            </div>
  </div>
</template>

<script>
import * as moduleApi from '@/api/module'

export default {
  name: 'ModuleEdit',
  props: {
    id: Number,
  },
  data() {
    return {
      module: {},
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
        moduleApi.getById(this.id).then((response) => {
          let result = response.data
          this.module = result.data
        })
      }
    },
    //保存
    save() {
        this.module.projectId=this.project.id
      //如果id为空，新增；如果不为空，则为更新
      let operation = null
      if (!this.module.id) {
        operation = moduleApi.create(this.module)
      } else {
        operation = moduleApi.modify(this.module)
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