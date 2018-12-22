import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'api/info/employ/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: 'api/info/employ/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/info/employ/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/info/employ/delete',
    method: 'post',
    data
  })
}


