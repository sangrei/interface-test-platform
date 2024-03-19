/*
  定时任务api
*/
import request from '@/util/request'

//根据id获取数据
export function getById(id) {
    return request({
      url: '/job/' + id,
      method: 'get'
    })
  }
//创建
export function create(data) {
  return request({
    url: '/job/',
    method: 'post',
    data:data
  })
}
//修改
export function modify(data) {
    return request({
      url: '/job/',
      method: 'put',
      data:data
    })
  }
//删除
export function remove(id) {
  return request({
    url: '/job/'+id,
    method: 'delete'
  })
}
//启动
export function start(id) {
  return request({
    url: '/job/start',
    method: 'get',
    params:{id:id}
  })
}
//停止
export function stop(id) {
  return request({
    url: '/job/stop',
    method: 'get',
    params:{id:id}
  })
}