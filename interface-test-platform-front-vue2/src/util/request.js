/*
Axios工具封装
*/
import axios from 'axios'
import { Message, Loading } from 'element-ui'
import router from '@/router'
import * as storage from '@/util/storage'

//创建一个Axios实例
const service = axios.create({
  //url前缀
  baseURL: process.env.VUE_APP_BASE_API, 
  //请求超时时间,防止请求无限等待
  timeout: 10000
})

let loading  = null

//允许后端跨域写入cookies，主要用于接收Session ID的cookies
service.defaults.withCredentials = true;

//请求拦截
service.interceptors.request.use(
  config => {
    loading = Loading.service({
      lock: true,
      text: '数据加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    return config
  },
  error => {
    //错误时拦截
    return Promise.reject(error)
  }
)

//响应拦截
service.interceptors.response.use(
  //可以对返回内容进行一些通用的处理，比如把通用的返回异常进行处理
  response => {
    if(loading!=null){
      loading.close()
    }
    return response
  },
  error => {
    //状态码为401，表示未登录，清除当前cookie，并跳转到登录页
    if (error.response && error.response.status === 401) {
      //清除登录票据
      storage.removeCurrentUser()
      //隐藏弹窗
      if(loading!=null){
        loading.close()
      }
      //跳转到登录页
      router.push('/login')
      return
    }
    //状态码为996，表示数据验证异常，提示
    if (error.response && error.response.status === 996) {
      Message({
        message: error.response.data.message,
        type: 'warning',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: '返回处理异常。' + error,
        type: 'error',
        duration: 5 * 1000
      })
    }
    if(loading!=null){
      loading.close()
    }
    return Promise.reject(error)
  }
)

export default service
