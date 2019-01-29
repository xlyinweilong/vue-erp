import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'api/vip/integral_to_amount/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: 'api/vip/integral_to_amount/save',
    method: 'post',
    data
  })
}

