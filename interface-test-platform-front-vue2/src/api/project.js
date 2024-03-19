/*
  项目api
*/
import request from '@/util/request'

//查询所有
export function queryAll() {
  return request({
    url: '/project/queryAll',
    method: 'get'
  })
}
//根据id获取数据
export function getById(id) {
    return request({
      url: '/project/' + id,
      method: 'get'
    })
  }
//创建
export function create(data) {
  return request({
    url: '/project/',
    method: 'post',
    data:data
  })
}
//修改
export function modify(data) {
    return request({
      url: '/project/',
      method: 'put',
      data:data
    })
  }
//删除
export function remove(id) {
  return request({
    url: '/project/'+id,
    method: 'delete'
  })
}