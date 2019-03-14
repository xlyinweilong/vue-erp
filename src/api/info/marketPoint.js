import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'api/info/marketPoint/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: 'api/info/marketPoint/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/info/marketPoint/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/info/marketPoint/delete',
    method: 'post',
    data
  })
}


