/*
  接口api
*/
import request from '@/util/request'

//按条件分页查询
export function query(params) {
  return request({
    url: '/testsuit/',
    method: 'get',
    params:params
  })
}
//查询全部
export function queryByProjectId(projectId) {
  return request({
    url: '/testsuit/queryByProjectId',
    method: 'get',
    params:{projectId:projectId}
  })
}
//根据id获取数据
export function getById(id) {
    return request({
      url: '/testsuit/' + id,
      method: 'get'
    })
  }
//创建
export function create(data) {
  return request({
    url: '/testsuit/',
    method: 'post',
    data:data
  })
}
//修改
export function modify(data) {
    return request({
      url: '/testsuit/',
      method: 'put',
      data:data
    })
  }
//删除
export function remove(id) {
  return request({
    url: '/testsuit/'+id,
    method: 'delete'
  })
}