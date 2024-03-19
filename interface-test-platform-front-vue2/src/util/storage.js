/*
本地存储工具
*/

//当前用户项目key
const CURRENT_USER_PROJECT = 'current-user-project'
//当前用户key
const CURRENT_USER = 'current-user'

//通用操作
//新增
export function set(key,value){
    window.localStorage.setItem(key,JSON.stringify(value))
}
//获取
export function get(key){
    return JSON.parse(window.localStorage.getItem(key))
}
//移除
export function remove(key){
    window.localStorage.removeItem(key)
}

//当前用户项目的快捷操作
//获取
export function getCurrentUserProject() {
  return get(CURRENT_USER_PROJECT)
}
//设置
export function setCurrentUserProject(value) {
  set(CURRENT_USER_PROJECT, value)
}
//移除
export function removeCurrentUserProject() {
  remove(CURRENT_USER_PROJECT)
}

//当前用户的快捷操作
//获取
export function getCurrentUser() {
  return get(CURRENT_USER)
}
//设置
export function setCurrentUser(value) {
  set(CURRENT_USER, value)
}
//移除
export function removeCurrentUser() {
  remove(CURRENT_USER)
}