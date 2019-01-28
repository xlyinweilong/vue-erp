import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/pos/sale_diy/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: 'api/pos/sale_diy/save',
    method: 'post',
    data
  })
}

