import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/user/employ/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: '/user/employ/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: '/user/employ/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: '/user/employ/delete',
    method: 'post',
    data
  })
}


