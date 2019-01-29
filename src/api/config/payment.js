import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'api/config/payment/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: 'api/config/payment/save',
    method: 'post',
    data
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/config/payment/delete',
    method: 'post',
    data
  })
}
