import request from '@/utils/request'

export function answerAnalysis(data) {
  return request({
    url: '/project/tExamPaperAnswer/analysis',
    method: 'post',
    data
  })
}

export function fetchReadPaper(id) {
  return request({
    url: '/project/tExamPaperAnswer/read/id',
    method: 'get',
    params: { id }
  })
}

export function fetchList(query) {
  return request({
    url: '/project/tExamPaperAnswer/page',
    method: 'get',
    params: query
  })
}
// 根据主键查询
export function fetchDetail(id) {
  return request({
    url: '/project/tExamPaperAnswer/id',
    method: 'get',
    params: { id }
  })
}

// 创建
export function create(data) {
  return request({
    url: '/project/tExamPaperAnswer',
    method: 'post',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: '/project/tExamPaperAnswer',
    method: 'put',
    data
  })
}
// 删除
export function deleteData(id) {
  return request({
    url: '/project/tExamPaperAnswer',
    method: 'delete',
    params: { id }
  })
}
