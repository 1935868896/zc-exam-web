import request from '@/utils/request'
// 分页查
export function fetchQuestionList(query) {
  return request({
    url: '/project/tQuestion/page',
    method: 'get',
    params: query
  })
}
// 根据主键查询
export function fetchQuestionDetail(id) {
  return request({
    url: '/project/tQuestion/id',
    method: 'get',
    params: { id }
  })
}

// 创建
export function create(data) {
  return request({
    url: '/project/tQuestion',
    method: 'post',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: '/project/tQuestion',
    method: 'put',
    data
  })
}
// 删除
export function deleteData(id) {
  return request({
    url: '/project/tQuestion',
    method: 'delete',
    params: { id }
  })
}
