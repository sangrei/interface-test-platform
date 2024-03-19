/*
  接口api
*/
import request from '@/util/request'

//根据id获取数据
export function getById(id) {
  return request({
    url: '/testreport/' + id,
    method: 'get'
  })
}