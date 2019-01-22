import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'api/info/barCode/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: 'api/info/barCode/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/info/barCode/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/info/barCode/delete',
    method: 'post',
    data
  })
}


