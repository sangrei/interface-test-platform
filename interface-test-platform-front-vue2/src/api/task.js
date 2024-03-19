/*
  接口api
*/
import request from '@/util/request'

//按条件分页查询
export function query(params) {
  return request({
    url: '/task/',
    method: 'get',
    params:params
  })
}
//查询全部
export function queryByProjectId(projectId) {
  return request({
    url: '/task/queryByProjectId',
    method: 'get',
    params:{projectId:projectId}
  })
}

//查询全部，包含任务->测试套件->测试用例整个树信息
export function queryDetailByProjectId(projectId) {
  return request({
    url: '/task/queryDetailByProjectId',
    method: 'get',
    params:{projectId:projectId}
  })
}

//根据id获取数据
export function getById(id) {
    return request({
      url: '/task/' + id,
      method: 'get'
    })
  }
//创建
export function create(data) {
  return request({
    url: '/task/',
    method: 'post',
    data:data
  })
}
//创建
export function modify(data) {
  return request({
    url: '/task/',
    method: 'put',
    data:data
  })
}
//删除
export function remove(id) {
  return request({
    url: '/task/'+id,
    method: 'delete'
  })
}

//根据任务ID获取关联模块
export function getModulesByTaskId(taskId) {
  return request({
    url: '/task/getModulesByTaskId',
    method: 'get',
    params:{taskId:taskId}
  })
}

//运行
export function run(data) {
  return request({
    url: '/task/run',
    method: 'post',
    data:data
  })
}
//归档
export function archive(id) {
  return request({
    url: '/task/archive',
    method: 'get',
    params:{id:id}
  })
}
//切换任务是否为定时任务
export function changeIsJobOrNot(taskId,isJob) {
  return request({
    url: '/task/changeIsJobOrNot',
    method: 'post',
    data:{taskId:taskId,isJob:isJob}
  })
}