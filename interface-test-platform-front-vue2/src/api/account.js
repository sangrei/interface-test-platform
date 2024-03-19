import request from '@/util/request.js'

//登录
export function login(user) {
  return request({
    url: '/account/login',
    method: 'post',
    data: user
  })
}

//登出
export function logout() {
  return request({
    url: '/account/logout',
    method: 'get'
  })
}

//注册
export function register(user) {
  return request({
    url: '/account/register',
    method: 'post',
    data: user
  })
}