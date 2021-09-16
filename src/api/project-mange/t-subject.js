import request from '@/utils/request'
// 分页查
export function fetchList(query) {
  return request({
    url: '/project/tSubject/page',
    method: 'get',
    params: query
  })
}
export function getList() {
  return request({
    url: '/project/tSubject',
    method: 'get'
  })
}
// 根据主键查询
export function fetchDetail(id) {
  return request({
    url: '/project/tSubject/id',
    method: 'get',
    params: { id }
  })
}

// 创建
export function create(data) {
  return request({
    url: '/project/tSubject',
    method: 'post',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: '/project/tSubject',
    method: 'put',
    data
  })
}
// 删除
export function deleteData(id) {
  return request({
    url: '/project/tSubject',
    method: 'delete',
    params: { id }
  })
}
