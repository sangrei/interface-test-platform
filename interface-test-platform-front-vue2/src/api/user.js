import request from '@/util/request'

//查询列表
export function query(params) {
  return request({
    url: '/user/',
    method: 'get',
    params:params
  })
}
//查询所有
export function queryAll() {
  return request({
    url: '/user/queryAll',
    method: 'get'
  })
}
//根据id获取数据
export function getById(id) {
    return request({
      url: '/user/' + id,
      method: 'get'
    })
  }
//创建
export function create(user) {
  return request({
    url: '/user/',
    method: 'post',
    data:user
  })
}
//修改
export function modify(user) {
    return request({
      url: '/user/',
      method: 'put',
      data:user
    })
  }
//删除
export function remove(id) {
  return request({
    url: '/user/'+id,
    method: 'delete'
  })
}
//重置密码
export function reset(data) {
  return request({
    url: '/user/resetPassword',
    method: 'post',
    data:data
  })
}