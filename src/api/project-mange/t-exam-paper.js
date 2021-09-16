import request from '@/utils/request'
// 分页查
export function fetchList(query) {
  return request({
    url: '/project/tExamPaper/page',
    method: 'get',
    params: query
  })
}
// 根据主键查询
export function fetchPaperDetail(id) {
  return request({
    url: '/project/tExamPaper/id',
    method: 'get',
    params: { id }
  })
}

// 创建
export function create(data) {
  return request({
    url: '/project/tExamPaper',
    method: 'post',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: '/project/tExamPaper',
    method: 'put',
    data
  })
}
// 删除
export function deleteData(id) {
  return request({
    url: '/project/tExamPaper',
    method: 'delete',
    params: { id }
  })
}
