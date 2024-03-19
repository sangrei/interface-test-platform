/*
  接口api
*/
import request from '@/util/request'

//查询全部
export function queryByProjectId(projectId) {
  return request({
    url: '/environment/queryByProjectId',
    method: 'get',
    params:{projectId:projectId}
  })
}
//根据id获取数据
export function getById(id) {
    return request({
      url: '/environment/' + id,
      method: 'get'
    })
  }
//创建
export function create(data) {
  return request({
    url: '/environment/',
    method: 'post',
    data:data
  })
}
//修改
export function modify(data) {
    return request({
      url: '/environment/',
      method: 'put',
      data:data
    })
  }
//删除
export function remove(id) {
  return request({
    url: '/environment/'+id,
    method: 'delete'
  })
}