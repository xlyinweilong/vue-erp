import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'api/info/warehouse/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: 'api/info/warehouse/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/info/warehouse/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/info/warehouse/delete',
    method: 'post',
    data
  })
}


