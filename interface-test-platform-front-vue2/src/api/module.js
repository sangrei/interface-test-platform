/*
  接口api
*/
import request from '@/util/request'

//按条件分页查询
export function query(params) {
  return request({
    url: '/module/',
    method: 'get',
    params:params
  })
}
//查询全部
export function queryByProjectId(projectId) {
  return request({
    url: '/module/queryByProjectId',
    method: 'get',
    params:{projectId:projectId}
  })
}
//根据id获取数据
export function getById(id) {
    return request({
      url: '/module/' + id,
      method: 'get'
    })
  }
//创建
export function create(data) {
  return request({
    url: '/module/',
    method: 'post',
    data:data
  })
}
//修改
export function modify(data) {
    return request({
      url: '/module/',
      method: 'put',
      data:data
    })
  }
//删除
export function remove(id) {
  return request({
    url: '/module/'+id,
    method: 'delete'
  })
}