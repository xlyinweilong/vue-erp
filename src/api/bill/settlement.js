import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/bill/settlement/list',
    method: 'post',
    data
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/bill/settlement/delete',
    method: 'post',
    data
  })
}
