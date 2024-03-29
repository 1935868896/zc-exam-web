import request from '@/utils/request'
// 分页查
export function fetchList(query) {
  return request({
    url: '/system/role',
    method: 'get',
    baseURL: 'http://localhost:8080',
    params: query
  })
}
export function getAllRoles() {
  return request({
    url: '/system/role',
    method: 'get',
    baseURL: 'http://localhost:8080'

  })
}

// 根据主键查询
export function fetchDetail(id) {
  return request({
    url: '/system/role/id',
    method: 'get',
    baseURL: 'http://localhost:8080',
    params: { id }
  })
}

// 创建
export function create(data) {
  return request({
    url: '/system/role',
    method: 'post',
    baseURL: 'http://localhost:8080',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: '/system/role',
    method: 'put',
    baseURL: 'http://localhost:8080',
    data
  })
}
// 删除
export function deleteData(id) {
  return request({
    url: '/system/role',
    method: 'delete',
    baseURL: 'http://localhost:8080',
    params: { id }
  })
}
