<template>
  <div class="environment-edit">
    <el-form ref="updateEnvFrom" :model="environment">
      <el-form-item prop="name">
        <el-input placeholder="请求输入环境名称" v-model="environment.name">
          <template slot="prepend">环境名称</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="host">
        <el-input placeholder="请求输入主机地址" v-model="environment.host">
          <template slot="prepend">主机地址</template>
        </el-input>
      </el-form-item>
      <el-form-item label="数据库配置" prop="database">
        <editor
          height="200"
          width="100%"
          ref="editor"
          :content="environment.dbConfig"
          v-model="environment.dbConfig"
          :options="{
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
            tabSize: 2,
            fontSize: 20,
            showPrintMargin: false,
          }"
          :lang="'json'"
          @init="editorInit"
        >
        </editor>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="mini">取 消</el-button>
      <el-button type="primary" @click="save" size="mini">确 定</el-button>
    </div>
  </div>
</template>

<script>
import * as environmentApi from '@/api/environment'
import Editor from 'vue2-ace-editor'

export default {
  name: 'EnvironmentEdit',
  components:{
    Editor
  },
  props: {
    id: Number,
  },
  data() {
    return {
      environment: {
        dbConfig: '{\n    "host": "",\n    "user": "",\n    "password": "",\n    "db": "",\n    "charset": "",\n    "autocommit": true\n}'
      },
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
    //json数据编辑器配置
    editorInit() {
      require('brace/theme/chrome')
      require('brace/ext/language_tools')
      require('brace/mode/yaml')
      require('brace/mode/json')
      require('brace/mode/less')
      require('brace/snippets/json')
    },
    //获取初始化数据
    getInitData() {
      //如果参数id不为空，则获取需要修改的数据
      if (this.id) {
        environmentApi.getById(this.id).then((response) => {
          let result = response.data
          this.environment = result.data
        })
      }
    },
    //保存
    save() {
      this.environment.projectId = this.project.id
      //如果id为空，新增；如果不为空，则为更新
      let operation = null
      if (!this.environment.id) {
        operation = environmentApi.create(this.environment)
      } else {
        operation = environmentApi.modify(this.environment)
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