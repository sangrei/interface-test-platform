import Vue from 'vue'
import Vuex from 'vuex'
//导入storage工具
import * as storage from '@/util/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //菜单展开状态
    isCollapse:false,
    //当前用户，默认从storage工具获取
    currentUser: storage.getCurrentUser()||null,
    //当前项目，默认从storage工具获取
    currentUserProject: storage.getCurrentUserProject()||null,

    //测试任务详情数据列表，测试用例页面的列表组件和编辑组件共享的测试任务详情数据，下面包括子的测试套件，套件下包含测试用例，并会在用例详情删除时更新这个数据
    taskDetails:[],
    //当前测试用例，测试用例页面的列表组件和编辑组件共享的当前测试用例数据
    currentTestCase:{},
    //当前拷贝的用例，用于复制
    copyTestCase:null,
    //快捷标签列表
    tagsList:[]
  },
  getters:{
    //获取菜单展开状态
    getCollapse: state => {
      return state.isCollapse
    },
    //获取当前用户
    getCurrentUser:state=>{
      return state.currentUser
    },
    //获取当前项目
    getCurrentUserProject:state=>{
      return state.currentUserProject
    },

    //获取当前测试用例
    getCurrentTestCase:state=>{
      return state.currentTestCase
    },
    //获取测试任务详情数据列表
    getTaskDetails:state=>{
      return state.taskDetails
    },

    //获取当前拷贝的用例
    getCopyTestCase:state=>{
      return state.copyTestCase
    },
    //获取快捷标签列表
    getTagsList:state=>{
      return state.tagsList
    }
  },
  mutations: {
    //切换菜单展开状态
    toggleCollapse(state) {
      state.isCollapse = ! state.isCollapse
    },
    //设置当前用户，除了设置vuex，同时设置登录票据
    setCurrentUser(state,user){
      state.currentUser = user
      storage.setCurrentUser(user)
    },
    //移除当前用户，除了移除vuex，同时移除登录票据
    removeCurrentUser(state){
      state.currentUser = null
      storage.removeCurrentUser()
    },
    //设置当前项目，除了设置vuex，同时设置localStorage
    setCurrentUserProject(state,project){
      state.currentUserProject  = project
      storage.setCurrentUserProject(project)
    },
    //移除当前用户项目，除了移除vuex，同时移除localStorage
    removeCurrentUserProject(state){
      state.currentUserProject  = null
      storage.removeCurrentUserProject()
    },
    
    //设置当前测试用例
    setCurrentTestCase(state,currentTestCase){
      state.currentTestCase = currentTestCase
    },
    //设置测试任务详情数据列表
    setTaskDetails(state,taskDetails){
      state.taskDetails = taskDetails
    },
    //设置当前拷贝的用例
    setCopyTestCase(state,copyTestCase){
      state.copyTestCase = copyTestCase
    },
    //设置快捷标签列表
    setTagsList(state,tagsList){
      state.tagsList =tagsList
    }
  },
  actions: {
  },
  modules: {
  }
})
