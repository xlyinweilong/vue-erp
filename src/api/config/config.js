import request from '@/utils/request'

export function getAll(params) {
  return request({
    url: 'api/info/config/all',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: 'api/info/config/save',
    method: 'post',
    data
  })
}
