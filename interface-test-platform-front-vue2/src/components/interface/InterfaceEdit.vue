<template>
  <div class="interface-edit">
    <el-form :model="int" ref='createRef' label-width="80px">
				<el-form-item prop="module" label="所属模块">
					<el-select v-model="int.moduleId" placeholder="请选择所属模块" style="width: 100%;">
						<el-option v-for="item in modules" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
        <el-form-item prop="name" label="接口名称">
					<el-input v-model.trim="int.name" placeholder="请输入接口名称"></el-input>
				</el-form-item>
				<el-form-item prop="path" label="接口地址">
					<el-input v-model.trim="int.path" autocomplete="off" placeholder="请输入接口地址，输入不包含域名的相对路径，如/account/login"></el-input>
				</el-form-item>
        <el-form-item prop="requestMethod" label="请求方法">
					<el-select v-model="int.requestMethod" placeholder="请选择请求方法" style="width: 100%;">
						<el-option v-for="item in requestMethods" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
        <el-form-item prop="responseType" label="响应类型">
					<el-select v-model="int.responseType" placeholder="请选择响应类型" style="width: 100%;">
						<el-option v-for="item in responseTypes" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="开发人员">
          <el-select v-model="developer" value-key="id" placeholder="请选择开发人员" style="width: 100%;">
						<el-option v-for="item in users" :key="item.id" :label="item.name" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel" size='mini'>取 消</el-button>
				<el-button type="primary" @click="save" size='mini'>保存</el-button>
			</div>
  </div>
</template>

<script>
import * as interfaceApi from '@/api/interface'
import * as moduleApi from '@/api/module'
import * as userApi from '@/api/user'
import * as commonData from '@/api/commonData'

export default {
  name: 'InterfaceEdit',
  props:{
    id:Number
  },
  data(){
    return {
      modules:[],
      users:[],
      requestMethods:[],
      responseTypes:[],
      int:{
        requestMethod:'GET',
        responseType:'JSON'
      },
      developer: {},
    }
  },
  computed: {
    project() {
      return this.$store.getters.getCurrentUserProject
    },
  },
  created(){
    this.requestMethods = commonData.requestMethods
    this.responseTypes = commonData.responseTypes
    //获取初始化数据
    this.getInitData()
  },
  methods:{
    //获取初始化数据
    async getInitData() {
      //获取所有模块
      await moduleApi.queryByProjectId(this.project.id).then((response) => {
        let result = response.data
        this.modules = result.data
      })
      //获取所有用户
      await userApi.queryAll().then((response) => {
        let result = response.data
        this.users = result.data
      })
      //如果参数id不为空，则获取需要修改的数据
      if (this.id) {
        await interfaceApi.getById(this.id).then((response) => {
          let result = response.data
          this.int = result.data
          this.developer = {
            id: this.int.developerId,
            name: this.int.developerName,
          }
        })
      }
    },
    //保存
    save() {
      //设置项目id
      this.int.projectId = this.project.id
      this.int.developerId = this.developer.id
      this.int.developerName = this.developer.name
      //如果id为空，新增；如果不为空，则为更新
      let operation = null
      if (!this.int.id) {
        operation = interfaceApi.create(this.int)
      } else {
        operation = interfaceApi.modify(this.int)
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
  }
}
</script>

<style scoped>
</style>