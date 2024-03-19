/*
  接口api
*/
import request from '@/util/request'

//按条件分页查询
export function query(params) {
  return request({
    url: '/testrecord/',
    method: 'get',
    params:params
  })
}
//查询全部
export function queryByProjectId(params) {
  return request({
    url: '/testrecord/queryByProjectId',
    method: 'get',
    params: params
  })
}
//根据id获取数据
export function getById(id) {
  return request({
    url: '/testrecord/' + id,
    method: 'get'
  })
}